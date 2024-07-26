<template>

    <div class='h-screen' :class="fullAnswer?solved?'bg-green-500':'bg-red-500':'bg-white'">
    
    <div class="bg-red-500">Little Riddle</div>
    <div  class="h-full text-center">


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

<div class='lato inline-block mt-4  p-2'>Give me a: <span class='cursor-pointer lato rounded border p-1 m-1' @click="nextHint()">Hint</span><span class='cursor-pointer lato rounded border p-1 m-1' @click="hintKey()">Letter</span></div>

<div class='uppercase lato mt-4 text-xl' v-if="cluesIndex > -1">{{  riddle.clues[cluesIndex]  }}</div>

<button class='cursor-pointer' @click="shareRiddle()">Share Riddle</button>

</div>



    </div>
    <div class="w-full absolute bottom-0 left-0 bg-blue-500 p-2">

       
       


        <div class="flex justify-between items-stretch  roboto">

            <div @click='pressKey(key)' class='cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="key in keyboard[0]">
            
                {{key}}
            
            </div>

        </div>

        <div class="px-4 my-2">

        <div class="w-full flex justify-between roboto">

            <div @click='pressKey(key)' class='cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="key in keyboard[1]">
            
            {{key}}
        
        </div>

    </div>

    </div>

    <div class="w-full flex justify-between roboto">

        <div @click='clearKey()' class='cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto'>
            
            x
        
        </div>

        <div @click='pressKey(key)' class='cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto' v-for="key in keyboard[2]">
            
            {{key}}
        
        </div>

        <div @click='deleteKey()' class='cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-14 text-center text-3xl  my-auto'>
            
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
            
            

            }

        

    },

    async mounted() {

        //this needs to be in mounted, and not in create() or bad things happen
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

        solved() {

            return this.arraysEqual(this.riddleWordLettersArray, this.riddleWordArray)

            



        },

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

        //this stores the answer
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


       
console.log(this.$route)


        if (process.browser) {

//these are just some helpers for local dev / prod
store.localHost = store.isHostedLocally()
store.functionEndpoint = store.getFunctionEndpoint()
store.hostName = store.getHostname()
store.protocol = store.getProtocol()

}

        console.log('$$$$$$$')

        this.riddles = data;

        //if ( process.browser ) {

           // const currentUrl = window.location.href;

    // Parse the URL to extract the query string
    //const queryString = currentUrl.split('?')[1];

    // Check if the URL has a query string
    if (this.$route.query) {
      // Parse the query string using qs
     // const queryParams = qs.parse(queryString);
      this.riddle = JSON.parse(this.decrypt(this.$route.query.riddle))
    } else {

        const randomIndex = Math.floor(Math.random() * this.riddles.length);
      this.riddle = this.riddles[randomIndex];

     

      
    }

    this.riddle.clues = this.riddle.clues.filter(item => item !== '' && item !== null && item !== undefined);
      var riddleWordTmp = this.riddle.rhyme.replace(/\s+/g, '').split("");
      riddleWordTmp.forEach(letter => { this.riddleWordArray.push("") })




        

        

        
      

      

       

       


        
    },

    methods: {


        arraysEqual : function(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
},

        copyTextToClipboard: function(textToCopy, highlightElementID) {

       
    
var tempInput = document.createElement("textarea");
tempInput.style = "position: absolute; left: -1000px; top: -1000px";

tempInput.value = textToCopy

document.body.appendChild(tempInput);
tempInput.select();
document.execCommand("copy");
document.body.removeChild(tempInput);

//store.highlightElement(highlightElementID)





},




fallbackCopyTextToClipboard: function(text) {



var textArea = document.createElement("textarea");
textArea.value = text;

// Avoid scrolling to bottom
textArea.style.top = "0";
textArea.style.left = "0";
textArea.style.position = "fixed";

document.body.appendChild(textArea);
textArea.focus();
textArea.select();

try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
} catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
}

document.body.removeChild(textArea);
},


        shareRiddle : function() {

            this.copyTextToClipboard(store.protocol + "//" + store.hostName + "/?riddle=" + encodeURIComponent(this.encrypt()))


        },


        encrypt : function() {

            return CryptoJS.AES.encrypt(JSON.stringify(this.riddle), "littleriddle");


        },


        decrypt : function(message) {

            console.log(message)

            const bytes = CryptoJS.AES.decrypt(message, "littleriddle");
            const plaintext = bytes.toString(CryptoJS.enc.Utf8);

            console.log(plaintext)
            return plaintext

        },

        
//console.log(ciphertext.toString());


        nextHint : function() {

            if ( this.cluesIndex === - 1 ) {

                this.cluesIndex = 0

            } else {

                this.cluesIndex = (this.cluesIndex + 1) % this.riddle.clues.length;

            }

            


        },


        clearKey : function() {


            this.riddleWordArray = this.riddleWordArray.map(() => "")

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

           


            const blankIndex = this.riddleWordArray.findIndex(item => item === '');
            console.log(blankIndex)
            if ( blankIndex === - 1 ) {

                this.riddleWordArray[this.riddleWordArray.length - 1] = "";


            } else {

                var lastIndex = this.riddleWordArray.slice().reverse().findIndex(item => item !== "");
                const actualIndex = lastIndex !== -1 ? this.riddleWordArray.length - 1 - lastIndex : -1;
                this.riddleWordArray[actualIndex] = ""


            }

        },

        hintKey : function(key) {

            if ( !this.fullAnswer ) {

            const blankIndex = this.riddleWordArray.findIndex(item => item === '');
            if ( blankIndex === 0 ) {

                console.log('first one')
                this.riddleWordArray[blankIndex] = this.riddleWordLettersArray[blankIndex]


            } else {

                this.addValueToRandomBlankSlot(this.riddleWordArray);
                console.log('second one')



            }

            

        } else {


            console.log('all full here')

        }
               

               




        },

       

            pressKey : function(key) {

               
                if ( !this.fullAnswer ) {

                        const blankIndex = this.riddleWordArray.findIndex(item => item === '');

                        // Check if a blank entry was found
                        if (blankIndex !== -1) {
                            // Set the new value at the found index
                            this.riddleWordArray[blankIndex] = key;
                        }

                } else {

                    console.log('all full here')

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
 
      user-select: none;
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
    
}




</style>