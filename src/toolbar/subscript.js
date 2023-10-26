import { subscript } from '@/utils/constants/command';

export default {
  name: subscript,
  icon: 'v-md-icon-subscript',
  title: (editor) => editor.langConfig.subscript.toolbar,
  action(editor) {
    editor.execCommand(subscript);
  },
};
