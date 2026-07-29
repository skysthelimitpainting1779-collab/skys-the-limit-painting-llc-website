import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const scripts = new URL('../.github/skills/impeccable/scripts/', import.meta.url);

test('shared HTML filtering removes reconstructed hidden blocks without replacement chains', async () => {
  const { stripHtmlBlocks } = await import(
    new URL('lib/html-filtering.mjs', scripts)
  );

  assert.equal(
    stripHtmlBlocks(
      '<<!--x-->!--<scrip<script>hidden</script>t>unsafe</script><main>safe</main>-->',
      { comments: true, tags: ['script', 'style'] },
    ),
    '',
  );
  assert.equal(
    stripHtmlBlocks('<sty<style>hidden</style>le>unsafe</style><p>safe</p>', {
      tags: ['style'],
    }),
    '<p>safe</p>',
  );
  assert.equal(
    stripHtmlBlocks(
      '<div title="İ"></div><SCRIPT>hidden</SCRIPT><p>safe</p>',
      { tags: ['script'] },
    ),
    '<div title="İ"></div><p>safe</p>',
  );
  assert.equal(
    stripHtmlBlocks('<style/>hidden</style><p>safe</p>', {
      tags: ['style'],
    }),
    '<p>safe</p>',
  );
  assert.equal(
    stripHtmlBlocks(`${'<style>x</style>'.repeat(4_096)}<p>safe</p>`, {
      tags: ['style'],
    }),
    '<p>safe</p>',
  );
  assert.equal(
    stripHtmlBlocks('<script><style></script>VISIBLE</style>', {
      tags: ['script', 'style'],
    }),
    'VISIBLE</style>',
  );

  let reconstructionBomb = '<style>x</style>';
  for (let index = 0; index < 32; index += 1) {
    reconstructionBomb = `<sty${reconstructionBomb}le>x</style>`;
  }
  assert.throws(
    () => stripHtmlBlocks(reconstructionBomb, { tags: ['style'] }),
    /reconstruction-pass limit/,
  );
});

test('Svelte parsing accepts attributed closing tags and repeatedly removes hidden blocks', async () => {
  const svelte = await import(new URL('live/svelte-component.mjs', scripts));
  const parsed = svelte.parseSvelteComponentFile(
    '<script>const unsafe = true;</script data-x><main>safe</main>',
  );

  assert.equal(parsed.markup, '<main>safe</main>');
  assert.equal(typeof svelte.svelteMarkupHasVisibleContent, 'function');
  assert.equal(
    svelte.svelteMarkupHasVisibleContent(
      '<scrip<script>hidden</script>t>Design theater</script>',
    ),
    false,
  );
  assert.equal(svelte.svelteMarkupHasVisibleContent('<img alt="visible">'), true);
});

test('variant extraction repeatedly removes style blocks recreated by sanitization', async () => {
  const liveAccept = await import(new URL('live-accept.mjs', scripts));
  assert.equal(typeof liveAccept.stripStyleAndJoin, 'function');

  const lines = [
    '<sty<style>hidden</style>le>spoof</style>',
    '<div data-impeccable-variant="original"><p>safe</p></div>',
  ];
  assert.equal(
    liveAccept.stripStyleAndJoin(lines, { start: 0, end: 1 }),
    '\n<div data-impeccable-variant="original"><p>safe</p></div>',
  );
  assert.deepEqual(
    liveAccept.extractOriginal(lines, { start: 0, end: 1 }),
    ['<p>safe</p>'],
  );
  assert.equal(
    liveAccept.stripStyleAndJoin(
      [
        '<div data-impeccable-variant="original">',
        '<STYLE>',
        '<span data-impeccable-variant="spoof">hidden</span>',
        '</STYLE>',
        '<p>safe</p></div>',
      ],
      { start: 0, end: 4 },
    ),
    '<div data-impeccable-variant="original">\n\n\n<p>safe</p></div>',
  );
});

test('page and detector filters remove tags and comments until stable', async () => {
  const [{ isFullPage }, { checkHtmlPatterns }, { detectText }] = await Promise.all([
    import(new URL('detector/shared/page.mjs', scripts)),
    import(new URL('detector/rules/checks.mjs', scripts)),
    import(new URL('detector/engines/regex/detect-text.mjs', scripts)),
  ]);
  const hiddenPage = '<<!--x-->!--<html><body>hidden</body></html>-->';
  const hiddenTheater =
    '<scrip<script>hidden</script>t>Design theater</script><main>safe</main>';
  const hiddenBuzzword =
    '<!doctype html><scrip<script>hidden</script>t>unlock potential</script><main>safe</main>';

  assert.equal(isFullPage(hiddenPage), false);
  assert.equal(isFullPage('<!doctype html><html><body>safe</body></html>'), true);
  assert.equal(
    checkHtmlPatterns(hiddenTheater).some((finding) => finding.id === 'theater-slop-phrase'),
    false,
  );
  assert.equal(
    checkHtmlPatterns('<main>Design theater</main>')
      .some((finding) => finding.id === 'theater-slop-phrase'),
    true,
  );
  assert.equal(
    detectText(hiddenBuzzword, 'page.html')
      .some((finding) => finding.antipattern === 'marketing-buzzword'),
    false,
  );
});

test('visual implementation discovery ignores evidence recreated inside comments', async () => {
  const { hasVisualImplementation } = await import(new URL('context.mjs', scripts));
  const project = mkdtempSync(join(tmpdir(), 'impeccable-codeql-html-'));
  try {
    writeFileSync(
      join(project, 'styles.css'),
      '<<!--x-->!--:root { --a: red; --b: blue; --c: green; color: red; }-->',
    );
    assert.equal(hasVisualImplementation(project), false);
  } finally {
    rmSync(project, { recursive: true, force: true });
  }
});
