<template>
    <div v-show='pageLoaded' class="m-8 roboto">

      <Header :user="user" :store="dataStore"></Header>

      <button @click="uploadNarration()">Upload</button>

      <a v-if='!this.user' :href="googleAuthURL"><img class='h-16' src="/images/google.png" /></a>

        <div>
      ElevenLabs Pricing
     {{ numerOfLetters }} {{ numberOfMinutes   }} minutes ${{ Math.round((numberOfMinutes / 5.45) * 100) / 100 }}
     </div>

     <div>
      Google Pricing
     {{ numerOfLetters }} {{ numberOfMinutes   }} minutes ${{ 0.00016 * numerOfLetters }}
     </div>

     <div>
      Google Pricing
     {{ numerOfLetters }} {{ numberOfMinutes   }} minutes ${{ 0.000004 * numerOfLetters }}
     </div>

     <div> <button @click="dataStore.initPicker" class="cursor-pointer border border-blue-500 p-2 rounded text-blue-500">Load Google Slides</button></div>

     <div v-if='presentationLoaded' class="mt-2"><button class='border border-blue-500 p-2 rounded text-blue-500 cursor-pointer' @click="uploadNarrations()">Upload Narrations</button></div>

      <div v-if='presentationLoaded' class="mt-2"><button class='border border-blue-500 p-2 rounded text-blue-500 cursor-pointer' @click="buildPresentation">Build Video</button></div>

      <div v-for="(slide,index) in contentThumbnails" class="border rounded p-2 m-2">

        <div class='flex mt-4' v-show='recordingIndex === index'>
                        <button @click="stopRecording(index)"
                           class="h-12 flex-none align-middle my-auto bg-red-500 text-white rounded p-2 border mr-2">
                           <div class="inline-block align-middle ml-2 mr-3">
                              <span class="relative flex">
                                 <span
                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-100 opacity-75"></span>
                                 <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                              </span>
                           </div>
                           <div class="inline-block align-middle mr-2">
                              Stop Recording
                           </div>
                        </button>
                        
         </div>

         <div class='flex mt-4' v-show='recordingIndex !== index'>

<button v-if='presentationJSON.animationOption === 1' @click='recordVideo(index)'
    class="inline-block align-middle flex-none rounded p-2 border my-auto">Record Video</button>
<button v-if='presentationJSON.animationOption === 2' @click='recordNarration(index)'
class="inline-block align-middle flex-none rounded p-2 h-12 border my-auto">Record Narration</button>


<button @click='playAudio(index)'
class="align-middle flex-none rounded p-2 border mt-2 ml-2 mt-auto h-12"
>Play {{ presentationJSON.animationOption === 1 ? "Video":"Audio"}}</button>

</div>

<div class='border p-2 my-2 rounded overflow-hidden w-full inline-block align-middle  my-auto'
:id="'playWaveform' + index" v-show='recordingIndex !== index'></div>

<div v-show='recordingIndex === index' class="border p-2 my-2 rounded overflow-hidden w-full inline-block align-middle  my-auto">
 <div :id="'waveform' + index"></div>

       </div>


        <div class="flex">

            <!-- col 1 -->
            <div>

                <div class="">

                    <div class=''>{{ slide.notes }}</div>
                    <!-- <textarea class='p-2 h-full w-full'  v-model='slide.notes'>{{ slide.notes }}</textarea> -->
                
                </div>


            </div>


             <!-- col 2 -->
             <div class="w-96">

                            
                    <img class='border rounded p-2' :src="slide.thumbnail" />
                            


                


                




            </div> <!-- end of col-2 -->






        </div> <!-- end of grid-->
    
       

      

      

                     

   

                     

       

        
    
    
    </div>

    <button @click="enumerateMicrophones()">Grab Mics</button>


     <!-- -------- -->
      <!-- QUESTION -->
      <!-- -------- -->
      <div v-if='presentationJSON.animationChosen' class="border rounded m-2 p-4">
         <div>Do you want your recording to include narration?</div>
         <div>
            <button :class='presentationJSON.narrationOption === 1 ? "bg-blue-500" : ""' @click='chooseNarrationOption(1)'
               class="rounded border p-2 mx-2">Yes</button>
            <button :class='presentationJSON.narrationOption === 2 ? "bg-blue-500" : ""' @click='chooseNarrationOption(2)'
               class="rounded border p-2 mx-2">No</button>
         </div>
      </div>
      <!-- end question -->
      <!-- ------------ -->
      <!-- -------- -->
      <!-- QUESTION -->
      <!-- -------- -->
      <div v-if='presentationJSON.narrationOption === 1 && presentationJSON.animationOption === 2' class="border rounded m-2 p-4">
         <div>What type of narration do you want?</div>
         <div>
            <button :class='presentationJSON.narrationType === 1 ? "bg-blue-500" : ""' @click='chooseNarrationType(1)'
               class="rounded border p-2 mx-2">I will narrate</button>
            <button :class='presentationJSON.narrationType === 2 ? "bg-blue-500" : ""' @click='chooseNarrationType(2)'
               class="rounded border p-2 mx-2">AI narration</button>
         </div>
      </div>
      <!-- end question -->
      <!-- ------------ -->
      <!-- -------- -->

    <!-- QUESTION -->
      <!-- -------- -->
      <div v-if='presentationJSON.narrationType === 1' class="border rounded m-2 p-4">
         <div>What microphone do you want to use?</div>
         <div>
            <div class='border rounded px-1 py-3 mb-1' v-for="(microphone, index) in microphones" :key="index">
               <input @change='microphoneChoiceMade' class='ml-2 mr-2 text-base' type="radio" :id="index"
                  :value="microphone.value" v-model="presentationJSON.selectedMicrophone" />
               <label :for="index">{{ microphone.text }}</label>
            </div>
         </div>
      </div>
      <!-- end question -->
      <!-- ------------ -->



    
    

    <Footer></Footer>

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

import WaveSurfer from 'wavesurfer.js'
import Regions from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Record from 'wavesurfer.js/dist/plugins/record.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'



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
            user: null,
            //dataStore: reactive(store),
            //supabase: null,
            productName: "Slide Voice",
            productDescription: "Generic Product Description",

            googleAuthURL: "", //used in the continue with google button
            qs: null, //stores the id and user token passed from google on signup

            accessToken: null,
            currentStep: 0,
            googleStuffLoaded: false,

            document: null,
            documentID: null,

            contentThumbnails: [],
            notesArray: [],

            presentationLoaded : false,

            microphones: [],
             wavesurfers: [],

             recordingIndex : null,

             presentationJSON: {

                userName: "",
                userEmail: "",
                userID: "",
                presentationName: "",
                presentationLoaded: false,
                presentation: [],
                animationOption: 2,
                narrationOption: 0,
                narrationType: 0,
                selectedMicrophone: "",
                presentationId: "",
                narrationOptionChosen: false,
                animationChosen: true,
                narrationConfigurationChosen: false,
                microphoneChosen: false,
                downloadURL: "",
                pageURL: "",
                videoCreated: false,

            }

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

        })

        useSeoMeta({
            title: this.productName,

            description: this.productDescription

        })

    },

    computed: {


numerOfLetters() { //determine if the user can edit this plan

    return store.vue.contentThumbnails.reduce((total, obj) => {
  if (obj.notes) {
    total += obj.notes.length;
  }
  return total;
}, 0);


},


numberOfMinutes() {


   return  Math.round((this.numerOfLetters / 833) * 10) / 10



}


    },

    async created() {

        //go grab them as a user
        await store.setupPage(this)

        this.pageLoaded = true

        if (store.vue.user) {

            try {

                const {
                    data,
                    error
                } = await store.supabase
                    .from('oauth')
                    .select('oAuth')
                    .eq('user_id', store.vue.user.id) // user id

                if (error) {

                } else {

                    if (data.length) {

                        store.vue.user.oauth = data[0].oAuth

                    } else {

                    }

                }

            } catch (error) {

            }

            // }

            //builds out the signin URL for any new users.......
            axios.post("http://localhost:3000/api/getGoogleAuthorizationURL")
                .then(response => {
                    // Handle success
                    this.googleAuthURL = response.data.authURL

                })
                .catch(error => {
                    // Handle error
                    console.error('Error:', error);
                });

        }

    },

    methods: {


        uploadNarration : async function(slideIndex) {

            return new Promise(async (resolve, reject) => {
            
            //grab the blog for this audio file
            const response = await fetch( store.vue.wavesurfers[slideIndex].wavesurfer.media.src);

           
            //turn it into a file we can upload to supabase
            const blob = await response.blob();
            const filename = store.vue.presentationJSON.presentation[slideIndex].slideId + ".webm"
            const file = new File([blob], filename, { type: blob.type });

           const { data, error } = await store.supabase.storage.from('slideObjects').upload(store.vue.user.id + "/" +  filename, file, { upsert: true });

            

            resolve(true)

            })

        },

        //no idea what this does
        fixRegionBug: function (index) {

            var vue = this

            //vue.wavesurfers[index].wavesurfer.regions.list["region" + index].start = Math.round(vue.wavesurfers[index].wavesurfer.regions.list["region" + index].start * 100) / 100
           // vue.wavesurfers[index].wavesurfer.regions.list["region" + index].end = Math.round(vue.wavesurfers[index].wavesurfer.regions.list["region" + index].end * 100) / 100



},


        playAudio: function (index) {

            console.log(index)

            var vue = this

            //console.log(vue.presentationJSON.presentation[index].wavesurfer.regions.list)
            vue.fixRegionBug(index)
            vue.previewing = false


            vue.wavesurfers[index].wavesurfer.play()
           // vue.wavesurfers[index].wavesurfer.regions.list["region" + index].play()
            //vue.presentationJSON.presentation[index].wavesurfer.regions.list["region" + index].play()

            //vue.presentation[slideIndex].wavesurfer


        },


        buildWavesurfer : function(blob, slideIndex) {




            var vue = this

            vue.presentationJSON.presentation[slideIndex].blob = blob
            vue.presentationJSON.presentation[slideIndex].narration = window.URL.createObjectURL(blob);
            var audio = new Audio(vue.presentationJSON.presentation[slideIndex].narration);

            var recordingDuration

            audio.addEventListener("loadeddata", () => {

            vue.getDuration(vue.presentationJSON.presentation[slideIndex].narration, async function (duration) {

                recordingDuration = duration - vue.defaultClipEnd
                console.log('Duration: ' + recordingDuration)

                try {

                    vue.wavesurfers[slideIndex].wavesurfer.destroy()
                    // vue.presentationJSON.presentation[slideIndex].wavesurfer.destroy()
                    console.log('destroy!!!!')


                } catch (error) {


                    console.log('nothing to destory')

                }


                // console.log(parseFloat(recordingDuration))

                var waveOptions = {
                    container: '#playWaveform' + slideIndex,
                    waveColor: '#00B0F0',
                    progressColor: '#0070C0',
                    interact: true,
                    height: 38,
                    barHeight: 10,
                    cursorWidth: 3,
                    plugins: [
                        window.WaveSurfer.regions.create({})
                    ]

                }

                if (vue.presentationJSON.animationOption === 1) {

                    waveOptions.backend = 'MediaElement'

                }

                var wave = window.WaveSurfer.create(waveOptions)

                vue.wavesurfers[slideIndex].wavesurfer = wave
                //vue.presentationJSON.presentation[slideIndex].wavesurfer = wave


                console.log(vue.presentationJSON.animationOption)

                if (vue.presentationJSON.animationOption === 1) {

                    console.log('going to be video')

                    await store.waitForElm("#video" + slideIndex)
                    wave.load(document.querySelector("#video" + slideIndex))

                } else {


                    wave.loadBlob(blob)


                }



                // wave.on('ready', function () {



                // console.log(wave.region)

                // wave.enableDragSelection({});

                if (vue.isNewDoc) {

                    vue.presentationJSON.presentation[slideIndex].audioStart = 0
                    vue.presentationJSON.presentation[slideIndex].audioEnd = recordingDuration


                }

                if (!vue.isNewDoc) {

                    wave.addRegion({
                        start: vue.presentationJSON.presentation[slideIndex].audioStart,
                        drag: false,
                        resize: true,
                        end: vue.presentationJSON.presentation[slideIndex].audioEnd,
                        id: 'region' + slideIndex,
                        color: 'rgba(132,117,54,.5)'
                    });


                } else {

                    wave.addRegion({
                        start: 0,
                        drag: false,
                        resize: true,
                        end: recordingDuration,
                        id: 'region' + slideIndex,
                        color: 'rgba(132,117,54,.5)'
                    });



                }




                wave.on('seek', function (position) {
                    var currentTime = position * wave.getDuration();

                    if (vue.presentationJSON.animationOption === 1) {


                        console.log('move video to: ' + currentTime)
                        console.log(slideIndex)

                        var video = document.querySelector("#video" + slideIndex)
                        video.currentTime = currentTime;

                        // Optionally, if the video is not playing, you can update the frame shown using the load() method
                        //video.load();



                    }

                    // console.log(currentTime)
                });

                //wave.drawer.on('click', function (e) { 

                //console.log('clicker')})




                wave.on('region-updated', (region) => {

                    console.log('region updated')
                    // region.start = Math.round(region.start * 100) / 100
                    //  region.end = Math.round(region.end * 100) / 100

                    vue.presentationJSON.presentation[slideIndex].audioStart = region.start
                    vue.presentationJSON.presentation[slideIndex].audioEnd = region.end


                })



                wave.on('region-out', async (region) => {

                    console.log('done playing region')

                    var clipEnd = parseFloat(vue.presentationJSON.presentation[vue.slideIndex].clipEnd) * 1000

                    console.log('going to pause for ' + clipEnd)

                    await new Promise(r => setTimeout(r, clipEnd));

                    if (vue.previewing) {

                        vue.slideIndex++;
                        vue.playSlide()


                    }

                    // vue.presentationJSON.presentation[slideIndex].audioStart = region.start
                    // vue.presentationJSON.presentation[slideIndex].audioEnd = region.end


                })




            })

            });




            },


        stopRecording: function (index) {


            console.log('stopping: ' + index)
            this.recordingIndex = -1
            //store.microphoneRecorder.stop()
            store.record.stopRecording()

           // store.wavesurfer.destroy()



            //store.microphoneRecorder




        },


        getDuration: function (url, next) {
         var _player = new Audio(url);
         _player.addEventListener("durationchange", function (e) {

            // console.log(e)

            if (this.duration != Infinity) {
               var duration = this.duration
               _player.remove();
               next(duration);
            }
         }, false);
         _player.load();
         _player.currentTime = 24 * 60 * 60; //fake big time
         _player.volume = 0;
         _player.play();
         //waiting...
      },


        recordNarration: async function (slideIndex) {


           

            console.log(slideIndex)
            this.recordingIndex = slideIndex

            await store.waitForElm("#waveform" + slideIndex)

           

            var vue = this




            var chunks = [];

            try {

                document.getElementById("playWaveform" + slideIndex).innerHTML = '';
            store.wavesurfer.destroy()
            this.vue.wavesurfers[slideIndex].wavesurfer = null
            console.log('destroy!!!!')


            } catch (error) {


            //// console.log('nothing to destory')

            }


          //  console.log(Record)
           // console.log(window.WaveSurfer.microphone)

            let scrollingWaveform = false

            vue.wavesurfers[slideIndex].wavesurfer = 
            store.wavesurfer = WaveSurfer.create({
            container: '#waveform' + slideIndex,
            waveColor: '#EC4445',
            // interact: false,
            height: 38,
            barHeight: 10,
            // cursorWidth: 2,
            interact: true,
            // cursorColor : '#ffffff',

            })

            store.record = store.wavesurfer.registerPlugin(Record.create({ scrollingWaveform, renderRecordedAudio: false }))

            store.record.on('record-end', (blob) => {
    const container = document.querySelector('#playWaveform' + slideIndex)
    const recordedUrl = URL.createObjectURL(blob)

    // Create wavesurfer from the recorded audio
    vue.wavesurfers[slideIndex].wavesurfer = WaveSurfer.create({
      container,
      waveColor: 'rgb(200, 100, 0)',
      progressColor: 'rgb(100, 50, 0)',
            // interact: false,
            height: 38,
            barHeight: 10,
      url: recordedUrl,
    })

})


            if (store.record.isRecording() || store.record.isPaused()) {
                store.record.stopRecording()
   // recButton.textContent = 'Record'
    //pauseButton.style.display = 'none'
    return
  }

  //recButton.disabled = true

  // reset the wavesurfer instance

  // get selected device
  const deviceId =   vue.presentationJSON.selectedMicrophone

  store.record.startRecording({ deviceId }).then(() => {
    //recButton.textContent = 'Stop'
    //recButton.disabled = false
    //pauseButton.style.display = 'inline'
  })

            /*
            plugins: [
                window.WaveSurfer.cursor.create({
                    showTime: true,
                    opacity: 1,
                    customShowTimeStyle: {
                        'background-color': '#000',
                        color: '#fff',
                        padding: '2px',
                        'font-size': '10px'
                    }
                }),
               // window.WaveSurfer.microphone.create(),
                window.WaveSurfer.microphone.create({
                    bufferSize: 4096,
                   numberOfInputChannels: 1,
                   numberOfOutputChannels: 1,
                  constraints: {
                        audio: {
                        deviceId: {
                            exact: vue.presentationJSON.selectedMicrophone
                        }
                        }
                    }
                }),
            ],
            });
           

            store.wavesurfer.microphone.on('deviceReady', function (stream) {
            console.log('Device ready!', stream);

            store.microphoneRecorder = new MediaRecorder(stream);
            store.microphoneRecorder.start();

            store.microphoneRecorder.ondataavailable = function (e) {

                console.log(e.data)
                chunks.push(e.data);
            }

            store.microphoneRecorder.onstop = function () {
                var blob = new Blob(chunks, {
                    'type': 'audio/webm;codecs=opus'
                });



                vue.buildWavesurfer(blob, slideIndex)




            } //end of on stop



            });
            store.wavesurfer.microphone.on('deviceError', function (code) {
            console.warn('Device error: ' + code);
            });

            // start the microphone
            store.wavesurfer.microphone.start();

             */


            },



        chooseNarrationOption: function (narrationOption) {



this.presentationJSON.narrationOption = narrationOption

if ( this.presentationJSON.animationOption === 1 ) {

   this.presentationJSON.narrationType = 1
   this.presentationJSON.narrationConfigurationChosen = true
   this.enumerateMicrophones()


}


},



chooseNarrationType: function (narrationType) {


this.presentationJSON.narrationType = narrationType
this.presentationJSON.narrationConfigurationChosen = true


if (this.presentationJSON.narrationType === 1) {

   console.log('show enumerate')
   this.enumerateMicrophones()


}


},


        enumerateMicrophones: async function () {


            var vue = this

            //vue.presentationJSON.narrationType = 1
            //vue.presentationJSON.narrationConfigurationChosen = true

            //this just gets permission and turns it right off before we enumerate
            navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
            }).then(function (stream) {
            // Permission granted, but we won't start recording yet
            // Stop all tracks to release the microphone
            stream.getTracks().forEach(track => track.stop());



            vue.microphones = []

            navigator.mediaDevices.enumerateDevices().then(devices => {

                devices.forEach(device => {

                    // console.log(device)

                    var micCount = 0

                    if (device.kind === 'audioinput') {

                        micCount + 1
                        var option = {}
                        option.value = device.deviceId;
                        option.text = device.label || `Microphone ${micCount}`; // label may be empty on some 

                        vue.microphones.push(option)

                        //console.log(option)
                        // micSelect.appendChild(option);


                    }

                })




            })




            })




},


        gapiLoad : function() {


            //no idea why I have to put this in a timeout
            setTimeout(() => {gapi.load('picker');}, 250);


        },


        uploadNarrations : async function() {

            var slideIndex = 0
            for (const slide of store.vue.presentationJSON.presentation) {

                await this.uploadNarration(slideIndex)
                console.log('uploaded slide ' + slideIndex)
                slideIndex++

            }


            const {
                data,
                error
            } = await store.supabase
                .from('presentation')
                .upsert({
                    "presentationID": store.vue.document.id,
                    "user_id": this.user.id,
                    presentationPayload: store.vue.presentationJSON
                })
                .select();

            if (error) {

                console.log(error)

            } else {

            }




        },


        buildPresentation: async function() {

            const {
                data,
                error
            } = await store.supabase
                .from('presentation')
                .upsert({
                    "presentationID": store.vue.document.id,
                    "user_id": this.user.id,
                    presentationPayload: this.contentThumbnails
                })
                .select();

            if (error) {

                console.log(error)

            } else {

            }

        },

     

        loadExternalScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
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