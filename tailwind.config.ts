import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['var(--font-montserrat)', 'sans-serif'],
        'bodoni': ['var(--font-bodoni)', 'serif'],
        'barlow-condensed': ['var(--font-barlow-condensed)', 'sans-serif'],
        'playfair-display': ['var(--font-playfair-display)', 'serif'],
        'geist-sans': ['var(--font-geist-sans)', 'sans-serif'],
        'geist-mono': ['var(--font-geist-mono)', 'monospace'],
        'my-soul': ['var(--font-my-soul)', 'cursive'],
        'wind-song': ['var(--font-wind-song)', 'cursive'],
        'noto-naskh-arabic': ['var(--font-noto-naskh-arabic)', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;