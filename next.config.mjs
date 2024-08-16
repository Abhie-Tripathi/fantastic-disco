/** @type {import('next').NextConfig} */
// next.config.js

const config = {
  images: {
      domains: ['14068d66ba387efac9ce5e4b1741bcf2.r2.cloudflarestorage.com',
          'i.pinimg.com',
          'miro.medium.com',
          'palmbeach.floridaweekly.com',
          'images.ladepeche.fr',
          'cdn.choosechicago.com',
          'api.eventgeni.com',
          'logo.clearbit.com',
          'c1.10times.com',
          'oaidalleapiprodscus.blob.core.windows.net'
        ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: false,

};

export default config;