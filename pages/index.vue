<template>
    <div v-show='pageLoaded' class="m-8 roboto">

        Little Riddle
      

    </div>

</template>


<script>

import {
    store
} from "../store/store.js";

import {
    ref,
    reactive
} from 'vue'





import {
    CheckIcon,
    HeartIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios';
import qs from 'qs'

export default {

    name: 'home',

    components: {
        CheckIcon,
        HeartIcon
    },

    //======================================================================================
    //======================================================================================
    data: function() {
        return {

            pageLoaded : false,
            dataStore: store,
            productDescription : "sdfsdf"
            

            }

        

    },

    async mounted() {

        //this needs to be in mounted, and not created or bad things happen
        useHead({

            title: this.productName,
            meta: [{
                name: 'description',
                content: this.productDescription
            }],

            htmlAttrs: {
                lang: 'en', // Specify the language here
            },

            /*
            script: [

                {
                    src: `https://accounts.google.com/gsi/client`,
                    tagPosition: 'bodyClose',
                    defer: true
                },

                {
                    src: `https://apis.google.com/js/api.js`,
                    tagPosition: 'bodyClose',
                    onload : this.gapiLoad(),
                    defer: true
                },

              
            ]
            */

        })

        useSeoMeta({
            title: this.productName,
            description: this.productDescription

        })


        console.log('sdfdsfdf')
        this.pageLoaded = true

    },

    computed: {


numerOfLetters() { //determine if the user can edit this plan

    return 1


},





    },

    async created() {

        
    },

    methods: {


        uploadNarration : async function(slideIndex) {

            

        },

        

    },

    watch: {

        currentStep(newVal, oldVal) {

          

        }

    },

}

</script>




<style>






</style>