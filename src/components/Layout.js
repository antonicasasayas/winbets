import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
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
			<main className="md:pt-20 md:pl-56">{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
