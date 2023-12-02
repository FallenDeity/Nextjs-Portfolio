import { AiOutlineMessage } from "react-icons/ai";
import { BsInfoCircleFill } from "react-icons/bs";
import { ImBlog } from "react-icons/im";
import { PiProjectorScreenChart } from "react-icons/pi";

export const socialLinks = {
	github: "https://github.com/FallenDeity",
	discord: "https://discord.com/users/656838010532265994",
	gmail: "mailto:triyanmukherjee@gmail.com",
};

export const navLinks = [
	{
		icon: BsInfoCircleFill,
		id: "/#about",
		title: "About",
	},
	{
		id: "/#contact",
		title: "Contact",
		icon: AiOutlineMessage,
	},
	{
		id: "/projects",
		title: "Projects",
		icon: PiProjectorScreenChart,
	},
	{
		id: "/blog",
		title: "Blog",
		icon: ImBlog,
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
