import React, { useEffect, useState } from "react";
import Image from "next/image";
import { abi, contractAddresses } from "../../constants/";
import { useContractEvent } from "wagmi";

import anime from "animejs";

import TableLayout from "@/components/roulette/TableLayout";
import { ethers } from "ethers";
var currentBallRotation = 0;
var currentWheelRotation = 0;
var currentWheelIndex = 0;
var isRotating = false;
// const rouletteWheelNumbers = [
// 	0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
// 	24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
// ];

const rouletteWheelNumbers = [
	22, 29, 28, 35, 26, 32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18,
	7, 12, 3, 0, 15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20,
];

const getRouletteWheelNumber = (index) =>
	rouletteWheelNumbers[index >= 0 ? index % 37 : 37 - Math.abs(index % 37)];

const getRouletteWheelColor = (index) => {
	const i = index >= 0 ? index % 37 : 37 - Math.abs(index % 37);
	return i == 0 ? "green" : i % 2 == 0 ? "black" : "red";
};

function offsetEl(el) {
	if (window !== "undefined") {
		var rect = el.getBoundingClientRect(),
			scrollLeft =
				window.pageXOffset || document?.documentElement.scrollLeft,
			scrollTop =
				window.pageYOffset || document?.documentElement.scrollTop;
		return {
			top: rect.top + scrollTop,
			left: rect.left + scrollLeft,
			width: rect.width,
			height: rect.height,
		};
	}
}

// function isInBoundaryEl(el, x, y) {
// 	const o = offsetEl(el);
// 	return (
// 		x >= o.left &&
// 		x <= o.left + o.width &&
// 		y >= o.top &&
// 		y <= o.top + o.height
// 	);
// }

function isInRadiusEl(el, x, y) {
	const o = offsetEl(el);
	const cx = o.left + o.width / 2;
	const cy = o.top + o.height / 2;
	const dx = x - cx;
	const dy = y - cy;
	const r = o.width / 2;
	return Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(r, 2);
}

// const tryRotate = ([p0, p1]) => {
// 	console.log(p0, p1)
// 	if (window !== "undefined") {
// 		const w = document?.querySelector(".layer-2.wheel");
// 		if (isInRadiusEl(w, p0.x, p0.y)) {
// 			const d = Math.round(
// 				Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2)) /
// 					4
// 			);
// 			if (Math.abs(d) > 3) {
// 				window.startRotation(d);
// 			}
// 		}
// 	}
// };

const Roulette = () => {
	const rouletteAddress = contractAddresses["11155111"][0];
	const [betNumber, setBetNumber] = useState(0);
	const [betAmount, setBetAmount] = useState(0);
	const [winningNumber, setWinningNumber] = useState();
	const [showWinningNumber, setShowWinningNumber] = useState(false);
	function startRotation(winningNumber) {
		if (isRotating) {
			return;
		}
		isRotating = true;
		const bezier = [0.25, 0.1, 0.25, 1];
		const wheelSize = 37;
		const spinDuration = 5000;
		const ballDuration = 4000;

		// Calculate the index of the winning number on the wheel
		const winningIndex = rouletteWheelNumbers.indexOf(
			Number(winningNumber)
		);

		// Calculate the number of steps needed to reach the winning number from the current index
		let steps = (winningIndex + wheelSize - currentWheelIndex) % wheelSize;
		if (steps > wheelSize / 2) {
			steps = steps - wheelSize;
		}
		steps -= wheelSize; // add one full rotation

		// Calculate the speed based on the number of steps
		const speed = (360 / wheelSize) * steps * -1;

		// Calculate the duration of the wheel spin based on the speed
		const spinDurationFactor = Math.abs(speed) / (360 / wheelSize);
		const spinDurationAdjusted = Math.max(
			spinDuration / spinDurationFactor,
			2000
		);

		// Calculate the total number of steps required to reach the winning number
		const totalSteps = Math.abs(steps);

		// Calculate the duration of the ball animation based on the total number of steps
		const ballDurationFactor = totalSteps / wheelSize;
		const ballDurationAdjusted = Math.max(
			ballDuration * ballDurationFactor,
			2000
		);

		const newWheelIndex = currentWheelIndex + steps;
		const resultColor = getRouletteWheelColor(newWheelIndex);
		(() => {
			const newRotation = currentWheelRotation + speed;
			console.log(
				getRouletteWheelNumber(currentWheelIndex),
				"---> ",
				winningNumber
			);
			var myAnimation = anime({
				targets: [".layer-2", ".layer-4"],
				rotate: function () {
					return newRotation;
				},
				duration: function () {
					return spinDurationAdjusted;
				},
				loop: 1,
				easing: `cubicBezier(${bezier.join(",")})`,
				complete: (...args) => {
					currentWheelRotation = newRotation;
					currentWheelIndex = newWheelIndex;
				},
			});
		})();

		(() => {
			const ballEndAngle = (360 / wheelSize) * winningIndex - 90;
			const ballRotation = -4 * 360 + ballEndAngle + 360;
			var myAnimation1 = anime({
				targets: ".ball-container",
				translateY: [
					{ value: 0, duration: ballDurationAdjusted / 4 },
					{ value: 20, duration: ballDurationAdjusted / 8 },
					{ value: 25, duration: ballDurationAdjusted / 9 },
					{ value: 60, duration: ballDurationAdjusted / 8 },
				],
				rotate: [
					{ value: ballRotation, duration: ballDurationAdjusted },
				],
				duration: function () {
					return ballDurationAdjusted;
				},
				loop: 1,
				easing: `linear`,
				complete: () => {
					currentBallRotation = ballRotation;
					isRotating = false;
				},
			});
		})();
	}

	useEffect(() => {
		if (winningNumber) {
			startRotation(winningNumber);
			setTimeout(() => setShowWinningNumber(true), 4000);
		}
	}, [winningNumber]);

	useEffect(() => {
		window.anime = anime;
		window.rouletteWheelNumbers = rouletteWheelNumbers;
		window.startRotation = startRotation;
	}, []);

	// const payoutEvents = useEventListener(
	// 	readContracts,
	// 	"Roulette",
	// 	"Payout",
	// 	localProvider,
	// 	1
	// );
	// const playEvents = useEventListener(
	// 	readContracts,
	// 	"Roulette",
	// 	"Play",
	// 	localProvider,
	// 	1
	// );
	// const gameStartEvents = useEventListener(
	// 	readContracts,
	// 	"Roulette",
	// 	"GameStart",
	// 	localProvider,
	// 	1
	// );

	// Create a filter for the event you want to listen for

	useContractEvent({
		address: rouletteAddress,
		abi: abi,
		eventName: "Bet",
		listener(node, label, owner) {
			console.log(`This is the node: ${node}`);
			console.log(`This is the wei bet value: ${label}`);
			console.log(`This is the bet number: ${owner}`);
		},
	});

	useContractEvent({
		address: rouletteAddress,
		abi: abi,
		eventName: "GameStart",
		listener(node) {
			console.log(`This is the node: ${node}`);
		},
	});

	useContractEvent({
		address: rouletteAddress,
		abi: abi,
		eventName: "Play",
		listener(node, label, owner, rngNumber) {
			console.log(`This is the node: ${node}`);
			console.log(`This is the label: ${label}`);
			console.log(`This is the owner: ${owner}`);
			console.log(rngNumber);
			setWinningNumber(rngNumber.toString());
		},
	});

	const handleBet = async () => {
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(rouletteAddress, abi, signer);
			try {
				const response = await contract.bet(betNumber, {
					value: ethers.utils.parseEther(betAmount.toString()),
				});
				console.log("response", response);
				setShowWinningNumber(false);
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="pt-12 pl-6 pr-20 flex-col flex pb-4" id="app">
			<div className="flex items-center w-full mt-12  justify-center gap-x-12">
				<div className="flex flex-col w-48 gap-y-4">
					<span>House Edge: 2.70%</span>
					<span>
						Verified by <a href="https://api3.org/">API3</a>☑️{" "}
					</span>
					<span>Number:</span>
					<input
						className="text-black pl-2 rounded py-2"
						type="number"
						value={betNumber}
						onChange={(e) => setBetNumber(e.target.value)}
					/>
					<span>Amount in ETH:</span>
					<input
						className="text-black pl-2 py-2 rounded"
						type="number"
						value={betAmount}
						onChange={(e) => setBetAmount(e.target.value)}
					/>

					<button
						className="border border-white p-2 rounded text-xl"
						onClick={handleBet}
					>
						Bet
					</button>
				</div>

				<div className="flex gap-x-12  items-center justify-center">
					<div className="h-36 w-36 flex rounded-xl  justify-center items-center bg-background border border-primary">
						<span className=" text-center   text-6xl font-bold text-primary">
							{showWinningNumber && winningNumber}
						</span>
					</div>
					<div>
						<div className="roulette-wheel">
							<div
								className="layer-2 wheel"
								style={{ transform: "rotate(0deg)" }}
							/>
							<div className="layer-3" />
							<div
								className="layer-4 wheel"
								style={{ transform: "rotate(0deg)" }}
							/>
							<div className="layer-5" />
							<div
								className="ball-container"
								style={{ transform: "rotate(0deg)" }}
							>
								<div
									className="ball"
									style={{
										transform: "translate(0, -163.221px)",
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <TableLayout /> */}
		</div>
	);
};

export default Roulette;
