module.exports = function() {
  var unitialized

  var file = './another.js'

  // With keyword
  var str = window.URL.createObjectURL(new Blob(['(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\nvar ab = new Uint8Array(10)\nfor (var n = 0; n < ab.length; n++) ab[n] = 1\nself.postMessage(ab.buffer, [ab.buffer])\n\n},{}]},{},[1])'],{type:"text/javascript"}))
  var worker = new Worker(str)

  // Straight string
  var worker2 = new Worker(window.URL.createObjectURL(new Blob(['(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\nvar ab = new Uint8Array(10)\nfor (var n = 0; n < ab.length; n++) ab[n] = 1\nself.postMessage(ab.buffer, [ab.buffer])\n\n},{}]},{},[1])'],{type:"text/javascript"})))

  // With a variable
  var worker4 = new Worker(window.URL.createObjectURL(new Blob(['(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module \'"+o+"\'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\nvar ab = new Uint8Array(10)\nfor (var n = 0; n < ab.length; n++) ab[n] = 1\nself.postMessage(ab.buffer, [ab.buffer])\n\n},{}]},{},[1])'],{type:"text/javascript"})))
}
