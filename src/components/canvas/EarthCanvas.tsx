/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

import PyramidLoader from "../loaders/PyramidLoader";

const Earth = (): React.JSX.Element => {
	const earth = useGLTF("./planet/cc.gltf", true, true);
	return <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = (): React.JSX.Element => {
	useGLTF.preload("./planet/cc.gltf");
	return (
		<Canvas
			className="hidden sm:flex"
			shadows
			dpr={[1, 2]}
			gl={{ preserveDrawingBuffer: false, antialias: false }}
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-4, 3, 6],
			}}>
			<Suspense fallback={<PyramidLoader />}>
				<OrbitControls
					autoRotate={true}
					autoRotateSpeed={5}
					enableZoom={false}
					maxPolarAngle={Math.PI / 2}
					minPolarAngle={Math.PI / 2}
				/>
				<Earth />
				<Preload all />
			</Suspense>
		</Canvas>
	);
};

export default EarthCanvas;
