import { useAccount, useConnect, useEnsName } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
export default function Header() {
	const { address, isConnected } = useAccount();
	const { data: ensName } = useEnsName({ address });
	const { connect } = useConnect({
		connector: new MetaMaskConnector(),
	});

	return (
		<div >
			{isConnected ? (
				<div>Connected to {ensName ?? address}</div>
			) : (
				<button onClick={() => connect()}>Connect Wallet</button>
			)}
		</div>
	);
}
