import { Html } from "@react-three/drei";
import React from "react";

export default function PyramidLoader(): React.JSX.Element {
	return (
		<Html
			center
			as="div"
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}>
			<div className="pyramid-loader">
				<div className="wrapper">
					<span className="side side1"></span>
					<span className="side side2"></span>
					<span className="side side3"></span>
					<span className="side side4"></span>
					<span className="shadow"></span>
				</div>
			</div>
		</Html>
	);
}
