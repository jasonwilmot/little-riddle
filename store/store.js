import axios from 'axios'

export const store = {

    vue : null,
  

    protocol : null,
    hostName : null,
    functionEndpoint : null,
    localHost : null,


    loadAuthJavascript : function() {


        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client'
        document.head.appendChild(script);



    },



    isHostedLocally: function () {

        

        
        const hostname = window.location.hostname
       
       // 
        

        // Check if hostname is 'localhost' or '127.0.0.1'
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return true;
        }

        // Check if the hostname is a private IP address (10.x.x.x, 172.16.x.x - 172.31.x.x, 192.168.x.x)
        const ipv4Pattern = /^(10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|192\.168\.\d+\.\d+)$/;
        if (ipv4Pattern.test(hostname)) {
            return true;
        }

        // If the hostname doesn't match any of the above criteria, it's likely hosted in the cloud or on a public server
        return false;
        

    },


    getFunctionEndpoint: function () {

        if (this.isHostedLocally) {

            return "https://7d32-68-203-9-166.ngrok.io"

        } else {

            return this.productionDomain

        }


    },


    getHostname: function () {

        const hostname = window.location.hostname;
        return window.location.port ? hostname + ":" + window.location.port : hostname;

    },


    getProtocol: function () {

        return window.location.protocol;


    },



   


    getRefreshedOAuthToken : async function() {

        return new Promise(async (resolve, reject) => {


        var refreshToken = await axios.post(store.protocol + "//" + store.hostName  + '/api/getRefreshToken', {

            refreshToken: store.vue.user.oauth.refresh_token,
            protocol : store.protocol,
            hostName : store.hostName,
            planID : store.planID

        })

        if ( "tokenExpired" in refreshToken.data ) {


            window.location.href = refreshToken.data.redirectURL

        } else {


        var newAccessToken = refreshToken.data.tokenInfo.access_token
       // 

        resolve(newAccessToken)

        }

    })


    },

    sheetSelected : async function(data) {

      console.log('sheet selected!!!!!!')


        try {
            store.vue.document = data[window.google.picker.Response.DOCUMENTS][0];
            store.vue.documentID = document[window.google.picker.Document.ID];
            gapi.load('client', store.initializeGapiClient);
        } catch {

            console.log



        }

        
      //  

      
      

     

    


    },

    initializeGapiClient : function() {


        gapi.client.setToken({ access_token:  store.vue.user.oauth.access_token  });
        store.loadPresentation()


    },


    // Exponential backoff function
exponentialBackoff : async function(fn, retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
      }
    }
  },


  getThumbnail : async function(presentationID, slideID) {

    

    return new Promise(async function(resolve, reject) {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://slides.googleapis.com/v1/presentations/' + store.vue.document.id + "/pages/" + slideID + "/thumbnail",
        headers: { 
          'Authorization': 'Bearer ' +  store.vue.user.oauth.access_token
        }
      };
      
      axios.request(config)
      .then(async (response) =>  {
        
        resolve(response.data)


      })


    })


  },

  startRecord: function() {
    $('.btn-info').prop('disabled', true);
    $('#stop').prop('disabled', false);
    $('#download').css('display', 'none')
},

stopRecord : function() {
    $('.btn-info').prop('disabled', false);
    $('#stop').prop('disabled', true);
    $('#download').css('display', 'block')
},


  handleRecord : function ({stream, mimeType}) {
    startRecord()
    let recordedChunks = [];
    stopped = false;
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }

        if (shouldStop === true && stopped === false) {
            mediaRecorder.stop();
            stopped = true;
        }
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, {
            type: mimeType
        });
        recordedChunks = []
        const filename = window.prompt('Enter file name');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${filename || 'recording'}.webm`;
        stopRecord();
        videoElement.srcObject = null;
    };

    mediaRecorder.start(200);
},


  recordAudio : async function() {

    const audioRecordConstraints = {
        echoCancellation: true
    }

    const mimeType = 'audio/webm';
    shouldStop = false;
    const stream = await navigator.mediaDevices.getUserMedia({audio: audioRecordConstraints});
    handleRecord({stream, mimeType})
},


    loadPresentation : async function() {


        await gapi.client.load('slides', 'v1', async () => {

            try {
                var response = await gapi.client.slides.presentations.get({
                  presentationId: store.vue.document.id,
                });
              } catch (err) {
                
                console.log(err)

              }


              console.log('!!!!!!!')
              console.log(response.result)

              store.vue.presentationJSON.presentationName = response.result.title

              response.result.slides.forEach((slide,slideIndex) => {


                var presentationData = {}
                presentationData.thumbnail = ""
                presentationData.slideId = slide.objectId
                
                

                const notesPage = slide.slideProperties.notesPage;
    if (notesPage && notesPage.pageElements) {
      const notesTextElements = notesPage.pageElements
        .filter(element => element.shape && element.shape.text)
        .flatMap(element => element.shape.text.textElements);
      const notesText = notesTextElements
        .map(te => te.textRun ? te.textRun.content : '')
        .join('');

        
        presentationData.notes = notesText
        store.vue.presentationJSON.presentation.push(presentationData)
        store.vue.wavesurfers.push({})

        store.vue.contentThumbnails.push({"slideId":slide.objectId,"thumbnail":"","notes":notesText})
        // store.vue.contentThumbnails[slideIndex]['notes'] = notesText

    //  
    } else {


        presentationData.notes = ""
        store.vue.presentationJSON.presentation.push(presentationData)
        store.vue.wavesurfers.push({})

        store.vue.contentThumbnails.push({"slideId":slide.objectId,"thumbnail":"","notes":""})
       // store.vue.contentThumbnails[slideIndex]['notes'] = ""
    //  
    }

                //
                //var notes = slide.getNotesPage().getSpeakerNotesShape().getText().asString().replace(/\r/g, "")
               // 



              })


             
       

              let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://slides.googleapis.com/v1/presentations/' + store.vue.document.id,
                headers: { 
                  'Authorization': 'Bearer ' +  store.vue.user.oauth.access_token
                }
              };
              
              axios.request(config)
              .then(async (response) =>  {
                
              
                const slidesList = response.data.slides;
                //
                for (const [index, slide] of slidesList.entries()) {
                  
                  //
                  var thumbnailURL = await this.exponentialBackoff(() =>  this.getThumbnail(store.vue.document.id,slide.objectId))
                 // store.vue.contentThumbnails.push({"thumbnail":thumbnailURL.contentUrl,"notes":""})
                 

                 store.vue.presentationJSON.presentation[index]['thumbnail'] = thumbnailURL.contentUrl
                 store.vue.contentThumbnails[index]['thumbnail'] = thumbnailURL.contentUrl
                  
                } 

                store.vue.presentationLoaded = true
              
                
              
              
                  //var thumbnailURL = await 
              
              
              
              
              
              })
              .catch((error) => {
                
              });
              
              





        })


     

      
        



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

    initPicker : async function() {

        store.vue.user.oauth.access_token = await store.getRefreshedOAuthToken()

     

        const sharedwithmeview = new google.picker.DocsView(google.picker.ViewId.PRESENTATIONS)
            .setOwnedByMe(true) // creates just the shared with me view
           .setMode(google.picker.DocsViewMode.LIST)
            

        

        const picker = new window.google.picker.PickerBuilder()
          
          //  .addView(sharedwithmeview)
          .addView(sharedwithmeview)
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setOAuthToken(store.vue.user.oauth.access_token)
            .setAppId('420270208669-hecnqfc7op8nqt8naati6vbnff123nf5.apps.googleusercontent.com')
            .setDeveloperKey('AIzaSyA6R6fq4h8zU1BkXI-3KOfUwn-zUwJmhZM')
            .setCallback(store.sheetSelected)
            .build();
        picker.setVisible(true);
       // store.vue.processing = false




    },



}