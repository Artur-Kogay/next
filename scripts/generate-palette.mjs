#!/usr/bin/env node
// Generates src/shared/styles/base/palette/_<color>.scss files from
// @radix-ui/colors source CSS. Re-run after upgrading @radix-ui/colors.
//
// Transformations:
//   - Selectors .light / .light-theme       → :root[data-theme='light']
//   - Selectors .dark  / .dark-theme        → :root[data-theme='dark']
//   - :root, .light, .light-theme (inside P3 blocks too) → light selector only
//   - Wraps each block (light/dark × srgb/p3) in a SCSS @mixin and applies
//     light to both :root and :root[data-theme='light'] so the page renders
//     correctly before the inline boot script sets data-theme.
//   - Appends the four auxiliary tokens (-contrast/-surface/-indicator/-track)
//     using canonical Radix Themes values per scale per theme.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'node_modules/@radix-ui/colors');
const OUT = resolve(ROOT, 'src/shared/styles/base/palette');

const COLORS = ['yellow', 'gray', 'blue', 'violet', 'red', 'cyan'];

// Canonical Radix Themes auxiliary tokens. Values lifted from
// @radix-ui/themes color definitions (per scale, per theme).
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
};

/**
 * Pulls the `--<color>-…: …;` declaration lines out of one block.
 * Discards any selector lines and the enclosing braces — we'll re-wrap them.
 */
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

/**
 * Splits a Radix CSS file into top-level (SRGB) and P3-wrapped blocks.
 */
const parseRadixFile = (path) => {
  const text = readFileSync(path, 'utf8');
  const supportsIdx = text.indexOf('@supports');
  const srgbPart = supportsIdx >= 0 ? text.slice(0, supportsIdx) : text;
  const p3Part = supportsIdx >= 0 ? text.slice(supportsIdx) : '';

  // P3 block contains a nested @media → nested selector. Extract decls from
  // the innermost selector block.
  let p3Decls = '';
  if (p3Part) {
    const mediaIdx = p3Part.indexOf('@media');
    const innerStart = p3Part.indexOf('{', mediaIdx >= 0 ? mediaIdx : 0);
    const innerOpen = p3Part.indexOf('{', innerStart + 1);
    if (innerOpen >= 0) {
      // find matching close brace
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

  return `// Generated from @radix-ui/colors by scripts/generate-palette.mjs
// Do not edit by hand — re-run \`yarn generate:palette\` after upgrading.
// stylelint-disable

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

// Default + explicit light = same values so the page renders correctly
// before the inline boot script applies data-theme.
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
  `// Generated by scripts/generate-palette.mjs\n` +
  COLORS.map((c) => `@forward '${c}';`).join('\n') +
  '\n';
writeFileSync(`${OUT}/_index.scss`, indexBody);
console.log('✓ wrote _index.scss');

// silence unused var warning from lint
void indent;
