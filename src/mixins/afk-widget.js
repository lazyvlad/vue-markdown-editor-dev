import AfkWidget from '@/components/afk-widget.vue'

import { afkWidget } from '@/utils/constants/command'; //we will use the same command which is an image command


export default {
  components: {
    [AfkWidget.name]: AfkWidget,
  },
  props: {
    // uploadImageConfig: Object,
  },
  emits: ['afk-widget-use-link'],    
  computed: {

  },
  methods: {

    insertWidget(item){
      console.log(item);
      this.$emit('afk-widget-use-link',
        (widgetConfig) => {
          this.execCommand(afkWidget,widgetConfig)
        },
        item
      );
    },
     
  },
};
