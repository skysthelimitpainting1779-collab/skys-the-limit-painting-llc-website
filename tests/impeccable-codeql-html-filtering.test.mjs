import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const scripts = new URL('../.github/skills/impeccable/scripts/', import.meta.url);

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
