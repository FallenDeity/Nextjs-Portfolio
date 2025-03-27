"use client";

import "@/styles/carousel.css";
import "keen-slider/keen-slider.min.css";

import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import React from "react";

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

export function KeenCarousel({ images }: { images: string[] }): React.ReactElement {
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
		<div className="scene">
			<div className="carousel keen-slider" ref={sliderRef}>
				{images.map((src, idx) => (
					<Image
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
	);
}
