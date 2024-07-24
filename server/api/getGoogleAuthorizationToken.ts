//import { createClient } from '@supabase/supabase-js'
//#import { serverSupabaseUser } from '#supabase/server';
import { google } from 'googleapis'
//import { serverSupabaseUser } from '#supabase/server'
import { serverSupabaseClient } from '#supabase/server'

import { parseCookies } from 'h3'




export default defineEventHandler(async (event) => {

    

    

    var protocol = getRequestProtocol(event)
    var hostname = getRequestHost(event)
    var serverPath = protocol + "://" + hostname

    

    //var user = await serverSupabaseUser(event)
  // 

       


    const supabase = await serverSupabaseClient(event)

   
    


    const oauth2Client = new google.auth.OAuth2(
        '420270208669-hecnqfc7op8nqt8naati6vbnff123nf5.apps.googleusercontent.com',
        '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',
        serverPath + '/api/getGoogleAuthorizationToken'
    );

    //

    
    
    
    
    
    

    const query = getQuery(event)


    let { tokens } = await oauth2Client.getToken(query.code);

    //setup the user here
    const {data,error} = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: tokens.id_token,
        
    })

    if (error) {

        


    } else {


        
        var user = data.user




    }

   
   

    const { data2, error2 } = await supabase
        .from('oauth')
        .upsert({ "oAuth": tokens, user_id: user.id })
        .select();

    if (error2) {

       
       
       
       
       
       
       
     


    } else {

        
        
        
        
        
        

        if ( 'state' in query ) {

           // await sendRedirect(event, serverPath + '?id=' + tokens.id_token + "&access_token=" + tokens.access_token, 301)
           await sendRedirect(event, serverPath + '/', 301)
    
    
        } else {
    
            await sendRedirect(event, serverPath + '/', 301)
    
    
    
        }
       


    }

   


   
   

   // return {
     //   tokens
        //"sdfkjhsdfkjh"
    //}
})