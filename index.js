export class BitArray {
	constructor(buf) {
		if (buf) {
			this.decode(buf);
		} else {
			this.#reset();
		}
	}

	#reset() {
		this._bitArray = [];
		this._byteArray = [];
		this._curPos = 0;
	}

	#getStringBin(value, scale) {
		let bin = value.toString(2);
		let out = bin;

		for (var i = 0; i < scale - bin.length; i++) {
			out = "0" + out;
		}

		return out;
	}

	#getBitInPos(value, scale, position, bin) {
		if (scale > 32) {
			if (!bin) bin = this.#getStringBin(value, scale);

			return !!(bin[scale - 1 - position] >>> 0);
		} else {
			return !!((value >>> position) & 1);
		}
	}

	/**
	 * Write an individual bit to the BitArray
	 * @param {number} value The status of the bit (true/false, on/off, etc.)
	 * @param {number} position The location of the bit in the BitArray
	 */
	setBit(value, position) {
		this._bitArray[position] = !!value;
	}

	/**
	 * Write an unsigned integer to the BitArrays
	 * @param {number} value The uInt to add into the BitArray
	 * @param {number} scale The size of the uInt (8 for uint8)
	 * @param {number} position The position of the uInt
	 */
	setUint(value, scale, position) {
		let bin;
		if (scale > 32) {
			bin = this.#getStringBin(value, scale);
		}

		for (var i = 0; i < scale; i++) {
			this.setBit(this.#getBitInPos(value, scale, i, bin), position + i);
		}
	}

	/**
	 * Write a signed integer to the BitArrays
	 * @param {number} value The int to add into the BitArray
	 * @param {number} scale The size of the int (8 for int8)
	 * @param {number} position The position of the int
	 */
	setInt(value, scale, position) {
		this.setBit(value < 0, position);
		this.setUint(Math.abs(value + (value < 0 ? 1 : 0)), scale - 1, position + 1);
	}

	/**
	 * Fetch an individual bit from the BitArray
	 * @param {number} position The position of the bit in the BitArray
	 * @returns {number} 1 or 0
	 */
	getBit(position) {
		let pos = position || this._curPos;

		return this._bitArray[pos] ? 1 : 0;
	}

	/**
	 * Fetch an unsigned integer from the BitArray
	 * @param {number} scale The scale of the uInt (8 for uint8)
	 * @param {number} position The position in the BitArray to retrieve from
	 * @returns {number} The uInt
	 */
	getUint(scale, position) {
		let bin = "";

		if (!position) position = this._curPos;

		this._curPos = position;

		for (var i = scale - 1; i >= 0; i--, this._curPos++) {
			bin += this.getBit(position + i);
		}

		return parseInt(bin, 2);
	}

	/**
	 * Fetch a signed integer from the BitArray
	 * @param {number} scale The scale of the int (8 for int8)
	 * @param {number} position The position in the BitArray to retrieve from
	 * @returns {number} The int
	 */
	getInt(scale, position) {
		if (!position) position = this._curPos;

		this._curPos = position;

		let sign = 1 - 2 * this.getBit(position);

		this._curPos++;

		return this.getUint(scale - 1, position + 1) * sign + (sign < 0 ? -1 : 0);
	}

	/**
	 * Appends an individual bit to the BitArray
	 * @param {boolean} value The status of the bit (on/off, true/false, etc.)
	 */
	addBit(value) {
		this.setBit(value, this.bitLength);
	}

	/**
	 * Appends an unsigned integer to the BitArray
	 * @param {number} value The uInt to add
	 * @param {number} scale The size of the uInt (8 for uint8)
	 */
	addUint(value, scale) {
		this.setUint(value, scale, this.bitLength);
	}

	/**
	 * Appends a signed integer to the BitArray
	 * @param {number} value The int to add
	 * @param {number} scale The size of the int (8 for int8)
	 */
	addInt(value, scale) {
		this.setInt(value, scale, this.bitLength);
	}

	/**
	 * Decodes the BitArray from an ArrayBuffer
	 * @param {ArrayBuffer} buf The ArrayBuffer outputted by "encode"
	 * @returns The BitArray instance
	 */
	decode(buf) {
		this.#reset();

		let dat = new DataView(buf);

		for (var i = 0; i < dat.byteLength; i++) {
			this._byteArray.push(dat.getUint8(i));

			let int = this._byteArray[i] >>> 0;

			for (let h = 0; h < 8; h++) {
				this.addBit(this.#getBitInPos(int, 8, h));
			}
		}

		return this;
	}

	/**
	 * Encodes the BitArray into a JavaScript ArrayBuffer
	 * @returns an ArrayBuffer
	 */
	encode() {
		let bin = [...this._bitArray];
		let len = Math.ceil(this.bitLength / 8) * 8;
		let buf = new ArrayBuffer(len / 8);
		let dat = new DataView(buf);

		for (var i = 0; i < len - this.bitLength; i++) {
			bin.push(false);
		}

		for (var i = 0; i < len / 8; i++) {
			let int = 0;

			for (var h = 0; h < 8; h++) {
				if (bin[i * 8 + h]) {
					int |= 1 << h % 8;
				} else {
					int &= ~(1 << h % 8);
				}
			}

			dat.setUint8(i, int);
		}

		return buf;
	}

	get bitLength() {
		return this._bitArray.length;
	}
}

export const decodeBitArray = (buf) => {
	let arr = new BitArray(buf);

	return arr;
};

export const scaleRangeUint = (scale) => {
	return [0, Math.pow(2, scale) - 1];
};

export const scaleRangeInt = (scale) => {
	return [-Math.pow(2, scale - 1), Math.pow(2, scale - 1) - 1];
};
