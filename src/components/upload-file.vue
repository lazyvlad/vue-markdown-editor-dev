<template>
  <input
    type="file"
    style="display: block"
    :key="key"
    :accept="uploadConfig.accept"
    :multiple="uploadConfig.multiple"
    @input="handleUpload"
    ref="fileInput"
  >
</template>

<script>
export default {
  name: 'v-md-upload-file',
  props: {
    uploadConfig: Object,
  },
  data() {
    return {
      handleUpload() {},
      key: 0,
    };
  },
  methods: {
    async upload() {
      const event = await this.chooseFile();

      return event;
    },   
    chooseFile() {
      return new Promise((resolve) => {
        this.handleUpload = (e) => {
          resolve(e);

          this.key++;
        };

        this.$refs.fileInput.click();
      });
    },
  },
};
</script>
