"use client";

import "react-toastify/dist/ReactToastify.css";

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

import { slideIn } from "@/lib/motion";
import { styles } from "@/lib/styles";

import EarthCanvas from "./canvas/EarthCanvas";
import StarWrapper from "./wrappers/SectionWrapper";

const Contact = (): React.JSX.Element => {
	const formRef = useRef<HTMLFormElement>(null);
	const [form, setForm] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const { target } = e;
		const { name, value } = target;

		setForm({
			...form,
			[name]: value,
		});
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		if (loading) return;
		if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
			toast.error("Please fill all the fields.", {
				position: "bottom-right",
				theme: "dark",
			});
			return;
		}
		setLoading(true);
		emailjs.init(String(process.env.NEXT_PUBLIC_EMAILJS_USER_ID));
		void emailjs
			.send(
				String(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
				String(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
				{
					from_name: form.name,
					to_name: "Triyan Mukherjee",
					from_email: form.email,
					to_email: "triyanmukherjee@gmail.com",
					message: form.message,
				},
				String(process.env.NEXT_PUBLIC_EMAILJS_USER_ID)
			)
			.then(
				() => {
					setLoading(false);
					toast.success("Message sent successfully!", {
						position: "bottom-right",
						theme: "dark",
					});
					setForm({
						name: "",
						email: "",
						message: "",
					});
				},
				(error) => {
					setLoading(false);
					console.error(error);
					toast.error("Something went wrong. Please try again later.", {
						position: "bottom-right",
						theme: "dark",
					});
				}
			);
	};

	return (
		<div className={`flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row`}>
			<ToastContainer />
			<motion.div
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				variants={slideIn("left", "tween", 0.2, 1)}
				className="flex-[0.75] rounded-2xl bg-black-100 p-8">
				<p className={styles.sectionSubText}>Get in touch</p>
				<h3 className={styles.sectionHeadText}>Contact</h3>
				<form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
					<label className="flex flex-col">
						<span className="text-white mb-4 font-medium">Your Name</span>
						<input
							type="text"
							name="name"
							value={form.name}
							onChange={handleChange}
							placeholder="What's your good name?"
							className="text-white rounded-lg border-none bg-neutral-300 bg-opacity-5 px-6 py-4 font-medium outline-none placeholder:text-neutral-500"
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-white mb-4 font-medium">Your email</span>
						<input
							type="email"
							name="email"
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
							value={form.email}
							onChange={handleChange}
							placeholder="What's your web address?"
							className="text-white rounded-lg border-none bg-neutral-300 bg-opacity-5 px-6 py-4 font-medium outline-none placeholder:text-neutral-500"
						/>
					</label>
					<label className="flex flex-col">
						<span className="text-white mb-4 font-medium">Your Message</span>
						<textarea
							rows={7}
							name="message"
							value={form.message}
							onChange={handleChange}
							placeholder="What you want to say?"
							className="text-white rounded-lg border-none bg-neutral-300 bg-opacity-5 px-6 py-4 font-medium outline-none placeholder:text-neutral-500"
						/>
					</label>
					<button
						disabled={loading}
						type="submit"
						className="text-white w-full rounded-xl bg-pink-600 px-8 py-3 text-center font-bold outline-none transition-all duration-300 hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-pink-400 disabled:bg-opacity-10">
						{loading ? <BeatLoader size={8} color="#ffffff" /> : "Send"}
					</button>
				</form>
			</motion.div>
			<motion.div
				initial="hidden"
				whileInView="show"
				viewport={{ once: true }}
				variants={slideIn("right", "tween", 0.2, 1)}
				className="h-[350px] md:h-[550px] xl:h-auto xl:flex-1">
				<EarthCanvas />
			</motion.div>
		</div>
	);
};

export default StarWrapper(Contact, "contact");
