import { cleanSpacesFromParameters } from '@/utils/common/common';


let doCheck = (afk_text,widget_regex) => {

    const found = afk_text.match(widget_regex);

    return {
      regex: widget_regex,
      result: found && found[0] ? found[0] : false,
    };  

}

let checkWidget = (afk_text) => {

    const widget_regex = /\{\s*afk\s*:\s*widgets\s*:\s*instance\s*(.*?)\s*\}/gim; 
    
    return doCheck(afk_text, widget_regex);    


}

let checkLoadPartial = (afk_text) => {

    // afk:template:load_partial

    const widget_regex = /\{\s*afk\s*:\s*template\s*:\s*load_partial\s*(.*?)\s*\}/gim;
    return doCheck(afk_text, widget_regex);  


  }
let checkLoadCss = (afk_text) => {

  }
let  checkLoadJs = (afk_text) => {

  }



const widgetInstance = {
  //check if a string is a widget instance, if it is return the string
  checkInstance: (afk_text) => {

      let type  = checkWidget(afk_text)
      if(type.result) return type

      type = checkLoadPartial(afk_text)
      if(type.result) return type;
  },

  extractParameters: (afk_text, regex) => {
    let parameters = afk_text
      .replace(regex, (match, p1, p2) => {
        return cleanSpacesFromParameters(p1);
      })
      .split(',')
      .map((element) => {
        let value = element.split('=').map((el) => {
          return el.replace(/'/g, '');
        });
        let return_value = {};
        return_value[value[0].replace(/\s+/, '')] = value[1];
        return return_value;
      });

    let id = parameters.find((element) => {
      return element.id;
    });

    return {
      id,
      parameters,
    };
  },
};

export { widgetInstance };

export function selectLine(editor, keyword, line) {
  if (!keyword) return;
  if (!line) return;
  if (!editor) return;

  var cursor = editor.getSearchCursor(
    keyword,
    { line: line, ch: 0 },
    { caseFold: true, multiline: false }
  );

  let cursor_found = cursor.find();

  if (cursor_found) {
    let from = cursor.from();
    let to = cursor.to();
    editor.setSelection(from, to);
    editor.scrollIntoView({ from: from, to: to }, 20);
  }
}
