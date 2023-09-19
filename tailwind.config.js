/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: "jit",
	darkMode: "class",
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					light: "hsl(var(--primary-light))",
					dark: "hsl(var(--primary-dark))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
					light: "hsl(var(--secondary-light))",
					dark: "hsl(var(--secondary-dark))",
				},
				tertiary: {
					DEFAULT: "hsl(var(--tertiary))",
					foreground: "hsl(var(--tertiary-foreground))",
					light: "hsl(var(--tertiary-light))",
					dark: "hsl(var(--tertiary-dark))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				black: {
					100: "#100d25",
					200: "#090325",
					300: "#05011a",
					400: "#040114",
					500: "#03010e",
					600: "#020109",
					700: "#010104",
					800: "#000000",
					900: "#000000",
				},
				white: {
					100: "#f3f3f3",
					200: "#e7e7e7",
					300: "#dbdbdb",
					400: "#d0d0d0",
					500: "#c4c4c4",
					600: "#b8b8b8",
					700: "#acacac",
					800: "#a1a1a1",
					900: "#959595",
				},
			},
			screens: {
				xs: "450px",
			},
			backgroundImage: {
				"hero-pattern": "url('/herobg.webp')",
				"project-pattern": "url('/projectbg.png')",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("prettier-plugin-tailwindcss"), require("tailwind-scrollbar")],
};
