import Image from "next/image";
import React from "react";
import Link from "next/link";
const Sidebar = () => {
	return (
		<div className="fixed mt-20 h-screen p-4 w-56 bg-sidebar">
			<div className="bg-gray-900 box">$0.00 WINB</div>
			<div className="flex flex-col gap-y-2 mt-4">
				<span className="font-bold text-xs text-gray-500">
					PLAY WINBETS
				</span>
				<Link href="/roulette">
					<span className="flex cursor-pointer gap-x-2 w-full hover:bg-sidebar-hover p-2 font-bold rounded-lg text-sm ">
						{" "}
						<Image
							src="/roulette.svg"
							width={15}
							height={15}
						/>{" "}
						Roulette
					</span>
				</Link>
				<Link href="/sports">
					<span className="flex cursor-pointer gap-x-2 w-full hover:bg-sidebar-hover p-2 font-bold rounded-lg text-sm ">
						{" "}
						<Image
							src="/basketball.svg"
							width={15}
							height={15}
						/>{" "}
						Sports
					</span>
				</Link>
			</div>
		</div>
	);
};

export default Sidebar;
