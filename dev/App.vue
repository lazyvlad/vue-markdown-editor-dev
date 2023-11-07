<template>
  <div>
    <v-md-editor
      v-model="text"
      height="700px"
      autofocus
      :disabled-menus="[]"
      toc-nav-position-right
      :upload-url = "{
        get : `${base_url}/files/ajax/get_images`,
        post:`${base_url}/files/upload/photo?sess=2`,
        delete:`${base_url}/files/ajax/delete_images`,
        num_show:100,
        page_show:0
        }"
      @upload-image="handleUploadImage"
      @fullscreen-change="handleFullscreenChange"
      @save="handleSave"
      @copy-code-success="handleCopyCodeSuccess"
      @monolith-use-link="handleMonolithInject"
      :monolith-settings="{num_show:100,page_show:0}"
      ref="editor"
    />
  </div>
</template>


<script>
import text from './text';
import html from './html';

import {ref, computed} from 'vue';

import axios from 'axios';

export default {
  data() {


    return {
      base_url : 'https://dev.afk.mk/barkoder/',
      text,
      html,
    };
  },
  methods: {

    handleFullscreenChange(v) {
      console.log(v);
    },
    handleMonolithInject(insertImage,image){
        console.log(image);
        insertImage({
          url: image.image_url,
          desc: image.filename,
        });
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
