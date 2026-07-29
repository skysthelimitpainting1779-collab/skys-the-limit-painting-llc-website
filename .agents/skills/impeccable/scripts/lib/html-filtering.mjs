function isTagBoundary(character) {
  return character === undefined || /[\s/>]/.test(character);
}

function asciiCode(character) {
  const code = character?.charCodeAt(0);
  return code >= 65 && code <= 90 ? code + 32 : code;
}

function matchesAsciiAt(source, index, marker) {
  if (index + marker.length > source.length) return false;
  for (let offset = 0; offset < marker.length; offset += 1) {
    if (asciiCode(source[index + offset]) !== marker.charCodeAt(offset)) {
      return false;
    }
  }
  return true;
}

function findTagEnd(source, start) {
  let quote = null;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '>') return index;
  }
  return -1;
}

function findTagStart(source, marker, from) {
  let start = source.indexOf('<', from);
  while (start !== -1) {
    if (
      matchesAsciiAt(source, start, marker) &&
      isTagBoundary(source[start + marker.length])
    ) {
      return start;
    }
    start = source.indexOf('<', start + 1);
  }
  return -1;
}

function isSelfClosingTag(source, tagEnd) {
  let index = tagEnd - 1;
  while (index >= 0 && /\s/.test(source[index])) index -= 1;
  return source[index] === '/';
}

function findCompleteTagBlocks(source, tagName) {
  const openMarker = `<${tagName}`;
  const closeMarker = `</${tagName}`;
  const blocks = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const start = findTagStart(source, openMarker, searchFrom);
    if (start === -1) break;
    const openEnd = findTagEnd(source, start + openMarker.length);
    if (openEnd === -1) break;

    const closeStart = findTagStart(source, closeMarker, openEnd + 1);
    if (closeStart !== -1) {
      const closeEnd = findTagEnd(source, closeStart + closeMarker.length);
      if (closeEnd !== -1) {
        blocks.push({ start, end: closeEnd + 1 });
        searchFrom = closeEnd + 1;
        continue;
      }
    }

    if (isSelfClosingTag(source, openEnd)) {
      blocks.push({ start, end: openEnd + 1 });
    }
    searchFrom = openEnd + 1;
  }
  return blocks;
}

function findCompleteComments(source) {
  const blocks = [];
  let searchFrom = 0;
  while (searchFrom < source.length) {
    const start = source.indexOf('<!--', searchFrom);
    if (start === -1) break;
    const standardEnd = source.indexOf('-->', start + 4);
    const bangEnd = source.indexOf('--!>', start + 4);
    const candidates = [
      standardEnd === -1 ? null : standardEnd + 3,
      bangEnd === -1 ? null : bangEnd + 4,
    ].filter((end) => end !== null);
    if (candidates.length === 0) break;
    const end = Math.min(...candidates);
    blocks.push({ start, end });
    searchFrom = end;
  }
  return blocks;
}

function removeBlocks(source, candidates) {
  if (candidates.length === 0) return source;
  candidates.sort(
    (left, right) => left.start - right.start || right.end - left.end,
  );

  const blocks = [];
  for (const candidate of candidates) {
    const previous = blocks.at(-1);
    if (previous && candidate.start < previous.end) continue;
    blocks.push(candidate);
  }

  const chunks = [];
  let cursor = 0;
  for (const block of blocks) {
    chunks.push(source.slice(cursor, block.start));
    cursor = block.end;
  }
  chunks.push(source.slice(cursor));
  return chunks.join('');
}

export function stripHtmlBlocks(
  value,
  { comments = false, tags = [] } = {},
) {
  let source = String(value ?? '');
  const maxIterations = 32;
  const tagNames = [...new Set(tags.map((tag) => String(tag).toLowerCase()))];
  if (tagNames.some((tag) => !/^[a-z][a-z0-9:-]*$/.test(tag))) {
    throw new TypeError('HTML tag names must be literal names.');
  }

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    const candidates = tagNames.flatMap((tag) =>
      findCompleteTagBlocks(source, tag),
    );
    if (comments) {
      candidates.push(...findCompleteComments(source));
    }
    if (candidates.length === 0) return source;

    source = removeBlocks(source, candidates);
  }

  throw new Error('HTML filtering exceeded its reconstruction-pass limit.');
}
