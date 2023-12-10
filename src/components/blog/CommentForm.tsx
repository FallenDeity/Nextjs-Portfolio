/* eslint-disable @typescript-eslint/no-base-to-string */
"use client";

import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { BeatLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";

import { submitComment } from "@/lib/requests/Comments";

interface CommentFormT extends HTMLFormElement {
	comment: HTMLTextAreaElement;
	commenterName: HTMLInputElement;
	email: HTMLInputElement;
	storeData: HTMLInputElement;
}

export default function CommentForm({ slug }: { slug: string }): React.JSX.Element {
	const [loading, setLoading] = React.useState(false);
	const formRef = React.useRef<CommentFormT>(null);
	React.useEffect(() => {
		if (!formRef.current) return;
		const name = localStorage.getItem("commenterName");
		const email = localStorage.getItem("email");
		if (name && email) {
			formRef.current.commenterName.value = name;
			formRef.current.email.value = email;
			formRef.current.storeData.checked = true;
		}
	}, []);
	const SubmitForm = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		if (!formRef.current) return;
		setLoading(true);
		const formData = new FormData(formRef.current);
		const data = Object.fromEntries(formData.entries());
		if (!data.comment || !data.commenterName || !data.email) {
			toast.error("Please fill all fields", {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				theme: "dark",
			});
			setLoading(false);
			return;
		}
		if (data.storeData) {
			localStorage.setItem("commenterName", data.commenterName.toString());
			localStorage.setItem("email", data.email.toString());
		} else {
			localStorage.removeItem("commenterName");
			localStorage.removeItem("email");
		}
		const params = {
			name: data.commenterName.toString(),
			email: data.email.toString(),
			comment: data.comment.toString(),
			slug,
		};
		const result = await submitComment(params);
		if (result) {
			toast.success("Comment submitted for review", {
				position: "bottom-right",
				theme: "dark",
			});
			formRef.current.comment.value = "";
			formRef.current.commenterName.value = "";
			formRef.current.email.value = "";
			formRef.current.storeData.checked = false;
		} else {
			toast.error("Error posting comment", {
				position: "bottom-right",
				theme: "dark",
			});
		}
		setLoading(false);
	};
	return (
		<div className="mb-8 rounded-lg bg-[#0e0a1f] p-8 pb-8 shadow-[0px_15px_30px_-15px_#211e35]">
			<h3 className="mb-8 border-b pb-4 text-xl font-semibold">Leave a Reply</h3>
			{/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
			<form ref={formRef} onSubmit={SubmitForm}>
				<div className="mb-4 grid grid-cols-1 gap-4">
					<textarea
						className="h-40 w-full rounded-lg bg-black-100 p-4 text-white-300 outline-none"
						name="comment"
						placeholder="Comment"
					/>
				</div>
				<div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<input
						type="text"
						className="w-full rounded-lg bg-black-100 px-4 py-2 text-white-300 outline-none"
						placeholder="Name"
						name="commenterName"
					/>
					<input
						type="email"
						className="w-full rounded-lg bg-black-100 px-4 py-2 text-white-300 outline-none"
						placeholder="Email"
						name="email"
					/>
				</div>
				<div className="mb-4 ml-1 grid grid-cols-1 gap-4">
					<div className="flex flex-row items-center">
						<input type="checkbox" id="storeData" name="storeData" value="true" />
						<label className="ml-3 cursor-pointer text-gray-500" htmlFor="storeData">
							Remember me
						</label>
					</div>
				</div>
				<div className="mt-2 flex justify-end">
					<button
						disabled={loading}
						type="submit"
						className="ease text-white text-md inline-block w-full cursor-pointer rounded-full bg-pink-600 px-5 py-2 transition duration-500 hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-pink-400 sm:text-lg">
						{loading ? <BeatLoader color="#ffffff" size={8} /> : "Post Comment"}
					</button>
				</div>
			</form>
			<ToastContainer />
		</div>
	);
}
