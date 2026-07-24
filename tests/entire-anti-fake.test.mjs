/**
 * Regression: Entire codify must NEVER invent lessons/skills from git commits.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  assertNoFakeEntireLessons,
  extractLessons,
  isAuthOkFromText,
  isFakeEntireLesson,
  isOneOffCommitSubject,
  isSkillWorthyLesson,
  SKILL_WORTHY_KINDS,
} from '../scripts/entire-to-agentos.mjs';

const SAMPLE_GIT_LOG = [
  {
    sha: 'd4011883dda0d37c532d3c5066b80fb9c86803f9',
    short: 'd401188',
    date: '2026-07-06T03:09:28Z',
    subject: 'chore(deps)(deps): bump next from 16.2.9 to 16.2.10',
  },
  {
    sha: 'd352247676c83d63bcae93f39fcfd4820a08b93d',
    short: 'd352247',
    date: '2026-07-07T20:51:37-07:00',
    subject: 'infra: fix CI/CD pipeline, HubSpot mock sync, and md-linter ignores',
  },
  {
    sha: '67ae9e0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    short: '67ae9e0',
    date: '2026-07-05T00:00:00Z',
    subject: 'fix(seo): resolve GSC redirect error, robots.txt syntax',
  },
];

test('isAuthOkFromText fail-closed on not logged in / ambiguous / empty', () => {
  assert.equal(isAuthOkFromText("Not logged in.\nRun 'entire login'").auth, false);
  assert.equal(isAuthOkFromText('').auth, false);
  assert.equal(isAuthOkFromText('● Enabled · manual-commit').auth, false);
  assert.equal(isAuthOkFromText('Logged in as alice@example.com').auth, true);
});

test('deps bump subjects are one-offs', () => {
  assert.equal(isOneOffCommitSubject(SAMPLE_GIT_LOG[0].subject), true);
  assert.equal(isOneOffCommitSubject('fix(seo): real durable fix for robots'), false);
});

test('git-derived lesson shapes are always fake', () => {
  const fake = {
    kind: 'workflow',
    id: 'git-d401188',
    title: SAMPLE_GIT_LOG[0].subject,
    body: `Commit d401188 (2026-07-06): ${SAMPLE_GIT_LOG[0].subject}\nSHA: ${SAMPLE_GIT_LOG[0].sha}`,
    tags: ['git', 'entire-linked', 'chore'],
    publish_skill: true,
  };
  assert.equal(isFakeEntireLesson(fake), true);
  assert.equal(isSkillWorthyLesson(fake), false);

  const weak = {
    kind: 'git-weak',
    id: 'git-d352247',
    title: SAMPLE_GIT_LOG[1].subject,
    body: 'weak',
    tags: ['git', 'no-entire'],
  };
  assert.equal(isFakeEntireLesson(weak), true);
  assert.equal(isSkillWorthyLesson(weak), false);
});

test('extractLessons ignores git_log completely (unauthenticated)', () => {
  const lessons = extractLessons({
    auth: false,
    dispatch: null,
    checkpoints: [],
    search_hits: [],
    sessions: [],
    git_log: SAMPLE_GIT_LOG,
    errors: ['Entire not logged in'],
  });
  assert.equal(lessons.length, 0, 'must not invent lessons from git when Entire empty');
  assert.ok(lessons.every((l) => !String(l.id).startsWith('git-')));
});

test('extractLessons ignores git_log even when authenticated but no real signals', () => {
  const lessons = extractLessons({
    auth: true,
    dispatch: null,
    checkpoints: [{ raw: 'checkpoints  0\nNo checkpoints found' }],
    search_hits: [],
    sessions: [],
    git_log: SAMPLE_GIT_LOG,
  });
  assert.equal(lessons.length, 0);
});

test('extractLessons accepts real checkpoint with substance', () => {
  const lessons = extractLessons({
    auth: true,
    dispatch: null,
    checkpoints: [
      {
        id: 'cp-abc123',
        title: 'Fixed next/dynamic ssr:false in Server Component',
        summary:
          'Removed next/dynamic with ssr:false from a Server Component. Use a client island import instead. Verified with npm run build.',
        agent: 'cursor',
      },
    ],
    search_hits: [],
    sessions: [],
    git_log: SAMPLE_GIT_LOG,
  });
  assert.equal(lessons.length, 1);
  assert.equal(lessons[0].kind, 'checkpoint');
  assert.ok(isSkillWorthyLesson(lessons[0]));
  assert.equal(isFakeEntireLesson(lessons[0]), false);
});

test('extractLessons accepts search error hits with body', () => {
  const lessons = extractLessons({
    auth: true,
    search_hits: [
      {
        id: 'hit-1',
        title: 'CI lint failure typescript',
        snippet:
          'Type error in src/app/page.tsx: Property x does not exist. Fixed by narrowing the type and re-running npm run lint:types.',
        query: 'error',
      },
    ],
    checkpoints: [],
    sessions: [],
    git_log: SAMPLE_GIT_LOG,
  });
  assert.equal(lessons.length, 1);
  assert.equal(lessons[0].kind, 'error');
  assert.ok(isSkillWorthyLesson(lessons[0]));
});

test('assertNoFakeEntireLessons throws on git fakes', () => {
  assert.throws(
    () =>
      assertNoFakeEntireLessons([
        {
          id: 'git-abc',
          kind: 'workflow',
          title: 'chore',
          body: 'Commit abc',
          tags: ['git'],
        },
      ]),
    /anti-fake/
  );
  assert.doesNotThrow(() =>
    assertNoFakeEntireLessons([
      {
        id: 'cp-real',
        kind: 'checkpoint',
        title: 'Real fix',
        body: 'A substantive checkpoint body with enough detail about the failure and the fix steps taken.',
        tags: ['checkpoint', 'entire'],
      },
    ])
  );
});

test('SKILL_WORTHY_KINDS never includes git', () => {
  assert.equal(SKILL_WORTHY_KINDS.has('git'), false);
  assert.equal(SKILL_WORTHY_KINDS.has('git-weak'), false);
  assert.equal(SKILL_WORTHY_KINDS.has('workflow'), false);
  assert.ok(SKILL_WORTHY_KINDS.has('checkpoint'));
  assert.ok(SKILL_WORTHY_KINDS.has('error'));
});

test('short commit-stub body is fake even with checkpoint kind', () => {
  const stub = {
    id: 'cp-d401188',
    kind: 'checkpoint',
    title: 'chore(deps): bump next',
    body: 'Commit d401188 (2026-07-06): chore(deps): bump next\nSHA: d4011883dda0d37c532d3c5066b80fb9c86803f9',
    tags: ['checkpoint', 'entire'],
    publish_skill: true,
  };
  assert.equal(isFakeEntireLesson(stub), true);
  assert.equal(isSkillWorthyLesson(stub), false);
});
