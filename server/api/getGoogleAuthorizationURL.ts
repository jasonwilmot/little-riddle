//import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'



google
export default defineEventHandler(async (event) => {

   
    var protocol = getRequestProtocol(event)
   var hostname = getRequestHost(event)
   var serverPath = protocol + "://" + hostname
   

   

    

    const body = await readBody(event)

  //  
    
  //  


    const oauth2Client = new google.auth.OAuth2(
        '420270208669-hecnqfc7op8nqt8naati6vbnff123nf5.apps.googleusercontent.com',
        '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',
        serverPath + '/api/getGoogleAuthorizationToken'
    );

    //

    // Access scopes for read-only Drive activity.
    const scopes = [

        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.email',
       

    ];

    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = await oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
          * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
        //state: body.supabaseID,
        state: "sdfdsf",
       // prompt: 'consent'
    });


   // 
   // 

   


    return {
        authURL: authorizationUrl
    }
})