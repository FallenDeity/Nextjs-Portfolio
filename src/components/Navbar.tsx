"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiMenu } from "react-icons/hi";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navLinks } from "@/lib/constants";
import { styles } from "@/lib/styles";

export default function Navbar(): React.JSX.Element {
	const [active, setActive] = React.useState<string>("");
	return (
		<nav className={`fixed top-0 z-20 flex w-full items-center py-5 ${styles.paddingX} bg-background`}>
			<div className="mx-auto flex w-full items-center justify-between">
				<Link
					href="/"
					className="flex cursor-pointer items-center gap-2"
					onClick={(): void => {
						setActive("");
						window.scrollTo(0, 0);
					}}>
					<Image src={"/logo.png"} width={50} height={50} alt="Logo" className="h-10 w-10 object-contain" />
					<p className="text-2xl font-bold text-white">
						Triyan <span className="hidden md:inline-flex">| Portfolio</span>
					</p>
				</Link>
				<ul className="hidden list-none flex-row gap-10 sm:flex">
					{navLinks.map((link) => (
						<li key={link.title}>
							<Link href={`#${link.id}`}>
								<p
									className={`cursor-pointer ${
										active === link.title ? "text-white" : "text-neutral-200 text-opacity-90"
									} cursor-pointer text-xl font-medium transition duration-300 ease-in-out hover:text-white`}
									onClick={(): void => setActive(link.title)}>
									{link.title}
								</p>
							</Link>
						</li>
					))}
				</ul>
				<div className="flex items-center sm:hidden">
					<DropdownMenu>
						<DropdownMenuTrigger className="focus:outline-none">
							<HiMenu
								className="cursor-pointer text-3xl text-white"
								onClick={(): void => setActive(active === "" ? "active" : "")}
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="mr-3 sm:hidden">
							{navLinks.map((link) => (
								<DropdownMenuItem
									key={link.title}
									className="items-center justify-between px-2 py-[0.2rem]">
									<Link href={`#${link.id}`}>
										<DropdownMenuLabel
											className={`cursor-pointer ${
												active === link.title
													? "text-white"
													: "text-neutral-200 text-opacity-90"
											} text-md cursor-pointer font-medium transition duration-300 ease-in-out hover:text-white`}
											onClick={(): void => setActive(link.title)}>
											{link.title}
										</DropdownMenuLabel>
									</Link>
									<link.icon
										className={`${
											active === link.title ? "text-white" : "text-neutral-200 text-opacity-90"
										} text-md cursor-pointer transition duration-300 ease-in-out hover:text-white`}
									/>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
}
