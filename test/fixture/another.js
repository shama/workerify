var ab = new Uint8Array(10)
for (var n = 0; n < ab.length; n++) ab[n] = 1
self.postMessage(ab.buffer, [ab.buffer])
