import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
const Navbar = () => {
	return (
		<nav className="fixed z-50 bg-background h-20 px-6 flex items-center justify-between w-full border-b border-black">
			<Link href="/">
				<Image
					className="cursor-pointer"
					src="/winbets-logo.png"
					height={50}
					width={150}
				/>
			</Link>
			<div className=" gap-x-4 hidden md:flex absolute top-4 left-1/2 right-1/2 items-center font-bold text-sm">
				<button className="bg-primary box text-secondary">
					CASHIER
				</button>
				<span className="py-3 px-4 box bg-gray-900">
					$0.00
				</span>
			</div>
			<Header />
		</nav>
	);
};

export default Navbar;
