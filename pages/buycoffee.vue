<template>

    <div class='h-screen'>
    
    <div class="luckiest bg-white mt-4 md:mt-8 text-center text-4xl text-blue-500"><a href='/'>Little Riddle:</a></div>

    

    Buy a coffee

    <div class="mx-4">
    <form id="payment-form">
  <div id="payment-element">
    <!-- Elements will create form elements here -->
  </div>
  <div @click='handlePayment' class='bg-blue-500 p-2 rounded border text-white' id="submit">Submit</div>
  <div id="error-message">
    <!-- Display error message to your customers here -->
  </div>
</form>
</div>

   
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

            nudgeVariation : 1,
            nudge : false,
            nudgeInterval : 1,
            riddleCount : 0,
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

            
            script: [

                {
                    src: `https://js.stripe.com/v3/`,
                    tagPosition: 'bodyClose',
                    defer: true
                }

              
            ]
            

        })

        useSeoMeta({
            title: this.productName,
            description: this.productDescription

        })


       
        this.pageLoaded = true


        const response = await fetch('/api/getPaymentIntent');
        const {client_secret: clientSecret} = await response.json();

        console.log(clientSecret)

        await this.delay(2000)

        store.stripe = Stripe('pk_test_51PhhMRAf1FjVNxtqASumSmURU1lFSRcfC5oQaqo4RFdXhEcck5Wo3zr6Mr3vn2t3t5Uw6PRTTgiOsMjVtVFYAyEB006rbreBBJ');
        

        const options = {
  clientSecret: clientSecret,
  // Fully customizable with appearance API.
  appearance: {/*...*/},
};

// Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in a previous step
store.elements = store.stripe.elements(options);

// Create and mount the Payment Element
const paymentElement = store.elements.create('payment');
paymentElement.mount('#payment-element');

    },

    computed: {


        hintHeat : function() {

            return true




        },

        




    },

    async created() {

      
       

       


        
    },

    methods: {

        handlePayment : async function() {

            var elements = store.elements

            const {error} = await store.stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url:  store.protocol + "//" +  store.hostName + "/thanks/"
    },
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
            

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


       
        

    },

    watch: {

        makeRiddle(newVal, oldVal) {

            console.log('making riddle')


        }

    }

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