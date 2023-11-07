<template>
    <div class="form-check noselect">
        <input class="form-check-input" type="checkbox" :id="id" :value="value" :model="modelValue" />
        <label class="form-check-label" :for="id">
            <slot />
        </label>
    </div>
</template>

<script>


import { v4 as uuidv4 } from "uuid";



export default {
    inheritAttrs: false,
    name:'md-check-box',
    emits: ["update:modelValue"],
    props: {
        modelValue: {
            type: [Array,Boolean],
            required: true,
        },
        value:{
            type:[Boolean,Object],
            required : true
        }
    },
    data() {

        return {
            id: uuidv4(),
        };
    },
    create(){
        console.log('should be created no?')
    },
    computed : {
        model:{
            get(){
                return this.modelValue
            },
            set(value){
                this.$emit('update:modelValue',value)
            }
        }
    }

};
</script>