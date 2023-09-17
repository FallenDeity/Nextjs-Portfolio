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
