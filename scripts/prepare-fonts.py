"""동일 서체의 필요한 글자만 WOFF2로 저장한다. pip install fonttools brotli 필요.

기본 실행은 Git 제외 캐시를 재사용하며 --download는 고정 버전 원본을 받는다.
소스가 없으면 --download를 안내한다. 웹 빌드 자체는 Python·외부 다운로드 없이 동작한다.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
from urllib.request import urlopen

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'assets/font-work'
OUTPUT = ROOT / 'FE/src/assets/fonts'
LICENSES = ROOT / 'FE/public/licenses/fonts'
SOURCES = {
    'nanummyeongjo': ('f12cf9db03e887b61a34ead809ec1b632bd013b5', {
        'NanumMyeongjo-Regular.ttf': '7ed9e8653a8ed04285d51dc343ffea6eb3d9c73afc27383ea8929ee4ffd03205',
        'NanumMyeongjo-Bold.ttf': 'bc9ed8e60d93fe6db054b8fb988481b625f2eef8cb2317ad0e9834681b8fe3f3',
        'OFL.txt': '8eb1c1019fe7fe6d0b6e7d7bbbba1d9cbdd969d8c5f26455708f6cfb8a77284c',
    }),
    'cinzeldecorative': ('3dd78844021e948ceb633d1dcee3f7885561b5d9', {
        'CinzelDecorative-Regular.ttf': '5b862be329103ad287a10f0a53e27a40e8cc519999253f1a0223e2dc330b10b8',
        'OFL.txt': '1e5d6660366ddcfca4f2fc10e2acfba9fa4d97d40aec80d7dbfd41d730a420ae',
    }),
}
FONTS = [
    ('nanummyeongjo', 'NanumMyeongjo-Regular.ttf', 'Amen17 Myeongjo', 'Regular', 'myeongjo-400.woff2'),
    ('nanummyeongjo', 'NanumMyeongjo-Bold.ttf', 'Amen17 Myeongjo', 'Bold', 'myeongjo-700.woff2'),
    ('cinzeldecorative', 'CinzelDecorative-Regular.ttf', 'Amen17 Decorative', 'Regular', 'decorative-400.woff2'),
]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--download', action='store_true')
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    LICENSES.mkdir(parents=True, exist_ok=True)
    for family, (revision, files) in SOURCES.items():
        for filename, expected in files.items():
            target = CACHE / family / filename
            if args.download:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(urlopen(f'https://raw.githubusercontent.com/google/fonts/{revision}/ofl/{family}/{filename}', timeout=45).read())
            if not target.exists():
                raise SystemExit('Run python scripts/prepare-fonts.py --download to fetch pinned font sources.')
            if hashlib.sha256(target.read_bytes()).hexdigest() != expected:
                raise ValueError(f'Unexpected font source: {family}/{filename}')
        (LICENSES / f'{family}-OFL.txt').write_bytes((CACHE / family / 'OFL.txt').read_bytes())

    codepoints = json.loads(subprocess.check_output(['node', 'FE/scripts/font-text.mjs', '--collect'], cwd=ROOT, text=True, encoding='utf8'))
    manifest = {'sourceCodepoints': codepoints, 'fonts': []}
    for directory, filename, family, style, output in FONTS:
        font = TTFont(CACHE / directory / filename, recalcTimestamp=False)
        wanted = set(codepoints) & set(font.getBestCmap())
        options = subset.Options()
        options.flavor = 'woff2'
        options.name_IDs = ['*']
        options.name_legacy = True
        options.name_languages = ['*']
        sub = subset.Subsetter(options=options)
        sub.populate(unicodes=wanted)
        sub.subset(font)
        # OFL의 Reserved Font Name을 지키며 원래 저작권·라이선스 레코드는 보존한다.
        names = {1: family, 2: style, 3: f'{family}-{style}-Subset', 4: f'{family} {style}',
                 6: f'{family.replace(" ", "")}-{style}', 16: family, 17: style,
                 18: f'{family} {style}', 21: family, 22: style}
        for record in font['name'].names:
            if record.nameID in names:
                record.string = names[record.nameID].encode(record.getEncoding())
        font.flavor = 'woff2'
        target = OUTPUT / output
        font.save(target)
        # 생성 직후 cmap에 실제 글자가 남아 있는지 확인한다.
        with TTFont(target) as check:
            assert wanted <= set(check.getBestCmap()), f'Missing glyphs in {output}'
        body = target.read_bytes()
        manifest['fonts'].append({'file': output, 'bytes': len(body), 'sha256': hashlib.sha256(body).hexdigest(), 'codepoints': sorted(wanted)})
        print(f'{output}: {len(body)} bytes, {len(wanted)} glyph codepoints')
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf8')

if __name__ == '__main__':
    main()
