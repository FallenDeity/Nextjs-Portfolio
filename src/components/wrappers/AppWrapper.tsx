"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const SocialMedia = (): React.JSX.Element => (
	<div className="app__social">
		<div>
			<BsTwitter />
		</div>
		<div>
			<FaFacebookF />
		</div>
		<div>
			<BsInstagram />
		</div>
	</div>
);

const NavigationDots = ({ active }: { active: string }): React.JSX.Element => {
	const router = useRouter();
	return (
		<div className="app__navigation">
			{["/", "/#about", "/#work", "/#technologies", "/#works", "/#contact"].map((item, index) => (
				<div
					onClick={(): void => router.push(item)}
					key={`${item}-${index}`}
					className="app__navigation-dot"
					style={active === item.replace("/", "").replace("#", "") ? { backgroundColor: "#313BAC" } : {}}
				/>
			))}
		</div>
	);
};

const AppWrap = (Component: React.FC, idName: string, classNames: string): React.FC =>
	function HOC() {
		return (
			<div className={`app__container ${classNames}`}>
				<SocialMedia />
				<div className="app__wrapper app__flex">
					<Component />
					<div className="copyright">
						<p className="p-text">@2020 MICHAEL</p>
						<p className="p-text">All rights reserved</p>
					</div>
				</div>
				<NavigationDots active={idName} />
			</div>
		);
	};

export default AppWrap;
