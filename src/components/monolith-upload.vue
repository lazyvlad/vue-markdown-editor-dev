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
@import '@/styles/var';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.monolith{
    background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;    
}




.modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    width: 90%;
    height: 90%;

    @media only screen and (max-width: 1240px) {
    
        overflow-y:scroll

    }    

    .header-title{
        display: flex;
        justify-content: center;
        color:#ddd;
        padding: 15px 10px;
        background: #1976d2;
    }    
  
    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
    button.close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ddd;
        border: none;
        padding: 8px 12px;
        border-radius: 50%;
        cursor: pointer;
    }

    button:hover {
        background-color: #ccc;
    }  
    .search-box{
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;        
    }
    .search-box-input{
        padding: 1rem;
        border:1px solid #ccc;
        border-radius: 1rem;
    }

    .upload-data{
        margin-top:1px;
        margin-bottom: 1px;
    }

    .container-area{
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: flex-start; /* align items in Main Axis */
        align-items: stretch; /* align items in Cross Axis */
        align-content: stretch; /* Extra space in Cross Axis */         
        font-family: Arial, Helvetica, sans-serif;
        font-size: 16px;
        height: 100%;
        @media only screen and (max-width: 1483px) {
            display: block;

        }
    }    


    .container-area {

        > div{
            flex-grow: 1;
            box-shadow: 0 1px 7px 3px #f3f3f3;    
            border-radius: 1rem;
        }
        
        div.info-area{
            flex-basis: 75%;
            flex-grow:0;
            max-width: 75%;
            height: 100%;

            @media only screen and (max-width: 1483px) {
                flex-basis: 100%;    
                max-width: 100%;
                margin-top: 1rem;
            }

            .pagination{
                display: flex;
                gap:0.51rem;
            }


            .buttons{
                display: flex;
                align-items: center;
            }

            

            /* CSS */
            .normal-button {
                appearance: button;
                background-color: #1652F0;
                border: 1px solid #1652F0;
                border-radius: 4px;
                box-sizing: border-box;
                color: #FFFFFF;
                cursor: pointer;
                font-family: Graphik,-apple-system,system-ui,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
                font-size: 14px;
                line-height: 1.15;
                overflow: visible;
                padding: 6px;
                position: relative;
                text-align: center;
                text-transform: none;
                transition: all 80ms ease-in-out;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                width: fit-content;
            }
            .normal-button.selected{
                background-color: #4CAF50;
            }

            .normal-button.delete{
                background-color: #c33c3c;
                border-color:#b44000
            }

            .normal-button.delete:hover{
                background-color: #b4000f;
                border-color:#b44000
            }

            .normal-button:disabled {
                opacity: .5;
            }

            .normal-button:focus {
                outline: 0;
            }

            .normal-button:hover {
                background-color: #2b5fe4;
                border-color: #2b5fe4;
            }

            .normal-button:active {
                background-color: #0039D7;
                border-color: #0039D7;
            }            
        }

        .data-area{
            height: 100%;
            @media only screen and (max-width: 1483px) {
                height: auto;
            }
        }

        .server-data{
            height: calc(100% - 8.1rem);
            overflow-y: auto;

            .delete-checkbox{
                padding: 30px;

                input{
                    width: 20px;
                }
            }


        }
        div.upload-area{
            max-height: 400px;
        }

        .drop-area{
            height: 100px;
            background-color: #ccc;
            display: flex;
            justify-content: center;
            vertical-align:middle;
            align-items: center;
            border-radius: 1rem;
            cursor: pointer;
        }
        .drop-area-wrap{
            padding: 1rem;
        }

        .image-preview{
            display:flex;
        }

        .image-preview img{
            object-fit: cover;
            width:100px;
            height: 100px;


        }

        .progress-bar-wrapper{
            fieldset{

                border: none;
                border-radius: 1rem;
                background: #f6f6f6;
                padding: 0.2rem;
                overflow: hidden;                
            }
        }

        .progress-bar{
            background-color: #2196f3;
            width:0%;
            display: flex;
            align-items: center;
            color: #f3f3f3; 
            border-radius:1rem;
           
            legend{
                
                display: flex;
                gap:1em;
                padding:8px;
                align-items: center;
                .small-name{
                    display: block;
                    font-size: 12px;
                    flex-grow: 100;
                }
            }
        }


        .info-message{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 400px;
        }


    }

    @import '@/assets/css/style';

}


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
        clickMe(){

            console.log(this.checkboxes)

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

                console.log(this.files_data)
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
  