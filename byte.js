//// byte.js - because the ArrayBuffer API sucks
//
// MIT License
// 
// Copyright (c) 2023 David J Goehrig
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rig:hts
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

function bytes(b) {
	return (new TextEncoder()).encode(b)
}

function i8(i) {
	var b = new Int8Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function u8(i) {
	var b = new Uint8Array(1)
	b[0] = i
	return b
}

function i16(i) {
	var b = new Int16Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function u16(i) {
	var b = new Uint16Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function i32(i) {
	var b = new Int32Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function u32(i) {
	var b = new Uint32Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function i64(i) {
	var b = new BigInt64Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function u64(i) {
	var b = new BigUint64Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))

}

function f32(f) {
	var b = new Float32Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function f64(f) {
	var b = new Float64Array(1)
	b[0] = i
	return (new Uint8Array(b.buffer))
}

function binary() {
	var args = [...arguments]
	var l = args.reduce( (a,b) => { return a + b.length }, 0)
	console.log(l)
	var b = new Uint8Array(l)
	var o = 0
	for (var i = 0; i < args.length; ++i) {
		console.log(args[i])
		b.set(args[i],o)
		o += args[i].length
	}
	return b
}

function asByte(b,o) {
	return String.fromCharCode(b[o])
}

function asBytes(b,o,l) {
	return (new TextDecoder).decode(b.slice(o,o+l).buffer)
}

function asI8(b,o) {
	var c = new Int8Array(1)
	c[0] = b[o]
	return c[0]
}

function asU8(b,o) {
	return b[o]
}

function asI16(b,o) {
	return (new Int16Array(b.slice(o,o+2).buffer))[0]
}

function asU16(b,o) {
	return (new Uint16Array(b.slice(o,o+2).buffer))[0]
}

function asI32(b,o) {
	return (new Int32Array(b.slice(o,o+4).buffer))[0]
}

function asU32(b,o) {
	return (new Uint32Array(b.slice(o,o+4).buffer))[0]
}

function asI64(b,o) {
	return (new Int64Array(b.slice(o,o+8).buffer))[0]
}

function asU64(b,o) {
	return (new Uint64Array(b.slice(o,o+8).buffer))[0]
}

function asF32(b,o) {
	return (new Float32Array(b.slice(o,o+4).buffer))[0]
}

function asF64(b,o) {
	return (new Float64Array(b.slice(o,o+4).buffer))[0]
}


module.exports = { bytes, binary, i8, u8, i16, u16, i32, u32, i64, u64, f32, f64, asByte, asBytes, asI8, asU8, asI16, asU16, asI32, asU32, asI64, asU64, asF32, asF64 }
