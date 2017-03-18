import {animate} from "liquid-fire";

export default function scale (opts = {}) {
	let transition = this;
	return animate(transition.oldElement, {scale: [0.9, 1]}, opts).then(() => {
		return animate(transition.newElement, {scale: [1, 0.9]}, opts);
	});
}
