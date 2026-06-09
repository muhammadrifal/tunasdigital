import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/ebook", destination: "/pustaka", permanent: true },
      { source: "/ebook/:slug", destination: "/pustaka/:slug", permanent: true },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "tunasdigitalbackend.test",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tunasdigitalbackend.test",
        pathname: "/**",
      },
    ],
    unoptimized: isDev,
  },

  webpack(config) {
    // Paksa webpack resolve module dari folder node_modules project ini secara absolut,
    // menghindari salah resolve ke parent directory saat CWD tidak tepat.
    config.resolve.modules = [
      path.resolve(__dirname, "node_modules"),
      "node_modules",
    ];
    return config;
  },
};

export default nextConfig;
