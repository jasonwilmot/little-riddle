<template>

    <div class='h-screen'>
    
    <div class="luckiest bg-white mt-6 md:mt-8 text-center text-4xl text-purple-500">Little Riddle:</div>

    

    <div  class="h-full text-center">

        <div v-if='riddle.rhyme !== ""' id="riddleContainer">

            <div class='flex my-4 mx-4 text-xl text-gray-500 text-center' v-if='newPlayer'><div class='max-w-2xl mx-auto'>Use the keyboard to solve the rhyming riddle below.  Every answer is made of two words that always rhyme. If you get stuck, use a hint!</div></div>

        <div  class="bitter text-3xl text-gray-700 flex  mt-2 mb-4 mx-4"><div class='mx-auto my-auto'>"{{  riddle.hint  }}"</div></div>

        
       

        <div id='answer' class="mx-4">

<div class="flex items-center justify-center mx-auto roboto"> 
    <div :id='"letter" + index' :class='index === nextBlankIndex?"bg-yellow-100":"",solved?"text-5xl font-bold":"border text-3xl border-gray-500 border-dashed",riddleWordArray[index] === riddleWordLettersArray[index] ? solved ? "text-gray-700  ":"text-green-500  ":"text-red-500 "' class='uppercase flex items-center grow mr-1 max-w-12 justify-center  rounded h-14 text-center my-auto' v-for="(letter,index) in firstWordAnswer">
{{ riddleWordArray[index] || '\u00A0' }}
</div>
</div>


<div class="flex items-center justify-center mx-auto mt-4 roboto"> 
<div :id='"letter" + (index  + firstWordAnswer.length)' :class='index + firstWordAnswer.length === nextBlankIndex?"bg-yellow-100":"",riddleWordArray[index  + firstWordAnswer.length] === riddleWordLettersArray[index  + firstWordAnswer.length] ? solved ? "text-gray-700 ":"text-green-500 ":"text-red-500 ",solved?"text-gray-800 text-5xl font-bold":"border border-dashed border-gray-500 text-3xl"' class='uppercase flex items-center grow max-w-12 mr-1 justify-center  rounded h-14 text-center   my-auto' v-for="(secondWordletter,index) in secondWordAnswer">
{{ riddleWordArray[index + firstWordAnswer.length] || '\u00A0' }}
</div>
</div>

</div>

</div>




<div class="mt-8">
    <transition name="fade">
<div @click='nextRiddle($event)' class='key cursor-pointer inline-block border rounded-xl py-2 px-6 text-3xl text-white bg-purple-500 border-purple-300 border-2 drop-shadow-sm' v-if="waitingForNextRiddle && started">
    
    <div class="flex">
    <span class="my-auto bitter">Next Riddle</span>
    <ChevronRightIcon class='my-auto text-white ml-1 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
    </div>

</div>
</transition>
<div>
<div v-if="!solved && cluesIndex > -1" class='bitter inline-block rounded py-2 px-4 capitalize bg-gray-400 text-white italic text-2xl'>{{  riddle.clues[cluesIndex]  }}</div>
</div>

</div>







    </div>
    <div class="w-full absolute bottom-0 left-0 bg-purple-100 p-2">

       
       


        <div class="flex justify-between items-stretch  roboto">

            <div @click='pressKey($event, key)' class='border-purple-500 text-purple-600 key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[0]">
            
                {{key}}
            
            </div>

        </div>

        <div class="px-2 my-3">

        <div class="w-full flex justify-between roboto">

            <div @click='pressKey($event, key)' class='border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[1]">
            
            {{key}}
        
        </div>

    </div>

    </div>

    <div class="w-full flex justify-between roboto">

        <div @click='clearKey($event)' ref="parentDiv" class='border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto'>
            
            <div class='flex'>
              <TrashIcon class='text-purple-500 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
            </div>
        
        </div>

        <div @click='pressKey($event,key)' class='border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[2]">
            
            {{key}}
        
        </div>

        <div @click='deleteKey($event)' class='border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto'>
            
            <div class='flex'>
              <BackspaceIcon class=' text-purple-500 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
            </div>
        
        </div>

        </div>

        <div class="w-full mt-2 flex justify-between roboto">

            <div class='key border-purple-500 text-purple-600  flex grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'>
                
                <PuzzlePieceIcon class='my-auto text-purple-500 my-auto text-black md:w-8 md:h-8 h-6 w-6 mr-1' />
                <span class="my-auto">{{ points }}</span>
            
            </div>

            <div class='key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="nextHint($event)">Hint</div>

            <div class='key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="hintKey($event)">Letter</div>

            <div class='key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'  @click="shareRiddle($event)">Share Riddle</div>

            

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
import animejs from 'animejs';


import data from '@/assets/riddles.json';
import confetti from 'canvas-confetti';



import {
    store
} from "../store/store.js";







import {
    CheckIcon,
    HeartIcon,
    BackspaceIcon,
    ChevronRightIcon,
    PuzzlePieceIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios';
import qs from 'qs'

export default {

    name: 'home',

    components: {
        CheckIcon,
        HeartIcon, BackspaceIcon, TrashIcon, ChevronRightIcon, PuzzlePieceIcon
    },

    //======================================================================================
    //======================================================================================
    data: function() {
        return {

            points : null,
            waitingForNextRiddle : false,
            started : false,
            newPlayer : true,

            riddleWordArray : [],
            riddles : [],
            riddle : {
      "rhyme": "",
      "type": "",
      "hint": "",
      "clues": [
        ""
      ]
    },
            cluesIndex : -1,

            
            pageLoaded : false,
            dataStore: store,
            productDescription : "sdfsdf",
            
            

            }

        

    },

    async mounted() {

        window.addEventListener('keydown', this.handleKeydown);

        this.riddles = data;
        
        this.buildRiddle()

       

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


        nextBlankIndex() {

            return this.riddleWordArray.findIndex(item => item === '');



        },

        solved() {

            return this.arraysEqual(this.riddleWordLettersArray, this.riddleWordArray)

            



        },

        fullAnswer() {

            if ( this.riddleWordArray.length > 0 ) {

            return this.riddleWordArray.every(item => item !== '')

            } else {


                return false

            }


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

    try { 

var letters =  this.riddle.rhyme.split(' ')[1].split("")
var secondWordAnswer = []
letters.forEach(letter => secondWordAnswer.push(""))

return secondWordAnswer

    } catch(error) {


        return ""

    }


},

        secondWord() {

return this.riddle.rhyme.split(' ')[1].split("")


},


numerOfLetters() { //determine if the user can edit this plan

    return 1


},





    },

    async created() {

       // if(process.server){

        

       // }



       // if (process.browser) {

       

       // }


      /*
       
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




        

        

        
      

      */

       

       


        
    },

    methods: {


        buildRiddle : function() {

            const value = localStorage.getItem("onboarded");
            if (value === null) {

                localStorage.setItem('points', 500);
                this.points = 500

                this.riddle = {
      "rhyme": "fat cat",
      "type": "noun",
      "hint": "Overweight feline",
      "clues": [
        "Well fed tiger",
        "Obese lion",
        "Voluptuous feline"
      ]
    }
        
      } else {

        this.points = localStorage.getItem("points")

        this.newPlayer = false
        const randomIndex = Math.floor(Math.random() * this.riddles.length);
      this.riddle = this.riddles[randomIndex];
      
        
      }

      this.riddle.clues = this.riddle.clues.filter(item => item !== '' && item !== null && item !== undefined);

      var riddleWordTmp = this.riddle.rhyme.replace(/\s+/g, '').split("");
      riddleWordTmp.forEach(letter => { this.riddleWordArray.push("") })


            


        },


        nextRiddle : function(event) {

            this.animateKeyPress(event)

            this.waitingForNextRiddle = false
           
            var movement = window.innerWidth


            animejs({
        targets: '#riddleContainer',
        translateX: movement, // Move left by half of the viewport width
        duration: 700,
        easing: 'easeInOutQuad',
        complete: () => {

            localStorage.setItem('onboarded', 'onboarded');
            this.newPlayer = false

          // Perform the action
          console.log('Action performed!');
          this.clearKey(event)
            this.riddleWordArray = []
            this.cluesIndex = - 1
            this.riddle.clues = []
            this.buildRiddle()

            document.getElementById('riddleContainer').style.transform = `translateX(${-window.innerWidth}px)`;

           // document.getElementById('riddleContainer').style.left = -window.innerWidth + "px"
          
          // Move the div back to the original position
          animejs({
            targets: '#riddleContainer',
            translateX: 0,
            duration: 1000,
            easing: 'easeInOutQuad'
          });
        }
      });

            



        },

        handleKeydown : function(event) {
      // Check if the key is alphanumeric or delete
      const key = event.key;

      console.log(key)

      const isAlphanumeric = /^[a-z0-9]$/i.test(key); // Check if alphanumeric
      const isDelete = key === 'Backspace' || key === 'Delete';
     
      if (isAlphanumeric || isDelete) {

        if ( isDelete ) {

            this.deleteKey()

        } else {


            this.pressKey(key)

        }
       // this.lastKey = key;
       // console.log('Key pressed:', key);
      }
    },


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


        shareRiddle : function(event) {

            this.animateKeyPress(event)

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

        randomInRange : function(min, max) {
  return Math.random() * (max - min) + min;
},

        
//console.log(ciphertext.toString());


        nextHint : function(event) {

            this.animateKeyPress(event)

            if ( this.cluesIndex === - 1 ) {

                this.cluesIndex = 0

            } else {

                this.cluesIndex = (this.cluesIndex + 1) % this.riddle.clues.length;

            }

            
            this.deductCredit()


        },


        deductCredit : function() {


            localStorage.setItem('points', localStorage.getItem("points") - 1);
            this.points = localStorage.getItem("points")


        },


        clearKey : function(event) {

            this.animateKeyPress(event)

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


        deleteKey : function(event) {

           
            this.animateKeyPress(event)

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

        hintKey : function(event) {

            this.animateKeyPress(event)

            if ( !this.fullAnswer ) {

            const blankIndex = this.riddleWordArray.findIndex(item => item === '');
            if ( blankIndex === 0 ) {

                console.log('first one')
                this.riddleWordArray[blankIndex] = this.riddleWordLettersArray[blankIndex]


            } else {

                this.addValueToRandomBlankSlot(this.riddleWordArray);
                console.log('second one')



            }


            this.deductCredit()

            

        } else {


            console.log('all full here')

        }
               

               




        },


        findElementWithClass : function(element, className) {
      // Base case: if element has the desired class, return it
      if (element.classList && element.classList.contains(className)) {
        return element;
      }
      // Recursive case: if element has a parent, recurse with the parent element
      if (element.parentElement) {
        return this.findElementWithClass(element.parentElement, className);
      }
      // If no parent element exists and the class was not found, return null
      return null;
    },
  


        animateKeyPress : function(event) {

            this.started = true

            //find the highest level key element.  this prevents us from animating a child element
            //like an image on a key
            const targetClass = 'key';
            const element = this.findElementWithClass(event.target, targetClass);

        
            animejs({
                    targets: element,
                    translateY: 7,
                    duration : 50,
                    direction: 'alternate',
                    easing: 'easeInOutSine'
                });



        },

       

            pressKey : function(event,key) {

                //console.log(event)

                this.animateKeyPress(event)

               
                if ( !this.fullAnswer ) {

                        const blankIndex = this.riddleWordArray.findIndex(item => item === '');

                        // Check if a blank entry was found
                        if (blankIndex !== -1) {
                            // Set the new value at the found index
                            this.riddleWordArray[blankIndex] = key;

                            animejs({
                                targets: '#letter' + blankIndex,
                                scale: 1.2,
                                duration : 70,
                                delay : 0,
                                direction: 'alternate',
                                easing: 'easeInOutSine'
                            });

                        }

                } else {

                    console.log('all full here')

                }
                




            },






        uploadNarration : async function(slideIndex) {

            

        },

        

    },

    watch: {

        solved(newVal, oldVal) {



            var vue = this

            

            if ( newVal === true && oldVal === false ) {

                vue.waitingForNextRiddle = true

                const element = document.getElementById('answer')
      const rect = element.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      
      // Calculate normalized center Y position
      const viewportHeight = window.innerHeight;
      const normalizedCenterY = elementCenterY / viewportHeight;
      
      var emojiArray = ['💥','💝','💖','🦄','🐱️','⭐️','🌟️']

      //var emojiArray = [this.riddle.rhyme]
     
      
      var scalar = 4;
    var unicorn = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });
    var blob = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });
            
      // Use confetti to create an effect that expands over the entire viewport
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {  shapes: [unicorn,blob],
  scalar, startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};
      const particleCount = 100

      
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x:.5, y: normalizedCenterY } }));

        animejs({
                                targets: '#answer',
                                scale: 1.2,
                                duration : 900,
                                delay : 100,
                                direction: 'alternate',
                                easing: 'easeOutQuart',
                                

                            });
     

            
                            this.newPlayer = false
    
}

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
      touch-action: manipulation; /* Prevent zooming */
}

* { touch-action: manipulation; }

.fade-enter-active, .fade-leave-active {
  transition: opacity .7s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}



</style>