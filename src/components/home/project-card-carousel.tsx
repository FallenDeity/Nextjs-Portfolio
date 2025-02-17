"use client";

import "@/styles/carousel.css";
import "keen-slider/keen-slider.min.css";

import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import React from "react";

import { BentoCard } from "@/components/magicui/bento-grid";

const carousel: KeenSliderPlugin = (slider) => {
	const z = 300;
	function rotate(): void {
		const deg = 360 * slider.track.details.progress;
		slider.container.style.transform = `translateZ(-${z}px) rotateY(${-deg}deg)`;
	}
	slider.on("created", () => {
		const deg = 360 / slider.slides.length;
		slider.slides.forEach((element, idx) => {
			element.style.transform = `rotateY(${deg * idx}deg) translateZ(${z}px)`;
		});
		rotate();
	});
	slider.on("detailsChanged", rotate);
};

const WheelControls: KeenSliderPlugin = (slider) => {
	let touchTimeout: ReturnType<typeof setTimeout>;
	let position: {
		x: number;
		y: number;
	};
	let wheelActive: boolean;

	function dispatch(e: WheelEvent, name: string): void {
		position.x -= e.deltaX;
		position.y -= e.deltaY;
		slider.container.dispatchEvent(
			new CustomEvent(name, {
				detail: {
					x: position.x,
					y: position.y,
				},
			})
		);
	}

	function wheelStart(e: WheelEvent): void {
		position = {
			x: e.pageX,
			y: e.pageY,
		};
		dispatch(e, "ksDragStart");
	}

	function wheel(e: WheelEvent): void {
		dispatch(e, "ksDrag");
	}

	function wheelEnd(e: WheelEvent): void {
		dispatch(e, "ksDragEnd");
	}

	function eventWheel(e: WheelEvent): void {
		e.preventDefault();
		if (!wheelActive) {
			wheelStart(e);
			wheelActive = true;
		}
		wheel(e);
		clearTimeout(touchTimeout);
		touchTimeout = setTimeout(() => {
			wheelActive = false;
			wheelEnd(e);
		}, 50);
	}

	slider.on("created", () => {
		slider.container.addEventListener("wheel", eventWheel, {
			passive: false,
		});
	});
};

// plugin for moving to next slide every 5 seconds
const AutoSlide: KeenSliderPlugin = (slider) => {
	let interval: ReturnType<typeof setInterval>;

	function startAutoSlide(): void {
		interval = setInterval(() => {
			slider.moveToIdx((slider.track.details.abs + 1) % slider.track.details.slides.length, true);
		}, 5000);
	}

	function stopAutoSlide(): void {
		clearInterval(interval);
	}

	slider.on("created", () => {
		slider.container.style.transition = "transform 0.2s";
	});

	slider.on("dragStarted", stopAutoSlide);
	slider.on("dragEnded", startAutoSlide);

	slider.on("destroyed", () => {
		stopAutoSlide();
	});

	startAutoSlide();
};

const images = [
	"https://cdn.sanity.io/images/obr3wr6r/production/c37823adc73b8418ee53eeebe000a8122e9ad91a-1868x992.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/b2c6494675f21a6759a4896b911f564d5276deb1-1920x947.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/41e869078931e1d96c6288038b8628a97c463e5f-1920x1080.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/be09ae295b57ba0f4d94c193c5447202f5e452b7-1920x927.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/863a6277b959bed0cca389c09590e5d3614f2262-1870x988.png",
	"https://cdn.sanity.io/images/obr3wr6r/production/d75d6048a782222023a8fda126c8018597df51df-2085x1128.png",
];

export function ProjectCard(): React.ReactElement {
	const [sliderRef] = useKeenSlider<HTMLDivElement>(
		{
			loop: true,
			selector: ".carousel__cell",
			renderMode: "custom",
			mode: "free",
			drag: true,
			slides: {
				perView: 1,
				origin: "center",
			},
		},
		[carousel, WheelControls, AutoSlide]
	);

	return (
		<BentoCard name="Projects" className="lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2">
			<div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden pb-6">
				<h2 className="my-6 w-full px-6 text-start text-xl font-semibold">Projects</h2>
				<div className="scene">
					<div className="carousel keen-slider" ref={sliderRef}>
						{images.map((src, idx) => (
							<Image
								quality={100}
								key={idx}
								className="carousel__cell number-slide rounded-md shadow-md"
								src={src}
								alt="project"
								width={260}
								height={160}
							/>
						))}
					</div>
				</div>
				{/* <ThreeDPhotoCarousel cards={images} /> */}
			</div>
		</BentoCard>
	);
}
