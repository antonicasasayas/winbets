import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Play } from "@next/font/google";

const play = Play({
	weight: ["400", "700"],
	style: ["normal"],
	subsets: ["latin"],
});
const Layout = ({ children }) => {
	return (
		<div className={`w-screen ${play.className}  `}>
			<Navbar />
			<Sidebar />
			<main className="pt-20 pl-56">{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
