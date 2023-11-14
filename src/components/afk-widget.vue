<template>

    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
      <div class="modal">
    
            <div class="container-area">
                <div class="info-area">
                    <iframe :src="url" frameborder="0"></iframe>
                </div>
                <div class="message-area">
                    viewing: {{ url }}
                    <div v-if="iframe_message">
                        {{ iframe_message }}
                    </div>
                </div>
            </div>
            <button class="close-button" @click="closeModal">X</button>
      </div>
    </div>
</template>
<style lang="scss">
@import '@/styles/modals';

</style>


  
  <script>

    import { ref, onMounted, onUnmounted, reactive } from 'vue'   
    import axios from 'axios';
    
    
  export default {
    name: 'v-md-afk-widget',
    inject : ['markdownEditor'],
    props: {
      widgetSettings:Object,
    },
    data() {

      let url = this.widgetSettings?.url
      return {
        isOpen: ref(false),
        base_url: url,
        url: ref(url),
        iframe_message: ref('')
      };
    },
    mounted(){     


		    window.addEventListener("message", this.iframeEvent, false);        
    },
    unmounted(){

    },
    watch : {

    },
    computed: {

    },  
    methods: {

        iframeEvent(event){


            if(event?.data){

                if(event.data?.canceled){
                    console.log(`the action was canceled`);
                    this.isOpen = false;
                    return
                }

                if(event.data.msg){

                    this.iframe_message = event.data.msg

                    if(event.data?.data){
                        
                        let title = event.data?.data?.options?.widget_title;
                        let id = event.data?.data?.instance_id;
                        let description = `Widget: ${event.data?.data?.options?.widget_title}(#${id})`;
                        let slug = event.data?.data?.options?.slug
    
                        this.markdownEditor.insertWidget({
                            id,title,description,slug
                        })
                    }

                }
            }
        },
        openModal(id,parameters) {
            if(!this.url)
                return;

            if(id){
                this.url = `${this.base_url}/${id.id}`;
                this.isOpen = true;
            }
        },
        closeModal() {
          this.isOpen = false;
        }

    },
  };
  </script>
  