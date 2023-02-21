import React from "react";
import Image from "next/image";
import Link from "next/link";
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
			<div className="flex gap-x-4 items-center font-bold text-sm">
				<button className="bg-primary box text-secondary">
					CASHIER
				</button>
				<span className="py-3 px-4 box bg-gray-900">
					$0.00
				</span>
			</div>
			<div className="cursor-pointer">Account</div>
		</nav>
	);
};

export default Navbar;
