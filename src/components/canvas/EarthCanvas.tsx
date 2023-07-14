"use client";

import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";

import CanvasLoader from "../Loader";

const Earth = (): React.JSX.Element => {
	const earth = useGLTF("./planet/cc.gltf", true, true);
	return <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />;
};

const EarthCanvas = (): React.JSX.Element => {
	return (
		<Canvas
			shadows
			dpr={[1, 2]}
			gl={{ preserveDrawingBuffer: false, antialias: false }}
			camera={{
				fov: 45,
				near: 0.1,
				far: 200,
				position: [-4, 3, 6],
			}}>
			<Suspense fallback={<CanvasLoader />}>
				<OrbitControls
					autoRotate={true}
					autoRotateSpeed={10}
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
