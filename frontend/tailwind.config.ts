import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: { lg: "960px", xl: "1140px", "2xl": "1280px" },
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { soft: "0 6px 24px rgba(0,0,0,0.08)" },
    },
  },
  plugins: [],
} satisfies Config;
