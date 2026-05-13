// Minimal markdown-like renderer for the policy pages.
// Supports: ## H2 / ### H3, paragraphs, lines starting with "- " as <ul><li>,
// and escapes any HTML in the source. Anything more advanced should move
// to Markdoc in the singleton schema.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderLightMarkdown(input: string): string {
  if (!input) return '';

  const blocks = input.split(/\n\s*\n/);
  const out: string[] = [];

  for (const raw of blocks) {
    const block = raw.replace(/\r/g, '').trimEnd();
    if (!block.trim()) continue;

    const lines = block.split('\n');

    // Heading: ## or ###
    if (/^###\s+/.test(lines[0]) && lines.length === 1) {
      out.push(`<h3>${escapeHtml(lines[0].replace(/^###\s+/, ''))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(lines[0]) && lines.length === 1) {
      out.push(`<h2>${escapeHtml(lines[0].replace(/^##\s+/, ''))}</h2>`);
      continue;
    }

    // Bullet list: all lines start with "- "
    if (lines.every((l) => /^-\s+/.test(l))) {
      const items = lines
        .map((l) => `<li>${escapeHtml(l.replace(/^-\s+/, ''))}</li>`)
        .join('');
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    // Paragraph (join multi-line with a space, preserve manual breaks for safety)
    const text = lines.map(escapeHtml).join(' ');
    out.push(`<p>${text}</p>`);
  }

  return out.join('\n');
}
