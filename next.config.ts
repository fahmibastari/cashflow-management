import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: false,
  register: true,
  scope: "/",
  sw: "service-worker.js",
});

export default withPWAConfig(nextConfig);
// export default nextConfig;
