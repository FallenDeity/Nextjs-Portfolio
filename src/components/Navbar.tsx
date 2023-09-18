"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { HiMenu } from "react-icons/hi";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";
import { styles } from "@/lib/styles";

export default function Navbar(): React.JSX.Element {
	const router = useRouter();
	const [active, setActive] = React.useState<string>("");
	const navBarRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		const handleScroll = (): void => {
			if (navBarRef.current) {
				if (window.scrollY > 0) {
					navBarRef.current.classList.remove("bg-inherit");
					navBarRef.current.classList.add("backdrop-blur-sm");
				} else {
					navBarRef.current.classList.remove("backdrop-blur-sm");
					navBarRef.current.classList.add("bg-inherit");
				}
			}
		};
		window.addEventListener("scroll", handleScroll);
		return (): void => window.removeEventListener("scroll", handleScroll);
	}, []);
	return (
		<nav
			className={`fixed top-0 z-20 flex w-full items-center py-5 backdrop-filter ${styles.paddingX} bg-inherit transition-all duration-300 ease-in`}
			ref={navBarRef}>
			<div className="mx-auto flex w-full items-center justify-between">
				<div
					className="flex cursor-pointer items-center gap-3"
					onClick={(): void => {
						setActive("");
						router.push("/");
						window.scrollTo(0, 0);
					}}>
					<Image src={"/logo.png"} width={50} height={50} alt="Logo" className="h-8 w-8 object-contain" />
					<p className="flex items-center text-2xl font-bold">TRIYAN</p>
				</div>
				<ul className="hidden list-none flex-row items-center justify-center gap-10 md:flex">
					{navLinks.map((link) => (
						<li key={link.title}>
							<div>
								<p
									className={`cursor-pointer ${
										active === link.title ? "text-white" : "text-neutral-200 text-opacity-90"
									} hover:text-white text-md cursor-pointer font-medium uppercase transition duration-300 ease-in-out`}
									onClick={(): void => {
										setActive(link.title);
										router.push(link.id);
									}}>
									{link.title}
								</p>
							</div>
						</li>
					))}
				</ul>
				<div className="flex items-center md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<HiMenu
								className="cursor-pointer text-3xl"
								onClick={(): void => setActive(active === "" ? "active" : "")}
							/>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle className="my-3 text-center">Menu</SheetTitle>
							</SheetHeader>
							{navLinks.map((link) => (
								<Link key={link.title} href={link.id} passHref>
									<SheetDescription
										className={`cursor-pointer ${
											active === link.title ? "text-white" : "text-neutral-200 text-opacity-90"
										} text-md hover:text-white my-3 flex cursor-pointer flex-row items-center rounded-md p-2 font-medium uppercase transition duration-300 ease-in-out hover:bg-secondary`}>
										<link.icon className="mr-3 h-3 w-3" />
										{link.title}
									</SheetDescription>
								</Link>
							))}
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</nav>
	);
}
