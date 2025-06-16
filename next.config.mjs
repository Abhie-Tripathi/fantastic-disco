import {withSentryConfig} from "@sentry/nextjs";
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
    // if (!dev && !isServer) {
    //   // Force CSS injection
    //   config.optimization.splitChunks.cacheGroups.default = {
    //     minChunks: 1,
    //   };
    //   config.optimization.splitChunks.cacheGroups.styles = {
    //     name: 'styles',
    //     test: /\.css$/,
    //     chunks: 'all',
    //     enforce: true,
    //   };
    // }
    return config;
  },
  reactStrictMode: true,
};

export default withSentryConfig(config, {
// For all available options, see:
// https://www.npmjs.com/package/@sentry/webpack-plugin#options

org: "10times-e9",
project: "whr",

// Only print logs for uploading source maps in CI
silent: !process.env.CI,

// For all available options, see:
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// Upload a larger set of source maps for prettier stack traces (increases build time)
widenClientFileUpload: true,

// Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
// This can increase your server load as well as your hosting bill.
// Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
// side errors will fail.
tunnelRoute: "/monitoring",

// Automatically tree-shake Sentry logger statements to reduce bundle size
disableLogger: true,

// Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
// See the following for more information:
// https://docs.sentry.io/product/crons/
// https://vercel.com/docs/cron-jobs
automaticVercelMonitors: true,
});