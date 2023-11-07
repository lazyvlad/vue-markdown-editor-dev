import MonolithUpload from '@/components/monolith-upload.vue'

import { image } from '@/utils/constants/command'; //we will use the same command which is an image command


const defaultConfig = {
    accept: 'image/*',
    multiple: true,
  };

export default {
  components: {
    [MonolithUpload.name]: MonolithUpload,
  },
  props: {
    uploadImageConfig: Object,
  },
  emits: ['monolith-upload','monolith-use-link'],    
  computed: {
    monolithImageConfig(){
        return { ...defaultConfig, ...this.uploadImageConfig };
    }
  },
  methods: {

    useImage(item){


      console.log('this is happening in use image');
      this.$emit('monolith-use-link',
        (imageConfig) => {
          console.log(image)
          this.execCommand(image,imageConfig)
        },
        item
      );
    },
     
  },
};
