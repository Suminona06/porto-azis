import { Marked, Renderer, type Token, type Tokens } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { codeToHtml } from 'shiki';
import { isSafeExternalUrl, isSafeMediaUrl, normalizeSlug } from './validation';

export interface TocHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface RenderedMarkdown {
  html: string;
  toc: TocHeading[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function collectCodeTokens(tokens: Token[], out: Tokens.Code[]): void {
  for (const token of tokens) {
    if (token.type === 'code') {
      out.push(token as Tokens.Code);
    }
    if ('tokens' in token && Array.isArray(token.tokens)) {
      collectCodeTokens(token.tokens, out);
    }
    if (token.type === 'list' && 'items' in token && Array.isArray(token.items)) {
      for (const item of token.items) {
        if (Array.isArray(item.tokens)) {
          collectCodeTokens(item.tokens, out);
        }
      }
    }
  }
}

async function highlightCodeSafe(code: string, langRaw?: string): Promise<string> {
  const lang = (langRaw || 'text').trim().toLowerCase().split(/\s+/)[0] || 'text';
  try {
    return await codeToHtml(code, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: 'light',
    });
  } catch {
    try {
      return await codeToHtml(code, {
        lang: 'text',
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        defaultColor: 'light',
      });
    } catch {
      return `<pre class="shiki" tabindex="0"><code>${escapeHtml(code)}</code></pre>`;
    }
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Parses Markdown safely with dual-theme Shiki blocks, TOC extraction, and XSS sanitization. */
export async function renderCozyMarkdown(
  markdown: string,
  copyLabels: { copy: string; copied: string } = { copy: 'Copy', copied: 'Copied' },
): Promise<RenderedMarkdown> {
  const source = markdown || '';
  const marked = new Marked({ gfm: true, breaks: false });
  const tokens = marked.lexer(source);

  const codeTokens: Tokens.Code[] = [];
  collectCodeTokens(tokens, codeTokens);

  const highlightedMap = new WeakMap<Tokens.Code, string>();
  await Promise.all(
    codeTokens.map(async (token) => {
      const html = await highlightCodeSafe(token.text, token.lang);
      highlightedMap.set(token, html);
    }),
  );

  const toc: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  const nextHeadingId = (rawText: string): string => {
    const base = normalizeSlug(rawText) || 'section';
    const count = usedIds.get(base) || 0;
    usedIds.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };

  const baseRenderer = new Renderer();
  const customRenderer = new Renderer();
  customRenderer.options = marked.defaults;

  customRenderer.heading = function heading({ tokens: headingTokens, depth }: Tokens.Heading): string {
    const inner = this.parser.parseInline(headingTokens);
    const plain = stripTags(inner);
    if (depth === 2 || depth === 3) {
      const id = nextHeadingId(plain);
      toc.push({ id, text: plain, depth });
      return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
    }
    const safeDepth = Math.min(Math.max(depth, 1), 6);
    return `<h${safeDepth}>${inner}</h${safeDepth}>\n`;
  };

  customRenderer.code = function code(token: Tokens.Code): string {
    const highlighted =
      highlightedMap.get(token) ||
      `<pre class="shiki" tabindex="0"><code>${escapeHtml(token.text)}</code></pre>`;
    const label = (token.lang || 'text').trim().split(/\s+/)[0] || 'text';
    return `<div class="code-block-wrap">
  <div class="code-block-header">
    <span>${escapeHtml(label)}</span>
    <button type="button" class="border border-[var(--border-light)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono-tech text-xs uppercase text-[var(--text-primary)] hover:border-[var(--border-strong)]" data-copy-code data-copy-label="${escapeHtml(copyLabels.copy)}" data-copied-label="${escapeHtml(copyLabels.copied)}">${escapeHtml(copyLabels.copy)}</button>
  </div>
  ${highlighted}
</div>\n`;
  };

  customRenderer.table = function table(token: Tokens.Table): string {
    baseRenderer.parser = this.parser;
    const htmlTable = baseRenderer.table.call(this, token);
    return `<div class="table-scroll">\n${htmlTable}</div>\n`;
  };

  customRenderer.link = function link({ href, title, tokens: linkTokens }: Tokens.Link): string {
    const inner = this.parser.parseInline(linkTokens);
    if (!href) return inner;
    if (href.startsWith('#')) {
      return `<a href="${escapeHtml(href)}">${inner}</a>`;
    }
    if (!isSafeExternalUrl(href)) {
      return inner;
    }
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${inner}</a>`;
  };

  customRenderer.image = function image({ href, title, text }: Tokens.Image): string {
    if (!href || !isSafeMediaUrl(href)) {
      return '';
    }
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text || '')}"${titleAttr} loading="lazy" decoding="async" />`;
  };

  marked.use({ renderer: customRenderer });
  const rawHtml = marked.parser(tokens);

  const hexPattern = [/^#[0-9a-fA-F]{3,8}$/];
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: [
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'ul',
      'ol',
      'li',
      'blockquote',
      'strong',
      'em',
      'del',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
      'br',
      'pre',
      'code',
      'span',
      'div',
      'button',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'loading', 'decoding'],
      h2: ['id'],
      h3: ['id'],
      div: ['class'],
      pre: ['class', 'style', 'tabindex'],
      code: ['class'],
      span: ['class', 'style'],
      button: ['type', 'class', 'data-copy-code', 'data-copy-label', 'data-copied-label'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowedStyles: {
      pre: {
        color: hexPattern,
        '--shiki-dark': hexPattern,
      },
      span: {
        color: hexPattern,
        '--shiki-dark': hexPattern,
      },
    },
    transformTags: {
      img: (tagName, attribs) => {
        if (!isSafeMediaUrl(attribs.src)) {
          return { tagName: 'span', attribs: {} };
        }
        return { tagName, attribs };
      },
    },
    allowProtocolRelative: false,
  });

  return { html: cleanHtml, toc };
}
