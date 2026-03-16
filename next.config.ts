import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uwcyphkniyycdsbztfpy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**", // для публичных ссылок
      },
      {
        protocol: "https",
        hostname: "uwcyphkniyycdsbztfpy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/**", // для подписанных (временных) ссылок
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tournaments",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
