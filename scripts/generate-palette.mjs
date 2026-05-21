#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'node_modules/@radix-ui/colors');
const OUT = resolve(ROOT, 'src/shared/styles/base/palette');

const COLORS = ['yellow', 'gray', 'blue', 'violet', 'red', 'cyan', 'orange'];

const AUX = {
  yellow: {
    light: { contrast: '#21201c', surface: '#fefce9', indicator: '#ffe629', track: '#ffe629' },
    dark:  { contrast: '#21201c', surface: '#272100', indicator: '#ffe629', track: '#ffe629' },
  },
  gray: {
    light: { contrast: '#ffffff', surface: '#ffffffcc', indicator: '#8d8d8d', track: '#8d8d8d' },
    dark:  { contrast: '#ffffff', surface: 'rgba(0, 0, 0, 0.05)', indicator: '#7c7c7c', track: '#7c7c7c' },
  },
  blue: {
    light: { contrast: '#ffffff', surface: '#f1f9ff', indicator: '#0090ff', track: '#0090ff' },
    dark:  { contrast: '#ffffff', surface: '#11243d', indicator: '#0090ff', track: '#0090ff' },
  },
  violet: {
    light: { contrast: '#ffffff', surface: '#f9f6ff', indicator: '#6e56cf', track: '#6e56cf' },
    dark:  { contrast: '#ffffff', surface: '#25193a', indicator: '#6e56cf', track: '#6e56cf' },
  },
  red: {
    light: { contrast: '#ffffff', surface: '#fff5f5', indicator: '#e5484d', track: '#e5484d' },
    dark:  { contrast: '#ffffff', surface: '#3b1219', indicator: '#e5484d', track: '#e5484d' },
  },
  cyan: {
    light: { contrast: '#ffffff', surface: '#eff9fa', indicator: '#00a2c7', track: '#00a2c7' },
    dark:  { contrast: '#ffffff', surface: '#0b2a35', indicator: '#00a2c7', track: '#00a2c7' },
  },
  orange: {
    light: { contrast: '#ffffff', surface: '#fff7ed', indicator: '#f76b15', track: '#f76b15' },
    dark:  { contrast: '#ffffff', surface: '#2b1400', indicator: '#f76b15', track: '#f76b15' },
  },
};

const extractDecls = (block) => {
  const open = block.indexOf('{');
  const close = block.lastIndexOf('}');
  if (open < 0 || close < 0) return '';
  return block
    .slice(open + 1, close)
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('--'))
    .map((l) => `  ${l}`)
    .join('\n');
};

const parseRadixFile = (path) => {
  const text = readFileSync(path, 'utf8');
  const supportsIdx = text.indexOf('@supports');
  const srgbPart = supportsIdx >= 0 ? text.slice(0, supportsIdx) : text;
  const p3Part = supportsIdx >= 0 ? text.slice(supportsIdx) : '';

  let p3Decls = '';
  if (p3Part) {
    const mediaIdx = p3Part.indexOf('@media');
    const innerStart = p3Part.indexOf('{', mediaIdx >= 0 ? mediaIdx : 0);
    const innerOpen = p3Part.indexOf('{', innerStart + 1);
    if (innerOpen >= 0) {
      let depth = 1;
      let i = innerOpen + 1;
      while (i < p3Part.length && depth > 0) {
        if (p3Part[i] === '{') depth++;
        else if (p3Part[i] === '}') depth--;
        i++;
      }
      const innerBlock = p3Part.slice(innerOpen, i);
      p3Decls = extractDecls(innerBlock);
    }
  }

  return {
    srgb: extractDecls(srgbPart),
    p3: p3Decls,
  };
};

const indent = (text, spaces = 2) =>
  text
    .split('\n')
    .map((l) => (l ? ' '.repeat(spaces) + l : l))
    .join('\n');

const auxBlock = (color, theme) => {
  const a = AUX[color][theme];
  return [
    `  --${color}-contrast: ${a.contrast};`,
    `  --${color}-surface: ${a.surface};`,
    `  --${color}-indicator: ${a.indicator};`,
    `  --${color}-track: ${a.track};`,
  ].join('\n');
};

const buildFile = (color) => {
  const light = parseRadixFile(`${SRC}/${color}.css`);
  const dark = parseRadixFile(`${SRC}/${color}-dark.css`);
  const lightA = parseRadixFile(`${SRC}/${color}-alpha.css`);
  const darkA = parseRadixFile(`${SRC}/${color}-dark-alpha.css`);

  const lightBody = [light.srgb, lightA.srgb, auxBlock(color, 'light')].filter(Boolean).join('\n');
  const darkBody = [dark.srgb, darkA.srgb, auxBlock(color, 'dark')].filter(Boolean).join('\n');
  const lightP3 = [light.p3, lightA.p3].filter(Boolean).join('\n');
  const darkP3 = [dark.p3, darkA.p3].filter(Boolean).join('\n');

  return `
@mixin ${color}-light {
${lightBody}
}

@mixin ${color}-dark {
${darkBody}
}

@mixin ${color}-light-p3 {
${lightP3}
}

@mixin ${color}-dark-p3 {
${darkP3}
}

:root,
:root[data-theme='light'] { @include ${color}-light; }
:root[data-theme='dark']  { @include ${color}-dark; }

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root,
    :root[data-theme='light'] { @include ${color}-light-p3; }
    :root[data-theme='dark']  { @include ${color}-dark-p3; }
  }
}
`;
};

for (const color of COLORS) {
  const out = buildFile(color);
  writeFileSync(`${OUT}/_${color}.scss`, out);
  console.log(`✓ wrote _${color}.scss`);
}

const indexBody =
  COLORS.map((c) => `@forward '${c}';`).join('\n') +
  '\n';
writeFileSync(`${OUT}/_index.scss`, indexBody);
console.log('✓ wrote _index.scss');

void indent;
