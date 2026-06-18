// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  app: {
    head: {
      title: 'Comunidad Chile',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Comunidad de Innovación y Tecnología' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'comunidad-super-secret-key-2024',
    minimaxApiKey: process.env.MINIMAX_API_KEY || '',
    public: {
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Comunidad Chile'
    }
  },

  nitro: {
    experimental: {
      asyncContext: true
    }
  }
})
