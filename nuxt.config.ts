// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
    }
  },
  devtools: { enabled: false },
  
  googleFonts: {
    display: 'block', // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'

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
    "@nuxtjs/google-fonts"
  ],
  

  
 
})