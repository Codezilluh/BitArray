# BitArray

An easy-to-use ArrayBuffer-like concept for storing indivdual bits.

## Purpose

The purpose of this package is to make data optimization easier. Why store a value as 8 bits when you only need 5? Although this package still stores data into bytes, you can easily pack those bytes however you want.

## Installation

You can install the package with npm

```
npm i @codezilluh/bitarray.js
```

## Usage

You can store values as integers, unsigned integers, and bits. You can set a scale for the value you wish to store. The scale determines the range of possible values. A scale of 8 for a uint (uint-8) can store any number from 0 to 255. More info on ranges later.

To encode (store) data:

```js
// Create a new BitArray
const array = new BitArray();

// Add a uInt to the BitArray
// 223 is the uInt to store
// 8 is the amount of bits (this example is of a uint-8)
array.addUint(223, 8);

// You could also specify where you want to store the uInt
// 0 is the position in bits
array.setUint(223, 8, 0);

// Regular integers can also be added
// -45 is the integer to store
// 7 is the amount of bits (this could be called an int-7)
array.addInt(-45, 7);

// Bits (booleans) may be stored
array.addBit(true);

// Encode the BitArray into an ArrayBuffer
array.encode();
```

To decode (read) data:

```js
// There are three options (differing only in style)
const array = decodeBitArray(buffer);
// OR
const array = new BitArray(buffer);
// OR
const array = existingBitArray.decode(buffer);

// You can read a uInt with an optional position
// 8 is the scale (this is a uint-8)
// 0 is the position (in bits)
array.getUint(8, 0);

// You read ints the same way
// 7 is the scale
// Notice the position is optional for reading in order
array.getInt(7);

// Bits are the same
// Think of this example as "get next bit"
array.getBit();
```

## Ranges

As mentioned, you can store data with a custom scale. There is no official limit to the scale, however doing anything larger than 64-bit seems impractical and is not what this package is meant for.

These are the general formulas for finding the range of a particular scale:

```
Formula for uInts with scale of n:
    min: 0,
    max: (2^n) - 1

Formula for ints with scale of n:
    min: -(2^(n-1))
    max: (2^(n-1)) - 1
```

I have built functions into this package to output ranges:

```js
// This is what would be outputted for the 8-bit number scale
// [MIN, MAX]
scaleRangeInt(8); // [-128, 127]
scaleRangeUint(8); // [0, 255]
```

## Conclusion

I hope you find this easy-to-use. I will be using this mostly for optimizing real-time communication, but it could also be used to optimize database or data storage in general.
