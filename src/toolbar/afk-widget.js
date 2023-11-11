import { afkWidget } from '@/utils/constants/command';
import { filesFilter } from '@/utils/file';

export default {
    name: afkWidget,
    icon: 'v-md-icon-img',
    title: (editor) => editor.langConfig.afkWidget.toolbar,
    action(editor) {

        editor.$nextTick(async () => {

            try{

              let selection = editor.codemirrorInstance.getSelection();



              var line = editor.codemirrorInstance.getCursor().line,   //Cursor line
                ch = editor.codemirrorInstance.getCursor().ch,       //Cursor character
                // stringToMatch = "color:",
                // n = stringToMatch.length,
                // stringToTest = editor.codemirrorInstance.getLine(line).substr(Math.max(ch - n, 0), n);

                lineString = editor.codemirrorInstance.getLine(line);
                let cmEditor = editor.codemirrorInstance;


                // const re = /see (chapter \d+(\.\d)*)/i;
                const widget_regex = new RegExp("\{afk:widgets:instance\s*(.*)\}", "i"); 
                const found = lineString.match(widget_regex); 


                console.log(found);

                console.log(cmEditor)

                if(found && found[0]){
                  let keyword = found[0];

                  //keyword is a lowercase string I wish to search for in my cmEditor instance of codemirror editor.
                  var cursor = editor.codemirrorInstance.getSearchCursor(keyword, {line:line,ch:0}, { caseFold: true, multiline: false })

                  
                  let cursor_found = cursor.find();
                  console.log(cursor_found);

                  if (cursor_found) { //move to that position.

                    let from = cursor.from()
                    let to = cursor.to()
                    console.log('i guess this is not happening?')
                    cmEditor.setSelection(from, to);
                    cmEditor.scrollIntoView({ from: from, to: to }, 20);

                  }                  
                }

                // return;


                const parameters = lineString
                        .replace(widget_regex,(match,p1,p2) => {
                            let m = p1.trim().replace(/\s+/g,',');
                            return m
                        })
                        .split(',')
                        .map( (element) => {

                            let value = element.split('=').map( (el) => {
                                return el.replace(/'/g,'');
                            });
                            let return_value = {};
                            return_value[value[0]] = value[1]
                            return return_value;
                        });
                

                let id = parameters.find( (element) => {
                    return (element.id)
                })
                console.log(parameters)
                console.log(id)

                if(id){
                    const event = editor.$refs.afkWidget.openModal(id,parameters);
                }
  
            }
            catch(e){
              console.log(e)
            }  
  
          });        
    },
  };
