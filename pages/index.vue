<template>

    <div class='h-screen'>
    
    <div class="luckiest bg-white mt-4 md:mt-8 text-center text-4xl text-purple-500"><a href='/'>Little Riddle:</a></div>

    

    <div  class="text-center h-full">

        <div class='flex' v-show='riddle.hint !== "" && !this.make || this.make' id="riddleContainer">

            <div class="w-full p-2" v-show="make">
            
                <div @click='focusMakerField(1,$event)' :class='makerFocusIndex === 1?"border-purple-500":"border-gray-400",makeRiddle===placeholderArray[0]?"text-gray-400":""' class='border w-full text-left p-2 mb-3 rounded text-lg align-center h-10'><span  class='my-auto  text-left  w-full uppercase' v-html="makeRiddle"></span><span v-if='makeRiddle!=placeholderArray[0] && makerFocusIndex === 1' class=" my-1 cursor align-center"></span>
                
                <span v-if='makeRiddle === ""' class="text-gray-400">{{ placeholderArray[0] }}</span>
                
                </div>

                <div @click='focusMakerField(2,$event)' :class='makerFocusIndex === 2?"border-purple-500":"border-gray-400",makeAnswer1===placeholderArray[1]?"text-gray-400":""' class='border w-full text-left p-2 mb-3 rounded text-lg align-center h-10'><span  class='my-auto  text-left  w-full uppercase' v-html="makeAnswer1"></span><span v-if='makeAnswer1!=placeholderArray[1] && makerFocusIndex === 2' class=" my-1 cursor align-center"></span>
                
                    <span v-if='makeAnswer1 === ""' class="text-gray-400">{{ placeholderArray[1] }}</span>

                </div>

                <div @click='focusMakerField(3,$event)' :class='makerFocusIndex === 3?"border-purple-500":"border-gray-400",makeAnswer2===placeholderArray[2]?"text-gray-400":""' class='border w-full text-left p-2 mb-3 rounded text-lg align-center h-10'><span  class='my-auto  text-left  w-full uppercase' v-html="makeAnswer2"></span><span v-if='makeAnswer2!=placeholderArray[2] && makerFocusIndex === 3' class=" my-1 cursor align-center"></span>
                
                    <span v-if='makeAnswer2 === ""' class="text-gray-400">{{ placeholderArray[2] }}</span>
                
                </div>

                <div @click='focusMakerField(4,$event)' :class='makerFocusIndex === 4?"border-purple-500":"border-gray-400",makeClue1===placeholderArray[3]?"text-gray-400":""' class='border w-full text-left p-2 mb-3 rounded text-lg align-center h-10'><span  class='my-auto  text-left  w-full uppercase' v-html="makeClue1"></span><span v-if='makeClue1!=placeholderArray[3] && makerFocusIndex === 4' class=" my-1 cursor align-center"></span>
                
                    <span v-if='makeClue1 === ""' class="text-gray-400">{{ placeholderArray[3] }}</span>
                
                </div>

                <div @click='focusMakerField(5,$event)' :class='makerFocusIndex === 5?"border-purple-500":"border-gray-400",makeClue2===placeholderArray[4]?"text-gray-400":""' class='border w-full text-left p-2 mb-3 rounded text-lg align-center h-10'><span  class='my-auto  text-left  w-full uppercase' v-html="makeClue2"></span><span v-if='makeClue2!=placeholderArray[4] && makerFocusIndex === 5' class=" my-1 cursor align-center"></span>
                
                    <span v-if='makeClue2 === ""' class="text-gray-400">{{ placeholderArray[4] }}</span>
                
                </div>

                
                
            
            
            </div>

            <div class='mt-12 grow flex justify-end' v-show="catTime && !make">

             <img class='h-48' v-if='animalIndex === 0' src="/images/cute-animated-cat-tutorial.gif" />
            <img class='h-72' v-if='animalIndex === 1' src="/images/dog.webp" />
            <img class='h-72' v-if='animalIndex === 2' src="/images/doggie.webp" />
            <!-- <img class='h-48 align-right' v-show='animalIndex === 0' src="/images/donkey.gif" />
            <img class='h-48' v-show='animalIndex === 1' src="/images/elephant.gif" />
            <img class='h-48' v-show='animalIndex === 2' src="/images/goatgif.gif" />
            <img class='h-48' v-show='animalIndex === 3' src="/images/llama.gif" />
            <img class='h-48' v-show='animalIndex === 4' src="/images/monkey.gif" />
            <img class='h-48' v-show='animalIndex === 5' src="/images/ostrich.gif" />
            <img class='h-48' v-show='animalIndex === 6' src="/images/pig.gif" />
            <img class='h-48' v-show='animalIndex === 7' src="/images/ram.gif" />
            <img class='h-48' v-show='animalIndex === 8' src="/images/rhino.gif" />
            <img class='h-48' v-show='animalIndex === 9' src="/images/sheep.gif" />
            <img class='h-48' v-show='animalIndex === 10' src="/images/yak.gif" />
            <img class='h-48' v-show='animalIndex === 11' src="/images/zebra.gif" /> -->

            </div>


            <div class='grow' v-show="!catTime && !make">

                        <div class='flex md:my-4 my-2 mx-4 text-lg text-gray-400 text-center' v-if='newPlayer'><div class='max-w-2xl mx-auto'>Use the keyboard to solve the rhyming riddle.  Every answer is a two word rhyme!</div></div>

                    <div  id='hintContainer' style='height : 76px; color:#ffffff;' class="flex bitter text-3xl mt-2 mb-2 md:mb-4 mx-6"><div id='hint' class='mx-auto my-auto'>"{{  riddle.hint  }}"</div></div>

                    
                

                    <div id='answer' class="mt-1 mx-4">

            <div class="flex items-center justify-center mx-auto roboto"> 
                <div :id='"letter" + index' :class='index === nextBlankIndex?"bg-gray-100":"",solved?"bitter text-5xl font-bold shrink":"roboto grow border text-3xl border-gray-500 border-dashed",riddleWordArray[index] === riddleWordLettersArray[index] ? solved ? "text-gray-700  ":"text-green-500  ":"text-red-500 "' class='uppercase flex items-center  mr-1 max-w-12 justify-center  rounded h-14 text-center my-auto' v-for="(letter,index) in firstWordAnswer">
            {{ riddleWordArray[index] || '\u00A0' }}
            </div>
            </div>


            <div class="flex items-center justify-center mx-auto md:mt-4 mt-2"> 
            <div :id='"letter" + (index  + firstWordAnswer.length)' :class='index + firstWordAnswer.length === nextBlankIndex?"bg-gray-100":"",riddleWordArray[index  + firstWordAnswer.length] === riddleWordLettersArray[index  + firstWordAnswer.length] ? solved ? " text-gray-700 ":" text-green-500 ":"text-red-500 ",solved?"bitter shrink  text-5xl font-bold":"roboto grow border border-dashed border-gray-500 text-3xl"' class='uppercase flex items-center  max-w-12 mr-1 justify-center  rounded h-14 text-center   my-auto' v-for="(secondWordletter,index) in secondWordAnswer">
            {{ riddleWordArray[index + firstWordAnswer.length] || '\u00A0' }}
            </div>
            </div>

            </div>

            </div>

</div>




<div class="md:mt-8 mt-6">
    <transition name="fade">
<div @click='nextRiddle($event)' class=' bg-purple-100 cursor-pointer inline-block border rounded-xl mb-2 py-2 px-6 text-3xl text-purple-700 border-purple-500 border-2 drop-shadow-sm' v-if="waitingForNextRiddle && started">
    
    <div class="flex">
    <span class="my-auto bitter">Next Riddle</span>
    <ChevronRightIcon class='my-auto text-purple-700 ml-1 my-auto  md:w-8 md:h-8 h-6 w-6' />
    </div>

</div>
</transition>
<div>
<div v-if="!solved && cluesIndex > -1 && !copiedToClipboard && !newPlayer" class='bitter inline-block rounded py-2 px-4 capitalize border-purple-400 border text-purple-400 italic text-2xl'>{{  riddle.clues[cluesIndex]  }}</div>
</div>

<div>
<div v-if="copiedToClipboard" class='bitter inline-block rounded py-2 px-4 capitalize bg-gray-400 text-white italic text-lg'>Riddle link copied to clipboard</div>
</div>

</div>







    </div>
    <div class="w-full border border-t-1 border-r-0 border-l-0 border-b-0 border-gray-300 absolute bottom-0 left-0 bg-gray-100 p-2 pt-3">

       
       


        <div class="flex justify-between items-stretch  roboto">

            <div :id='"key" + key' @click='pressKey($event, key)' class='bg-purple-100 border-purple-500 text-purple-600 key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[0]">
            
                {{key}}
            
            </div>

        </div>

        <div class="px-2 my-3">

        <div class="w-full flex justify-between roboto">

            <div :id='"key" + key' @click='pressKey($event, key)' class='bg-purple-100 border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[1]">
            
            {{key}}
        
        </div>

    </div>

    </div>

    <div class="w-full flex justify-between roboto">

        <div @click='clearKey($event)' ref="parentDiv" class='bg-purple-100 border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto'>
            
            <div class='flex'>
              <TrashIcon class='text-purple-500 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
            </div>
        
        </div>

        <div :id='"key" + key' @click='pressKey($event,key)' class='bg-purple-100 border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[2]">
            
            {{key}}
        
        </div>

        <div id='deleteKey' @click='deleteKey($event)' class='bg-purple-100 border-purple-500 text-purple-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto'>
            
            <div class='flex'>
              <BackspaceIcon class=' text-purple-500 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
            </div>
        
        </div>

        </div>

        <div class="w-full mt-2 flex justify-between roboto">

            <div :class='hintHeat' class='bg-purple-100 key  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'>
                
                +{{ hintCount }}
            
            </div>

            <div v-if='!make' class='bg-purple-100 key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="nextHint($event)">Hint</div>

            <div v-if='!make' class='bg-purple-100 key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="hintKey($event)">Letter</div>

            <div v-if='make' class='bg-purple-100 key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="pressKey($event,'Space')">Space</div>

            <div class='bg-purple-100 key border-purple-500 text-purple-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="make = !make">Make</div>

           

                <a :class='makeRiddle !== "" && makeAnswer1 != "" && makeAnswer2 != ""?"bg-green-500 text-white border-green-500":"bg-purple-100 border-purple-500 text-purple-600"' v-if='isMobile && make' @click="shareRiddle($event)" class='key  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' :href="'sms:?body=' + shareCopy + ' ' + encodeURIComponent(dataStore.protocol + '//' + dataStore.hostName + '/?riddle=' + encrypt)">Share</a>

            <div :class='makeRiddle !== "" && makeAnswer1 != "" && makeAnswer2 != ""?"bg-green-500 border text-white border-green-500":"bg-purple-100 border border-purple-500 text-purple-600"' v-if='!isMobile && make' class='key grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'  @click="shareRiddle($event)">Share</div>
            
           

            <a :class='solved?"bg-green-500 text-white border-green-500":"bg-purple-100 border-purple-500 text-purple-600"' v-if='isMobile && !make' @click="shareRiddle($event)" class='key  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' :href="'sms:?body=' + shareCopy + ' ' + encodeURIComponent(dataStore.protocol + '//' + dataStore.hostName + '/?riddle=' + encrypt)">Share</a>

            <div :class='solved?"bg-green-500 border text-white border-green-500":"bg-purple-100 border border-purple-500 text-purple-600"' v-if='!isMobile && !make' class='key grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'  @click="shareRiddle($event)">Share</div>



            
            
            

            

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


import data from '@/assets/saturdayNightoutput1722131985702.json';
import confetti from 'canvas-confetti';



import {
    store
} from "../store/store.js";



import { autoTextSize } from 'auto-text-size'




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

            makerFocusIndex : 0,
            makeRiddle : "",
            makeAnswer1 : "",
            makeAnswer2 : "",
            makeClue1 : "",
            makeClue2 : "",

            placeholderArray : ["Enter your riddle","Rhyming Word 1","Rhyming Word 2","Clue 1","Clue 2"],

                

            productDescription : "In this clever twist on classic word puzzles, players must guess two rhyming words based on a single, cryptic clue.",
            productName : "Little Riddle",

            make : false,
            animalIndex : 0,
            catTime : false,
            hintCount : 0,
            copiedToClipboard : false,
            firstRiddlePlayed : false, //need this to jump to next puzzle for shared puzzles
            fontSizeSet : false,
            points : null,
            waitingForNextRiddle : false,
            started : false,
            newPlayer : true,

            riddleWordArray : [],
            riddles : [],
            riddle : {
                "score":200,
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

        var url = useRequestURL()
        console.log(url)

        store.hostName = url.host
        store.protocol = url.protocol

        console.log(store.hostName)
        console.log( store.protocol)



        //listen for keyboard events for dekstop players
        window.addEventListener('keydown', this.handleKeydown);

        //grab all of the riddles
        this.riddles = data;
        
        //build the riddle
       // const currentUrl = window.location.href;

    // Parse the URL to extract the query string
    //const queryString = currentUrl.split('?')[1];

    // Check if the URL has a query string
   // if (this.$route.query.riddle) {

    //    console.log(this.$route.query)
      // Parse the query string using qs
     // const queryParams = qs.parse(queryString);
   //  this.riddle = JSON.parse(this.decrypt(this.$route.query.riddle))

    //} else {

        
      this.buildRiddle()
     

      
    //}



        

       

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


        hintHeat : function() {

            switch (this.hintCount) {
                case 0:
    return "border-purple-500 text-purple-600"
    break;
  case 1:
    return "bg-purple-200 border-purple-200 text-purple-600"
    break;
  case 2:
  return "bg-purple-300 border-purple-300 text-purple-600"
    break;
  case 3:
  return "bg-purple-400 border-purple-400 text-white"
    break;
  case 4:
  return "bg-purple-500 border-purple-500 text-white"
    break;
  case 5:
  return "bg-purple-600 border-purple-600 text-white"
    break;
  case 6:
  return "bg-purple-700 border-purple-700 text-white"
    break;
 
  default:
    return "bg-purple-700 border-purple-700 text-white"
}




        },

        shareCopy : function() {

            if ( this.solved ) {

                return "I solved this Little Riddle with " + this.hintCount + " hints:"


            } else {

                return "Try and solve this Little Riddle:"


            }


        },

        encrypt : function() {

            return encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.riddle), "littleriddle"))


        },

        isMobile() {

            if ( process.browser ) {

// User agent string method
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Screen resolution method
if (!isMobile) {
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    isMobile = (screenWidth < 768 || screenHeight < 768);
}

// Touch events method
if (!isMobile) {
    isMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

// CSS media queries method
if (!isMobile) {
    let bodyElement = document.getElementsByTagName('body')[0];
    isMobile = window.getComputedStyle(bodyElement).getPropertyValue('content').indexOf('mobile') !== -1;
}

return isMobile } else {


    return true

}
},


        maxScore() {

            return this.calculateScrabbleScore(this.riddle.rhyme.replace(/\s+/g, '')) * 10


        },


        nextBlankIndex() {

            return this.riddleWordArray.findIndex(item => item === '');



        },

        solved() {

            if ( this.riddle.rhyme === "" || this.riddleWordArray.length === 0 ) {

                return false

            } else {

                return this.arraysEqual(this.riddleWordLettersArray, this.riddleWordArray)

            }

            

            



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

        focusMakerField : function(makerFocusIndex,event) {

            console.log(event.target.innerHTML)

            this.makerFocusIndex = makerFocusIndex

            if ( this.placeholderArray.includes(event.target.innerHTML) ) {

                event.target.innerHTML = ""

                if ( this.makerFocusIndex === 1) { this.makeRiddle = "" }
                if ( this.makerFocusIndex === 2) { this.makeAnswer1 = "" }
                if ( this.makerFocusIndex === 3) { this.makeAnswer2 = "" }
                if ( this.makerFocusIndex === 4) { this.makeClue1 = "" }
                if ( this.makerFocusIndex === 5) { this.makeClue2 = "" }


            }


        },


       makePersonalRiddle : function() {


        console.log('making')

        this.riddle = {

            "rhyme": this.makeAnswer1.toLowerCase() + " " + this.makeAnswer2.toLowerCase(),
            "type": "noun",
            "hint": this.makeRiddle.replace(/&nbsp;/g, ' '),
            "clues": [
                this.makeClue1.replace(/&nbsp;/g, ' '),
                this.makeClue2.replace(/&nbsp;/g, ' '),
            ]

        }

        //this.make = true

        this.postRiddle()



       },

        delay : function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
},


waitForElm: function (selector) {

var a = "jason"
var b = "rachel"

return new Promise(resolve => {
    if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {


        if (a === b) { console.log(mutations) }



        if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
},


        adjustFontSizeToFit : async function() {

           await this.delay(200)
            //await store.waitForElm("#hintContainer")

            const box = document.getElementById('hintContainer');
      const textElement = document.getElementById('hint');

      autoTextSize({
                
                mode : "box",
                containerEl : box,
                innerEl : textElement,
                maxFontSizePx : 40,


            })
           

            animejs({
  targets: '#hintContainer',

  color: '#374151',
  duration : 3000
});
     
     
    },


        calculateScrabbleScore : function(word) {

            const scrabbleScores = {
                a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1,
                m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8,
                y: 4, z: 10
            };

            word = word.toLowerCase(); // Ensure the word is in lowercase
            let score = 0;

            for (let char of word) {
                score += scrabbleScores[char] || 0; // Add the score of the character, default to 0 if not found
            }

            return score;

        },

        buildRiddle : function() {

            this.hintCount = 0

            //let's see if the user has already played a puzzle and doesn't need instructions
            const onboarded = localStorage.getItem("onboarded");

            //if this is a new user
            if (onboarded === null) {

                //set some points for them
                localStorage.setItem('points', 500);
                this.points = 500

            //if this is an exiting user, grab their existing points
            } else {

                this.points = localStorage.getItem("points")
                this.newPlayer = false

            }


            //if this is a shared riddle show that riddle, even if they are a new user
            if (this.$route.query.riddle) {

                if ( this.firstRiddlePlayed ) {

                //if this isn't a new user, grab a random puzzle
                const randomIndex = Math.floor(Math.random() * this.riddles.length);
                this.riddle = this.riddles[randomIndex];


                } else {

                    this.riddle = JSON.parse(this.decrypt(this.$route.query.riddle))

                }


            //if this isn't a shared riddle
            } else {

                //give them a super easy riddle to start
                if ( onboarded === null ) {

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

                //if this isn't a new user, grab a random puzzle
                const randomIndex = Math.floor(Math.random() * this.riddles.length);
                this.riddle = this.riddles[randomIndex];

                }

            }

            

     this.postRiddle()
            
     

            


        },


        postRiddle : function() {

            this.riddleWordArray = []

             //remove any blank clues that came over from chatgpt
      this.riddle.clues = this.riddle.clues.filter(item => item !== '' && item !== null && item !== undefined);

//create an empty array that we use to store letters entered by user
var riddleWordTmp = this.riddle.rhyme.replace(/\s+/g, '').split("");
riddleWordTmp.forEach(letter => { this.riddleWordArray.push("") })

this.riddle.score = this.maxScore

//make the riddle fit into the fixed height box to prevent use expanding to far
//for small screens.  we need to conserve real estate.
this.adjustFontSizeToFit()



        },


        nextRiddle : async function(event) {

            this.catTime = false

            await this.delay(100)

            var vue = this

            this.animateKeyPress(event)

            this.waitingForNextRiddle = false
           

            var movement = window.innerWidth


            
            var showAnimal = this.getRandomNumber(0,4) === 2 ? true : false



            animejs({

                targets: '#riddleContainer',
                translateX: movement, // Move left by half of the viewport width
                duration: 700,
                easing: 'easeInQuad',

                complete: async () => {

                    //set the flag to eliminate onboarding and hide the instructions
                    //on the next term
                    localStorage.setItem('onboarded', 'onboarded');
                    this.newPlayer = false

          
                    //clear out the old and in with the new
                    this.clearKey(event)
                    this.riddleWordArray = []
                    this.cluesIndex = - 1
                    this.riddle.clues = []
                    this.firstRiddlePlayed = true
                    this.buildRiddle()

            
                    //adding this may help with the wierd race conditions
                    await this.delay(250)
           

                    document.getElementById('riddleContainer').style.transform = `translateX(${-window.innerWidth}px)`;

            if ( !showAnimal ) {

                console.log('no animal!!!!!!')

                animejs({
            targets: '#riddleContainer',
            translateX: 0,
            duration: 1000,
            easing: 'easeInOutQuad',
            })



            } else {

                console.log('gonna show animal!!!!!!')

            this.catTime = true
            await this.delay(100)

            this.animalIndex = this.getRandomNumber(0,2)

           // document.getElementById('riddleContainer').style.left = -window.innerWidth + "px"
          
          // Move the div back to the original position
          animejs({
            targets: '#riddleContainer',
            translateX: movement / 1.7,
            duration: 2000,
            delay : 200,
            easing: 'linear',
            complete: async () => {

                

            document.getElementById('riddleContainer').style.transform = `translateX(${-window.innerWidth}px)`;

            vue.catTime = false
            await this.delay(100)

            animejs({
            targets: '#riddleContainer',
            translateX: 0,
            duration: 1000,
            easing: 'easeInOutQuad',
            })


        

        




            }
          });

        }
        }
      });

            



        },

        handleKeydown : function(event) {
      // Check if the key is alphanumeric or delete
      const key = event.key;

      console.log("*" + key + "*")

      const isAlphanumeric = /^[a-z]$/i.test(key); // Check if alphanumeric
      const isDelete = key === 'Backspace' || key === 'Delete';

      if ( key === 'Enter' && this.solved ) {

        this.nextRiddle(event)

      }
     
      if (isAlphanumeric || isDelete) {

        if ( isDelete ) {

            this.deleteKey(event,key,true)

        } else {


            this.pressKey(event,key,true)

        }
       // this.lastKey = key;
       // console.log('Key pressed:', key);
      }

      if ( key === ' ' && this.make ) {


        this.pressKey(event,"Space")

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

if ( !this.isMobile ) {
this.copiedToClipboard = true

}

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

            this.copyTextToClipboard(store.protocol + "//" + store.hostName + "/?riddle=" + this.encrypt)




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

            this.copiedToClipboard = false //just hide any previous clipboard stuff

            this.animateKeyPress(event)

            if ( this.cluesIndex === - 1 ) {

                this.cluesIndex = 0

            } else {

                this.cluesIndex = (this.cluesIndex + 1) % this.riddle.clues.length;

            }

           if ( this.newPlayer ) {

            this.riddle.hint = this.riddle.clues[this.cluesIndex]


           }

            
            this.deductCredit()


        },


        deductCredit : function() {

            this.hintCount++

            this.riddle.score = this.riddle.score - 5


            //localStorage.setItem('points', localStorage.getItem("points") - 1);
            //this.points = localStorage.getItem("points")


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


        deleteKey : function(event,key,keyboard) {

           
            this.animateKeyPress(event,keyboard,key)

            if ( this.make ) {

                const nbsp = '&nbsp;';
                

                if ( this.makerFocusIndex === 1 && this.makeRiddle.endsWith(nbsp) ) { this.makeRiddle = this.makeRiddle.slice(0, -nbsp.length); return}
                if ( this.makerFocusIndex === 2 && this.makeAnswer1.endsWith(nbsp) ) { this.makeAnswer1 = this.makeAnswer1.slice(0, -nbsp.length); return }
                if ( this.makerFocusIndex === 3 && this.makeAnswer2.endsWith(nbsp) ) { this.makeAnswer2 = this.makeAnswer2.slice(0, -nbsp.length); return }
                if ( this.makerFocusIndex === 4 && this.makeClue1.endsWith(nbsp) ) { this.makeClue1 = this.makeClue1.slice(0, -nbsp.length); return }
                if ( this.makerFocusIndex === 5 && this.makeClue2.endsWith(nbsp) ) { this.makeClue2 = this.makeClue2.slice(0, -nbsp.length); return }

                if ( this.makerFocusIndex === 1 && !this.makeRiddle.endsWith(nbsp) ) { this.makeRiddle = this.makeRiddle.slice(0, -1)}
                if ( this.makerFocusIndex === 2 && !this.makeAnswer1.endsWith(nbsp) ) { this.makeAnswer1 = this.makeAnswer1.slice(0, -1)}
                if ( this.makerFocusIndex === 3 && !this.makeAnswer2.endsWith(nbsp) ) { this.makeAnswer2 = this.makeAnswer2.slice(0, -1)}
                if ( this.makerFocusIndex === 4 && !this.makeClue1.endsWith(nbsp) ) { this.makeClue1 = this.makeClue1.slice(0, -1)}
                if ( this.makerFocusIndex === 5 && !this.makeClue2.endsWith(nbsp) ) { this.makeClue2 = this.makeClue2.slice(0, -1)}


            } else {

            const blankIndex = this.riddleWordArray.findIndex(item => item === '');
            console.log(blankIndex)
            if ( blankIndex === - 1 ) {

                this.riddleWordArray[this.riddleWordArray.length - 1] = "";


            } else {

                var lastIndex = this.riddleWordArray.slice().reverse().findIndex(item => item !== "");
                const actualIndex = lastIndex !== -1 ? this.riddleWordArray.length - 1 - lastIndex : -1;
                this.riddleWordArray[actualIndex] = ""


            }

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
                //this.riddleWordArray[blankIndex] = this.riddleWordLettersArray[blankIndex]
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
  


        animateKeyPress : function(event,keyboard, key) {

            this.started = true

            var element

            if ( keyboard ) {

               

                if ( key === 'Backspace' || key === 'Delete ') {

                    
                    element = document.getElementById('deleteKey')
                  

                } else {


                    element = document.getElementById('key' + key)
               


                }
                

            } else {

                const targetClass = 'key';
                element = this.findElementWithClass(event.target, targetClass);

            }
            

            //find the highest level key element.  this prevents us from animating a child element
            //like an image on a key
            

        
            animejs({
                    targets: element,
                    translateY: 7,
                    duration : 50,
                    direction: 'alternate',
                    easing: 'easeInOutSine'
                });



        },

       

            pressKey : function(event,key,keyboard) {

                //console.log(event)

                this.animateKeyPress(event,keyboard,key)


                if ( this.make ) {

                   

                    if ( key === 'Space') { 

                        if ( this.makerFocusIndex === 2 || this.makerFocusIndex === 3 ) { return }
                        
                        key = '&nbsp;'
                    
                    }

                    console.log('#####')
                    console.log(key)

                    if ( this.makerFocusIndex === 1 ) { this.makeRiddle = this.makeRiddle + key.toLowerCase()}
                    if ( this.makerFocusIndex === 2 ) { this.makeAnswer1 = this.makeAnswer1 + key.toLowerCase()}
                    if ( this.makerFocusIndex === 3 ) { this.makeAnswer2 = this.makeAnswer2 + key.toLowerCase()}
                    if ( this.makerFocusIndex === 4 ) { this.makeClue1 = this.makeClue1 + key.toLowerCase()}
                    if ( this.makerFocusIndex === 5 ) { this.makeClue2 = this.makeClue2 + key.toLowerCase()}


                } else {

               
                if ( !this.fullAnswer ) {

                        const blankIndex = this.riddleWordArray.findIndex(item => item === '');

                        // Check if a blank entry was found
                        if (blankIndex !== -1) {
                            // Set the new value at the found index
                            this.riddleWordArray[blankIndex] = key;

                            if ( this.riddleWordArray[blankIndex] !== this.riddleWordLettersArray[blankIndex] ) { 

                                this.hintCount++

                            }

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
                

            }


            },






        uploadNarration : async function(slideIndex) {

            

        },

        getRandomNumber : function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

        

    },

    watch: {

        makeRiddle(newVal, oldVal) {

            this.makePersonalRiddle()


        },

        makeAnswer1(newVal, oldVal) {

this.makePersonalRiddle()


},

makeAnswer2(newVal, oldVal) {

this.makePersonalRiddle()


},

makeClue1(newVal, oldVal) {

this.makePersonalRiddle()


},

makeClue2(newVal, oldVal) {

this.makePersonalRiddle()


},

        solved(newVal, oldVal) {



            var vue = this

            

            if ( newVal === true && oldVal === false ) {

                vue.waitingForNextRiddle = true

                const element = document.getElementById('answer')
      const rect = element.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      
      // Calculate normalized center Y position
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const normalizedCenterY = elementCenterY / viewportHeight;
      
      var emojiArray = ['💥','💝','💖','🦄','🐱️','⭐️','🌟️','🍌️','🍏️','💜️','🍊️']

      //var emojiArray = [this.riddle.rhyme]
     
      
      var scalar = 4;
    var unicorn = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });
    var blob = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });
            
      // Use confetti to create an effect that expands over the entire viewport
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {  shapes: [unicorn,blob],
  scalar, spread: viewportWidth, ticks: 60, zIndex: 0, angle: 10};
      const particleCount = this.getRandomNumber(50,150)
      const angle = this.getRandomNumber(80,100)
      const startVelocity = this.getRandomNumber(20,60)
      const spread = this.getRandomNumber(Math.round(viewportWidth/1.5),viewportWidth)

      var unicorn = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });

      
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { startVelocity: 30, spread: spread, angle: angle, particleCount, origin: { x:.5, y: normalizedCenterY } }));

        animejs({
                                targets: '#answer',
                                scale: 1.2,
                                duration : 500,
                                delay : 100,
                                direction: 'alternate',
                                easing: 'easeOutCirc',
                                

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

.cursor {
            display: inline-block;
            width: 2px;
            height: 18px;
            background-color: black;
            position: absolute;
            animation: blink 1s step-start 0s infinite;
        }

        @keyframes blink {
            50% {
                background-color: transparent;
            }
        }



</style>