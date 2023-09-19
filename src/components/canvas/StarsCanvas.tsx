"use client";

import { PointMaterial, Points, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as random from "maath/random/dist/maath-random.esm";
import { Suspense, useRef, useState } from "react";

const Stars = (): React.JSX.Element => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ref = useRef<any>();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
	const [sphere] = useState(() => random.inSphere(new Float32Array(4500), { radius: 1.2 }));
	useFrame((_, delta) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		ref.current.rotation.x -= delta / 10;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		ref.current.rotation.y -= delta / 15;
	});
	return (
		<group rotation={[0, 0, Math.PI / 4]}>
			{/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
			<Points ref={ref} positions={sphere} stride={3} frustumCulled>
				<PointMaterial transparent color="#f5c731" size={0.002} sizeAttenuation={true} depthWrite={false} />
			</Points>
		</group>
	);
};

const StarsCanvas = (): React.JSX.Element => {
	return (
		<div className="absolute inset-0 z-[-1] h-auto w-full">
			<Canvas camera={{ position: [0, 0, 1] }} gl={{ preserveDrawingBuffer: false, antialias: false }}>
				<Suspense fallback={null}>
					<Stars />
				</Suspense>
				<Preload all />
			</Canvas>
		</div>
	);
};

export default StarsCanvas;
