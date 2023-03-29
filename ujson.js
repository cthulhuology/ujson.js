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
	var str = byte.bytes(x)
	return byte.binary(byte.bytes('s'), byte.u16(str.length), str)
}

function tag_array(x) {
	var arr = byte.binary( ...x.map( (e) => { return tag(e) }) )
	return byte.binary(byte.bytes('a'), byte.u16(arr.length), arr)
}

function tag_blob(x) {
	return byte.binary(byte.bytes('b'), byte.u32(x.length), x)
}

function tag_object(x) {
	var ks = Object.keys(x)
	var obj = byte.binary(...ks.map( (k) => { 
		return byte.binary( byte.u16(k.length), byte.bytes(k), tag(x[k])) 
	}))
	return byte.binary(byte.bytes('o'), byte.u16(obj.length), obj)
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
			if (x instanceof Uint8Array) return tag_blob(x)
			return tag_object(x)
		default:
			console.log("unknown type... don't do functions")
	}
}

function detag_array(b,o,l) {
	var arr = []
	for (var i = o; i < o+l; ) {
		var x = detag(b,i)
		console.log(x)
		arr.push(x[0])
		i = x[1]
	}
	console.log(arr)
	return [ arr, o+l ]
}

function detag_object(b,o,l) {
	var obj = {}
	for (var i = o; i < o+l;) {
		var kl = byte.asU16(b,i)
		var k = byte.asBytes(b,i+2,kl)
		var v = detag(b,i+2+kl)
		obj[k] = v[0]
		i = v[1]
	}
	return [ obj, o+l ]
}

function detag(b,o) {
	switch(byte.asByte(b,o)) {
		case 'n':
			return [ nil, o + 1 ]
		case 't':
			return [ true, o + 1 ]
		case 'f':
			return [ false, o + 1 ]
		case 'c':
			return [ byte.asI8(b,o+1), o + 2 ]
		case 'C':
			return [ byte.asU8(b,o+1), o + 2 ]
		case 'w':
			return [ byte.asI16(b,o+1), o + 3 ]
		case 'W':
			return [ byte.asU16(b,o+1), o + 3 ]
		case 'i':
			return [ byte.asI32(b,o+1), o + 5 ]
		case 'I':
			return [ byte.asU32(b,o+1), o + 5 ]
		case 'q':
			return [ byte.asI64(b,o+1), o + 9 ]
		case 'Q':
			return [ byte.asU64(b,o+1), o + 9 ]
		case 'd':
			return [ byte.asF32(b,o+1), o + 5 ]
		case 'D':
			return [ byte.asF64(b,o+1), o + 9 ]
		case 's':
			var l = byte.asU16(b,o+1)
			return [ byte.asBytes(b,o+3,l), o + 3 + l ]
		case 'b':
			var l = byte.asU32(b,o+1)
			return [ b.slice(o+5,o+5+l), o + 5 + l ]
		case 'a':
			var l = byte.asU16(b,o+1)
			return detag_array(b,o+3,l)
		case 'o':
			var l = byte.asU16(b,o+1)
			return detag_object(b,o+3,l)
		default:
			console.log('unknown encoding')
	}
}

function encode() {
	var args = [...arguments]
	return byte.binary(...args.map( (x) => tag(x) ))
}

function decode(b) {
	var l = b.length
	var acc = []
	for (var i = 0; i < l; ) {
		var v = detag(b,i)
		acc.push(v[0])	
		i = v[1]
	}
	return acc
}

module.exports = { encode, decode }
