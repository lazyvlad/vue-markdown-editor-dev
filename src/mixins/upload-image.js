import UploadFile from '@/components/upload-file';
import imageToolbar from '@/toolbar/image';
import { filesFilter, getFilesFromClipboardData } from '@/utils/file';
import { image } from '@/utils/constants/command';

const defaultConfig = {
  accept: 'image/*',
  multiple: false,
};

export default {
  components: {
    [UploadFile.name]: UploadFile,
  },
  props: {
    uploadImageConfig: Object,
  },
  emits: ['upload-image'],
  computed: {
    uploadImgConfig() {

      return { ...defaultConfig, ...this.uploadImageConfig };
    },
    hasUploadImage() {

      console.log(!this.disabledMenus.includes(`${imageToolbar.name}/upload-image`))
      return !this.disabledMenus.includes(`${imageToolbar.name}/upload-image`);
    },
  },
  methods: {
    handleDrop(e) {

      const files = filesFilter(e.dataTransfer.files, this.uploadImgConfig);


      console.log(files)

      this.emitUploadImage(e, files);
    },
    handlePaste(e) {
      const { clipboardData } = e;

      if (!clipboardData) return;

      const files = filesFilter(getFilesFromClipboardData(clipboardData), this.uploadImgConfig);


      console.log(files)

      this.emitUploadImage(e, files);
    },
    emitUploadImage(e, files) {
      if (this.hasUploadImage && files.length) {
        e.preventDefault();

        this.$emit(
          'upload-image',
          e,
          (imageConfig) => {
            console.log('tuka tava ne se ni desva');
            this.execCommand(image, imageConfig);
          },
          files
        );
      }
    },
  },
};
