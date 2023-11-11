<template>
  <div>
    <v-md-editor
      v-model="text"
      height="700px"
      autofocus
      :default-fullscreen="true"
      :disabled-menus="[]"
      toc-nav-position-right
      :upload-url = "{
        get : `${base_url}/files/ajax/get_images`,
        post:`${base_url}/files/upload/photo?sess=2`,
        delete:`${base_url}/files/ajax/delete_images`,
        num_show:100,
        page_show:0
      }"
      :widget-settings="{
        url: `${base_url}/widgets/admin/iframe_edit_instance`
      }"
      @upload-image="handleUploadImage"
      @fullscreen-change="handleFullscreenChange"
      @save="handleSave"
      @copy-code-success="handleCopyCodeSuccess"
      @monolith-use-link="handleMonolithInject"
      @afk-widget-use-link="handleInsertWidget"
      :monolith-settings="{num_show:100,page_show:0}"
      ref="editor"
    />
  </div>
</template>


<script>
import text from './text';
import html from './html';


export default {
  data() {


    return {
      base_url : 'https://dev.afk.mk/barkoder',
      text,
      html,
    };
  },
  methods: {

    handleFullscreenChange(v) {
      console.log(v);
    },
    handleMonolithInject(insertImage,image){

        let url = (image.image_url)?image.image_url:image.url;

        insertImage({
          url: url,
          desc: image.filename,
        });
    },
    handleInsertWidget(insertLink,widget){

      console.log(widget);
      insertLink(widget)
      

    },
    handleUploadImage(e, insertImage, files) {

      console.log(files);


      insertImage({
        url: 'https://google.com',
        desc: 'A matter of time',
      });
    },
    handleSave(v, html) {
      console.log(v, html);
    },
    handleCopyCodeSuccess(code) {
      console.log(code);
    },
  },
};
</script>
