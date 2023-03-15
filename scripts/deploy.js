
const hre = require("hardhat");


async function main() {
	const RoboPunksNFT = await hre.ethers.getContractFactory("Staker");
	const roboPunksNFT = await RoboPunksNFT.deploy("0x2ab9f26E18B64848cd349582ca3B55c2d06f507d");

	await roboPunksNFT.deployed();

	console.log(`Staker deployed to ${roboPunksNFT.address}`);
	

	const Roulette = await hre.ethers.getContractFactory("Roulette");
	const roulette = await Roulette.deploy(roboPunksNFT.address);

	await roulette.deployed();

	console.log(`Roulette deployed to ${roulette.address}`);

	const BackingContract = await hre.ethers.getContractFactory("BackingContract");
	const backingContract = await BackingContract.deploy();

	await backingContract.deployed();

	console.log(`BackingContract deployed to ${backingContract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
