import { google } from 'googleapis'
import { serverSupabaseClient } from '#supabase/server'
import axios from 'axios'
import qs from 'qs'

export default defineEventHandler(async (event) => {

    

    const body = await readBody(event)
    
   // query.code

    let data = qs.stringify({
        'refresh_token': body.refreshToken,
        'grant_type': 'refresh_token',
        'client_secret': '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',
        'client_id': '420270208669-hecnqfc7op8nqt8naati6vbnff123nf5.apps.googleusercontent.com'
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://oauth2.googleapis.com/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    
    


    try {
    var response = await axios.request(config)

    return {
        tokenInfo : response.data }

    } catch(error) {

        var googleAuthURL = await axios.post(body.protocol + "//" + body.hostName + '/api/getGoogleAuthorizationURL', {

        redirectURL: body.protocol + "//" + body.hostName +  '/api/getGoogleAuthorizationToken',
        supabaseID: body.planID

        })

        return {

            tokenExpired : true,
            redirectURL : googleAuthURL.data.authURL 


        }


    }


 




    

    


})