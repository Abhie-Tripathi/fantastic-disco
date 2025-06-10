/** @type {import('next').NextConfig} */
// next.config.js

const config = {
  images: {
    domains: [
      "14068d66ba387efac9ce5e4b1741bcf2.r2.cloudflarestorage.com",
      "i.pinimg.com",
      "miro.medium.com",
      "palmbeach.floridaweekly.com",
      "images.ladepeche.fr",
      "cdn.choosechicago.com",
      "api.whr.ai",
      "api.eventgeni.com",
      "console.dev.eventgeni.com",
      "api.dev.eventgeni.com",
      "logo.clearbit.com",
      "c1.10times.com",
      "oaidalleapiprodscus.blob.core.windows.net",
      "img.10times.com",
      "login.10times.com",
      "api.dev.gtm.whr.ai",
      "im.gifbt.com",
      "gtmdev-api.whr.ai",
      "geodev-api.whr.ai",
      "gtm-api.whr.ai",
      "geo-api.whr.ai",
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Force CSS injection
      config.optimization.splitChunks.cacheGroups.default = {
        minChunks: 1,
      };
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
  reactStrictMode: true,
};

export default config;
