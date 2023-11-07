import { monolithUpload } from '@/utils/constants/command';
import { filesFilter } from '@/utils/file';

export default {
    name: monolithUpload,
    icon: 'v-md-icon-img',
    title: (editor) => editor.langConfig.monolithUpload.toolbar,
    action(editor) {

        editor.$nextTick(async () => {

            try{

                //here i could call the component monolithUpload, but we really don't have a need for that component, a simple mixin is enough
              const event = await editor.$refs.monolithUpload.openModal();
            //   const files = filesFilter(event.target.files, editor.uploadImgConfig);
            //   editor.activate();
  
            }
            catch(e){
              console.log(e)
            }  
  
          });        
    },
  };
