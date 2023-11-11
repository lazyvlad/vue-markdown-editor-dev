export { afkWidget as name } from '@/utils/constants/command.js';

export default function (editor, { id, description, title, slug } = {}) {


  let text = `\t{afk:widgets:instance id='${id}' __description='${description}' __title='${title}' __slug='${slug}'}`;
  editor.codemirrorInstance.replaceSelection(text);
  editor.$refs.afkWidget.closeModal();

}
