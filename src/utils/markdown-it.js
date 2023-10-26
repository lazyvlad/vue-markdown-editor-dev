import MarkdownIt from 'markdown-it';
import { escapeHtml } from 'markdown-it/lib/common/utils';

// const MarkdownItSub = require('markdown-it-sub')

export function createHighlightRender({
  codeHighlightExtensionMap = {},
  hasLang = () => true,
  highlight = (str) => str,
  codeBlockClass,
}) {
  const getCodeBlockClass = (lang) => (codeBlockClass ? codeBlockClass(lang) : `language-${lang}`);

  return function (str, lang) {
    let res = escapeHtml(str);

    lang = codeHighlightExtensionMap[lang] || lang;

    if (lang) {
      if (hasLang(lang)) {
        res = highlight(str, lang);
      }
    }

    return `<pre class="${getCodeBlockClass(lang)}"><code>${res}</code></pre>`;
  };
}

export default function () {
  const markdownItInstance = new MarkdownIt();

  markdownItInstance.set({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  // markdownItInstance.use(markDownItSub)

  return markdownItInstance;
}
