# -*- coding: utf-8 -*-
"""영상 원본에서 경량본(preview), 보존용 고화질본(full), 웹 고화질본(hd), 별도 썸네일을 만든다.

원본은 assets/video-originals/에 보관하고, FE/public/video/에는 재생용만 쓴다.
원본의 이동·삭제는 이 스크립트가 하지 않는다. 미수령 초원은 건너뛴다.

필요 도구: PATH의 ffmpeg, ffprobe (libx264, libwebp, zscale, tonemap 지원)
사용법:
    python scripts/prepare-videos.py --section testimony
    python scripts/prepare-videos.py --section graduation
    python scripts/prepare-videos.py --section all
    python scripts/prepare-videos.py --section hd
    python scripts/prepare-videos.py --section hd --hd-section graduation
    python scripts/prepare-videos.py --section posters

감사 합본은 NN-그룹.mp4 파일명의 앞 번호순으로 자르지 않고 연결한다.
원본 해시·변환 인자가 같은 완료 파일은 재사용한다. 검증 전 결과는 public에 노출하지 않는다.
"""

import argparse
import hashlib
import json
import math
from pathlib import Path
import struct
import subprocess
import sys


REPO = Path(__file__).resolve().parent.parent
ORIGINALS = REPO / 'assets/video-originals'
OUTPUT = REPO / 'FE/public/video'
POSTERS = REPO / 'FE/public/video-posters'
WORK = REPO / 'assets/video-work'
PREVIEW_SIZE = (960, 540)
# 2336×1080 가로 영상도 잘라내거나 줄이지 않도록 이를 담는 16:9 표준 크기를 쓴다.
GRADUATION_SIZE = (2560, 1440)
TESTIMONY = [
    (1, '생사위주 초원'), (2, 'Onlyhim 초원'), (3, '하.군.남 초원'),
    (4, '다모인 초원'), (5, '은혜둥이 팔복둥이 초원'), (6, '영음 초원'),
    (7, '감사의 언니들 초원'), (8, '더드림 가조 초원'),
    (9, '어순종팀 초원'), (10, '부어부어 초원'),
]
# 장년·청년 구분보다 파일명 앞 번호를 우선한다. 목록 추가 위치와 무관하게 숫자로 정렬한다.
GRATITUDE = sorted([
    '01-장년.mp4', '02-청년.mp4', '03-장년.mp4', '04-장년.mp4',
    '05-장년.mp4', '06-청년.mp4', '07-장년.mp4',
], key=lambda name: int(Path(name).stem.split('-', 1)[0]))


def probe(path):
    result = subprocess.run(
        ['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
        capture_output=True, text=True, encoding='utf-8', check=True,
    )
    return json.loads(result.stdout)


def sha256(path):
    with path.open('rb') as file:
        return hashlib.file_digest(file, 'sha256').hexdigest()


def video_stream(info):
    return next(stream for stream in info['streams'] if stream['codec_type'] == 'video')


def faststart(path):
    # moov가 mdat보다 앞에 있어야 파일 끝까지 받지 않고 재생 정보를 읽을 수 있다.
    with path.open('rb') as file:
        while header := file.read(8):
            if len(header) != 8:
                break
            size, kind = struct.unpack('>I4s', header)
            header_size = 8
            if size == 1:
                size = struct.unpack('>Q', file.read(8))[0]
                header_size = 16
            if kind == b'moov':
                return True
            if kind == b'mdat' or size < header_size:
                return False
            file.seek(size - header_size, 1)
    return False


def validate(path, duration, dimensions):
    info = probe(path)
    video = video_stream(info)
    audio = [s for s in info['streams'] if s['codec_type'] == 'audio']
    actual_duration = float(info['format']['duration'])
    if video['codec_name'] != 'h264' or video['pix_fmt'] != 'yuv420p':
        raise ValueError(f'재생 규격 불일치: {path}')
    if not audio or any(s['codec_name'] != 'aac' for s in audio):
        raise ValueError(f'AAC 음성 트랙 없음: {path}')
    if (video['width'], video['height']) != dimensions:
        raise ValueError(f'영상 크기 불일치: {path}')
    if abs(actual_duration - duration) > 0.25:
        raise ValueError(f'길이 불일치: {path} ({actual_duration} / {duration})')
    if not faststart(path):
        raise ValueError(f'빠른 재생용 MP4 구조 아님: {path}')
    return {
        'path': path.relative_to(REPO).as_posix(), 'bytes': path.stat().st_size,
        'duration': actual_duration, 'width': video['width'], 'height': video['height'],
        'fps': video['avg_frame_rate'], 'video': video['codec_name'],
        'audio': audio[0]['codec_name'], 'faststart': True,
    }


def render(path, args, sources, duration, dimensions):
    for candidate in [path, *sources]:
        if not candidate.resolve().is_relative_to(REPO):
            raise ValueError(f'작업 공간 밖의 경로: {candidate}')
    if not path.resolve().is_relative_to(OUTPUT.resolve()):
        raise ValueError(f'출력 디렉터리 밖의 경로: {path}')
    job = '-'.join(path.relative_to(OUTPUT).with_suffix('').parts)
    state_path = WORK / f'{job}.json'
    signature = hashlib.sha256(json.dumps({
        'args': args, 'sources': [sha256(source) for source in sources],
    }, ensure_ascii=False).encode('utf-8')).hexdigest()
    previous = json.loads(state_path.read_text('utf-8')) if state_path.exists() else None
    if path.exists():
        if not previous:
            raise FileExistsError(f'출처를 확인할 수 없는 기존 출력 파일: {path}')
        if previous['signature'] == signature and previous['sha256'] == sha256(path):
            print(f'SKIP 완료 파일: {path.relative_to(REPO)}', flush=True)
            return validate(path, duration, dimensions)
    temporary = WORK / f'{job}.partial.mp4'
    log_path = WORK / f'{job}.log'
    progress_path = WORK / f'{job}.progress'
    print(f'START {path.relative_to(REPO)}', flush=True)
    with log_path.open('w', encoding='utf-8') as log:
        subprocess.run([
            'ffmpeg', '-hide_banner', '-loglevel', 'warning', '-nostdin', '-y',
            '-filter_threads', '2', '-filter_complex_threads', '2',
            '-progress', str(progress_path), '-stats_period', '5',
            *args, '-movflags', '+faststart', str(temporary),
        ], stdout=log, stderr=log, check=True)
    validate(temporary, duration, dimensions)
    # 디코딩도 끝까지 확인한 뒤에만 최종 경로로 옮긴다. 원본은 건드리지 않는다.
    with log_path.open('a', encoding='utf-8') as log:
        subprocess.run([
            'ffmpeg', '-v', 'error', '-xerror', '-threads', '2', '-i', str(temporary),
            '-map', '0:v:0', '-map', '0:a:0', '-f', 'null', '-',
        ], stdout=log, stderr=log, check=True)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary.replace(path)
    report = validate(path, duration, dimensions)
    state_path.write_text(json.dumps({
        'signature': signature, 'sha256': sha256(path), 'result': report,
        'sources': [p.relative_to(REPO).as_posix() for p in sources],
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"DONE {report['path']} ({report['bytes'] / 1024**2:.2f} MiB)", flush=True)
    return report


def color_filter(stream):
    if stream.get('color_transfer') in ('arib-std-b67', 'smpte2084'):
        # HDR 원본을 SDR 영상과 합칠 때 밝기·색이 달라지지 않도록 명시적으로 변환한다.
        return ('zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,'
                'tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=limited,')
    return ''


def encode_options(crf, audio_copy=False, preset='medium', threads=4):
    return [
        '-c:v', 'libx264', '-preset', preset, '-crf', str(crf), '-threads', str(threads),
        '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709',
        '-color_trc', 'bt709', '-colorspace', 'bt709',
        *(['-c:a', 'copy'] if audio_copy else ['-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2']),
        '-map_metadata', '-1', '-map_chapters', '-1',
    ]


def testimony():
    reports = []
    for number, name in TESTIMONY:
        source = ORIGINALS / 'testimony' / f'{number:02d}_{name}.mp4'
        if not source.exists():
            print(f'MISSING {number:02d} {name}', flush=True)
            continue
        info = probe(source)
        stream = video_stream(info)
        duration = float(info['format']['duration'])
        audio_copy = all(s['codec_name'] == 'aac' for s in info['streams'] if s['codec_type'] == 'audio')
        rotation = next((s.get('rotation', 0) for s in stream.get('side_data_list', []) if 'rotation' in s), 0)
        dimensions = (stream['width'], stream['height'])
        if abs(rotation) % 180 == 90:
            dimensions = dimensions[::-1]
        base = ['-threads', '2', '-i', str(source), '-map', '0:v:0', '-map', '0:a:0']
        folder = OUTPUT / 'testimony' / f'{number:02d}'
        # 이미 호환되는 원본은 재압축하지 않아 원본 해상도와 화질을 그대로 보존한다.
        if stream['codec_name'] == 'h264' and stream['pix_fmt'] == 'yuv420p' and audio_copy and not rotation and not color_filter(stream):
            full_args = base + ['-c', 'copy', '-map_metadata', '-1', '-map_chapters', '-1']
        else:
            full_args = base + ['-vf', color_filter(stream) + 'setsar=1,format=yuv420p'] + encode_options(18)
        reports.append(render(folder / 'full.mp4', full_args, [source], duration, dimensions))
        scale = min(1, PREVIEW_SIZE[0] / dimensions[0], PREVIEW_SIZE[1] / dimensions[1])
        preview_dimensions = tuple(max(2, math.floor(n * scale / 2) * 2) for n in dimensions)
        filters = color_filter(stream) + f'scale={preview_dimensions[0]}:{preview_dimensions[1]}:flags=lanczos,setsar=1'
        preview_args = base + ['-vf', filters] + encode_options(24, audio_copy)
        reports.append(render(folder / 'preview.mp4', preview_args, [source], duration, preview_dimensions))
    return reports


def graduation():
    sources = [ORIGINALS / 'gratitude' / name for name in GRATITUDE]
    if not all(source.is_file() for source in sources):
        raise FileNotFoundError('감사 영상 원본이 빠져 있습니다. GRATITUDE 목록을 확인하세요.')
    width, height = GRADUATION_SIZE
    inputs, filters, durations = [], [], []
    for i, source in enumerate(sources):
        info = probe(source)
        # 영상 프레임 경계에 맞춰 아주 짧은 부족분만 마지막 프레임/무음으로 채운다.
        duration = math.ceil(float(info['format']['duration']) * 30) / 30
        durations.append(duration)
        inputs += ['-threads', '2', '-i', str(source)]
        filters.append(
            f'[{i}:v:0]setpts=PTS-STARTPTS,' + color_filter(video_stream(info))
            + f'fps=30,scale={width}:{height}:force_original_aspect_ratio=decrease:force_divisible_by=2:flags=lanczos,'
            + f'pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p,'
            + f'tpad=stop_mode=clone:stop_duration=1,trim=duration={duration:.6f},setpts=PTS-STARTPTS[v{i}]'
        )
        filters.append(
            f'[{i}:a:0]aresample=48000:async=1:first_pts=0,apad,'
            + f'atrim=duration={duration:.6f},asetpts=PTS-STARTPTS[a{i}]'
        )
    joined = ''.join(f'[v{i}][a{i}]' for i in range(len(sources)))
    filters.append(joined + f'concat=n={len(sources)}:v=1:a=1[v][a]')
    duration = sum(durations)
    folder = OUTPUT / 'graduation'
    full = folder / 'full.mp4'
    args = inputs + ['-filter_complex', ';'.join(filters), '-map', '[v]', '-map', '[a]'] + encode_options(19, preset='veryfast', threads=6)
    reports = [render(full, args, sources, duration, GRADUATION_SIZE)]
    args = ['-threads', '2', '-i', str(full), '-map', '0:v:0', '-map', '0:a:0',
            '-vf', f'scale={PREVIEW_SIZE[0]}:{PREVIEW_SIZE[1]}:flags=lanczos,setsar=1'] + encode_options(24, True)
    reports.append(render(folder / 'preview.mp4', args, [full], duration, PREVIEW_SIZE))
    chapters, start = [], 0
    for name, seconds in zip(GRATITUDE, durations):
        chapters.append({'source': name, 'start_seconds': round(start, 3), 'duration': round(seconds, 3)})
        start += seconds
    (WORK / 'graduation-order.json').write_text(json.dumps(chapters, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return reports


def high_definition(section='all'):
    # 원본 해상도를 보존하는 full은 그대로 두고, 공개 전송량을 줄인 hd를 따로 만든다.
    sources = []
    if section in ('testimony', 'all'):
        sources += [OUTPUT / 'testimony' / f'{number:02d}' / 'full.mp4' for number, _ in TESTIMONY]
    if section in ('graduation', 'all'):
        sources.append(OUTPUT / 'graduation/full.mp4')
    reports = []
    for source in sources:
        if not source.is_file():
            raise FileNotFoundError(f'고화질 재생본을 먼저 생성하세요: {source}')
        info = probe(source)
        stream = video_stream(info)
        dimensions = (stream['width'], stream['height'])
        duration = float(info['format']['duration'])
        # 크기·프레임률·AAC 음성을 유지한다. 축소하거나 원본을 덮어쓰지 않는다.
        args = ['-threads', '2', '-i', str(source), '-map', '0:v:0', '-map', '0:a:0']
        args += encode_options(24, audio_copy=True)
        reports.append(render(source.with_name('hd.mp4'), args, [source], duration, dimensions))
    return reports


def posters():
    # 재생 전에는 MP4 메타데이터조차 요청하지 않도록 별도 이미지를 Git 배포에 포함한다.
    reports = []
    sources = [OUTPUT / 'testimony' / f'{number:02d}' / 'preview.mp4' for number, _ in TESTIMONY]
    sources.append(OUTPUT / 'graduation/preview.mp4')
    for source in sources:
        if not source.is_file():
            raise FileNotFoundError(f'썸네일을 만들 경량본이 없습니다: {source}')
        relative = source.parent.relative_to(OUTPUT).with_suffix('.webp')
        path = POSTERS / relative
        job = 'poster-' + '-'.join(relative.with_suffix('').parts)
        state_path = WORK / f'{job}.json'
        args = [
            '-ss', '1', '-i', str(source), '-frames:v', '1', '-an',
            '-vf', 'scale=640:360:force_original_aspect_ratio=decrease:flags=lanczos,pad=640:360:(ow-iw)/2:(oh-ih)/2,setsar=1',
            '-c:v', 'libwebp', '-quality', '75', '-compression_level', '6',
            '-map_metadata', '-1',
        ]
        signature = hashlib.sha256(json.dumps({
            'args': args, 'source': sha256(source),
        }).encode('utf-8')).hexdigest()
        previous = json.loads(state_path.read_text('utf-8')) if state_path.exists() else None
        if path.exists() and previous and previous['signature'] == signature and previous['sha256'] == sha256(path):
            reports.append(previous['result'])
            print(f'SKIP {path.relative_to(REPO)}', flush=True)
            continue
        temporary = WORK / f'{job}.partial.webp'
        subprocess.run([
            'ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
            '-threads', '2', '-filter_threads', '2', *args, str(temporary),
        ], check=True)
        stream = video_stream(probe(temporary))
        if stream['codec_name'] != 'webp' or (stream['width'], stream['height']) != (640, 360):
            raise ValueError(f'썸네일 규격 불일치: {temporary}')
        # 새 체크아웃에 이미 있는 이미지가 동일한 결과면 허용하되, 수동 교체한 이미지는 덮어쓰지 않는다.
        if path.exists() and sha256(path) != sha256(temporary) and (not previous or previous['sha256'] != sha256(path)):
            raise FileExistsError(f'수동 변경한 썸네일을 확인하세요: {path}')
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary.replace(path)
        report = {'path': path.relative_to(REPO).as_posix(), 'bytes': path.stat().st_size, 'width': 640, 'height': 360}
        state_path.write_text(json.dumps({
            'signature': signature, 'sha256': sha256(path), 'result': report,
            'source': source.relative_to(REPO).as_posix(),
        }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        reports.append(report)
        print(f"DONE {report['path']} ({report['bytes']} bytes)", flush=True)
    return reports


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--section', choices=['testimony', 'graduation', 'all', 'hd', 'posters'], default='all')
    parser.add_argument('--hd-section', choices=['testimony', 'graduation', 'all'], default='all')
    args = parser.parse_args()
    WORK.mkdir(parents=True, exist_ok=True)
    reports = []
    if args.section in ('testimony', 'all'):
        reports += testimony()
    if args.section in ('graduation', 'all'):
        reports += graduation()
    if args.section in ('hd', 'all'):
        reports += high_definition(args.hd_section if args.section == 'hd' else 'all')
    if args.section in ('posters', 'all'):
        reports += posters()
    report_name = f'hd-{args.hd_section}' if args.section == 'hd' and args.hd_section != 'all' else args.section
    (WORK / f'report-{report_name}.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'완료: 재생용 파일 {len(reports)}개', flush=True)


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
