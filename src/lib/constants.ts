import { AiOutlineMessage } from "react-icons/ai";
import { BsInfoCircleFill } from "react-icons/bs";
import { ImBlog } from "react-icons/im";
import { PiProjectorScreenChart } from "react-icons/pi";

export const navLinks = [
	{
		icon: BsInfoCircleFill,
		id: "/#about",
		title: "ABOUT",
	},
	{
		id: "/#contact",
		title: "CONTACT",
		icon: AiOutlineMessage,
	},
	{
		id: "/projects",
		title: "PROJECTS",
		icon: PiProjectorScreenChart,
	},
	{
		id: "/blog",
		title: "BLOG",
		icon: ImBlog,
	},
];

export interface Experience {
	title: string;
	company_name: string;
	icon: string;
	iconBg: string;
	date: string;
	points: string[];
}

export const experiences: Experience[] = [
	{
		title: "React.js Developer",
		company_name: "Starbucks",
		icon: "/experience/starbucks.png",
		iconBg: "#326E36",
		date: "March 2020 - April 2021",
		points: [
			"Developing and maintaining web applications using React.js and other related technologies.",
			"Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
			"Implementing responsive design and ensuring cross-browser compatibility.",
			"Participating in code reviews and providing constructive feedback to other developers.",
		],
	},
	{
		title: "React Native Developer",
		company_name: "Tesla",
		icon: "/experience/tesla.png",
		iconBg: "#E6DEDD",
		date: "Jan 2021 - Feb 2022",
		points: [
			"Developing and maintaining web applications using React.js and other related technologies.",
			"Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
			"Implementing responsive design and ensuring cross-browser compatibility.",
			"Participating in code reviews and providing constructive feedback to other developers.",
		],
	},
	{
		title: "Web Developer",
		company_name: "Shopify",
		icon: "/experience/shopify.png",
		iconBg: "#DDF9DC",
		date: "Jan 2022 - Jan 2023",
		points: [
			"Developing and maintaining web applications using React.js and other related technologies.",
			"Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
			"Implementing responsive design and ensuring cross-browser compatibility.",
			"Participating in code reviews and providing constructive feedback to other developers.",
		],
	},
	{
		title: "Full stack Developer",
		company_name: "Meta",
		icon: "/experience/meta.png",
		iconBg: "#E6DEDD",
		date: "Jan 2023 - Present",
		points: [
			"Developing and maintaining web applications using React.js and other related technologies.",
			"Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
			"Implementing responsive design and ensuring cross-browser compatibility.",
			"Participating in code reviews and providing constructive feedback to other developers.",
		],
	},
];

export interface Testimony {
	testimonial: string;
	name: string;
	designation: string;
	company: string;
	image: string;
}

export const testimonials = [
	{
		testimonial:
			"I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
		name: "Sara Lee",
		designation: "CFO",
		company: "Acme Co",
		image: "https://randomuser.me/api/portraits/women/4.jpg",
	},
	{
		testimonial: "I've never met a web developer who truly cares about their clients' success like Rick does.",
		name: "Chris Brown",
		designation: "COO",
		company: "DEF Corp",
		image: "https://randomuser.me/api/portraits/men/5.jpg",
	},
	{
		testimonial: "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
		name: "Lisa Wang",
		designation: "CTO",
		company: "456 Enterprises",
		image: "https://randomuser.me/api/portraits/women/6.jpg",
	},
];
