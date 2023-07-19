import React from "react";

export default function CommentForm(): React.JSX.Element {
	return (
		<div className="mb-8 rounded-lg bg-[#0e0a1f] p-8 pb-8 shadow-[0px_15px_30px_-15px_#211e35]">
			<h3 className="mb-8 border-b pb-4 text-xl font-semibold">Leave a Reply</h3>
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
					name="name"
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
					type="button"
					className="ease text-white text-md inline-block cursor-pointer rounded-full bg-pink-600 px-5 py-2 font-medium transition duration-500 hover:scale-110 sm:text-lg">
					Post Comment
				</button>
			</div>
		</div>
	);
}
