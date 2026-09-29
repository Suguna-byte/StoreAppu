import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 blocks the image optimizer from fetching loopback addresses by
    // default (SSRF guard). Our Django backend is only reachable at
    // 127.0.0.1/localhost in local dev, so this is required there; it has no
    // effect in production, which serves images from Cloudinary/onrender/railway.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.onrender.com", pathname: "/media/**" },
      { protocol: "https", hostname: "*.railway.app", pathname: "/media/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
