"use client";

import "@/styles/shortcut_button.css";

import Link from "next/link";
import React from "react";
import { AiFillGithub } from "react-icons/ai";
import { BsDiscord } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

import { socialLinks } from "@/lib/constants";

export default function Shortcut(): React.JSX.Element {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<div id="main-div">
			<div
				className={`absolute bottom-[-10px] right-[-5px] z-[-10] h-[245px] w-[60px] items-center justify-center rounded-full bg-[#270d54] transition-opacity duration-300 ease-in-out ${
					isOpen ? "wave" : "opacity-0"
				}`}
			/>
			<div
				id="main-button"
				className={`${isOpen ? "open" : ""} wave`}
				onClick={(): void => setIsOpen((prev) => !prev)}>
				<FaFolder />
			</div>
			<Link href={socialLinks.github} className="github-color" aria-label="Github">
				<AiFillGithub />
			</Link>
			<Link href={socialLinks.discord} className="discord-color" aria-label="Discord">
				<BsDiscord />
			</Link>
			<Link href={socialLinks.gmail} className="gmail-color" aria-label="Gmail">
				<SiGmail />
			</Link>
		</div>
	);
}
