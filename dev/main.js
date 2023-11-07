import App from './App';
import { createApp } from 'vue';
import PreviewHtml from '@/preview-html.js';
// import VueMarkdownEditor from '@/base-editor';
import VueMarkdownEditor from '@/codemirror-editor';
// import Preview from '@/preview';
import githubTheme from '@/theme/github/index';

import createEmojiPlugin from '@/plugins/emoji/full';
import '@/plugins/emoji/emoji';
import createKatexPlugin from '@/plugins/katex/cdn';
import createTodoListPlugin from '@/plugins/todo-list/index';
import '@/plugins/todo-list/todo-list';
import createLineNumberPlugin from '@/plugins/line-number/index';
import createCopyCodePlugin from '@/plugins/copy-code/index';
import '@/plugins/copy-code/copy-code';
import createHighLinesPlugin from '@/plugins/highlight-lines/';
import '@/plugins/highlight-lines/highlight-lines';
import createMermaidPlugin from '@/plugins/mermaid/cdn';

import createCreateCopyCodePreview from '@/plugins/copy-code/preview';

import vuepressTheme from '@/theme/vuepress';
import enUS from '@/lang/en-US';

import Prism from 'prismjs';

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

const app = createApp(App);

PreviewHtml.use(createCreateCopyCodePreview());

VueMarkdownEditor.lang.use('en-US', enUS);

// VueMarkdownEditor.use(githubTheme, {
//   codeHighlightExtensionMap: {
//     vue: 'xml',
//   },
// });
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  codeHighlightExtensionMap: {
    vue: 'markup',
  },
});

// Preview.use(githubTheme);

VueMarkdownEditor.use(createEmojiPlugin())
  .use(createKatexPlugin())
  .use(createTodoListPlugin())
  .use(createLineNumberPlugin())
  .use(createCopyCodePlugin())
  .use(createHighLinesPlugin())
  .use(createMermaidPlugin());

VueMarkdownEditor.Codemirror = Codemirror;

app.use(VueMarkdownEditor);
app.use(PreviewHtml);
// app.use(Preview);

app.mount('#app');


