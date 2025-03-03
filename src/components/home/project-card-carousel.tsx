import React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";

import { KeenCarousel } from "./components/keen-carousel";

const images = [
	"https://cdn.sanity.io/images/obr3wr6r/production/c37823adc73b8418ee53eeebe000a8122e9ad91a-1868x992.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/b2c6494675f21a6759a4896b911f564d5276deb1-1920x947.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/41e869078931e1d96c6288038b8628a97c463e5f-1920x1080.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/be09ae295b57ba0f4d94c193c5447202f5e452b7-1920x927.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/863a6277b959bed0cca389c09590e5d3614f2262-1870x988.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/d75d6048a782222023a8fda126c8018597df51df-2085x1128.png",
];

export function ProjectCard(): React.ReactElement {
	return (
		<BentoCard name="Projects" className="lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2">
			<div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden pb-6">
				<h2 className="my-6 w-full px-6 text-start text-xl font-semibold">Projects</h2>
				<KeenCarousel images={images} />
			</div>
		</BentoCard>
	);
}
