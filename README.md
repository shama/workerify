# workerify

Transform web workers into browserified inline Blobs with browserify.

## example

Your entry point `main.js`:
```js
var mod = require('module')
var worker = new Worker('worker.js')
```

Your worker entry point `worker.js`:
```js
self.onmessage = function(e) {
  var ab = new Uint8Array(10)
  for (var n = 0; n < ab.length; n++) ab[n] = 1
  self.postMessage(ab.buffer, [ab.buffer])
}
```

Browserify with this workerify transform:
```shell
browserify -t workerify main.js > bundle.js
```

and your `bundle.js` will look like:
```js
var mod = require('module')
var worker = new Worker(window.URL.createObjectURL(new Blob(['BROWSERIFIED CONTENTS OF worker.js'])));
```

## Modular Workers
The main reason for this is modular workers.

Let's say you create a module that would like to use web workers. Users would
need to configure the URL to the worker. When your module becomes a dependency
of a dependency and so on, the setup becomes really cumbersome. Especially when
your worker needs to be browserified.

With this transform you simply `npm install workerify --save` and configure your
module's `package.json` to apply the transform:

``` json
{
  "name": "mymodule",
  "browserify": {
    "transform": "workerify"
  }
}
```

Now when end users `browserify` your module, anywhere in the dependency tree, it
will browserify and inline the worker. No URLs, no extra build steps and no
additional end user requirements.

## Notes
**This is a work in progress.** Currently it will only transform
`new Worker('string')`. But it should also detect if a worker is variable
identifier so it can be used with libs like
[workerstream](https://github.com/maxogden/workerstream).

## install

With [npm](https://npmjs.org) do:

```
npm install workerify
```

## release history
* 0.1.0 - initial release

## license
Copyright (c) 2013 Kyle Robinson Young<br/>
Licensed under the MIT license.
