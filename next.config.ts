import type { NextConfig } from "next";

function supabaseRemotePattern() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return {
      protocol: "https" as const,
      hostname: new URL(url).hostname,
      pathname: "/storage/v1/object/**",
    };
  } catch {
    return null;
  }
}

const supabasePattern = supabaseRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      ...(supabasePattern ? [supabasePattern] : []),
    ],
  },
};

export default nextConfig;
