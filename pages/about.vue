<template>

    <div class='h-screen'>
    
    <div class="luckiest bg-white mt-4 md:mt-8 text-center text-4xl text-blue-500"><a href='/'>Little Riddle:</a></div>

    <div :class='success?"border-blue-300":"border-gray-300"' class="flex mx-4 my-4 rounded ">

       

    <div :class='success?"bg-blue-200":"bg-gray-200"' class='p-1 rounded-l-lg'><img class='my-auto rounded round-xl h-16' src="/images/jasonAndGrandma.jpg" /></div>
    <div :class='success?"bg-blue-200":"bg-gray-200"' class="text-2xl  grow flex rounded-r-lg"><div class='mx-auto my-auto lato font-bold'>{{ success ? "Thank You!!!!" : "About Little Riddle"}} </div></div>


    </div>

    <div v-show="!success">

    <div class="text-gray-600 lato mx-6 my-4">

       <div class="mb-2">I'm Jason (jason@bytejelly.com), the humble maker of Little Riddle, a puzzle game originally created as a gift to my grandmother who loves word games.</div> 


       <div class="mb-2">If you want to show your thanks, provide feedback, and play 2000+ more riddles, consider buying myself and grandma two hot coffees for $5.00. ☕❤️ </div>

       


    </div>

    

    <div class="mx-4 rounded p-2 border bg-blue-100">
        <input class="mb-2 text-lg text-left shadow appearance-none border rounded w-full py-3 bg-white px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" v-model='note' placeholder="Please enter a note or suggestion" />
    <form id="payment-form">
  <div id="payment-element" class="text-2xl text-center shadow appearance-none border rounded w-full py-2 bg-white px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    <!-- Elements will create form elements here -->
  </div>
  <button @click='handlePayment($event)' class='flex flex-row  mt-2 rounded-xl bg-green-500 p-2 px-4 rounded border text-white text-xl'>

    <CubeTransparentIcon v-if="processing" class="flex-none text-white spinner ml-1 mr-2 min-w-6 min-h-6 my-auto h-6 w-6 text-gray-700 cursor-pointer" />
                    <CreditCardIcon v-else class="flex-none text-white ml-1 mr-2 my-auto min-w-6 min-h-6 h-6 w-6 text-gray-700 cursor-pointer" />
                    <span class='flex-none my-auto mr-1 text-lg text-white'>Support ${{ ammount / 100 }}</span>
    
    

  </button>
  <div id="error-message" class="mt-1 pl-3 text-base text-red-600">
    <!-- Display error message to your customers here -->
  </div>
</form>
</div>

</div>

<div v-show="success">

    <div class="text-gray-600 lato mx-6 my-4">

<div class="mb-2">Thanks for the coffee and supporting Little Riddle. You now have access to 2000+ riddles and will also receive any new riddles forever.  </div> 


<div class="mb-2">Your receipt number is: <span class="font-bold text-blue-500">{{  this.receipt }}</span>.  Please tuck it away somewhere for safe keeping.</div>

 <div class="mb-2">Thanks again! Jason and Claire</div>

 <div class="mb-2"><a class='mt-2 bg-blue-500 text-white p-2 rounded px-4 py-2 inline-block font-bold' href='/'>Return to Little Riddle</a></div>


</div>



</div>

   
</div>
   

</template>


<script>





import {
    store
} from "../store/store.js";







import {
    CheckIcon,
    HeartIcon,
    BackspaceIcon,
    ChevronRightIcon,
    PuzzlePieceIcon,
    TrashIcon, CubeTransparentIcon, TableCellsIcon, CreditCardIcon
} from '@heroicons/vue/24/outline'
import axios from 'axios';
import qs from 'qs'

export default {

    name: 'home',

    components: {
        CheckIcon,
        HeartIcon, BackspaceIcon, TrashIcon, ChevronRightIcon, PuzzlePieceIcon, TableCellsIcon, CubeTransparentIcon, CreditCardIcon
    },

    //======================================================================================
    //======================================================================================
    data: function() {
        return {

            processing : false,
            success : false,
            note : "",
            ammount : 500,
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


        

        await this.delay(1000)

        if ( store.protocol === 'http:') {

store.stripe = Stripe('pk_test_51PhhMRAf1FjVNxtqASumSmURU1lFSRcfC5oQaqo4RFdXhEcck5Wo3zr6Mr3vn2t3t5Uw6PRTTgiOsMjVtVFYAyEB006rbreBBJ');

} else {

store.stripe = Stripe('pk_live_51PhhMRAf1FjVNxtq0SbxRbF5ZSxWi09iuKO2vdDirtcIGaw7l2TEPvOGgQ8zQ9NGuALHihypz4ocYqIQn5VOlZIA00qik79R9H');


}
        

        const options = {
  //clientSecret: clientSecret,
  // Fully customizable with appearance API.
  appearance: {/*...*/},
};

// Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in a previous step
store.elements = store.stripe.elements(options);

var style = {
            base: {
                // Add your base input styles here. For example:
                fontSize: '18px',
                color: "#000000",
                lineHeight: '1.8',
                "::placeholder": {
                    color: "#A9A9A9"
                }

            }
        };

// Create and mount the Payment Element
store.paymentElement = store.elements.create('card',{

    style: style

});
store.paymentElement.mount('#payment-element');

    },

    computed: {


        hintHeat : function() {

            return true




        },

        




    },

    async created() {

      
       

       


        
    },

    methods: {

        handlePayment : async function(event) {

            event.preventDefault();

            this.processing = true

            var vue = this

            const response = await fetch('/api/getPaymentIntent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ note: this.note, protocol : store.protocol })
  })

         //   const response = await fetch('/api/getPaymentIntent');
        const {client_secret: clientSecret} = await response.json();

        console.log(clientSecret)

        //store.clientSecret = clientSecret

        var elements = store.elements

        store.stripe
  .confirmCardPayment(clientSecret, {
    payment_method: {
      card: store.paymentElement,
      metadata: {
                        user_text: this.note
                    }
      //billing_details: {
        //name: 'Jenny Rosen',
      //},
    },
  })
  .then(function(result) {
    console.log(result)

    if ( result.paymentIntent.status === "succeeded") {

        vue.success = true
        vue.receipt = result.paymentIntent.id
        localStorage.setItem('donated', result.paymentIntent.id);


    } else {

        this.processing = false


    }
    // Handle result.error or result.paymentIntent
  }).catch(error => {

    console.log(error)
    vue.processing = false


  
  }    ) 

           

           

  
            

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




<style scoped>

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

        .spinner {
    /*  border: 4px solid #f3f3f3; Light grey */
    /* border-top: 4px solid #3498db; /* Blue */

    animation: spin 1.5s linear infinite;

}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}



</style>