"use client";

import { Clock, Download, Info, Languages, MapPin } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";
import { StaggerText } from "@/components/magicui/text-animate";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ShineBorder } from "../magicui/shine-border";

export default function ProfileCard(): React.ReactElement {
	const [time, setTime] = React.useState(new Date());
	const [timeValues, setTimeValues] = React.useState([0, 0, 0]);

	React.useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return (): void => clearInterval(interval);
	}, []);

	React.useEffect(() => {
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const seconds = time.getSeconds();
		setTimeValues([hours, minutes, seconds]);
	}, [time]);

	return (
		<BentoCard name="Profile" className="lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4">
			<div className="flex h-full flex-col items-center p-6">
				<div className="flex w-full flex-row items-center justify-between">
					<ShineBorder
						borderRadius={64}
						borderWidth={3}
						className="absolute size-32 min-w-0 rounded-full"
						color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
					/>
					<Avatar className="ml-1 h-30 w-30 rounded-full shadow-md dark:shadow-none">
						<AvatarImage src="/profile.jpg" />
						<AvatarFallback>T</AvatarFallback>
					</Avatar>
					<div className="flex w-full flex-col items-center justify-center space-y-2">
						<h3 className="text-xl font-semibold">Triyan Mukherjee</h3>
						<p className="text-muted-foreground text-center tracking-tight">
							CCE @ MIT, Manipal | Coding Head @ Robomanipal
						</p>
					</div>
				</div>
				<div className="mt-4 flex w-full flex-col items-start justify-center">
					<h3 className="text-md flex items-center justify-center gap-2 font-semibold">
						<Info className="h-5 w-5" />
						About Me
					</h3>
					<p className="text-card-foreground/80 mt-3 text-justify text-sm text-pretty">
						Hi! I'm Triyan, a Computer and Communication Engineering student at MIT, Manipal. I'm also the
						Coding Head at Robomanipal. I'm a software developer, and I love building things with code. I'm
						passionate about technology, and I'm always looking for new ways to learn and grow.
					</p>
				</div>
				<div className="mt-4 flex w-full flex-row items-center justify-center space-x-2">
					<Badge
						variant={"outline"}
						className="border-primary/70 hover:bg-primary/10 min-w-20 cursor-pointer gap-1 px-1.5 py-1 shadow-md transition-all duration-300 ease-in dark:shadow-none">
						<Languages className="-ms-0.5 opacity-60" size={12} strokeWidth={2} aria-hidden="true" />
						English
					</Badge>
					<Badge
						variant={"outline"}
						className="border-primary/70 hover:bg-primary/10 min-w-20 cursor-pointer gap-1 px-1.5 py-1 shadow-md transition-all duration-300 ease-in dark:shadow-none">
						<Languages className="-ms-0.5 opacity-60" size={12} strokeWidth={2} aria-hidden="true" />
						Hindi
					</Badge>
					<Badge
						variant={"outline"}
						className="border-primary/70 hover:bg-primary/10 min-w-20 cursor-pointer gap-1 px-1.5 py-1 shadow-md transition-all duration-300 ease-in dark:shadow-none">
						<Languages className="-ms-0.5 opacity-60" size={12} strokeWidth={2} aria-hidden="true" />
						Bengali
					</Badge>
				</div>
				<div className="mt-6 flex w-full flex-row items-center justify-center space-x-2">
					<Button
						variant="outline"
						className="bg-card/70 flex w-full cursor-pointer flex-row-reverse items-center justify-between p-8 transition-all duration-300 ease-in-out">
						<Download className="ml-2 h-8 w-8" />
						<div className="flex w-full flex-row-reverse items-center justify-center space-x-2">
							<div className="flex w-full flex-col items-start justify-center">
								<p className="text-sm font-semibold">Download Resume</p>
								<p className="text-muted-foreground text-xs">Last updated on 23rd August 2021</p>
							</div>
							<Image className="mr-2" src="/pdf.png" alt="pdf" width={24} height={24} />
						</div>
					</Button>
				</div>
				<div className="mt-6 flex w-full flex-row items-center justify-between space-x-2">
					<div className="flex w-full flex-col items-start">
						<h3 className="text-md flex items-center justify-center gap-2 font-semibold">
							<Clock className="h-5 w-5" />
							My Time
						</h3>
						<div className="mt-3 flex flex-row items-center justify-center space-x-2">
							<AnimatedCounter className="border" value={timeValues[0]} places={2} />
							<p className="text-center font-semibold">:</p>
							<AnimatedCounter className="border" value={timeValues[1]} places={2} />
							<p className="font-semibold">:</p>
							<AnimatedCounter className="border" value={timeValues[2]} places={2} />
						</div>
						<p className="text-muted-foreground mt-1 text-sm">
							{time.toDateString()},{" "}
							<span className="text-muted-foreground text-xs">Local time in India</span>
						</p>
					</div>
					<div className="flex h-full w-full flex-col items-end">
						<h3 className="text-md flex items-center justify-center gap-2 font-semibold">
							<MapPin className="h-5 w-5" />
							My Location
						</h3>
						<p className="text-muted-foreground mt-3 text-sm">Kolkata, West Bengal, India</p>
					</div>
				</div>
				<div className="relative mt-12 -mb-44 block h-[40vh] w-full items-center justify-center pt-12 md:mt-0">
					<div id="functions-hero" className="absolute inset-0 top-10">
						<div className="animate-in fade-in absolute top-[0%] left-[20%] z-20 flex h-auto w-[70%] flex-1 items-center justify-center transition-opacity duration-1000 ease-in sm:top-[0%] sm:left-[23%] sm:w-[55%] md:top-[5%] md:left-[25%] md:w-[55%] lg:top-[-10%] lg:left-[5%] lg:w-[100%] xl:top-[-5%] xl:left-[8%] xl:w-[90%] 2xl:top-[-5%] 2xl:left-[5%] 2xl:w-[100%]">
							<a
								href="mailto:triyanmukherjee@gmail.com"
								className="group hover:border-strong bg-alternative group/email flex w-full items-center gap-1 rounded-xl border border-amber-600 px-3 py-2 sm:gap-2">
								<div className="text-foreground-muted relative font-mono text-sm text-amber-400">
									<svg
										stroke="currentColor"
										fill="currentColor"
										strokeWidth="0"
										viewBox="0 0 512 512"
										className="text-white"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
									</svg>
									<svg
										stroke="currentColor"
										fill="currentColor"
										strokeWidth="0"
										viewBox="0 0 512 512"
										className="absolute top-0 animate-pulse text-amber-400"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
									</svg>
									<svg
										stroke="currentColor"
										fill="currentColor"
										strokeWidth="0"
										viewBox="0 0 512 512"
										className="absolute top-0 animate-ping text-amber-400"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"></path>
									</svg>
								</div>
								<div className="text-foreground flex-1 text-left font-mono text-xs md:text-sm">
									<StaggerText
										text="I'd love to hear from you!"
										direction="right"
										transition={{ type: "spring", stiffness: 100, damping: 10, mass: 0.5 }}
									/>
								</div>
								<div className="text-foreground rounded p-1.5 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover/email:text-amber-300">
									<svg
										stroke="currentColor"
										fill="currentColor"
										strokeWidth="0"
										viewBox="0 0 512 512"
										className="h-3.5 w-3.5"
										height="1em"
										width="1em"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path>
									</svg>
								</div>
							</a>
						</div>
						<svg
							id="svg1"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							fill="none"
							viewBox="0 0 155 284"
							className="absolute"
							style={{ width: "15.244%", height: "41.24%", left: "38.8%", top: "31.2%" }}>
							<path
								stroke="url(#lg-svg1)"
								strokeWidth="1.396"
								d="M.797 283.216c14.605-22.693 64.498-78.738 87.739-104.396-22.406-17.823-47.852-46.354-57.983-58.555 36.536-29.153 96.735-65.699 122.267-80.327-6.727-8.041-21.226-27.282-26.518-39.053"></path>
							<defs>
								<linearGradient
									id="lg-svg1"
									x1="100%"
									x2="100%"
									y1="-20%"
									y2="130%"
									gradientUnits="userSpaceOnUse">
									<stop offset="0" stopColor="#FFFFFF" stopOpacity="0"></stop>
									<stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.6"></stop>
									<stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
								</linearGradient>
							</defs>
						</svg>
						<svg
							id="svg2"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							fill="none"
							viewBox="0 0 272 235"
							className="absolute"
							style={{ width: "27.458%", height: "34.045%", left: "50.8%", top: "31.4%" }}>
							<path
								stroke="url(#lg-svg2)"
								strokeWidth="1.396"
								d="M271.749 233.614C215.075 230.474 159.599 210.964 138.945 201.602C144.38 186.681 156.517 152.612 161.587 135.71C126.058 122.39 44.25 76.75 1.25 0.75"></path>
							<defs>
								<linearGradient
									id="lg-svg2"
									x1="100%"
									x2="100%"
									y1="-20%"
									y2="130%"
									gradientUnits="userSpaceOnUse">
									<stop offset="0" stopColor="#FFFFFF" stopOpacity="0"></stop>
									<stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.6"></stop>
									<stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
								</linearGradient>
							</defs>
						</svg>
						<svg
							id="svg3"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							fill="none"
							viewBox="0 0 261 144"
							className="absolute"
							style={{ width: "26.687%", height: "20.49%", left: "25.1%", top: "31.4%" }}>
							<path
								stroke="url(#lg-svg3)"
								strokeWidth="1.396"
								d="M260.5 1.5C157.75 30.75 67.75 89 1.13281 143.202"></path>
							<defs>
								<linearGradient
									id="lg-svg3"
									x1="100%"
									x2="100%"
									y1="-20%"
									y2="130%"
									gradientUnits="userSpaceOnUse">
									<stop offset="0" stopColor="#FFFFFF" stopOpacity="0"></stop>
									<stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.6"></stop>
									<stop offset="1" stopColor="#FFFFFF" stopOpacity="0"></stop>
								</linearGradient>
							</defs>
						</svg>
						<div
							id="dot1"
							style={{ left: "50%", top: "29.9%" }}
							className="animate-in fade-in absolute flex h-[3.6%] w-[2.5%] origin-center items-center justify-center transition-opacity duration-500 ease-in">
							<span className="bg-opacity-20 absolute inset-0 h-full w-full rounded-full bg-black dark:bg-white"></span>
							<span className="bg-opacity-90 absolute h-4/5 w-4/5 rounded-full bg-black dark:bg-white"></span>
						</div>
						<div className="absolute top-[10%] left-[51.15%] h-[20%] w-px overflow-hidden">
							<span className="animate-in fade-in absolute inset-0 h-full w-full bg-gradient-to-t from-current to-transparent delay-75 duration-700 ease-in"></span>
						</div>
						<Image
							alt="globe wireframe"
							width="400"
							height="400"
							decoding="async"
							data-nimg="1"
							className="block h-full w-full"
							style={{ color: "transparent" }}
							src="/globe-light.svg"
						/>
						<Image
							alt="globe wireframe"
							width="400"
							height="400"
							decoding="async"
							data-nimg="1"
							className="hidden h-full w-full"
							style={{ color: "transparent" }}
							src="/globe.svg"
						/>
					</div>
				</div>
			</div>
		</BentoCard>
	);
}
