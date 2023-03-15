require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();
const defaultNetwork = "sepolia";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork,

	solidity: {
		compilers: [
			{
				version: "0.8.4",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
			{
				version: "0.6.7",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
	networks: {
		sepolia: {
			url: "https://sepolia.infura.io/v3/6e33118194c34d29bc4478bf71f80908", // <---- YOUR INFURA ID! (or it won't work)
			//      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXXXXXXX/eth/sepolia", // <---- YOUR MORALIS ID! (not limited to infura)
			accounts: [process.env.REACT_APP_PRIVATE_KEY],
		},
		goerli: {
			url: process.env.REACT_APP_RINKEBY_RPC_URL,
			accounts: [process.env.REACT_APP_PRIVATE_KEY],
		},
		arbgoerli: {
			url: process.env.REACT_APP_ARBGOERLI_RPC_URL,
			accounts: [process.env.REACT_APP_PRIVATE_KEY],
		},
	},
	etherscan: {
		apiKey: process.env.REACT_APP_ETHERSCAN_KEY,
	},
};
