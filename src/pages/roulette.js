import React, { useEffect } from "react";
import Image from "next/image";
import anime from "animejs";
import {
	map,
	zip,
	fromEvent,
	pipe,
	withLatestFrom,
} from "../javascript/Observable";
import TableLayout from "@/components/roulette/TableLayout";

var currentBallRotation = 0;
var currentWheelRotation = 0;
var currentWheelIndex = 0;
var isRotating = false;
const rouletteWheelNumbers = [
	0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
	24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const getRouletteWheelNumber = (index) =>
	rouletteWheelNumbers[index >= 0 ? index % 37 : 37 - Math.abs(index % 37)];

const getRouletteWheelColor = (index) => {
	const i = index >= 0 ? index % 37 : 37 - Math.abs(index % 37);
	return i == 0 ? "green" : i % 2 == 0 ? "black" : "red";
};

function startRotation(speed) {
	if (isRotating) {
		return;
	}

	isRotating = true;

	// const writeResult = addFlipper();

	const bezier = [0.165, 0.84, 0.44, 1.005];

	const newWheelIndex = currentWheelIndex - speed;
	const result = getRouletteWheelNumber(newWheelIndex);
	const resultColor = getRouletteWheelColor(newWheelIndex);
	(() => {
		const newRotaion = currentWheelRotation + (360 / 37) * speed;
		console.log(getRouletteWheelNumber(currentWheelIndex), "---> ", result);
		var myAnimation = anime({
			targets: [".layer-2", ".layer-4"],
			rotate: function () {
				return newRotaion;
			},
			duration: function () {
				return 5000;
			},
			loop: 1,
			// easing: "cubicBezier(0.010, 0.990, 0.855, 1.010)",
			easing: `cubicBezier(${bezier.join(",")})`,
			// easing: "cubicBezier(0.000, 1.175, 0.980, 0.990)",
			complete: (...args) => {
				currentWheelRotation = newRotaion;
				currentWheelIndex = newWheelIndex;
			},
		});
	})();

	(() => {
		const newRotaion = -4 * 360 + currentBallRotation;
		console.log("newRotaion", newRotaion);
		var myAnimation1 = anime({
			targets: ".ball-container",
			translateY: [
				{ value: 0, duration: 2000 },
				{ value: 20, duration: 1000 },
				{ value: 25, duration: 900 },
				{ value: 50, duration: 1000 },
			],
			rotate: [{ value: newRotaion, duration: 4000 }],
			duration: function () {
				return 4000; // anime.random(800, 1400);
			},
			loop: 1,
			easing: `cubicBezier(${bezier.join(",")})`,
			complete: () => {
				currentBallRotation = newRotaion;
				// writeResult(result, resultColor);
				isRotating = false;
			},
		});
	})();
}

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

function isInBoundaryEl(el, x, y) {
	const o = offsetEl(el);
	return (
		x >= o.left &&
		x <= o.left + o.width &&
		y >= o.top &&
		y <= o.top + o.height
	);
}

function isInRadiusEl(el, x, y) {
	const o = offsetEl(el);
	const cx = o.left + o.width / 2;
	const cy = o.top + o.height / 2;
	const dx = x - cx;
	const dy = y - cy;
	const r = o.width / 2;
	return Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(r, 2);
}

const tryRotate = ([p0, p1]) => {
	if (window !== "undefined") {
		const w = document?.querySelector(".layer-2.wheel");
		if (isInRadiusEl(w, p0.x, p0.y)) {
			const d = Math.round(
				Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2)) /
					4
			);
			if (Math.abs(d) > 3) {
				window.startRotation(d);
			}
		}
	}
};

const Roulette = () => {
	useEffect(() => {
		const documentEvent = (eventName) =>
			pipe(
				fromEvent(eventName),
				map((e) =>
					e.type == "touchstart" || e.type == "touchmove"
						? { x: e.touches[0].clientX, y: e.touches[0].clientY }
						: { x: e.clientX, y: e.clientY }
				)
			);
		zip(documentEvent("mousedown"))(documentEvent("mouseup")).subscribe({
			next: tryRotate,
		});

		zip(documentEvent("touchstart"))(
			pipe(
				withLatestFrom(documentEvent("touchmove"))(
					fromEvent("touchend")
				),
				map(([_, r]) => r)
			)
		).subscribe({
			next: tryRotate,
		});

		pipe(
			withLatestFrom(documentEvent("touchmove"))(fromEvent("touchend")),
			map(([_, r]) => r)
		).subscribe({
			next: (e) => console.log(e),
		});

		document.querySelector(".roulette-wheel").addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
			},
			{ passive: false }
		);

		window.anime = anime;
		window.rouletteWheelNumbers = rouletteWheelNumbers;
		window.startRotation = startRotation;
	}, []);

	return (
		<div className="pt-12 px-12  flex h-screen" id="app">
			<div>

			<h1 className="text-4xl font-bold text-center">Roulette</h1>
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
			<div className="result" />
			</div>

			<TableLayout />
		</div>
	);
};

export default Roulette;
