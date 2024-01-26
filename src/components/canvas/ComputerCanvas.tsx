/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";

import PyramidLoader from "../loaders/PyramidLoader";

const Computers = ({ isMobile }: { isMobile: boolean }): React.JSX.Element => {
	const computer = useGLTF("./desktop_pc/cc.gltf", true, true);
	return (
		<mesh>
			<hemisphereLight intensity={0.15} groundColor="black" />
			<spotLight
				position={[-20, 50, 10]}
				angle={0.12}
				penumbra={1}
				intensity={1}
				castShadow={true}
				shadow-mapSize={1024}
			/>
			<pointLight intensity={1} />
			<primitive
				object={computer.scene}
				scale={isMobile ? 0.7 : 0.75}
				position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
				rotation={[-0.01, -0.2, -0.1]}
			/>
		</mesh>
	);
};

const ComputersCanvas = (): React.JSX.Element => {
	useGLTF.preload("./desktop_pc/cc.gltf");
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 500px)");
		setIsMobile(mediaQuery.matches);
		const handleMediaQueryChange = (event: MediaQueryListEvent): void => {
			setIsMobile(event.matches);
		};
		mediaQuery.addEventListener("change", handleMediaQueryChange);
		return () => {
			mediaQuery.removeEventListener("change", handleMediaQueryChange);
		};
	}, []);
	return (
		<Canvas
			frameloop="always"
			shadows
			dpr={[1, 2]}
			camera={{ position: [20, 3, 5], fov: 29 }}
			gl={{ preserveDrawingBuffer: false, antialias: false }}>
			<Suspense fallback={<PyramidLoader />}>
				<OrbitControls
					autoRotate
					autoRotateSpeed={3}
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Computers isMobile={isMobile} />
			</Suspense>
			<Preload all />
		</Canvas>
	);
};

export default ComputersCanvas;
