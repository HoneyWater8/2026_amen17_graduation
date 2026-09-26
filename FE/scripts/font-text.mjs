/* ───── 주석 대신 실제 문자열·JSX 텍스트에서 부분 폰트 글자를 수집한다 ───── */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));

export function collectFontCodepoints() {
  // 숫자·동적 사진 번호·영문 대문자 변환은 콘텐츠에 아직 없어도 포함한다.
  const texts = [Array.from({ length: 95 }, (_, i) => String.fromCodePoint(i + 32)).join('')];
  function scan(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (entry.isDirectory()) scan(filename);
      else if (/\.tsx?$/.test(entry.name)) {
        const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
        function visit(node) {
          if (ts.isStringLiteralLike(node) || ts.isJsxText(node) ||
              ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) texts.push(node.text);
          ts.forEachChild(node, visit);
        }
        visit(source);
      }
    }
  }
  scan(path.join(root, 'src'));
  return [...new Set([...texts.join('').normalize('NFC')].map(char => char.codePointAt(0)))]
    .filter(codepoint => codepoint >= 32).sort((a, b) => a - b);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const codepoints = collectFontCodepoints();
  if (process.argv.includes('--collect')) console.log(JSON.stringify(codepoints));
  else {
    const directory = path.join(root, 'src/assets/fonts');
    const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
    const missing = codepoints.filter(codepoint => !manifest.sourceCodepoints.includes(codepoint));
    if (missing.length) throw new Error(`부분 폰트에 새 글자가 필요합니다: ${String.fromCodePoint(...missing)}. 레포 루트에서 python scripts/prepare-fonts.py 실행 후 폰트를 함께 커밋하세요.`);
    for (const font of manifest.fonts) {
      const hash = createHash('sha256').update(fs.readFileSync(path.join(directory, font.file))).digest('hex');
      if (hash !== font.sha256) throw new Error(`${font.file}: 폰트 파일이 생성 기록과 다릅니다.`);
    }
    console.log(`Font coverage checked: ${codepoints.length} source characters, ${manifest.fonts.length} fonts.`);
  }
}
