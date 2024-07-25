<template>

    <div class='h-screen' :class="fullAnswer?'bg-red-500':'bg-green-500'">
    
    <div class="bg-red-500">Little Riddle</div>
    <div :class="fullAnswer?'bg-red-500':'bg-green-500'" class="h-full text-center">


        <div class="lato text-2xl mt-4">{{  riddle.hint  }}</div>

       

        <div class="mt-8 mx-4">

<div class="flex items-center justify-center mx-auto roboto"> 
    <div class='uppercase flex items-center grow mr-1 max-w-12 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="(letter,index) in firstWordAnswer">
{{ riddleWordArray[index] || '\u00A0' }}
</div>
</div>


<div class="flex items-center justify-center mx-auto mt-4 roboto"> 
<div class='uppercase flex items-center grow max-w-12 mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="(secondWordletter,index) in secondWordAnswer">
{{ riddleWordArray[index + firstWordAnswer.length] || '\u00A0' }}
</div>
</div>

<hr class="mt-6" />

<div class='lato inline-block mt-4  p-2'>Give me a: <span class='lato rounded border p-1 m-1' @click="nextHint()">Hint</span><span class='lato rounded border p-1 m-1' @click="hintKey()">Letter</span></div>

<div class='uppercase lato mt-4 text-xl' v-if="cluesIndex > -1">{{  riddle.clues[cluesIndex]  }}</div>

</div>



    </div>
    <div class="w-full absolute bottom-0 left-0 bg-blue-500 p-2">

       
       


        <div class="flex justify-between items-stretch  roboto">

            <div @click='pressKey(key)' class='uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="key in keyboard[0]">
            
                {{key}}
            
            </div>

        </div>

        <div class="px-4 my-2">

        <div class="w-full flex justify-between roboto">

            <div @click='pressKey(key)' class='uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="key in keyboard[1]">
            
            {{key}}
        
        </div>

    </div>

    </div>

    <div class="w-full flex justify-between roboto">

        <div @click='clearKey()' class='uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto'>
            
            x
        
        </div>

        <div @click='pressKey(key)' class='uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="key in keyboard[2]">
            
            {{key}}
        
        </div>

        <div @click='deleteKey()' class='uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto'>
            
            x
        
        </div>

        </div>


    </div>


        <!-- <h1>Guess the mystery rhyming words using a little clue</h1>

        <div>Clue: 'Small Puzzle'</div>
        <div>Answer: 'Little Riddle'</div>

        <button class="bg-green-500 text-xl py-2 px-4 text-white rounded-xl">Play Now</button> -->

        <!-- 

       
        <div class="mt-8">

        <div class="flex items-center justify-center mx-auto"> 
            <div class='w-8 h-8 p-2 mr-1 border rounded' v-for="firstWordletter in firstWordAnswer">
        {{ firstWordletter }}
        </div>
    </div>
       

    <div class="flex items-center justify-center mx-auto mt-4"> 
        <div class='w-8 h-8 p-2 mr-1 border rounded' v-for="secondWordletter in secondWordAnswer">
        {{ secondWordletter }}
        </div>
        </div>

    </div> -->

   
</div>
   

</template>


<script>

import CryptoJS from 'crypto-js'

import data from '@/assets/riddles.json';



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

            riddleWordArray : [],
            riddles : [],
            riddle : null,
            cluesIndex : -1,

            
            pageLoaded : false,
            dataStore: store,
            productDescription : "sdfsdf",
            encryptedRiddles : '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'
            

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

        fullAnswer() {


            return this.riddleWordArray.every(item => item !== '')


        },

        keyboard() {

            var row1 = "qwertyuiop".split("")
            var row2 = "asdfghjkl".split("")
            var row3 = "zxcvbnm".split("")

            return [row1,row2,row3]


        },

        riddleWord() {

            var riddleWordArray = this.riddle.rhyme.replace(/\s+/g, '').split("");
            var riddleAnswer = []
            riddleWordArray.forEach(letter => riddleAnswer.push(""))

            return riddleAnswer
            //return riddleWordArray.split("")

        },

        riddleWordLettersArray() {

var riddleWordArray = this.riddle.rhyme.replace(/\s+/g, '').split("");


return riddleWordArray
//return riddleWordArray.split("")

},

        firstWord() {

            return this.riddle.rhyme.split(' ')[0].split("")


        },

        firstWordAnswer() {

            var letters =  this.riddle.rhyme.split(' ')[0].split("")
            var firstWordAnswer = []
            letters.forEach(letter => firstWordAnswer.push(""))

            return firstWordAnswer


},


secondWordAnswer() {

var letters =  this.riddle.rhyme.split(' ')[1].split("")
var secondWordAnswer = []
letters.forEach(letter => secondWordAnswer.push(""))

return secondWordAnswer


},

        secondWord() {

return this.riddle.rhyme.split(' ')[1].split("")


},


numerOfLetters() { //determine if the user can edit this plan

    return 1


},





    },

    async created() {

        console.log('$$$$$$$')

        this.riddles = data;

        const randomIndex = Math.floor(Math.random() * this.riddles.length);
      this.riddle = this.riddles[randomIndex];

      this.riddle.clues = this.riddle.clues.filter(item => item !== '' && item !== null && item !== undefined);


      var riddleWordTmp = this.riddle.rhyme.replace(/\s+/g, '').split("");

      riddleWordTmp.forEach(letter => { this.riddleWordArray.push("") })

      

        //this.riddle = this.riddles

        const message = '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';
const password = 'my secret password';

// encrypt the message using AES encryption
//const ciphertext = CryptoJS.AES.encrypt(message, password);
//console.log(ciphertext.toString());

// decrypt the ciphertext using AES decryption
const bytes = CryptoJS.AES.decrypt(message, password);
const plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log(JSON.parse(plaintext)[0]);

       


        
    },

    methods: {


        nextHint : function() {

            if ( this.cluesIndex === - 1 ) {

                this.cluesIndex = 0

            } else {

                this.cluesIndex = (this.cluesIndex + 1) % this.riddle.clues.length;

            }

            


        },


        clearKey : function() {


            this.riddleWordArray = []

        },

        addValueToRandomBlankSlot : function(array) {


  // Step 1: Identify blank slots
  const blankIndices = array.reduce((acc, item, index) => {
    if (item === '' || item === null || item === undefined) {
      acc.push(index);
    }
    return acc;
  }, []);

  // Check if there are any blank slots
  if (blankIndices.length === 0) {
    console.log('No blank slots available');
    return array;
  }

  // Step 2: Pick a random blank slot
  const randomIndex = blankIndices[Math.floor(Math.random() * blankIndices.length)];

  // Step 3: Add value to the chosen slot
  array[randomIndex] = this.riddleWordLettersArray[randomIndex];

  return array;
},


        deleteKey : function() {


            this.riddleWordArray.pop()


        },

        hintKey : function(key) {

            const blankIndex = this.riddleWordArray.findIndex(item => item === '');
            if ( blankIndex === 0 ) {

                console.log('first one')
                this.riddleWordArray[blankIndex] = this.riddleWordLettersArray[blankIndex]


            } else {

                this.addValueToRandomBlankSlot(this.riddleWordArray);
                console.log('second one')



            }

            

                
               

               




        },

       

            pressKey : function(key) {

               

                
                console.log(key)

                const blankIndex = this.riddleWordArray.findIndex(item => item === '');

                console.log(blankIndex)

                // Check if a blank entry was found
                if (blankIndex !== -1) {
                    // Set the new value at the found index
                    this.riddleWordArray[blankIndex] = key;
                }
                




            },






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

html, body {
  overflow: hidden;
}




</style>