import React from "react";

export const TextAlign = (props: {
	value?: "left" | "center" | "right";
	children?: React.ReactNode;
}): React.ReactElement => {
	return <div style={{ textAlign: props.value ? props.value : "left", width: "100%" }}>{props.children}</div>;
};
