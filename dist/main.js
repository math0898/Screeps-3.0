'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
var encode$1 = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
var decode$1 = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

var base64 = {
	encode: encode$1,
	decode: decode$1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
var encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
var decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var base64Vlq = {
	encode: encode,
	decode: decode
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var util = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port;
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 === null) {
    return 1; // aStr2 !== null
  }

  if (aStr2 === null) {
    return -1; // aStr1 !== null
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

/**
 * Strip any JSON XSSI avoidance prefix from the string (as documented
 * in the source maps specification), and then parse the string as
 * JSON.
 */
function parseSourceMapInput(str) {
  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
}
exports.parseSourceMapInput = parseSourceMapInput;

/**
 * Compute the URL of a source given the the source root, the source's
 * URL, and the source map's URL.
 */
function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
  sourceURL = sourceURL || '';

  if (sourceRoot) {
    // This follows what Chrome does.
    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
      sourceRoot += '/';
    }
    // The spec says:
    //   Line 4: An optional source root, useful for relocating source
    //   files on a server or removing repeated values in the
    //   “sources” entry.  This value is prepended to the individual
    //   entries in the “source” field.
    sourceURL = sourceRoot + sourceURL;
  }

  // Historically, SourceMapConsumer did not take the sourceMapURL as
  // a parameter.  This mode is still somewhat supported, which is why
  // this code block is conditional.  However, it's preferable to pass
  // the source map URL to SourceMapConsumer, so that this function
  // can implement the source URL resolution algorithm as outlined in
  // the spec.  This block is basically the equivalent of:
  //    new URL(sourceURL, sourceMapURL).toString()
  // ... except it avoids using URL, which wasn't available in the
  // older releases of node still supported by this library.
  //
  // The spec says:
  //   If the sources are not absolute URLs after prepending of the
  //   “sourceRoot”, the sources are resolved relative to the
  //   SourceMap (like resolving script src in a html document).
  if (sourceMapURL) {
    var parsed = urlParse(sourceMapURL);
    if (!parsed) {
      throw new Error("sourceMapURL could not be parsed");
    }
    if (parsed.path) {
      // Strip the last path component, but keep the "/".
      var index = parsed.path.lastIndexOf('/');
      if (index >= 0) {
        parsed.path = parsed.path.substring(0, index + 1);
      }
    }
    sourceURL = join(urlGenerate(parsed), sourceURL);
  }

  return normalize(sourceURL);
}
exports.computeSourceURL = computeSourceURL;
});
util.getArg;
util.urlParse;
util.urlGenerate;
util.normalize;
util.join;
util.isAbsolute;
util.relative;
util.toSetString;
util.fromSetString;
util.compareByOriginalPositions;
util.compareByGeneratedPositionsDeflated;
util.compareByGeneratedPositionsInflated;
util.parseSourceMapInput;
util.computeSourceURL;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */


var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet$1() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet$1.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet$1();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet$1.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet$1.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet$1.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet$1.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet$1.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet$1.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

var ArraySet_1 = ArraySet$1;

var arraySet = {
	ArraySet: ArraySet_1
};

var binarySearch = createCommonjsModule(function (module, exports) {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};
});
binarySearch.GREATEST_LOWER_BOUND;
binarySearch.LEAST_UPPER_BOUND;
binarySearch.search;

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
var quickSort_1 = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

var quickSort$1 = {
	quickSort: quickSort_1
};

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */



var ArraySet = arraySet.ArraySet;

var quickSort = quickSort$1.quickSort;

function SourceMapConsumer$1(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer$1.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer$1.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer$1.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer$1.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer$1.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer$1.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer$1.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer$1.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer$1.GENERATED_ORDER = 1;
SourceMapConsumer$1.ORIGINAL_ORDER = 2;

SourceMapConsumer$1.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer$1.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer$1.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer$1.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer$1.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer$1.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer$1.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

var SourceMapConsumer_1 = SourceMapConsumer$1;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer$1.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer$1;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64Vlq.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer$1.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer$1.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

var BasicSourceMapConsumer_1 = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util.parseSourceMapInput(aSourceMap);
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer$1(util.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer$1.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer$1;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

var IndexedSourceMapConsumer_1 = IndexedSourceMapConsumer;

var sourceMapConsumer = {
	SourceMapConsumer: SourceMapConsumer_1,
	BasicSourceMapConsumer: BasicSourceMapConsumer_1,
	IndexedSourceMapConsumer: IndexedSourceMapConsumer_1
};

var SourceMapConsumer = sourceMapConsumer.SourceMapConsumer;

class ErrorMapper {
    static get consumer() {
        if (this._consumer == null) {
            this._consumer = new SourceMapConsumer(require("main.js.map"));
        }
        return this._consumer;
    }
    /**
     * Generates a stack trace using a source map generate original symbol names.
     *
     * WARNING - EXTREMELY high CPU cost for first call after reset - >30 CPU! Use sparingly!
     * (Consecutive calls after a reset are more reasonable, ~0.1 CPU/ea)
     *
     * @param {Error | string} error The error or original stack trace
     * @returns {string} The source-mapped stack trace
     */
    static sourceMappedStackTrace(error) {
        const stack = error instanceof Error ? error.stack : error;
        if (Object.prototype.hasOwnProperty.call(this.cache, stack)) {
            return this.cache[stack];
        }
        // eslint-disable-next-line no-useless-escape
        const re = /^\s+at\s+(.+?\s+)?\(?([0-z._\-\\\/]+):(\d+):(\d+)\)?$/gm;
        let match;
        let outStack = error.toString();
        while ((match = re.exec(stack))) {
            if (match[2] === "main") {
                const pos = this.consumer.originalPositionFor({
                    column: parseInt(match[4], 10),
                    line: parseInt(match[3], 10)
                });
                if (pos.line != null) {
                    if (pos.name) {
                        outStack += `\n    at ${pos.name} (${pos.source}:${pos.line}:${pos.column})`;
                    }
                    else {
                        if (match[1]) {
                            // no original source file name known - use file name from given trace
                            outStack += `\n    at ${match[1]} (${pos.source}:${pos.line}:${pos.column})`;
                        }
                        else {
                            // no original source file name known or in given trace - omit name
                            outStack += `\n    at ${pos.source}:${pos.line}:${pos.column}`;
                        }
                    }
                }
                else {
                    // no known position
                    break;
                }
            }
            else {
                // no more parseable lines
                break;
            }
        }
        this.cache[stack] = outStack;
        return outStack;
    }
    static wrapLoop(loop) {
        return () => {
            try {
                loop();
            }
            catch (e) {
                if (e instanceof Error) {
                    if ("sim" in Game.rooms) {
                        const message = `Source maps don't work in the simulator - displaying original error`;
                        console.log(`<span style='color:red'>${message}<br>${_.escape(e.stack)}</span>`);
                    }
                    else {
                        console.log(`<span style='color:red'>${_.escape(this.sourceMappedStackTrace(e))}</span>`);
                    }
                }
                else {
                    // can't handle it
                    throw e;
                }
            }
        };
    }
}
// Cache previously mapped traces to improve performance
ErrorMapper.cache = {};

/**
 * This enum cotains a couple number threasholds which are used later in this
 * file and in main.ts to determine how urgent a task may be. High number means
 * more urgency.
 */
var priority;
(function (priority) {
    priority[priority["HIGH"] = 100] = "HIGH";
    priority[priority["MEDIUM"] = 50] = "MEDIUM";
    priority[priority["LOW"] = 25] = "LOW";
    priority[priority["NONE"] = 0] = "NONE";
})(priority || (priority = {}));
/**
 * The Request class defines what a request looks like when it's sent from
 * somewhere other than main.ts. With the exception of main.ts every added to
 * the queue will be a version of the Request class at some point.
 */
class Request {
    /**
     * This describes the basic construction of a priority. Similar to the Request
     * class its fairly basic and just requires the setting of local counterparts.
     * Runtime: O(2)
     * @param t The described in the request
     * @param p The prioirty the task should be run at
     */
    constructor(t, p) { this.task = t; this.prio = p; } //O(2)
    /**
     * getTask() returns the task in the Request object.
     * Runtime: O(1)
     */
    getTask() { return this.task; } //O(1)
    /**
     * The getPrio method returns the priority of the Request object.
     * Runtime: O(1)
     */
    getPrio() { return this.prio; } //O(1)
}
/**
 * This class, Queue implements a queue object which contains a list of tasks
 * to be run in reverse order on the priority level. For example if you add a, b
 * and c at priority HIGH once the queue starts the HIGH prioity it will resolve
 * in, c -> b -> a, assuming there's sufficent cpu remaining.
 */
class Queue {
    constructor() {
        /**
         * highTasks contains an array of tasks objects which are assumed to have a
         * priority of HIGH. Tasks with a HIGH priority are run without consideration
         * for cpu usage.
         */
        this.highTasks = [];
        /**
         * The mediumTasks array contains an array of tasks objects which are assumed
         * to have a priority of MEDIUM. Tasks are often run quickly with some
         * consideration for CPU usage.
         */
        this.mediumTasks = [];
        /**
         * This variable, lowTasks contains an array of task objects which are assumed
         * to have a priority of LOW. These tasks are run when they do not pose much
         * risk to going over on CPU.
         */
        this.lowTasks = [];
        /**
         * tasks contains an array of tasks objects which are assumed to have no
         * priority. A few examples of tasks which may end up here include various
         * screen drawing functions and console logging. Tasks at this level do not
         * run if they have the potential to go over on CPU.
         */
        this.tasks = [];
    }
    /**
     * The printQueue method prints all the items in the queue to the console in a
     * hopefully human readable format.
     * Runtime: O(9 + 5h + 5m + 5l + 5t) or O(9 + 5n) where n is the number of
     * tasks in all arrays
     */
    printQueue() {
        //Nice header
        console.log("---- Queue: ----"); //O(1)
        //Print a sub header
        console.log(priority.HIGH + ": "); //O(2)
        //Iterate through the list and print
        for (var j = 0; j < this.highTasks.length; j++)
            console.log("    " + this.highTasks[j].getName()); //O(3 + 5h)
        //Print a sub header
        console.log(priority.MEDIUM + ": "); //O(4 + 5h)
        //Iterate through the list and print
        for (var j = 0; j < this.mediumTasks.length; j++)
            console.log("    " + this.mediumTasks[j].getName()); //O(5 + 5h + 5m)
        //Print a sub header
        console.log(priority.LOW + ": "); //O(6 + 5h + 5m)
        //Iterate through the list and print
        for (var j = 0; j < this.lowTasks.length; j++)
            console.log("    " + this.lowTasks[j].getName()); //O(7 + 5h + 5m + 5l)
        //Print a sub header
        console.log(priority.NONE + ": "); //O(8 + 5h + 5m + 5l)
        //Iterate through the list and print
        for (var j = 0; j < this.tasks.length; j++)
            console.log("    " + this.tasks[j].getName()); //O(9 + 5h + 5m + 5l + 5t)
    }
    /**
     * This method runQueue runs the queue object with all of the given tasks. It
     * checks cpu before every task is run if it has reached a total cpu usage of
     * 50% before then but skips the check if bellow. Without considering that the
     * runtime of this method can vary wildly in runtime depending on the tasks
     * that are in the queue. As such I have opted not to give this method a
     * formal runtime analysis and most optimizations should be done in the tasks
     * themselves or in the free reign threashold which is currently 50%.
     */
    runQueue() {
        var _a, _b, _c, _d, _e, _f, _g;
        //Run all of the high tasks regardless of cpu
        while (this.highTasks.length > 0)
            (_a = this.highTasks.pop()) === null || _a === void 0 ? void 0 : _a.run();
        //Run all of the medium tasks if we're bellow 50% usage
        if (Game.cpu.getUsed() < Game.cpu.limit * 0.5)
            while (this.mediumTasks.length > 0)
                (_b = this.mediumTasks.pop()) === null || _b === void 0 ? void 0 : _b.run();
        //Run medium tasks until within 98% if we're above 50% usage
        else
            while (this.mediumTasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.98)
                (_c = this.mediumTasks.pop()) === null || _c === void 0 ? void 0 : _c.run();
        //Run all of the low tasks if we're bellow 50% usage
        if (Game.cpu.getUsed() < Game.cpu.limit * 0.5)
            while (this.lowTasks.length > 0)
                (_d = this.lowTasks.pop()) === null || _d === void 0 ? void 0 : _d.run();
        //Run low tasks until within 95% if we're above 50% usage
        else
            while (this.lowTasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.95)
                (_e = this.lowTasks.pop()) === null || _e === void 0 ? void 0 : _e.run();
        //Run all no prioirty tasks if we're bellow 50% usage
        if (Game.cpu.getUsed() < Game.cpu.limit * 0.5)
            while (this.tasks.length > 0)
                (_f = this.tasks.pop()) === null || _f === void 0 ? void 0 : _f.run();
        //Run no priority tasks until we're within 10% of cap
        else
            while (this.tasks.length > 0 && Game.cpu.getUsed() < Game.cpu.limit * 0.90)
                (_g = this.tasks.pop()) === null || _g === void 0 ? void 0 : _g.run();
    }
    /**
     * queueAdd adds an item to the queue immediatly, defaulting to a priority of
     * zero, unless one is provided.
     * Runtime: O(3)
     * @param t The task to be added to the queue
     * @param p the priority for the item to be added, defaults to no priority
     */
    queueAdd(t, p = priority.NONE) {
        //Check the priority this should be added at
        switch (p) { //O(1)
            //We're adding the item to the highTasks
            case priority.HIGH:
                this.highTasks.push(t);
                break; //O(3)
            //We're adding the item to the mediumTasks
            case priority.MEDIUM:
                this.mediumTasks.push(t);
                break; //O(3)
            //We're adding the item to the lowTasks
            case priority.LOW:
                this.lowTasks.push(t);
                break; //O(3)
            //We're adding the item to the tasks
            case priority.NONE:
                this.tasks.push(t);
                break; //O(3)
        }
    }
    /**
     * The request method works as a way for tasks to request other tasks to be
     * completed. Requests must be proccessed to a Queue object before they can
     * run.
     * Runtime: O(4)
     * @param t The task to be added to the requests array
     * @param p The priority for the request to be added, defaults to no priority
     */
    static request(t, p = priority.NONE) {
        //Make a quick request then push it to the array
        var request = new Request(t, p); //O(3)
        //Add it to the array to be proccessed later
        Queue.requests.push(request); //O(4)
    }
    /**
     * Proccesses all the requests that are in the requests array held on the
     * Queue static item. The object proccessRequests is called on will hold the
     * requests in its Queue.
     * Runtime: O(2 + 6n) where n is the length of the requests array
     */
    proccessRequests() {
        //Iterate through the requests and add them to the queue
        for (var i = 0; i < Queue.requests.length; i++)
            this.queueAdd(Queue.requests[i].getTask(), Queue.requests[i].getPrio()); //O(1 + 6n)
        //Clear the requests array
        Queue.requests = []; //O(2 + 6n)
    }
}
/**
 * By default requests are empty but requests can be added by other tasks and
 * classes which need something to be done. requests are static and not bound
 * to any particular Queue object but are removed once they've entered a
 * specific queue.
 */
Queue.requests = [];

/**
 * A simple class which implements getName() so I don't have to a hundred times
 * over lol xD
 */
class template {
    //Constructor
    constructor() {
        //Variables
        /**
         * A string varaible which stores the shorthand name for the task.
         */
        this.name = "Undefined";
    }
    //Accessor methods
    /**
     * Returns the name of the task
     */
    getName() { return this.name; }
}

/**
 * This file handles the definitions for the statsmamanger class. The stats class
 * handles tracking, logging, and printing of script preformence.
 */
class StatsManager {
    //Constructor
    /**
     * Runs setup for the StatsManager so it can run without issue.
     * Runtime: O(c) ---> Runs in constant time.
     */
    constructor() {
        //Initalize if we haven't
        if (StatsManager.getInitStatus() == false)
            StatsManager.init();
    }
    //Accessor methods
    static getInitStatus() {
        //Check the memory locations that need to be set if any are undefined we need to init
        //Check if we think we're initalized
        if (Memory.statsInit != true)
            return false;
        //Check the count of the amount of cpu used
        else if (Memory.cpuCount == undefined)
            return false;
        //Check the running average of cpu
        else if (Memory.cpuAverage == undefined)
            return false;
        //We must be all good then
        else
            return true;
    }
    //Real methods
    /**
     * This function initalizes the memory to take in stats.
     */
    static init() {
        //Set up the number of ticks we've collected data
        Memory.dataCollected = 0;
        //Set up the average cpu so far
        Memory.cpuAverage = 0;
        //Set up the peak cpu recorded
        Memory.cpuPeak = 0;
        //Set the fact we're initalized
        Memory.statsInit = true;
        //Set the tick we've started on
        Memory.startTick = Game.time;
    }
    /**
     * Prints the stats collected, these are stored in Memory.stats.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static print() {
        //Print a nice header
        console.log("---- Preformence Report ----");
        //The tick we begun collecting data on
        console.log("Tick Started on: " + Memory.startTick);
        //The tick we're on
        console.log("Tick Ended on: " + Game.time);
        //Data capture rate
        console.log("Data Captured on: " + (Memory.dataCollected - 1) + " / " + (Game.time - Memory.startTick) + " for a rate of " + Math.fround((Memory.dataCollected - 1) / (Game.time - Memory.startTick) * 100) + "%");
        //Print the average cpu used
        console.log("Average CPU Usage: " + Memory.cpuAverage);
        //Print the peak cpu used
        console.log("Peak CPU Usage: " + Memory.cpuPeak);
    }
    /**
     * Collects all the stats for cpu this tick.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static collectCpu() {
        //Temp
        var cpuUsed = Game.cpu.getUsed();
        //Read memory
        var count = Memory.dataCollected;
        var average = Memory.cpuAverage;
        var peak = Memory.cpuPeak;
        //Do the maths for the new average
        var newAverage = ((average * count) + cpuUsed) / (count + 1);
        //Set the new peak if current tick is higher
        if (peak < cpuUsed)
            Memory.cpuPeak = cpuUsed;
        //Write to memory and increment our count
        Memory.cpuAverage = newAverage;
    }
    /**
     * Collects the stats for the StatsManager.
     */
    static collectStats() {
        //Collect Cpu data.
        this.collectCpu();
        //Increment the fact we collected data
        Memory.dataCollected++;
    }
}
/**
 * The collect_Stats task collects all the stats for the given tick.
 * Runtime: O(c) ---> Runs in constant time
 */
class collect_Stats extends template {
    //Constructors
    constructor() {
        super();
        //Variables
        //The name of the task
        this.name = "Collect Stats";
    }
    //Real methods
    run() {
        //Collect the stats... its really just that easy.
        StatsManager.collectStats();
    }
}
/**
 * The print_Stats task prints all the stats collected so far from the stats
 * managers and prints it into the console.
 * Runtime O(c) ---> Runs in constant time
 */
class print_Stats extends template {
    //Constructors
    constructor() {
        super();
        //Variables
        //The name of the task
        this.name = "Print Stats";
    }
    //Real methods
    run() {
        //Print the stats... also really just that easy.
        StatsManager.print();
    }
}

/**
 * This file contains the definitions for the Room class which defines a room,
 * whether hostile or not and assigns it certain properties.
 * @Author Sugaku, math0898
 */
/**
 * This enum holds definitions for the states that a room can be in.
 */
var state;
(function (state) {
    state["ALLIED"] = "allied";
    state["CONTROLLED"] = "controlled";
    state["HOSTILE"] = "hostile";
    state["EXPAND"] = "expand";
    state["MINE"] = "mine";
    state["UNKOWN"] = "unkown";
})(state || (state = {}));
/**
 * The room class. Handles information about rooms.
 */
class struc_Room {
    //Constructors
    /**
     * Constructs a room when given a hash for Game.rooms.
     * Runtime: O(f) ---> find command used.
     */
    constructor(name) {
        var _a, _b;
        //Refrence which points to the room in the future
        this.roomRefrence = name;
        //The current state of the room.
        this.roomState = this.findRoomState(); //O(f) ---> find command used.
        //Short hand the room name so we don't need to type that out all the time.
        const r = Game.rooms[name];
        //Check if the controlled is defined, if so set the level to it.
        if (r.controller != undefined)
            this.roomLevel = r.controller.level;
        //Otherwise set level to -1, there is no controller.
        else
            this.roomLevel = -1;
        //The owner of the room... is possible to be undefined in which case :shrug:
        this.roomOwner = (_b = (_a = r.controller) === null || _a === void 0 ? void 0 : _a.owner) === null || _b === void 0 ? void 0 : _b.username;
        //Set the spawn arrays
        this.roomSpawns = Game.rooms[this.roomRefrence].find(FIND_MY_SPAWNS);
        //Reset the total creep count for the room
        this.creepCount = 0;
        //Count the number of creeps which have this room as a refrence
        for (let c in Game.creeps) {
            //Check if their memory has a refrence to the room and increment if it does
            if (Game.creeps[c].memory.room == this.roomRefrence && Game.creeps[c] != undefined)
                this.creepCount++;
        }
    }
    //Acessor methods
    /**
     * Returns the refrence to the room.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getRoomRefrence() { return this.roomRefrence; }
    /**
     * Returns the current state of the room.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getRoomState() { return this.roomState; }
    /**
     * Returns the current level of the room.
     * Runtime: O(c) ---> Runs in constant time.
     */
    getRoomLevel() { return this.roomLevel; }
    /**
     * Prints the stats about the room in a nice human readable format.
     * Runtime: O(c) ---> Runs in constant time.
     */
    print() {
        //Print a nice header
        console.log("---- Room[" + this.roomRefrence + "] ----");
        //Print the current state of the room
        console.log("Room State: " + this.roomState);
        //Print the level of the room
        console.log("Room Level: " + this.roomLevel);
        //Print the owner of the room
        console.log("Room Owner: " + this.roomOwner);
        //Print the main spawn
        console.log("Main Room Spawn: " + this.roomSpawns[0].name);
    }
    //Real methods
    /**
     * Returns the state of the room after finding it.
     * Runtime: O(f) ---> find command used.
     * @param r The room which's type is being checked. Defaults to this object.
     */
    findRoomState(r = this) {
        //Make this const so we can call methods fewer times.
        const room = Game.rooms[r.getRoomRefrence()];
        //If the controller is not undefined...
        if (room.controller != undefined) {
            //Check if we own the controller, and return we control the room if we do.
            if (room.controller.my)
                return state.CONTROLLED;
            //If the room has a defined owner, and its not mine, its probably hostile.
            else if (room.controller.owner != undefined)
                return state.HOSTILE; //todo: More logic here for allies.
            //The room is unclaimed.
            else {
                //Scan for sources
                var s = room.find(FIND_SOURCES); //O(f) --> find command used.
                //If there's one source it could make a mine.
                if (s.length == 1)
                    return state.MINE;
                //If there's two sources it could make a good expansion.
                else if (s.length == 2)
                    return state.EXPAND;
            }
        }
        //The state of the room is unknown.
        return state.UNKOWN;
    }
    /**
     * Updates the room information.
     * Runtime: O(f) ---> find command used.
     */
    updateRoom() {
        var _a;
        //Find the current room state and update it.
        this.roomState = this.findRoomState(); //O(f) ---> find command used.
        //Check if a controller is defined
        if (Game.rooms[this.roomRefrence].controller != undefined) {
            //Update the room level to the controller level
            this.roomLevel = (_a = Game.rooms[this.roomRefrence].controller) === null || _a === void 0 ? void 0 : _a.level;
            //If there's a controller there can be spawns
            //Reset the current spawns
            this.roomSpawns = [];
            //Find my spawns and set room spawns
            this.roomSpawns = Game.rooms[this.roomRefrence].find(FIND_MY_SPAWNS);
        }
        //Reset the total creep count for the room
        this.creepCount = 0;
        //Count the number of creeps which have this room as a refrence
        for (let c in Game.creeps) {
            //Check if their memory has a refrence to the room and increment if it does
            if (Game.creeps[c].memory.room == this.roomRefrence)
                this.creepCount++;
        }
    }
}
/**
 * The init_Rooms task which initializes all the rooms current visible in
 * Game.rooms. It is a fairly costly task and so shouldn't be run much.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
class init_Rooms extends template {
    //Constructors
    /**
     * Takes the room array where the intialized rooms should be placed. WARN! This
     * will overwrite any data currently here!
     * @param rooms The room array to store the data in.
     */
    constructor(rooms) {
        //Call super
        super();
        //Varaibles
        //The name of the task
        this.name = "Initalize Rooms";
        //Set localized counter part
        this.rooms = rooms;
    }
    //Real methods
    run() {
        //Reset rooms to a blank array
        this.rooms = [];
        //Setup a short hand for rooms
        for (let name in Game.rooms) {
            //Assign it because well this is kind of annoying
            var r = Game.rooms[name];
            //Now push the rooms into the array one by one
            this.rooms.push(new struc_Room(r.name));
        }
        return this.rooms;
    }
}
/**
 * The update_Rooms task updates all the rooms currently initalized in the given
 * array at construction.
 * Runtime: O(r * f) --> find is used at most once per room in Game.rooms
 */
class update_Rooms extends template {
    //Constructors
    /**
     * Makes an update_Rooms task.
     * @param rooms The room array to be updated.
     */
    constructor(rooms) {
        //Call super
        super();
        //Variables
        //The name of the task
        this.name = "Update Rooms";
        //Set localized counter part
        this.rooms = rooms;
    }
    //Real methods
    /**
     * Updates all the rooms in the current array. It does not add new rooms.
     * Runtime: O(r * f) ---> Uses the find command for each room.
     */
    run() {
        //Check if rooms is undefined
        if (this.rooms == undefined) {
            console.log("Could not update rooms");
            return;
        }
        //Iterate down the array and call update room.
        for (var i = 0; i < this.rooms.length; i++)
            this.rooms[i].updateRoom(); //O(r * f)
    }
}
/**
 * The print_Rooms task prints all the givens in the array given at construction.
 * Runtime: O(r) ---> a constant number of tasks is run for each room.
 */
class print_Rooms extends template {
    //constructors
    /**
     * Makes a print_Rooms task which prints the rooms in the given array.
     * @param rooms The room array to be printed.
     */
    constructor(rooms) {
        //Call super
        super();
        //Variables
        //The name of the task
        this.name = "Print Rooms";
        //Set localized counter part
        this.rooms = rooms;
    }
    //Real methods
    /**
     * Prints all the rooms in the given array to the console.
     * Runtime: O(r) ---> r is the number of rooms
     */
    run() {
        //Check if rooms is undefined
        if (this.rooms == undefined) {
            console.log("Could not print rooms");
            return;
        }
        //Iterate down the array and call each rooms print
        for (var i = 0; i < this.rooms.length; i++)
            this.rooms[i].print(); //O(r * c)
    }
}

/**
 * This boolean tells whether creeps should report what they are doing or not.
 */
/**
 * Should the debug messages be sent to everyone?
 */
var publicDebug = true;
/**
 * This is an abstract class which holds of lot of useful utility functions for
 * creep roles in general. This class includes an optimized movement method, and
 * short hands for common tasks such as mining and filling containers. Creep
 * roles should all extend this class and implement the interface bellow in this
 * file.
 */
class Creep_Prototype {
    constructor() {
        /**
         * This is the role string which holdes the name of the role being defined.
         * Since this is the abstract class it is empty, but all other classes which
         * extend this one should add an appropriate role string.
         */
        this.role = "";
    }
    /**
     * getRole retruns the role stored in the role string of the object.
     * Runtime: O(1)
     */
    getRole() {
        //This aint rocket science, return the role
        return this.role; //O(1)
    }
    /**
     * The compareRoomPos() function takes two room positions and compares them.
     * It returns true if and only if they are equal. If either are undefined the
     * function returns false.
     * Runtime: O(2) -> O(6)
     * @param a - The first room to compare
     * @param b - The second room to compare
     */
    static compareRoomPos(a, b) {
        //Check if both parameters are defined
        if (a != undefined && b != undefined) { //O(1)
            //Check the x positions
            if (a.x != b.x)
                return false; //O(3)
            //Check the y positions
            if (a.y != b.y)
                return false; //O(4)
            //Check the room names
            if (a.roomName != b.roomName)
                return false; //O(5)
            //Then the positions are equal
            return true; //O(6)
            //One of the parameters is undefined, return false.
        }
        else
            return false; //O(2)
    }
    /**
     * This is a small utility function which when called on a creep checks how
     * much longer they have to life. If it is equal to some threashold then the
     * count in the room memory for that creep is reduced.
     * Runtime: O(2) -> O(7)
     * @param creep - The creep's life to check
     */
    static checkLife(creep) {
        //Check how long the creep has to live
        if (creep.body.length * 3 == creep.ticksToLive) { //O(2)
            //Decrease if it's one
            Game.rooms[creep.memory.room].memory.counts["Worker"]--; //O(7)
        }
    }
    /**
     * creepOptimizedMove optimizes the movement that creeps do. This is primarly
     * done but greatly reducing the number of times a creep recalcualtes its
     * pathing. It works well between rooms, judging from slack it works way
     * better than the default moveTo(pos) for multiple rooms. I don't know why
     * this is... it just happens to be. Should not be used for actions that
     * require very reponsive creep movement such as combat!
     * Runtime: O(2) -> O(7) -> O(19 + c)
     * Note: It is unknown how many calculations RoomPosition.findPathTo() is
     * making so its denoted as 'c'.
     * @param creep - The creep being moved
     * @param target - The target position you want the creep to reach.
     */
    static creepOptimizedMove(creep, target) {
        var _a;
        //If the creep is fatigued exit
        if (creep.fatigue > 0)
            return; //O(2)
        //Check if there's a path for this position or if we've reached the end of one
        if (!(this.compareRoomPos(creep.memory.pathTarget, target)) || creep.memory.pathStep == ((_a = creep.memory.path) === null || _a === void 0 ? void 0 : _a.length)) { //O(10)
            //Generate a path and save it to memory
            creep.memory.path = creep.pos.findPathTo(target, { ignoreCreeps: false }); //O(11 + c), c is based on how many calculations are being done by findPathTo()
            //Update the target of the path saved in memory
            creep.memory.pathTarget = target; //O(12 + c)
            //Start our step counter from 0
            creep.memory.pathStep = 0; //O(13 + c)
        }
        //Read memory
        var step = creep.memory.pathStep; //O(2) -> O(14 + c)
        var path = creep.memory.path; //O(3) -> O(15 + c)
        //Quickly make some basic checks that we can actually move
        if (path != undefined && step != undefined) { //O(5) -> O(17 + c)
            //Move the creep and increase the step
            creep.move(path[step].direction); //O(6) -> O(18 + c)
            creep.memory.pathStep++; //O(7) -> O(19 + c)
        }
    }
    /**
     * The method creepFill makes the given creep fill nearby strucutres. The
     * strucuture it fills is determined by findClosestByPath.
     * Runtime: O(5) -> O(9) -> O(15 + 3n)
     * Note: n comes from the use of the RoomPosition.find method.
     * @param creep The creep actions are taken on
     */
    static creepFill(creep) {
        //Send a message saying we're filling if we are
        creep.say('⚙ ⛴', publicDebug); //O(2)
        //Check to see if we have a target defined
        if (creep.memory.emptyStructure == undefined) { //O(3)
            //Find the nearest strucutre without full energy
            var s = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 }); //O(7 + 3n)
            //Set memory if s is not null
            if (s != null)
                creep.memory.emptyStructure = s.id; //O(9 + 3n)
        }
        //Make sure we have a target structure before going on
        if (creep.memory.emptyStructure != undefined) { //O(4) -> O(10 + 3n)
            //Read memory
            var x = Game.getObjectById(creep.memory.emptyStructure); //O(5) -> O(11 + 3n)
            //Check if the structure exists
            if (x != null && x.store.getFreeCapacity(RESOURCE_ENERGY) != 0) { //O(7) -> O(13 + 3n)
                //Check if we're near the structure and move to it if we aren't
                if (!(creep.pos.isNearTo(x)))
                    this.creepOptimizedMove(creep, x.pos); //O(8) -> O(14 + 3n), O(15) -> O(21 + 3n)
                //Transfer the resource
                else
                    creep.transfer(x, RESOURCE_ENERGY); //O(9) -> O(15 + 3n)
                //If the structure is null reset the memory
            }
            else
                creep.memory.emptyStructure = undefined; //O(5) -> O(11 + 3n)
        }
    }
    // TODO: Runtime analysis
    /**
     * Makes the creep look for and pickup nearby resources. Defaults to energy
     * however one can be specified in the function call.
     * Runtime: O(n) ---> n is the number of dropped resources
     */
    static creepPickup(creep, filter = RESOURCE_ENERGY) {
        //Say we're picking stuff up
        creep.say('♻', publicDebug);
        //Check if dropped is undefined
        if (creep.memory.droppedResource == undefined) {
            //Find nearby dropped resources of type filter
            var d = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: { resourceType: filter } }); //O(n)
            //Set dropped resoucres if d is not null
            if (d != null)
                creep.memory.droppedResource = d.id;
        }
        //Make sure dropped is defined before moving on
        if (creep.memory.droppedResource != undefined) {
            //Read memory
            var d = Game.getObjectById(creep.memory.droppedResource);
            //Check if the resource exists
            if (d != null) {
                //Check if we're near the resource and move to it if we aren't
                if (!(creep.pos.isNearTo(d)))
                    this.creepOptimizedMove(creep, d.pos);
                //Pickup the resource
                else
                    creep.pickup(d);
            }
            else {
                //We didn't get anything back from the Game.getObjectById so reset the id
                creep.memory.droppedResource = undefined;
            }
        }
    }
    /**
     * Makes the creep mine the nearest source.
     * Runtime: O(n) ---> n is the number of sources.
     */
    static creepHarvest(creep) {
        //Say we're harvesting
        creep.say('⛏', publicDebug);
        //check if sources is undefined
        if (creep.memory.sources == undefined) {
            //Find the active sources
            var t = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE); //O(n)
            //Set sources if t is not null
            if (t != null)
                creep.memory.sources = t.id;
        }
        //Make sure source is defined before moving on
        if (creep.memory.sources != undefined) {
            //Read memory
            var s = Game.getObjectById(creep.memory.sources);
            //Check if there exists a source
            if (s != null && s.energy != 0) {
                //Check if we're near the source and move to it if we aren't
                if (!(creep.pos.isNearTo(s)))
                    this.creepOptimizedMove(creep, s.pos);
                //Harvest the source
                else
                    creep.harvest(s);
            }
            else {
                creep.memory.sources = undefined;
            }
        }
    }
    /**
     * Makes the creep upgrade the controller of the current room.
     * Runtime: O(c) ---> runs in constant time.
     */
    static creepUpgrade(creep) {
        //Say we're upgrading
        creep.say('⚙ 🕹', publicDebug);
        //Read the room controller
        var r = creep.room.controller;
        //Make sure r is defined
        if (r != undefined) {
            //Check if we're in range of the controller, and move towards if we're not
            if (!(creep.pos.inRangeTo(r, 3)))
                this.creepOptimizedMove(creep, r.pos);
            //Upgrade the controller
            else
                creep.upgradeController(r);
        }
    }
    /**
     * Makes the creep build the nearest construction site.
     * Runtime: O(c) ---> runs in constant time.
     */
    static creepBuild(creep) {
        //Say we're building
        creep.say('⚙ ⚒', publicDebug);
        //check if building is undefined
        if (creep.memory.building == undefined) {
            //Find the nearest site
            var b = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); //O(n)
            console.log(b);
            //Set building if b is not null
            if (b != null)
                creep.memory.building = b.id;
        }
        //Make sure building is defined before moving on
        if (creep.memory.building != undefined) {
            //Read memory
            var b = Game.getObjectById(creep.memory.building);
            //Check if there exists a building
            if (b != null) {
                //Check if we're near the source and move to it if we aren't
                if (!(creep.pos.inRangeTo(b, 3)))
                    this.creepOptimizedMove(creep, b.pos);
                //Harvest the source
                else
                    creep.build(b);
            }
            else {
                //We need to find a new construction site
                creep.memory.building = undefined;
            }
        }
    }
    /**
     * This method makes the creep attack the passed through enemy.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static creepMelee(creep, victim) {
        //Say we're building
        creep.say('⚔', publicDebug);
        //Move to the creep we're attacking, visualize the path and refresh often
        if (!(creep.pos.isNearTo(victim.pos)))
            creep.moveTo(victim.pos, { reusePath: 0, visualizePathStyle: {} });
        //Attack them! grr!
        else
            creep.attack(victim);
    }
    /**
     * This method makes the creep repair buildings who are low on health.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static creepRepair(creep) {
        //Say we're building
        creep.say('⚙ ⛓', publicDebug);
        //check if building is undefined
        if (creep.memory.repair == undefined) {
            //Find the nearest site
            var b = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (c) => c.hits < c.hitsMax && c.structureType != STRUCTURE_WALL }); //O(n)
            console.log(b);
            //Set building if b is not null
            if (b != null)
                creep.memory.repair = b.id;
        }
        //Make sure building is defined before moving on
        if (creep.memory.repair != undefined) {
            //Read memory
            var b = Game.getObjectById(creep.memory.repair);
            //Check if there exists a building
            if (b != null && b.hits < b.hitsMax) {
                //Check if we're near the source and move to it if we aren't
                if (!(creep.pos.inRangeTo(b, 3)))
                    this.creepOptimizedMove(creep, b.pos);
                //Harvest the source
                else
                    creep.repair(b);
            }
            else {
                //We need to find a new construction site
                creep.memory.repair = undefined;
            }
        }
    }
    static run(creep, goal) {
        //Check if we're full on energy
        if (creep.carry.energy == creep.carryCapacity)
            creep.memory.working = true;
        //If we're out of energy obtain more
        else if (creep.carry.energy == 0 || creep.memory.working == undefined)
            creep.memory.working = false;
        //Lets Spend some energy
        if (creep.memory.working) {
            //We should otherwise fill up buildings
            switch (goal) {
                case undefined:
                    creep.say("ADKNFQERI");
                    return;
                case "Fill":
                    Creep_Prototype.creepFill(creep);
                    break;
                case "Fix":
                    Creep_Prototype.creepRepair(creep);
                    break;
                case "Build":
                    Creep_Prototype.creepBuild(creep);
                    break;
                case "Upgrade":
                    Creep_Prototype.creepUpgrade(creep);
                    break;
            }
        }
        //Lets get some energy
        else {
            //We're mining
            creep.say('⛏', true);
            //Got harvest
            Creep_Prototype.creepHarvest(creep); //O(n)
        }
    }
}

//Import the creepRole interface
/**
 * This is the class for the JumpStart creep. The primary job of the JumpStart
 * creep is to push the RCL from 1 to 2 or to fill extensions in case the colony
 * dies It is mostly static as it simply needs to act on harvester creeps
 *instead of storing them in cache as an object.
 */
class Scout extends Creep_Prototype {
    //Constructor
    constructor() {
        super();
        //Variables
        this.name = "Scout";
    }
    //Real Methods
    run(creep) {
        Scout.run(creep);
    }
    static run(creep) {
        //Scouts need to say things
        creep.say('🛰', true);
        //Scouts are simple... move to the scout target
        if (creep.memory.target != undefined)
            Creep_Prototype.creepOptimizedMove(creep, new RoomPosition(25, 25, creep.memory.target));
        //Else the mission is complete
        else
            creep.suicide();
    }
}

//Import the creepRole interface
/**
 * This is the class for the Carrier creep. The primary role of the carrier
 * creep is to move resources around the base and into storage or other devices
 * that could use them.
 */
class Defender extends Creep_Prototype {
    //Constructor
    constructor() {
        super();
        //Variables
        this.name = "Defender";
    }
    //Real Methods
    run(creep) {
        Defender.run(creep);
    }
    static run(creep) {
        //Find hostile creeps
        var h = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        //Check if there are some
        if (h != undefined) {
            //Attack!!
            super.creepMelee(creep, h);
        }
        else {
            //No enemies
            creep.say('🛏︎', true);
        }
    }
}

//Import the queue so we can request tasks, priority so we can set priority
var params = {};
params["Scout"] = new Scout();
params["Defender"] = new Defender();
/**
 * This is the creep manager class. It is mostly static and handles the
 * management of creeps including their AI and memory.
 */
class CreepManager {
    //Variables
    //Constructors
    constructor() {
        //Set the last time we cleaned memory to the anchient times
        Memory.lastCreepClean = 0;
    }
    //Accessor methods
    //Real methods
    /**
     * Runs the creep manager class. Static as it has nothing it needs to modify
     * on the object.
     * Runtime: O(c) ---> Runs in constant time.
     */
    static run() {
        //Start at 6,000 ticks and increment down. Request a clean based on how long ago it was
        for (var i = 4; i > 0; i--)
            if (Game.time - Memory.lastCreepClean >= 1500 * i || Memory.lastCreepClean == undefined) {
                Queue.request(new cleanMemory_CreepManager(), i * 25);
                console.log("Requested memory clean");
                break;
            }
    }
    static runCreepsAI() {
        //Iterate through creeps
        for (let c in Game.creeps) {
            //Short hand
            var creep = Game.creeps[c];
            //Check if the creep is spawning
            if (creep.spawning)
                break;
            //If the creep has a defined role run that role's AI
            if (creep.memory.role != undefined)
                params[creep.memory.role].run(creep);
            //Otherwise run the general code passing through the colony's goals
            else {
                var a = undefined;
                for (var i = 0; i < exports.colonies.length; i++)
                    if (exports.colonies[i].home.name == creep.memory.room) {
                        a = exports.colonies[i];
                        break;
                    }
                if (a != undefined)
                    Creep_Prototype.run(creep, a.goals.pop());
            }
            //Check the creep's life
            Creep_Prototype.checkLife(creep);
        }
    }
    /**
     * Clears the memory of dead creeps.
     * Runtime: O(n) ---> n is the number of creeps.
     */
    static cleanMemory() {
        //Iterate through creeps and check if they're alive, if they're not clean the memory
        for (var c in Memory.creeps)
            if (!Game.creeps[c])
                delete Memory.creeps[c]; //O(n)
        //Set the last clean date to right now
        Memory.lastCreepClean = Game.time;
    }
}
/**
 * The run CreepManager task runs the logic for the CreepManager which requests
 * other tasks that need to be completed in the future.
 */
class run_CreepManager extends template {
    //Constructors
    constructor() {
        super();
        //Variables
        this.name = "Run The Creep Manager";
    }
    //Real Methods
    run() {
        //Simple enough I'd say
        CreepManager.run();
    }
}
/**
 * The creepAI CreepManager task runs the ai for all the creeps.
 */
class creepAI_CreepManager extends template {
    //Constructors
    constructor() {
        super();
        //Variables
        this.name = "Run Creep AI";
    }
    //Real Methods
    run() {
        //Simple enough I'd say
        CreepManager.runCreepsAI();
    }
}
/**
 * The clean memory task clears the memory of any old creeps so they don't clog
 * it up too much in the future.
 */
class cleanMemory_CreepManager extends template {
    //Constructors
    constructor() {
        super();
        //Variables
        this.name = "Clean Creep Memory";
    }
    //Real Methods
    run() {
        //Simple enough I'd say
        CreepManager.cleanMemory();
    }
}

/**
 * This file manages the spawns that need to be completed including the queuing
 * of spawns and handling of when new spawns should happen.
 */
class SpawnManager {
    //Constructor
    constructor(r) {
        //Set the local counterparts
        this.room = r;
        //find the spawns we can use
        this.spawns = this.room.find(FIND_MY_SPAWNS);
        //Make a spawn queue for this manager
        this.spawnQueue = new SpawnQueue(this.spawns);
    }
    /**
     * Runs the SpawnManager which looks for creeps that need to be spawned and
     * adds them to the spawn queue.
     */
    run() {
        this.spawnQueue.print();
        //TODO logic for spawning creeps
        //Run the queue if it isn't empty
        if (!(this.spawnQueue.isEmpty()))
            this.spawnQueue.run();
    }
}
/**
 * This is a queue which holds creeps that need to be spawned based on their
 * importance.
 */
class SpawnQueue {
    //Constructor
    constructor(s) {
        this.queue = [];
        this.spawns = s;
    }
    //Accessor methods
    isEmpty() { return !(this.queue.length > 0); }
    print() {
        for (var i = 0; i < this.queue.length; i++) {
            console.log(this.queue[i].role);
        }
    }
    //Methods
    add(c) { this.queue.push(c); }
    run() {
        //Find an unused spawn
        for (var i = 0; i < this.spawns.length; i++) {
            //Check if there's anything left, return if there isn't
            if (this.queue[0] == undefined)
                return;
            //Do this for some nice short hand
            var spawn = this.spawns[i];
            //Grab the creep real quick
            var c = this.queue.pop();
            console.log((spawn.spawnCreep(c.body, Game.time + "", { dryRun: true })));
            console.log(c.body);
            //Spawn the creep, if we can
            if (spawn.spawnCreep(c.body, Game.time + "", { dryRun: true }) == OK)
                c.run(spawn);
        }
    }
    contains(r) {
        for (var i = 0; i < this.queue.length; i++) {
            if (this.queue[i].role == r)
                return true;
        }
        return false;
    }
}

/**
 * Spawns a defender creep at the given spawn and at the level given.
 * O(c) --> Runs in constant time.
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be produced
 */
function spawnDefender(capacity, spawn) {
    //The poor mans defender
    if (capacity < 380) {
        //Temporaily stores how much energy we've spent on our creep
        var spent = 130; //Starts at 130 since everything has 1 move (50) and 1 attack (80) parts
        //No matter how much energy we have the carrier starts with 2 parts
        var body = [MOVE, ATTACK];
        //Add more parts so as not to exceed our energy budget
        while (spent + 130 <= capacity) {
            body.push(MOVE);
            body.push(ATTACK);
            spent += 130;
        }
        //Budget defender
    }
    else if (capacity < 430)
        var body = [MOVE, ATTACK, HEAL];
    //Deluxe defender
    else {
        //Temporaily stores how much energy we've spent on our creep
        var spent = 430; //Starts at 430 since everything has 2 move (100), 1 attack (80), and 1 heal (250)
        //No matter how much energy we have the defender starts with 4 parts
        var body = [MOVE, MOVE, ATTACK, HEAL];
        //Add more parts so as not to exceed our energy budget
        while (spent + 130 <= capacity) {
            body.push(MOVE);
            body.push(ATTACK);
            spent += 130;
        }
    }
    //Temp name storing
    var name = '[' + spawn.room.name + '] Defender ' + Game.time;
    //Spawn the defender
    spawn.spawnCreep(body, name, { memory: { room: spawn.room.name, role: 'Defender' } });
}
/**
 * Spawns a claimer creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
// function spawnClaimer(capacity, spawn){
//   //Claimers are easy... basic body
//   var body = [MOVE,CLAIM]; //Cost - 650
//   //Temp name storage
//   var name = '[' + spawn.room.name + '] Claimer ' + Game.time;
//   //Spawn the creep, Increment the claimer count in the room if successful
//   if(spawn.spawnCreep(body,name, {memory: {role: 'claimer', distance: Game.flags['Claim'].room.name}}) == OK) spawn.room.memory.count.claimer++;
// }
/**
 * Spawns a distance harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 * @param targetRoom The room which the distance harvester will be mining in
 */
// function spawnDistanceHarvester(capacity:number, spawn:StructureSpawn, targetRoom:string){
//   //The amount of energy towards our total we've spent
//   var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
//   //The starting body for our distance harvester
//   var body:BodyPartConstant[] = [MOVE,MOVE,CARRY,CARRY];
//   //Add another carry part if we have the space
//   if(capacity > 550) { body.push(CARRY); spent += 50;}
//   //Add work parts until we're out of energy but not to exceed 750 cost
//   while(spent + 100 <= capacity && spent < 750) { body.push(WORK); spent += 100;}
//   //Temp name storing
//   var name = '[' + spawn.room.name + '] Distance Harvester ' + Game.time;
//   //Spawn the creep, Increment the distance harvester count in the room if successful
//   if(spawn.spawnCreep(body, name, {memory: {role: 'distanceHarvester', room: spawn.room.name, distance: targetRoom}}) == OK) spawn.room.meory.count.distanceHarvester++;
// }
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnHarvester(capacity, spawn) {
    //It's important to note that the harvester creep is also used for recovery
    // and as such can't cost more than 300 energy
    //Temp body storing
    var body = [MOVE, MOVE, CARRY, CARRY, WORK]; //Cost - 300
    //Temp name storing
    var name = '[' + spawn.room.name + '] Worker ' + Game.time;
    //Spawn the creep, Increment the harvester count in the room if successful
    if (spawn.spawnCreep(body, name, { memory: { room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Worker++;
}
/**
 * Spawns a harvester creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnBigBoiHarvester(capacity, spawn) {
    //The amount of energy towards our total we've spent
    var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
    //The starting body for our worker
    var body = [MOVE, MOVE, CARRY, CARRY];
    //Add another carry part if we have the space
    while (spent + 50 < capacity / 2) {
        body.push(CARRY);
        spent += 50;
    }
    //Add another carry part if we have the space
    while (spent + 50 < capacity * 3 / 5) {
        body.push(MOVE);
        spent += 50;
    }
    //Add work parts until we're out of energy but not to exceed 750 cost
    while (spent + 100 <= capacity) {
        body.push(WORK);
        spent += 100;
    }
    //Temp name storing
    var name = '[' + spawn.room.name + '] Worker ' + Game.time;
    //Spawn the creep, Increment the harvester count in the room if successful
    if (spawn.spawnCreep(body, name, { memory: { room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Worker++;
}
/**
 * Spawns a scout creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
// function spawnScout(capacity, spawn:StructureSpawn){
//   //It's important to note that the scout creep's only purpose is to move and
//   // as such its body leaves much to desire
//   //Temp body storing
//   var body = [MOVE]; //Cost - 50
//   //Temp name storing
//   var name = '[' + spawn.room.name + '] Scout ' + Game.time;
//   //Spawn the creep
//   if(spawn.spawnCreep(body, name, {memory: {role: 'Scout', scoutTarget: spawn.room.memory.scoutTarget}}) == OK) spawn.room.memory.count.scout++;
// }
/**
 * Spawns a worker creep at the given spawn and at the level given.
 * O(c) --> runs in constant time
 * @param capacity The max energy the creep can use
 * @param spawn The spawn where the creep will be spawned
 */
function spawnWorker(capacity, spawn) {
    //The amount of energy towards our total we've spent
    var spent = 200; //Starts at 200 since we have 2 move (50) parts and 2 carry (50) parts
    //The starting body for our worker
    var body = [MOVE, MOVE, CARRY, CARRY];
    //Add another carry part if we have the space
    while (spent + 50 < capacity / 2) {
        body.push(CARRY);
        spent += 50;
    }
    //Add another carry part if we have the space
    while (spent + 50 < capacity * 3 / 5) {
        body.push(MOVE);
        spent += 50;
    }
    //Add work parts until we're out of energy but not to exceed 750 cost
    while (spent + 100 <= capacity) {
        body.push(WORK);
        spent += 100;
    }
    //Temp name storing
    var name = '[' + spawn.room.name + '] Worker ' + Game.time;
    //Spawn the creep, Increment the upgrader count in the room if successful
    if (spawn.spawnCreep(body, name, { memory: { room: spawn.room.name } }) == OK)
        spawn.room.memory.counts.Worker++;
}
//Public facing functions
/**
 * Finds spawns in the room given and runs the logic for what needs to be spawned.
 * Then functions higher up in the file are called to handle the spawning of specifc
 * creeps.
 * Worst case: O(s + t) --> s is the number of spawns
 * Expected case: O(s + t) --> s is the number of spwans, t is the number of buildings
 * Best case: O(s + t) --> s is the number of spawns
 * @param currentRoom The room in which spawning occurs
 */
function spawn(currentRoom) {
    //Check the capacity we can spawn at
    var capacity = 300 + (currentRoom.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION }).length * 50); //O(t)
    //Iterate through spwans in the game
    for (var s in Game.spawns) { //TODO implement spawns into room.memory so this is O(c), current O(s)
        //Why is this harder than it needs to be?
        var spawn = Game.spawns[s];
        var hostiles = (spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS) != undefined);
        //Is the spawn in the room we want?
        if (currentRoom.name == spawn.room.name) {
            if (currentRoom.memory.counts.Miner == undefined) {
                currentRoom.memory.counts.Miner = 0;
                currentRoom.memory.counts.Carrier = 0;
                currentRoom.memory.counts.Jumpstart = 0;
                currentRoom.memory.counts.Worker = 0;
            }
            //If there are hostiles spawn a defender
            if (hostiles)
                spawnDefender(capacity, spawn);
            //Check if a harvester creep needs to be spawned, this includes recovery if all creeps die
            else if (currentRoom.memory.counts.Worker < 1)
                spawnHarvester(capacity, spawn);
            //Check if a carrier creep needs to be spawned, 2 per miner
            // else if(currentRoom.memory.counts.Carrier < currentRoom.memory.counts.Miner * 2) spawnCarrier(capacity, spawn);
            //Check if a miner creep needs to be spawned, 1 per source
            else if (currentRoom.memory.counts.Worker < 10)
                spawnBigBoiHarvester(capacity, spawn);
            //Check if workers should be spawned, 4 base, // TODO: check if more can be spawned
            else if (currentRoom.memory.counts.Worker < 4)
                spawnWorker(capacity, spawn);
            //Check if a repair bot should be spawned
            // else if(currentRoom.memory.counts.RepairBot < 1) spawnRepairBot(capacity, spawn);
            //Check if a scout should be spawned
            // else if(currentRoom.memory.count.scout < 1 && currentRoom.scoutTarget != null) spawnScout(capacity, spawn);
            //Check if a claimer should be spawned
            // else if(currentRoom.memory.countClaimer < 1 && Game.flags['Claim'] != undefined) spawnClaimer(capacity, spawn);
            // TODO: reimplement distance harvesters
            // else if(spawn.store.getCapacity(RESOURCE_ENERGY) == 300 && currentRoom.memory.counts.Worker < 8) spawnWorker(capacity,spawn);
        }
    }
}

//Import tasks
var p = {};
/**
 * A colony is a small collection of rooms. Each colony has a number of creeps
 * it needs to spawn to be functional.
 */
class Colony {
    //Constructors
    constructor(r) {
        this.goals = [];
        this.home = r;
        this.era = -1;
        this.homePrototype = new struc_Room(r.name);
        if (r.controller != undefined)
            if (r.controller.level <= 2)
                this.era = 0;
        this.spawnManager = new SpawnManager(Game.rooms[this.homePrototype.getRoomRefrence()]);
        this.home.memory.counts = p;
        this.construction = [];
        this.constructionStage = 0;
    }
    //Methods
    run() {
        //Do construction projects
        if (this.constructionStage == 0) {
            for (let s in Game.spawns) {
                if (Game.spawns[s].room.name == this.home.name) {
                    var train = Game.spawns[s];
                    var sources = train.room.find(FIND_SOURCES);
                    for (var i = 0; i < sources.length; i++) {
                        var path = train.pos.findPathTo(sources[i]);
                        for (var j = 0; j < path.length - 1; j++) {
                            this.construction.push(new ConstructionProject(new RoomPosition(path[j].x, path[j].y, train.room.name), STRUCTURE_ROAD));
                        }
                        path = sources[i].pos.findPathTo(sources[i].room.controller);
                        for (var j = path.length - 2; j >= 0; j--) {
                            this.construction.push(new ConstructionProject(new RoomPosition(path[j].x, path[j].y, train.room.name), STRUCTURE_ROAD));
                        }
                    }
                    var path = train.pos.findPathTo(train.room.controller);
                    for (var j = 0; j < path.length - 1; j++) {
                        this.construction.push(new ConstructionProject(new RoomPosition(path[j].x, path[j].y, train.room.name), STRUCTURE_ROAD));
                    }
                }
            }
            this.constructionStage++;
        }
        //Reset the goals
        this.goals = [];
        //Search for a set of objects
        var r = this.home.find(FIND_STRUCTURES, { filter: (c) => c.hits < c.hitsMax && c.structureType != STRUCTURE_WALL });
        var c = this.home.find(FIND_CONSTRUCTION_SITES);
        this.home.find(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY } });
        var s = this.home.find(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 }); //O(7 + 3n)
        this.goals.push("Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade", "Upgrade");
        if (c != null && c.length > 0)
            this.goals.push("Build", "Build", "Build", "Build");
        if (r != null && r.length > 0)
            this.goals.push("Fix", "Fix");
        if (s != null && s.length > 0)
            this.goals.push("Fill", "Fill", "Fill", "Fill", "Fill");
        if (Game.time % 100 == 0)
            this.census();
        //Run the spawn manger.
        spawn(this.home);
        if (this.construction.length > 0 && c.length == 0)
            this.construction.pop().place();
    }
    /**
     * This method runs a quick census of all the creeps and updates the memory in
     * this.home to their numbers.
     */
    census() {
        this.home.memory.counts["Miner"] = 0;
        this.home.memory.counts["Carrier"] = 0;
        this.home.memory.counts["Jumpstart"] = 0;
        this.home.memory.counts["Worker"] = 0;
        this.home.memory.counts["RepairBot"] = 0;
        for (let c in Game.creeps) {
            var creep = Game.creeps[c];
            if (creep.memory.room != this.home.name)
                continue;
            this.home.memory.counts["Worker"]++;
        }
    }
}
class Run_Colony extends template {
    //Constructor
    constructor(c) {
        super();
        //Variables
        this.name = "Run Colony";
        this.colony = c;
    }
    //Methods
    run() {
        this.colony.run();
    }
}
class ConstructionProject {
    constructor(p, t) {
        this.pos = p;
        this.type = t;
    }
    place() {
        Game.rooms[this.pos.roomName].createConstructionSite(this.pos, this.type);
    }
}

/**
 * This file is the int main() of my screeps program. This should be a fairly empty
 * and instead the heavy lifting should be done by clases/objects defined outside
 * of here.
 */
//A queue object holding the items which have been queue'd to complete.
var queue = new Queue();
//A rooms object holding all the rooms.
var rooms;
//A stats object which handles the collection of stats
new StatsManager();
//A colony array holding all of the colonies
exports.colonies = void 0;
/**
 * This is the main loop for the program. Expect clean concise code, anything
 * else means I should really get to work.
 */
const loop = ErrorMapper.wrapLoop(() => {
    //Check if we have any colonies. If we don't make one.
    if (exports.colonies == undefined) {
        exports.colonies = [];
        for (let r in Game.rooms) {
            exports.colonies.push(new Colony(Game.rooms[r]));
        }
    }
    //Proccess the requests from the last tick
    queue.proccessRequests();
    //Generate a pixel if we can.
    // if(Game.cpu.bucket == 10000) Game.cpu.generatePixel(); //Game.cpu.generatePixel(); is not a command in private servers, uncomment when pushing to public
    //Things that should always be ran
    queue.queueAdd(new creepAI_CreepManager(), priority.HIGH);
    //Add running the colonies to the queue
    for (var i = 0; i < exports.colonies.length; i++)
        queue.queueAdd(new Run_Colony(exports.colonies[i]), priority.HIGH);
    //Add items that should always be run... but only if they can be
    queue.queueAdd(new update_Rooms(rooms), priority.LOW);
    queue.queueAdd(new collect_Stats(), priority.LOW);
    queue.queueAdd(new run_CreepManager(), priority.LOW);
    //Check if we need to init rooms again, if so do it at maximum priority
    if (rooms == undefined)
        rooms = (new init_Rooms(rooms).run());
    //Telemetry stuffs
    queue.queueAdd(new print_Rooms(rooms));
    queue.queueAdd(new print_Stats());
    queue.printQueue();
    queue.runQueue();
});

exports.loop = loop;
//# sourceMappingURL=main.js.map
