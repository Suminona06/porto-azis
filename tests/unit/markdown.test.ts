import { describe, expect, it } from 'vitest';
import { renderCozyMarkdown } from '../../src/lib/content/markdown';

describe('markdown renderer and sanitizer', () => {
  it('extracts h2 and h3 headings with unique deterministic IDs for TOC', async () => {
    const md = `## Overview\n\nIntro\n\n### Setup Step\n\n## Overview\n\nSecond section`;
    const result = await renderCozyMarkdown(md);

    expect(result.toc).toEqual([
      { id: 'overview', text: 'Overview', depth: 2 },
      { id: 'setup-step', text: 'Setup Step', depth: 3 },
      { id: 'overview-2', text: 'Overview', depth: 2 },
    ]);
    expect(result.html).toContain('id="overview"');
    expect(result.html).toContain('id="setup-step"');
    expect(result.html).toContain('id="overview-2"');
  });

  it('strips dangerous HTML tags, event handlers, and javascript URLs', async () => {
    const malicious = `
## Safe Title

<script>alert('xss')</script>

<img src="x" onerror="alert(1)" />

[Bad Markdown Link](javascript:alert(2))

<a href="javascript:alert(3)" onclick="steal()">Bad Raw Link</a>

[Safe Link](https://example.com)
`;
    const result = await renderCozyMarkdown(malicious);

    expect(result.html).not.toContain('<script');
    expect(result.html).not.toContain('onerror');
    expect(result.html).not.toContain('onclick');
    expect(result.html).not.toContain('javascript:');
    expect(result.html).toContain('https://example.com');
  });

  it('renders highlighted code blocks with a copy button and falls back cleanly on unknown languages', async () => {
    const md = `\`\`\`bash\ndf -h\n\`\`\`\n\n\`\`\`unknownlang\necho hello\n\`\`\``;
    const result = await renderCozyMarkdown(md, { copy: 'Copy', copied: 'Copied' });

    expect(result.html).toContain('code-block-wrap');
    expect(result.html).toContain('data-copy-code');
    expect(result.html).toContain('class="shiki');
    const stripped = result.html.replace(/<[^>]*>/g, '');
    expect(stripped).toContain('df -h');
    expect(stripped).toContain('echo hello');
  });
});
