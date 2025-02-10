import React from "react";

import { cn } from "@/lib/utils";

// export const Lights: React.FC<{ className?: React.ReactNode }> = ({ className }) => (
// 	<div className={cn("h-full w-full overflow-hidden", className)}>
// 		<div
// 			className={"relative top-0 h-full w-full"}
// 			style={{
// 				background:
// 					"conic-gradient(from 180deg at 50% 50%,var(--blue-500) 0deg,var(--cyan-400) 180deg,var(--yellow-400) 1turn)",
// 				filter: "blur(75px)",
// 				opacity: "20%",
// 			}}
// 		/>
// 	</div>
// );

export const Lights: React.FC<{ className?: React.ReactNode }> = ({ className }) => (
	<div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
		<div className="absolute top-1/2 left-1/2 h-full min-h-[432px] w-full min-w-[768px] -translate-x-1/2 -translate-y-1/2">
			<div
				className="absolute inset-0"
				style={{
					maskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
				}}>
				<div className="absolute inset-0 overflow-hidden">
					<div
						className="pointer-events-none absolute -inset-[10px] overflow-hidden text-white opacity-30 blur-[15px] invert dark:text-black dark:opacity-10 dark:invert-0"
						style={{
							// @ts-expect-error custom properties
							"--duration": "60s",
							"--stripes":
								"repeating-linear-gradient(110deg, var(--background) 0%, var(--background) 7%, transparent 10%, transparent 12%, var(--background) 16%)",
							transform: "translate3d(0, 0, 0)",
							backgroundImage: "var(--stripes), var(--rainbow)",
							backgroundSize: "120%, 200%",
							backgroundPosition: "50% 50%, 50% 50%",
						}}>
						<div
							className="animate-god-rays absolute h-full w-[300%] mix-blend-difference"
							style={{
								backgroundImage: "var(--stripes), var(--rainbow)",
								backgroundSize: "100%, 100%",
								backgroundPosition: "50% 50%",
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
);
