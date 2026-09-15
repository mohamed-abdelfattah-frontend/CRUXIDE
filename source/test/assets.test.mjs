import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

test('themes and snippets are valid JSON with expected identities', async () => {
  const files = [
    'themes/cruxide-dark-color-theme.json',
    'themes/cruxide-light-color-theme.json',
    'snippets/typescript.json',
    'snippets/typescriptreact.json',
  ];
  const parsed = await Promise.all(
    files.map(async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'))),
  );

  assert.equal(parsed[0].name, 'CRUXIDE Dark');
  assert.equal(parsed[0].type, 'dark');
  assert.equal(parsed[1].name, 'CRUXIDE Light');
  assert.equal(parsed[1].type, 'light');
  assert.ok(Object.keys(parsed[2]).length > 0);
  assert.ok(Object.keys(parsed[3]).length > 0);

  for (const theme of parsed.slice(0, 2)) {
    assert.ok(
      contrast(theme.colors['button.background'], theme.colors['button.foreground']) >= 4.5,
      `${theme.name} button text must meet WCAG AA contrast`,
    );
    assert.ok(
      contrast(theme.colors['editor.background'], theme.colors['editor.foreground']) >= 4.5,
      `${theme.name} editor text must meet WCAG AA contrast`,
    );
    assert.ok(
      contrast(theme.colors['editor.background'], theme.colors.descriptionForeground) >= 4.5,
      `${theme.name} description text must meet WCAG AA contrast`,
    );
  }
});

function contrast(first, second) {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (
    (Math.max(firstLuminance, secondLuminance) + 0.05) /
    (Math.min(firstLuminance, secondLuminance) + 0.05)
  );
}

function luminance(hex) {
  const channels = hex
    .slice(1, 7)
    .match(/.{2}/g)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

test('CRUX mark matches the authoritative Figma geometry', async () => {
  const mark = await readFile(new URL('media/crux-mark.svg', root), 'utf8');
  assert.match(mark, /viewBox="0 0 136 136"/);
  assert.equal((mark.match(/<rect /g) ?? []).length, 0);
  assert.equal((mark.match(/<path /g) ?? []).length, 5);
  assert.match(mark, /fill="#15171A"/);
  assert.match(mark, /component 21:3, geometry group 21:5/);
  assert.match(mark, /M53 46H93V60H68V76H93V90H53L43 80V56L53 46Z/);
});

test('application icon matches the authoritative Figma favicon', async () => {
  const icon = await readFile(new URL('media/crux-app-icon.svg', root), 'utf8');
  assert.match(icon, /viewBox="0 0 64 64"/);
  assert.equal((icon.match(/<rect /g) ?? []).length, 1);
  assert.equal((icon.match(/<path /g) ?? []).length, 5);
  assert.match(icon, /component 22:104/);
  assert.match(icon, /fill="#15171A"/);
  assert.match(icon, /fill="#F3EFE6"/);
});

test('Home hero is a true 4K RGB PNG', async () => {
  const hero = await readFile(new URL('media/crux-home-4k.png', root));
  assert.deepEqual([...hero.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(hero.readUInt32BE(16), 3840);
  assert.equal(hero.readUInt32BE(20), 2160);
  assert.equal(hero[24], 8);
  assert.equal(hero[25], 2);
});

test('packaged font files are real TrueType assets', async () => {
  const paths = [
    'media/fonts/SpaceGrotesk-Variable.ttf',
    'media/fonts/Inter-Variable.ttf',
    'media/fonts/RobotoMono-Variable.ttf',
    'installers/fonts/RobotoMono-Variable.ttf',
    'installers/fonts/RobotoMono-Italic-Variable.ttf',
  ];
  for (const path of paths) {
    const font = await readFile(new URL(path, root));
    assert.deepEqual([...font.subarray(0, 4)], [0, 1, 0, 0], `${path} must be TrueType`);
    assert.ok(font.length > 100_000, `${path} is unexpectedly small`);
  }
});
