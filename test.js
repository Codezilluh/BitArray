import { BitArray } from "./index.js";

let arr = new BitArray();

try {
	arr.addUint(15, 4); // Store 15 in 4 bits
	arr.addUint(7, 3); // Store 7 in 3 bits
	arr.addUint(1655582715750, 45); // Store a number with >32 bits

	arr.addInt(-35, 8); // Store -35 in 8 bits
	arr.addInt(255, 9); // Store 255 in 9 bits

	arr.addBit(false); // Store false as a bit
} catch (e) {
	console.log("Failed adding to the BitArray");
}

let out;

try {
	out = arr.encode();
} catch (e) {
	console.log("Failed encoding the BitArray");
}

try {
	arr.decode(out);
} catch (e) {
	console.log("Failed decoding the BitArray");
}

try {
	let four = arr.getUint(4);
	let three = arr.getUint(3);
	let large = arr.getUint(45);

	console.log(four, three, large);

	let int8 = arr.getInt(8);
	let int9 = arr.getInt(9);

	console.log(int8, int9);

	let f = !!arr.getBit();

	console.log(f);
} catch (e) {
	console.log("Failed reading from the BitArray");
}
