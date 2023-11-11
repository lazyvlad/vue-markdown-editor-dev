<template>

    <div class="modal-overlay" v-if="isOpen" @click.self="closeModal">
      <div class="modal">
            <input
                class="monolith"
                type="file"
                style="display: none"
                :accept="uploadConfig.accept"
                :multiple="uploadConfig.multiple"
                @change="doChange($event)"
                ref="fileMonolithUpload"
            >       
            <div class="container-area">
                <div class="upload-area">
                    <div class="header-title">Upload Panel</div>
                    <div class="drop-area-wrap">
                        <div class="drop-area" :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop" @click="openInput">
                            <span v-if="active">that's nice, drop it now!</span>
                            <span v-if="!active">To upload: <br/> drag files or click here</span>
                        </div>
                        <template v-for="file in files" :key="file.name" ref="upload_items">  
                                <div class="upload-data">
                                    <div class="progress-bar-wrapper">
                                        <fieldset>
                                            <div class="progress-bar" :style="{width:upload_status[file.name]?.percentage + '%', height:'30px', overflow:'hidden'}"> 
                                                <legend>
                                                    <div class="small-name"> <img :src="upload_status[file.name]?.imageData" width="30" height="30"/></div>
                                                    <span class="small-name"> {{ file.name }} </span>
                                                    <span class="small-name">{{ upload_status[file.name]?.percentage }}%</span>
                                                    <span class="small-name">{{ upload_status[file.name]?.status }}</span>
                                                </legend>
                                            </div>
                                        </fieldset>
                                    </div>                        
                                </div>
                        </template>                      
                    </div>
                </div>                
                <div class="info-area">
                    <div class="header-title">Images</div>
                    <div class="data-area">
                        <div class="search-box">
                            <input class="search-box-input" v-model="search_string" placeholder="search" ref="searcher"/>
                            <label>Showing: {{ filteredFiles.length }} / {{ files_data.count }}</label>
                            <div class="pagination">
                                <button class="normal-button" @click.prevent="loadMore">Load More ( {{ num_show }} )</button>
                                <div><button :class="['normal-button',(num_show==5)?'selected':'']" @click.prevent="howMany(5)">5</button></div>
                                <div><button :class="['normal-button',(num_show==20)?'selected':'']" @click.prevent="howMany(20)">20</button></div>
                                <div><button :class="['normal-button',(num_show==50)?'selected':'']" @click.prevent="howMany(50)">50</button></div>
                                <div><button :class="['normal-button',(num_show==100)?'selected':'']" @click.prevent="howMany(100)">100</button></div>
                                <div><button :class="['normal-button',(num_show==200)?'selected':'']" @click.prevent="howMany(200)">200</button></div>
                            </div>


                        </div>
                        <div class="server-data" ref="serverData" v-if="showData">
                                <div class="block header">
                                    <div class="delete-checkbox"><input v-if="filteredFiles.length > 0" type="checkbox" v-model="selectAll" :value="false" /></div>
                                    <div class="buttons"> <button class="normal-button delete" v-if="selected_images.length>0" @click.prevent="deleteSelected">Delete</button> </div>
                                </div>                                
                                <template v-for="(item,index) in filteredFiles" :key="item.id" ref="ref_items">  
                                    <div class="block">
                                        <div class="delete-checkbox"><input :ref="checkboxRefs" type="checkbox"  v-model="selected_images" :value="Number(item.id)" /></div>
                                        <a :href="item.image_url" :class="[item.extension.substring(1).toLowerCase(),imageSelected(Number(item.id))]" target="_blank">
                                        <div :class="['img',item.extension.substring(1).toLowerCase()]"></div>
                                        <div class="name">
                                            <div class="file fs-1-2 bold">{{item.filename}}</div>
                                            <div class="data upper size fs-0-7"><span class="bold">Size:</span>{{printSize(item.size)}}</div>
                                            <div class="data upper modified fs-0-7"><span class="bold">Extension:</span>{{item.extension}}</div>
                                        </div>
                                        </a>
                                        <div class="image-preview">
                                            <img :src="item.image_data?.medium_version?.url" />
                                            <a href="#" @click.prevent="useImage(item)" class="link-interaction"> Use </a>
                                        </div>
                                    </div>
                                </template>
                        </div>
                        <div v-else class="server-data">     
                            <div class="info-message">Data is being fetched. Please wait...</div>
                        </div>                            
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

    const events = ['dragenter', 'dragover', 'dragleave', 'drop']


    import { filesFilter, getFilesFromClipboardData } from '@/utils/file';
    import { ref, onMounted, onUnmounted, reactive } from 'vue'   

    import axios from 'axios';

    
    
  export default {
    name: 'v-md-monolith-upload',
    inject : ['markdownEditor'],
    props: {
      uploadConfig: Object,
      uploadUrl:Object,
      settings:Object,
    },
    data() {

      let active = ref(false)
      let showProgress = ref(false)
      let show_data = ref(false)
      let files_data = ref([{count:0,sliced:[]}]);
      let upload_status = ref({});


      let num_show = ref(Number(this.settings?.num_show??0))
      let page_show = ref(Number(this.settings?.page_show??0))

      return {
        media : [],
        selected_images : ref([]),
        active : active,
        upload_enabled: ref(true),
        show_data : show_data,
        search_string : ref(''),
        isOpen: false,     
        inActiveTimeout : null,   
        handleUpload() {},
        showProgress : showProgress,
        files_data : files_data,
        upload_status: upload_status,
        files : ref([]),
        added_files : ref([]),
        checkboxes:reactive([]),
        selectAll : ref(false),
        showDelete: ref(false),
        page_show,
        num_show
      };
    },
    mounted(){

        events.forEach((eventName) => {
		    document.body.addEventListener(eventName, this.preventDefaults)
	    })        

    },
    unmounted(){

        events.forEach((eventName) => {
		    document.body.removeEventListener(eventName, this.preventDefaults)
	    })

    },
    watch : {
        selectAll(new_value,old_value){

            this.selected_images = [];                

            if(new_value == true){
                for (let index = 0; index < this.filteredFiles.length; index++) {
                    const image = this.filteredFiles[index];
                    this.selected_images.push(Number(image.id))               
                }
            }
        }
    },
    computed: {
        showData(){
            return this.show_data
        },
        filteredFiles(){

            let filtered = [];
            if(this.files_data?.sliced){
                filtered= this.files_data?.sliced?.filter((file_item)=>{
    
                    const match_regex = this.search_string;
                    var re = new RegExp(match_regex,"g");    
    
                    if(file_item?.filename?.toLowerCase().match(re)){
                        return true;
                    } 
                })
            }
            return filtered;
        },
    },  
    methods: {

        howMany(how_many){

            this.num_show = how_many
        },
        async loadMore(){

            let payload = {
                 params:{
                     num_show: this.num_show,
                     page_show: this.files_data.sliced.length
                 }
            }

            console.log(payload)

              let response = await axios.get(this.uploadUrl.get,payload);
              if (response.status == 200 && response.statusText == "OK") {


                  this.files_data.sliced =[ ...this.files_data.sliced,...response?.data?.sliced];
                  this.files_data.count = response?.data?.count

                  console.log(this.files_data)
                  this.show_data = true
              }


        },  

        checkboxRefs(el){

            if(el){
                this.checkboxes.push(el);
            }

        },
        deleteSelected(){

            let deleted = new Promise((resolve, reject) => {

                resolve(axios.post(this.uploadUrl.delete, {
                    images:this.selected_images
                },{
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }
                }))

            });            

            deleted.then((resolution)=>{
                
                if(resolution.status){

                    let arrayfromdata = Array.from(resolution?.data?.items,(item)=>{
                        return item.id
                    });

                    let new_list = this.files_data?.sliced

                    new_list = new_list.filter( (item) => {

                        return !arrayfromdata.includes(item.id)
                    })

                    this.files_data.sliced = new_list
                    this.selected_images = []
                    this.selectAll = false
                }

            })            


            
        },
        
        imageSelected(id){
            return (this.selected_images.includes(id))?'selected':''
        },
        async loadData(){

              let payload = {
                  params: {
                      num_show: this.num_show,
                      page_show: this.page_show
                  }
              }

            let response = await axios.get(this.uploadUrl.get,payload);
            if(response.status == 200 && response.statusText == "OK"){

                this.files_data = response?.data
                this.show_data = true
            }
        },        
        async openModal() {
            this.isOpen = true;
            await this.loadData();
        },
        closeModal() {
          this.isOpen = false;
        },        
        useImage(item){

            this.markdownEditor.useImage(item)
        },
        printSize(size){

            if(Number(size) > 1024 * 1024){
                return (Number(size) / (1024 * 1024)).toFixed(2) + 'MB'
            }

            if(Number(size) > 1024){
                return (Number(size) / 1024).toFixed(2) + 'KB'
            }
        },        
        async doChange(e){

            this.files = filesFilter(e.target.files, this.uploadConfig);

            this.upload_enabled = false
            
            await this.uploadFiles()
            
            // this.$emit('files-dropped', [...e.target.files])
        },
        async onDrop(e) {
            
            this.files = filesFilter(e.dataTransfer.files, this.uploadConfig);   
            this.setInactive()

            await this.uploadFiles();
   
        },        
        setActive() {
            this.active = true
            clearTimeout(this.inActiveTimeout)
        },
        setInactive() {
            this.inActiveTimeout = setTimeout(() => {
                this.active = false
            }, 50)
        },
        async uploadFiles(){


            let uploaded  = Promise.all(await this.files.map( async (file,index) => await this.uploadFile(file,index) )) 

            uploaded.then((resolution)=>{

                this.upload_enabled = true
                this.added_files = [...this.added_files,...this.files]
                //clear the files list to be able to upload the same image
                this.files = [];
                //clear the upload status
                this.upload_status = {}
                this.key++;
            })

            
            
        },          
        async uploadFile(file,index){


            this.upload_status[file.name] = {
                        loaded:0,
                        total:file.size,
                        percentage: 0,
                        status : 'uploading...',
                        imageData: ''
            }

            const reader = new FileReader
            reader.onload = e => {
                this.upload_status[file.name].imageData = e.target.result
            }
            reader.readAsDataURL(file)            

            // set up the request data
            let response = await axios.post(this.uploadUrl.post, {
                webp_size_w: '900', 
                webp_size_h: '900', 
                files:file
            },{
                headers: {
                'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: ({loaded,total}) => {

                    this.upload_status[file.name] = {...this.upload_status[file.name],
                        loaded,
                        total,
                        percentage: Math.round(loaded / total * 100),
                        status : (Math.round(loaded / total * 100) == 100)?'processing...':'uploading...'
                    }

                }
            });

            let data = response?.data.map((item) => {

                item.image_versions.forEach((version) => {
                    item[`${version.name}_url`] = version.url
                })

                return item;
            });


            this.files.splice(index,1);

            this.files_data.sliced = [...data,...this.files_data.sliced];
            this.files_data.count = this.files_data.count + response.data.length;


            return response
        },        
        preventDefaults(e) {
            e.preventDefault()
        },
        openInput(){
            if(this.upload_enabled)
                this.$refs.fileMonolithUpload.click();
        },
        chooseFile() {
            console.log('nekoj treba da go povikuva');
            return new Promise((resolve) => {

                this.handleUpload = (e) => {


                console.log(`from hanlde upload`)
                resolve(e);

                    this.key++;
                };

                this.$refs.fileMonolithUpload.click();
            });
        },        
        notify(data){
            console.log(`I was called with the data ${data}`)
        },


    },
  };
  </script>
  