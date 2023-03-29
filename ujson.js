// ujson.js
//
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

function tag_integer(x) {
	if (x >= -128 && x < 128) return byte.binary( byte.bytes('c'), byte.i8(x))
	if (x >= 0 && x < 256) return byte.binary( byte.bytes('C'), byte.u8(x))
	if (x >= -32768 && x < 32768) return byte.binary( byte.bytes('w'), byte.i16(x))
	if (x >= 0 && x < 65536) return byte.binary( byte.bytes('W'), byte.u16(x))
	if (x >= -2147483678 && x < 2147483648) return byte.binary(byte.bytes('i'), byte.i32(x))
	if (x >= 0 && x < 429497296 ) return byte.binary(byte.bytes('I'), byte.u32(x))
	if (x < 0) return byte.binary(byte.bytes('q'), byte.i64(x))
	return byte.binary(byte.bytes('Q'),byte.u64(x))
}

function tag_float(x) {
	if (x < -1.0e8) return byte.binary(byte.bytes('D'), byte.f64(x))
	if (x > 1.0e8) return byte.binary(byte.bytes('D'), byte.f64(x))
	return byte.binary(byte.bytes('d'), byte.f32(x))
}

function tag_string(x) {
	return byte.binary(byte.u16(x.length), byte.bytes(x))
}

function tag_array(x) {
	return byte.binary(byte.bytes('a'), byte.u16(x.length), ...x.map( (e) => { return tag(e) }))
}

function tag_object(x) {
	var ks = Object.keys(x)
	return byte.binary(byte.bytes('o'), byte.u16(ks.length), byte.binary(...ks.map( (k) => {
		return byte.binary( byte.u16(k.length), byte.bytes(k), tag(x[k])) })))
}

function tag(x) {
	switch(typeof(x)) {
		case undefined:
			return byte.bytes('n')
		case 'boolean':
			if (x) return byte.bytes('t')
			return byte.bytes('f')
		case 'number':
			if (Number.isInteger(x)) return tag_integer(x)
			return tag_float(x)
		case 'string':
			return tag_string(x)
		case 'object':
			if (x === null) return byte.bytes('n')
			if (Array.isArray(x)) return tag_array(x)
			return tag_object(x)
		default:
			console.log("unknown type... don't do functions")
	}
} 


function encode() {
	var args = [...arguments]
	return byte.binary(...args.map( (x) => tag(x) ))
}

function decode() {
	console.log("TODO implement me")
}


module.exports = { encode, decode }
