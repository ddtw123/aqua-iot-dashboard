import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontFamily: {
			poppins: "var(--font-poppins)",
			inter: "var(--font-inter)",
			roboto: "var(--font-roboto)",
		},
  		colors: {
			dark_blue: "#092533",
			border_blue: "#16303d",
			dark_grey: "#f3f3f3",
			light_grey: "#aaaaaa",
			black: "#000000",
			white: "#ffffff",
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
	fontSize: {
		//SM
		h1SM: "2.5rem",
		h2SM: "2rem",
		h3SM: "1.5rem",
		h4SM: "1.25rem",
		h5SM: "0.9rem",
		titleSM: "1.5rem",
		buttonSM: ["1rem", { fontWeight: "700" }],
		//MD
		h1MD: "4.5rem",
		h2MD: "3rem",
		h3MD: "1.75rem",
		h4MD: "1.25rem",
		h5MD: "1rem",
		titleMD: "2rem",
		buttonMD: ["1.25rem", { fontWeight: "700" }],
		//LG
		h1LG: "6rem",
		h2LG: "4rem",
		h3LG: "2.25rem",
		h4LG: "1.5rem",
		h5LG: "1.25rem",
		titleLG: "3.75rem",
		buttonLG: ["1.5rem", { fontWeight: "700" }],
		navbuttonLG: ["1rem", { fontWeight: "700" }],
		footerbuttonLG: "0.875",
		footer2LG: "0.75",
	},
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
