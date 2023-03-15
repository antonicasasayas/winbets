import "@/styles/globals.css";
import "../styles/flipper.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { sepolia } from "wagmi/chains";

import { publicProvider } from "wagmi/providers/public";

import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
	const { chains, provider, webSocketProvider } = configureChains(
		[sepolia],
		[publicProvider()]
	);

	const client = createClient({
		autoConnect: false,
		provider,
		webSocketProvider,
	});

	return (
		<WagmiConfig client={client}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</WagmiConfig>
	);
}
