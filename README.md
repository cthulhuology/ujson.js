ujson.js - a ujson implementation in javascript
-----------------------------------------------

This repo contains two files:

* byte.js
* ujson.js

The byte.js provides a more convient way of dealing with binary data
in javascript.  The ujson.js uses byte.js to encode / decode ujson
encoded messages.

The main reference for ujson is https://github.com/cthulhuology/ujson

This module has two functions ujson.encode and ujson.decode.  Encode
takes multiple arguments and returns a Uint8Array buffer with encoded
in the dynamic ujson encoding format.  It supports all of the typical
types and tries to use the smallest type appropriate for the data. If
multiple objects or values are passed, the encoded values will all be
concatenated together.

The decode function takes a Uint8Array and will return an array of all
of the decoded values.  So for example, if the buffer contains multiple
messages, each message will be parsed and returned as a separate array
element.  This makes it easier to handle cases where multiple messages
are receieved in a single frame.


MIT License

Copyright (c) 2023 David J Goehrig

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
