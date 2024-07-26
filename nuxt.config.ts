// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
    }
  },
  devtools: { enabled: true },
  
  googleFonts: {
    families: {
      Merriweather:true,
      Bitter:true,
      Roboto: true,
      'Space+Mono':true,
      'Luckiest+Guy':true,
      'Josefin+Sans': true,
      Lato: [100, 300],
      Yellowtail : true,
      Raleway: {
        wght: [100, 400],
        ital: [100]
      },
      Inter: '200..700',
      'Crimson Pro': {
        wght: '200..900',
        ital: '200..700',
      }
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxtjs/supabase',
    "@nuxtjs/google-fonts"
  ],
  

  //had to add this in to stop supabase from doing wierd shit
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['', '/', '/plan'],
      cookieRedirect: false,
    }
  },
 
})