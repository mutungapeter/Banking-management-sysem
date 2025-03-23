import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      satoshi: ["Satoshi", "sans-serif"],
      nunito: ['Nunito', 'sans-serif'],
      nunitoSans: ['Nunito Sans', 'sans-serif'],
      pacifico: ['Pacifico', 'cursive'],
      roboto: ['Roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        
        body:"#253545",
        bgColor:"#E3EFFE",
        white: "#FFFFFF",
        primary: "#0996D9",
        orange:"#F59E0B",
        green:"#10B981",
      },
     
      maxWidth: {
        "c-1390": "86.875rem",
        "c-1315": "82.188rem",
        "c-1280": "80rem",
        "c-1235": "77.188rem",
        "c-1154": "72.125rem",
        "c-1016": "63.5rem",
        "c-935": "58.438rem",
        "c-800": "50rem",
        "c-700": "43.75rem",
        "c-600": "37.5rem",
        "c-500": "31.25rem",
        "c-400": "25rem",
        "c-300": "18.75rem",
        "c-200": "12.5rem",
        "c-100": "6.25rem",
        
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        9: "9",
        1: "1",
      },
      opacity: {
        65: ".65",
      },
    },
  },
  plugins: [],
} satisfies Config;