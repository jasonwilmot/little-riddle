<template>

<div class='h-screen'>

  <!-- logo -->
   <div class="luckiest bg-white mt-5 md:mt-8 text-center text-4xl"><a href='/'>
      <span id='hint1' class='inline-block' :class='hintCount>=1?"text-blue-200":"text-blue-500"'>L</span>
      <span id='hint2' class='inline-block' :class='hintCount>=2?"text-blue-200":"text-blue-500"'>I</span>
      <span id='hint3' class='inline-block' :class='hintCount>=3?"text-blue-200":"text-blue-500"'>T</span>
      <span id='hint4' class='inline-block' :class='hintCount>=4?"text-blue-200":"text-blue-500"'>T</span>
      <span id='hint5' class='inline-block' :class='hintCount>=5?"text-blue-200":"text-blue-500"'>L</span>
      <span id='hint6' class='inline-block' :class='hintCount>=6?"text-blue-200":"text-blue-500"'>E</span>
      <span>&nbsp;</span>
      <span id='hint7' class='inline-block' :class='hintCount>=7?"text-blue-200":"text-blue-500"'>R</span>
      <span id='hint8' class='inline-block' :class='hintCount>=8?"text-blue-200":"text-blue-500"'>I</span>
      <span id='hint9' class='inline-block' :class='hintCount>=9?"text-blue-200":"text-blue-500"'>D</span>
      <span id='hint10' class='inline-block'  :class='hintCount>=10?"text-blue-200":"text-blue-500"'>D</span>
      <span id='hint11' class='inline-block'  :class='hintCount>=11?"text-blue-200":"text-blue-500"'>L</span>
      <span id='hint12' class='inline-block'  :class='hintCount>=12?"text-blue-200":"text-blue-500"'>E</span>
      </a>
   </div>

   <div  class="text-center h-full">
      <div class='flex' v-show='riddle.hint !== "" && !make || make' id="riddleContainer">

        <!-- nudge -->
         <div class="w-full p-2 mx-auto" v-show="nudge">
            <div v-if='nudgeVariation === 1' class='flex flex-col'>
               <div class="text-2xl mx-auto px-4 my-4 text-gray-600 lato">Appreciate Little Riddle?  Send a kind note and get all 2000+ riddles plus future riddles forever.</div>
               <a class='mt-2' href='/buycoffee'><button class="rounded rounded-xl py-4 px-4 bg-purple-500 text-white text-2xl">☕️ Buy Me A Coffee</button></a>
               <div class='lato cursor-pointer my-6 mx-auto text-gray-600' @click="nextRiddle($event)">No Thanks</div>
            </div>
            <div v-if='nudgeVariation === 2' class='flex flex-col'>
               <div class="text-2xl mx-auto my-4 text-gray-600 px-4 lato">Enjoying Little Riddle?  Show your appreciation, send me a note, and get all the riddle packs.</div>
               <a class='mt-2' href='/buycoffee'><button class="rounded rounded-xl  py-4 px-4 bg-yellow-500 text-white text-2xl">☕️ Buy Me A Coffee</button></a>
               <div class='lato cursor-pointer my-6 mx-auto text-gray-600' @click="nextRiddle($event)">Maybe Next Time</div>
            </div>
            <div v-if='nudgeVariation === 3' class='flex flex-col'>
               <div class="text-2xl mx-auto my-4 px-4 text-gray-600 lato">Want more Little Riddles?  Make a small donation, add a suggestion, and get all new riddles forever.</div>
               <a class='mt-2 inline-block' href='/buycoffee'><button class="rounded rounded-xl  py-4 px-4 bg-pink-500 text-white text-2xl">☕️ Buy Me A Coffee</button></a>
               <div class='lato cursor-pointer my-6 mx-auto text-gray-600' @click="nextRiddle($event)">No Thanks</div>
            </div>
         </div>

          <!-- maker -->
         <div class="w-full px-2 pt-1" v-show="make">
            <div class="text-xl text-gray-700 lato mb-2">Create your own riddle and share it:</div>
            <div style='height:44px' @click='focusMakerField(1,$event)' :class='makerFocusIndex === 1?"border-blue-500":"border-gray-400",makeRiddle===placeholderArray[0]?"text-gray-400":"text-gray-700"' class='border w-full text-left p-2 mb-3 rounded text-lg align-center lato '><span  class='my-auto  text-left  w-full capitalize' v-html="makeRiddle"></span><span v-if='makeRiddle!=placeholderArray[0] && makerFocusIndex === 1' class=" my-1  cursor align-center"></span>
               <span v-if='makeRiddle === "" && makerFocusIndex !== 1' class="my-auto text-gray-400">{{ placeholderArray[0] }}</span>
            </div>
            <div style='height:44px' @click='focusMakerField(2,$event)' :class='makerFocusIndex === 2?"border-blue-500":"border-gray-400",makeAnswer1===placeholderArray[1]?"text-gray-400":"text-gray-700"' class='border w-full text-left p-2 mb-3 rounded text-lg align-center lato'><span  class='my-auto  text-left  w-full capitalize' v-html="makeAnswer1"></span><span v-if='makeAnswer1!=placeholderArray[1] && makerFocusIndex === 2' class=" my-1 cursor align-center"></span>
               <span v-if='makeAnswer1 === "" && makerFocusIndex !== 2' class="text-gray-400">{{ placeholderArray[1] }}</span>
            </div>
            <div style='height:44px' @click='focusMakerField(3,$event)' :class='makerFocusIndex === 3?"border-blue-500":"border-gray-400",makeAnswer2===placeholderArray[2]?"text-gray-400":"text-gray-700"' class='border w-full text-left p-2 mb-3 rounded text-lg align-center lato'><span  class='my-auto  text-left  w-full capitalize' v-html="makeAnswer2"></span><span v-if='makeAnswer2!=placeholderArray[2] && makerFocusIndex === 3' class=" my-1 cursor align-center"></span>
               <span v-if='makeAnswer2 === "" && makerFocusIndex !== 3' class="text-gray-400">{{ placeholderArray[2] }}</span>
            </div>
            <div style='height:44px' @click='focusMakerField(4,$event)' :class='makerFocusIndex === 4?"border-blue-500":"border-gray-400",makeClue1===placeholderArray[3]?"text-gray-400":"text-gray-700"' class='border w-full text-left p-2 mb-3 rounded text-lg align-center lato'><span  class='my-auto  text-left  w-full capitalize' v-html="makeClue1"></span><span v-if='makeClue1!=placeholderArray[3] && makerFocusIndex === 4' class=" my-1 cursor align-center"></span>
               <span v-if='makeClue1 === "" && makerFocusIndex !== 4' class="text-gray-400">{{ placeholderArray[3] }}</span>
            </div>
            <div style='height:44px' @click='focusMakerField(5,$event)' :class='makerFocusIndex === 5?"border-blue-500":"border-gray-400",makeClue2===placeholderArray[4]?"text-gray-400":"text-gray-700"' class='border w-full text-left p-2 mb-3 rounded text-lg align-center lato'><span  class='my-auto  text-left  w-full capitalize' v-html="makeClue2"></span><span v-if='makeClue2!=placeholderArray[4] && makerFocusIndex === 5' class=" my-1 cursor align-center"></span>
               <span v-if='makeClue2 === "" && makerFocusIndex !== 5' class="text-gray-400">{{ placeholderArray[4] }}</span>
            </div>
         </div>

          <!-- animals -->
         <div class='mt-12 grow flex justify-end' v-show="catTime && !make & !nudge">
            <img class='h-48' v-if='animalIndex === 0' :src="animalImageArray[0]" />
            <img class='h-72' v-if='animalIndex === 1' :src="animalImageArray[1]" /> 
            <img class='h-48' v-if='animalIndex === 2' :src="animalImageArray[2]" /> 
            <img class='h-48' v-if='animalIndex === 3' :src="animalImageArray[3]" /> 
            <img class='h-48' v-if='animalIndex === 4' :src="animalImageArray[4]" />
            <img class='h-72' v-if='animalIndex === 5' :src="animalImageArray[5]" /> 
            <img class='h-48' v-if='animalIndex === 6' :src="animalImageArray[6]" /> 
            <img class='h-48' v-if='animalIndex === 7' :src="animalImageArray[7]" /> 
         </div>

         

          <!-- main container -->
         <div class='grow' v-show="!catTime && !make && !nudge">

             <!-- new player -->
            <div class='flex md:my-4 my-2 mx-4 text-lg text-gray-400 text-center' v-if='newPlayer'>
               <div class='max-w-2xl mx-auto lato'>Use the keyboard to solve the rhyming riddle.  Every answer is a two word rhyme!</div>
            </div>

             <!-- riddle container -->
            <div  id='hintContainer' style='height : 76px; color:#ffffff;' class="flex bitter text-3xl mt-2 mb-2 md:mb-4 mx-6">
               <div id='hint' class='mx-auto my-auto'>"{{  riddle.hint  }}"</div>
            </div>

             <!-- answers / letters container -->
            <div id='answer' class="mt-1 mx-4">
               <div class="flex items-center justify-center mx-auto roboto">
                  <div :id='"letter" + index' :class='index === nextBlankIndex?"bg-gray-100":"",solved?"bitter text-5xl font-bold shrink":"roboto grow border text-3xl border-gray-500 border-dashed",riddleWordArray[index] === riddleWordLettersArray[index] ? solved ? "text-gray-600  ":"text-green-500  ":"text-red-500 "' class='uppercase flex items-center  mr-1 max-w-12 justify-center  rounded h-14 text-center my-auto' v-for="(letter,index) in firstWordAnswer">
                     {{ riddleWordArray[index] || '\u00A0' }}
                  </div>
               </div>
               <div class="flex items-center justify-center mx-auto md:mt-4 mt-2">
                  <div :id='"letter" + (index  + firstWordAnswer.length)' :class='index + firstWordAnswer.length === nextBlankIndex?"bg-gray-100":"",riddleWordArray[index  + firstWordAnswer.length] === riddleWordLettersArray[index  + firstWordAnswer.length] ? solved ? " text-gray-600 ":" text-green-500 ":"text-red-500 ",solved?"bitter shrink  text-5xl font-bold":"roboto grow border border-dashed border-gray-500 text-3xl"' class='uppercase flex items-center  max-w-12 mr-1 justify-center  rounded h-14 text-center   my-auto' v-for="(secondWordletter,index) in secondWordAnswer">
                     {{ riddleWordArray[index + firstWordAnswer.length] || '\u00A0' }}
                  </div>
               </div>
            </div>
         </div>
      </div>


      <div v-show='!make' class="md:mt-8 mt-5">

         <!-- next riddle -->
         <transition name="fade">
            <div @click='nextRiddle($event)' id='nextRiddleButton' class=' bg-amber-200 cursor-pointer inline-block border rounded-xl mb-2 py-2 px-6 text-3xl text-blue-500 border-blue-500 border-2 ' v-if="waitingForNextRiddle && started">
               <div class="flex">
                  <span class="my-auto lato">Next Riddle</span>
                  <ChevronRightIcon class='my-auto text-blue-500 ml-1 my-auto  md:w-8 md:h-8 h-6 w-6' />
               </div>
            </div>
         </transition>

          <!-- clues -->
         <div>
            <div v-if="!solved && cluesIndex > -1 && !copiedToClipboard && !newPlayer" class='bitter inline-block rounded py-2 px-4 capitalize border-blue-400 border text-blue-400  text-xl'>{{  riddle.clues[cluesIndex]  }}</div>
         </div>

         <!-- copied to clipboard -->
         <div>
            <div v-if="copiedToClipboard" class='bitter inline-block rounded py-2 px-4 capitalize bg-gray-400 text-white italic text-lg'>Riddle link copied to clipboard</div>
         </div>

      </div>


   </div>


   <!-- keyboard -->
   <div class="w-full border border-t-1 border-r-0 border-l-0 border-b-0 border-gray-300 absolute bottom-0 left-0 bg-gray-100 p-2 pt-3">

        <!-- keyboard row 1 -->
      <div class="flex justify-between items-stretch  roboto">
         <div :disabled="disabled" :id='"key" + key' @click='pressKey($event, key)' class='bg-blue-100 border-blue-500 text-blue-600 key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[0]">
            {{key}}
         </div>
      </div>

       <!-- keyboard row 2 -->
      <div class="px-2 my-3">
         <div class="w-full flex justify-between roboto">
            <div :disabled="disabled" :id='"key" + key' @click='pressKey($event, key)' class='bg-blue-100 border-blue-500 text-blue-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[1]">
               {{key}}
            </div>
         </div>
      </div>

       <!-- keyboard row 3 -->
      <div class="w-full flex justify-between roboto">
         <a href='/about' class="bg-blue-100 border-blue-500 text-blue-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto">
            <div>
               <div class='flex'>
                  <QuestionMarkCircleIcon class=' text-blue-500 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
               </div>
            </div>
         </a>
        
         <div :disabled="disabled" :id='"key" + key' @click='pressKey($event,key)' class='bg-blue-100 border-blue-500 text-blue-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto' v-for="key in keyboard[2]">
            {{key}}
         </div>
         <div :disabled="disabled" id='deleteKey' @click='deleteKey($event)' class='bg-blue-100 border-blue-500 text-blue-600  key cursor-pointer uppercase flex items-center grow mr-1 justify-center border rounded h-10 text-center text-3xl  my-auto'>
            <div class='flex'>
               <BackspaceIcon class=' text-blue-500 my-auto text-black md:w-8 md:h-8 h-6 w-6' />
            </div>
         </div>
      </div>
      <div class="w-full mt-2 flex justify-between roboto">

         <div :class='hintHeat' class='key  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'>
            +{{ hintCount }}
         </div>

         <div :disabled="disabled" v-if='!make' class='bg-blue-100 key border-blue-500 text-blue-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="nextHint($event)">Hint</div>

         <div :disabled="disabled" v-if='!make' class='bg-blue-100 key border-blue-500 text-blue-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="hintKey($event)">Letter</div>

         <div :disabled="disabled" v-if='make' id='space' class='bg-blue-100 key border-blue-500 text-blue-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="pressKey($event,'Space')">Space</div>
         <div class='bg-blue-100 key border-blue-500 text-blue-600  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' @click="make = !make">Make</div>

          <!-- share in make state -->
         <a :disabled='makeRiddle === "" || makeAnswer1 === "" || makeAnswer2 === ""' :class='makeRiddle !== "" && makeAnswer1 != "" && makeAnswer2 != ""?"bg-green-500 text-white border-green-500":"bg-blue-100 border-blue-500 text-blue-600"' v-if='isMobile && make' @click="shareRiddle($event)" class='key  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' :href="makeRiddle === '' || makeAnswer1 === '' || makeAnswer2 === ''?'javascript:;':'sms:?body=' + shareCopy + ' ' + encodeURIComponent(dataStore.protocol + '//' + dataStore.hostName + '/?riddle=' + encrypt)">Share</a>

         <div :disabled='makeRiddle === "" || makeAnswer1 === "" || makeAnswer2 === ""' :class='makeRiddle !== "" && makeAnswer1 != "" && makeAnswer2 != ""?"bg-green-500 border text-white border-green-500":"bg-blue-100 border border-blue-500 text-blue-600"' v-if='!isMobile && make' class='key grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'  @click="shareRiddle($event)">Share</div>

         <!-- share in regular state -->
         <a :class='solved?"bg-green-500 text-white border-green-500":"bg-blue-100 border-blue-500 text-blue-600"' v-if='isMobile && !make' @click="shareRiddle($event)" class='key  grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center' :href="'sms:?body=' + shareCopy + ' ' + encodeURIComponent(dataStore.protocol + '//' + dataStore.hostName + '/?riddle=' + encrypt)">Share</a>

         <div :disabled="disabled" :class='solved?"bg-green-500 border text-white border-green-500":"bg-blue-100 border border-blue-500 text-blue-600"' v-if='!isMobile && !make' class='key grow cursor-pointer lato rounded border p-1 m-1 text-xl text-center'  @click="shareRiddle($event)">Share</div>
      </div>
   </div>
   
</div>
   

</template>


<script>
import CryptoJS from 'crypto-js'
import animejs from 'animejs';
import data from '@/assets/dualHints1722280784784.json';
import confetti from 'canvas-confetti';
import { store } from "../store/store.js";
import { autoTextSize } from 'auto-text-size'

import {
    CheckIcon,
    HeartIcon,
    BackspaceIcon,
    ChevronRightIcon,
    PuzzlePieceIcon,
    TrashIcon,
    QuestionMarkCircleIcon
} from '@heroicons/vue/24/outline'

export default {

    name: 'home',

    components: {
        CheckIcon,
        HeartIcon,
        BackspaceIcon,
        TrashIcon,
        ChevronRightIcon,
        PuzzlePieceIcon,
        QuestionMarkCircleIcon
    },

    //======================================================================================
    //======================================================================================
    data: function() {
        return {

            animalImageArray : ["/images/cute-animated-cat-tutorial.gif" ,"/images/dog.webp","/images/cat.webp","/images/doggie2.webp","/images/sheep.gif","/images/corgieCrop.gif", "/images/ostrich.gif","/images/gorilla.gif" ],

            disabled: false,
            nudgeVariation: 1,
            nudge: false,
            nudgeInterval: 5,
            riddleCount: 0,
            makerFocusIndex: 0,
            makeRiddle: "",
            makeAnswer1: "",
            makeAnswer2: "",
            makeClue1: "",
            makeClue2: "",

            placeholderArray: ["Enter your riddle", "Rhyming Word 1", "Rhyming Word 2", "Clue 1", "Clue 2"],

            productDescription: "In this clever twist on classic word puzzles, players must guess two rhyming words based on a single, cryptic clue.",
            productName: "Little Riddle",

            make: false,
            animalIndex: 0,
            catTime: false,
            hintCount: 0,
            copiedToClipboard: false,
            firstRiddlePlayed: false, //need this to jump to next puzzle for shared puzzles
            fontSizeSet: false,
            points: null,
            waitingForNextRiddle: false,
            started: false,
            newPlayer: true,

            riddleWordArray: [],
            riddles: [],
            riddle: {
                "score": 200,
                "rhyme": "",
                "type": "",
                "hint": "",
                "clues": [
                    ""
                ]
            },
            cluesIndex: -1,

            pageLoaded: false,
            dataStore: store,
            productDescription: "sdfsdf",

        }

    },

    async mounted() {


        //preload the animals so they always show
        this.animalImageArray.forEach(animalImage => {

            var image = new Image();
            image.src = animalImage;


        })

        

        var url = useRequestURL()
        
        store.hostName = url.host
        store.protocol = url.protocol

        //listen for keyboard events for dekstop players
        window.addEventListener('keydown', this.handleKeydown);

        //grab all of the riddles
        this.riddles = data;

        this.buildRiddle()

        /

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
                }

              
            ]
            */

        })

        useSeoMeta({
            title: this.productName,
            description: this.productDescription

        })

       
        this.pageLoaded = true

    },

    computed: {

        hintHeat: function() {

            switch (this.hintCount) {
                case 0:
                    return "border-blue-500 bg-blue-100 text-blue-600"
                    break;
                case 1:
                    return "bg-blue-200 border-blue-200 text-blue-600"
                    break;
                case 2:
                    return "bg-blue-300 border-blue-300 text-blue-600"
                    break;
                case 3:
                    return "bg-blue-400 border-blue-400 text-white"
                    break;
                case 4:
                    return "bg-blue-500 border-blue-500 text-white"
                    break;
                case 5:
                    return "bg-blue-600 border-blue-600 text-white"
                    break;
                case 6:
                    return "bg-blue-700 border-blue-700 text-white"
                    break;

                default:
                    return "bg-blue-700 border-blue-700 text-white"
            }

        },

        shareCopy: function() {

            if (this.solved) {

                return "I solved this Little Riddle with " + this.hintCount + " hints:"

            } else {

                return "Try and solve this Little Riddle:"

            }

        },

        encrypt: function() {

            return encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.riddle), "littleriddle"))

        },

        isMobile() {

            if (process.browser) {

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

                return isMobile
            } else {

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

            if (this.riddle.rhyme === "" || this.riddleWordArray.length === 0) {

                return false

            } else {

                return this.arraysEqual(this.riddleWordLettersArray, this.riddleWordArray)

            }

        },

        fullAnswer() {

            if (this.riddleWordArray.length > 0) {

                return this.riddleWordArray.every(item => item !== '')

            } else {

                return false

            }

        },

        keyboard() {

            var row1 = "qwertyuiop".split("")
            var row2 = "asdfghjkl".split("")
            var row3 = "zxcvbnm".split("")

            return [row1, row2, row3]

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

            var letters = this.riddle.rhyme.split(' ')[0].split("")
            var firstWordAnswer = []
            letters.forEach(letter => firstWordAnswer.push(""))

            return firstWordAnswer

        },

        secondWordAnswer() {

            try {

                var letters = this.riddle.rhyme.split(' ')[1].split("")
                var secondWordAnswer = []
                letters.forEach(letter => secondWordAnswer.push(""))

                return secondWordAnswer

            } catch (error) {

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

       

    },

    methods: {

        focusMakerField: function(makerFocusIndex, event) {

            console.log(event.target.innerHTML)

            this.makerFocusIndex = makerFocusIndex

            if (this.placeholderArray.includes(event.target.innerHTML)) {

                event.target.innerHTML = ""

                if (this.makerFocusIndex === 1) { this.makeRiddle = "" }
                if (this.makerFocusIndex === 2) { this.makeAnswer1 = "" }
                if (this.makerFocusIndex === 3) { this.makeAnswer2 = "" }
                if (this.makerFocusIndex === 4) { this.makeClue1 = "" }
                if (this.makerFocusIndex === 5) { this.makeClue2 = "" }

            }

        },

        makePersonalRiddle: function() {

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

        delay: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        waitForElm: function(selector) {

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

        adjustFontSizeToFit: async function() {

            await this.delay(200)
            //await store.waitForElm("#hintContainer")

            const box = document.getElementById('hintContainer');
            const textElement = document.getElementById('hint');

            autoTextSize({

                mode: "box",
                containerEl: box,
                innerEl: textElement,
                maxFontSizePx: 40,

            })

            animejs({
                targets: '#hintContainer',

                color: '#374151',
                duration: 3000
            });

        },

        calculateScrabbleScore: function(word) {

            const scrabbleScores = {
                a: 1,
                b: 3,
                c: 3,
                d: 2,
                e: 1,
                f: 4,
                g: 2,
                h: 4,
                i: 1,
                j: 8,
                k: 5,
                l: 1,
                m: 3,
                n: 1,
                o: 1,
                p: 3,
                q: 10,
                r: 1,
                s: 1,
                t: 1,
                u: 1,
                v: 4,
                w: 4,
                x: 8,
                y: 4,
                z: 10
            };

            word = word.toLowerCase(); // Ensure the word is in lowercase
            let score = 0;

            for (let char of word) {
                score += scrabbleScores[char] || 0; // Add the score of the character, default to 0 if not found
            }

            return score;

        },

        buildRiddle: function() {

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

                if (this.firstRiddlePlayed) {

                    //if this isn't a new user, grab a random puzzle
                    const randomIndex = Math.floor(Math.random() * this.riddles.length);
                    this.riddle = this.riddles[randomIndex];
                    const randomRiddleIndex = Math.floor(Math.random() * this.riddle.hint.length);
                    this.riddle.hint = this.riddles[randomIndex].hint[randomRiddleIndex]

                } else {

                    this.riddle = JSON.parse(this.decrypt(this.$route.query.riddle))
                    //const randomRiddleIndex = Math.floor(Math.random() * this.riddle.hint.length);
                    //this.riddle.hint = this.riddles[randomIndex].hint[randomRiddleIndex]

                }

                //if this isn't a shared riddle
            } else {

                //give them a super easy riddle to start
                if (onboarded === null) {

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
                    const randomRiddleIndex = Math.floor(Math.random() * this.riddle.hint.length);
                    this.riddle.hint = this.riddles[randomIndex].hint[randomRiddleIndex]

                }

            }

            this.postRiddle()

        },

        postRiddle: function() {

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

        calculateSpeed: function(screenWidth) {
            if (screenWidth < 600) {
                return 225; // Slower speed for smaller screens (pixels per second)
            } else if (screenWidth < 1200) {
                return 300; // Medium speed for medium screens
            } else {
                return 400; // Faster speed for larger screens
            }
        },


        incrementRiddleCount : function() {


            let count = localStorage.getItem('riddleCount');
            if (count === null) {
                count = 0;
            } else {
                count = parseInt(count);
            }

            // Increment the counter
            count++;

            // Store the updated value back in localStorage
            localStorage.setItem('riddleCount', count);



        },


        nextRiddle: async function(event) {

            this.incrementRiddleCount()

            animejs({
                targets: "#nextRiddleButton",
                scale: [1.05, 1, 0], // Scale down and then back to original size
                opacity: [1, 0], // Scale down and then back to original size
                duration: 500, // Duration of the animation in milliseconds
                easing: 'easeInOutQuad' // Easing function for smooth effect
            });

            //handle nudging for payment
            if (this.riddleCount === this.nudgeInterval) {

                var purchased = localStorage.getItem('donated');
                if (purchased === null) {

                    this.nudgeTime = true

                }

                if (this.nudgeVariation === 3) {

                    this.nudgeVariation = 1

                } else {

                    this.nudgeVariation++

                }

                this.riddleCount = 0;

            } else {

                this.nudgeTime = false
                this.riddleCount++

            }

            this.catTime = false
            await this.delay(100)

            var vue = this

            this.animateKeyPress(event)

            this.waitingForNextRiddle = false

            var movement = window.innerWidth

            //var showAnimal = this.getRandomNumber(0,6) === 2 ? true : false
            var showAnimal = this.getRandomNumber(0, 0) === 0 ? true : false

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
                    this.cluesIndex = -1
                    this.riddle.clues = []
                    this.firstRiddlePlayed = true
                    this.buildRiddle()

                    //adding this may help with the wierd race conditions
                    await this.delay(250)

                    document.getElementById('riddleContainer').style.transform = `translateX(${-window.innerWidth}px)`;

                    this.nudge = this.nudgeTime

                    if (!showAnimal || this.nudge) {

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

                        this.animalIndex = this.getRandomNumber(0, 7)

                        // document.getElementById('riddleContainer').style.left = -window.innerWidth + "px"

                        const speed = this.calculateSpeed(movement)
                        const animalDuration = (movement / speed) * 1000

                        // Move the div back to the original position
                        animejs({
                            targets: '#riddleContainer',
                            translateX: movement / 1.5,
                            duration: animalDuration,
                            delay: 200,
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

        handleKeydown: function(event) {

            event.preventDefault();
            // Check if the key is alphanumeric or delete
            const key = event.key;

            console.log("*" + key + "*")

            const isAlphanumeric = /^[a-z]$/i.test(key); // Check if alphanumeric
            const isDelete = key === 'Backspace' || key === 'Delete';

            if (key === 'Tab' && this.make) {

                console.log(this.makerFocusIndex)

                if (this.makerFocusIndex === 5) {

                    this.makerFocusIndex = 1

                } else {

                    this.makerFocusIndex++

                }

            }

            if (key === 'Enter' && this.solved) {

                this.nextRiddle(event)

            }

            if (isAlphanumeric || isDelete) {

                if (isDelete) {

                    this.deleteKey(event, key, true)

                } else {

                    this.pressKey(event, key, true)

                }
                // this.lastKey = key;
                // console.log('Key pressed:', key);
            }

            if (key === ' ' && this.make) {

                this.pressKey(event, "Space", true)

            }
        },

        arraysEqual: function(arr1, arr2) {
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

            if (!this.isMobile) {
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

        shareRiddle: function(event) {

            //this.disabled = true

            this.animateKeyPress(event)

            this.copyTextToClipboard(store.protocol + "//" + store.hostName + "/?riddle=" + this.encrypt)

        },

        decrypt: function(message) {

            console.log(message)

            const bytes = CryptoJS.AES.decrypt(message, "littleriddle");
            const plaintext = bytes.toString(CryptoJS.enc.Utf8);

            console.log(plaintext)
            return plaintext

        },

        randomInRange: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        //console.log(ciphertext.toString());

        nextHint: function(event) {

            this.copiedToClipboard = false //just hide any previous clipboard stuff
            // this.disabled = true

            this.animateKeyPress(event)

            if (this.cluesIndex === -1) {

                this.cluesIndex = 0

            } else {

                this.cluesIndex = (this.cluesIndex + 1) % this.riddle.clues.length;

            }

            if (this.newPlayer) {

                this.riddle.hint = this.riddle.clues[this.cluesIndex]

            }

            this.deductCredit()

        },

        deductCredit: function() {

            this.hintCount++
            this.riddle.score = this.riddle.score - 5

            var vue = this

            console.log(this.hintCount)

            //animejs({
               // targets: '#hint' + this.hintCount,
               // rotate: [
                   // { value: -360, duration: 300 },
                    // { value: 10, duration: 100 },
                    // { value: -10, duration: 100 },
                    // { value: 0, duration: 50 },

               // ],
               // easing: 'easeInOutQuad'
           // });

            //localStorage.setItem('points', localStorage.getItem("points") - 1);
            //this.points = localStorage.getItem("points")

        },

        clearKey: function(event) {

            // this.disabled = true

            this.animateKeyPress(event)

            this.riddleWordArray = this.riddleWordArray.map(() => "")

        },

        addValueToRandomBlankSlot: function(array) {

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

            animejs({
                targets: '#letter' + randomIndex,
                scale: 1.2,
                duration: 70,
                delay: 0,
                direction: 'alternate',
                easing: 'easeInOutSine'
            });

            return array;
        },

        deleteKey: function(event, key, keyboard) {

            // this.disabled = true

            this.animateKeyPress(event, keyboard, key)

            if (this.make) {

                const nbsp = '&nbsp;';

                if (this.makerFocusIndex === 1 && this.makeRiddle.endsWith(nbsp)) { this.makeRiddle = this.makeRiddle.slice(0, -nbsp.length); return }
                if (this.makerFocusIndex === 2 && this.makeAnswer1.endsWith(nbsp)) { this.makeAnswer1 = this.makeAnswer1.slice(0, -nbsp.length); return }
                if (this.makerFocusIndex === 3 && this.makeAnswer2.endsWith(nbsp)) { this.makeAnswer2 = this.makeAnswer2.slice(0, -nbsp.length); return }
                if (this.makerFocusIndex === 4 && this.makeClue1.endsWith(nbsp)) { this.makeClue1 = this.makeClue1.slice(0, -nbsp.length); return }
                if (this.makerFocusIndex === 5 && this.makeClue2.endsWith(nbsp)) { this.makeClue2 = this.makeClue2.slice(0, -nbsp.length); return }

                if (this.makerFocusIndex === 1 && !this.makeRiddle.endsWith(nbsp)) { this.makeRiddle = this.makeRiddle.slice(0, -1) }
                if (this.makerFocusIndex === 2 && !this.makeAnswer1.endsWith(nbsp)) { this.makeAnswer1 = this.makeAnswer1.slice(0, -1) }
                if (this.makerFocusIndex === 3 && !this.makeAnswer2.endsWith(nbsp)) { this.makeAnswer2 = this.makeAnswer2.slice(0, -1) }
                if (this.makerFocusIndex === 4 && !this.makeClue1.endsWith(nbsp)) { this.makeClue1 = this.makeClue1.slice(0, -1) }
                if (this.makerFocusIndex === 5 && !this.makeClue2.endsWith(nbsp)) { this.makeClue2 = this.makeClue2.slice(0, -1) }

            } else {

                const blankIndex = this.riddleWordArray.findIndex(item => item === '');
                console.log(blankIndex)
                if (blankIndex === -1) {

                    this.riddleWordArray[this.riddleWordArray.length - 1] = "";

                } else {

                    var lastIndex = this.riddleWordArray.slice().reverse().findIndex(item => item !== "");
                    const actualIndex = lastIndex !== -1 ? this.riddleWordArray.length - 1 - lastIndex : -1;
                    this.riddleWordArray[actualIndex] = ""

                }

            }

        },

        hintKey: function(event) {

            // this.disabled = true

            this.animateKeyPress(event)

            if (!this.fullAnswer) {

                const blankIndex = this.riddleWordArray.findIndex(item => item === '');
                if (blankIndex === 0) {

                    console.log('first one')
                    this.riddleWordArray[blankIndex] = this.riddleWordLettersArray[blankIndex]

                    animejs({
                        targets: '#letter' + blankIndex,
                        scale: 1.2,
                        duration: 70,
                        delay: 0,
                        direction: 'alternate',
                        easing: 'easeInOutSine'
                    });

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

        findElementWithClass: function(element, className) {
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

        animateKeyPress: function(event, keyboard, key) {

            console.log(key)

            if (this.disabled === true) { return }

            this.disabled = true

            this.started = true

            var vue = this

            var element

            if (keyboard) {

                console.log('@@@@@@@@@@')

                if (key === 'Space') {

                    element = document.getElementById('space')
                } else if (key === 'Backspace' || key === 'Delete ') {

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
                duration: 50,
                direction: 'alternate',
                easing: 'easeInOutSine',
                complete: async () => {

                    vue.disabled = false

                }
            });

        },

        pressKey: function(event, key, keyboard) {

            // this.disabled = true

            //console.log(event)

            this.animateKeyPress(event, keyboard, key)

            if (this.make) {

                if (key === 'Space') {

                    if (this.makerFocusIndex === 2 || this.makerFocusIndex === 3) { return }

                    key = '&nbsp;'

                }

                console.log('#####')
                console.log(key)

                if (this.makerFocusIndex === 1) { this.makeRiddle = this.makeRiddle + key.toLowerCase() }
                if (this.makerFocusIndex === 2) { this.makeAnswer1 = this.makeAnswer1 + key.toLowerCase() }
                if (this.makerFocusIndex === 3) { this.makeAnswer2 = this.makeAnswer2 + key.toLowerCase() }
                if (this.makerFocusIndex === 4) { this.makeClue1 = this.makeClue1 + key.toLowerCase() }
                if (this.makerFocusIndex === 5) { this.makeClue2 = this.makeClue2 + key.toLowerCase() }

            } else {

                if (!this.fullAnswer) {

                    const blankIndex = this.riddleWordArray.findIndex(item => item === '');

                    // Check if a blank entry was found
                    if (blankIndex !== -1) {
                        // Set the new value at the found index
                        this.riddleWordArray[blankIndex] = key;

                        if (this.riddleWordArray[blankIndex] !== this.riddleWordLettersArray[blankIndex]) {

                            this.hintCount++

                        }

                        animejs({
                            targets: '#letter' + blankIndex,
                            scale: 1.2,
                            duration: 70,
                            delay: 0,
                            direction: 'alternate',
                            easing: 'easeInOutSine'
                        });

                    }

                } else {

                    console.log('all full here')

                }

            }

        },

        uploadNarration: async function(slideIndex) {

        },

        getRandomNumber: function(min, max) {
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

            if (newVal === true && oldVal === false) {

                vue.waitingForNextRiddle = true

                const element = document.getElementById('answer')
                const rect = element.getBoundingClientRect();
                const elementCenterY = rect.top + rect.height / 2;

                // Calculate normalized center Y position
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                const normalizedCenterY = elementCenterY / viewportHeight;

                var emojiArray = ['💥', '💝', '💖', '🦄', '🐱️', '⭐️', '🌟️', '🍌️', '🍏️', '💜️', '🍊️']

                //var emojiArray = [this.riddle.rhyme]

                var scalar = 4;
                var unicorn = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });
                var blob = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });

                // Use confetti to create an effect that expands over the entire viewport
                const duration = 5 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = {
                    shapes: [unicorn, blob],
                    scalar,
                    spread: viewportWidth,
                    ticks: 60,
                    zIndex: 0,
                    angle: 10
                };
                const particleCount = this.getRandomNumber(50, 150)
                const angle = this.getRandomNumber(80, 100)
                const startVelocity = this.getRandomNumber(20, 60)
                const spread = this.getRandomNumber(Math.round(viewportWidth / 1.5), viewportWidth)

                var unicorn = confetti.shapeFromText({ text: emojiArray[Math.floor(Math.random() * emojiArray.length)], scalar });

                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { startVelocity: 30, spread: spread, angle: angle, particleCount, origin: { x: .5, y: normalizedCenterY } }));

                animejs({
                    targets: '#answer',
                    scale: 1.2,
                    duration: 500,
                    delay: 100,
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