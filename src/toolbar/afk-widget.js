import { afkWidget } from '@/utils/constants/command';
import { cleanSpacesFromParameters } from '@/utils/common/common';
import { selectLine, widgetInstance } from '@/utils/widgets/regex';

export default {
  name: afkWidget,
  icon: 'v-md-icon-html',
  title: (editor) => editor.langConfig.afkWidget.toolbar,
  action(editor) {
    editor.$nextTick(async () => {
      try {
        let line = editor.codemirrorInstance.getCursor().line; //Cursor line
        let lineString = editor.codemirrorInstance.getLine(line);


        let { result: found, regex: widget_regex } = widgetInstance.checkInstance(lineString);

        console.log(found)

        if(found){
          selectLine(editor.codemirrorInstance, found, line);
  
          let { id, parameters } = widgetInstance.extractParameters(lineString, widget_regex);
  
          if (id) {
            editor.$refs.afkWidget.openModal(id, parameters);
          }
          return
        }

      } catch (e) {
        console.log(e);
      }
    });
  },
};
