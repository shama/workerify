# workerify

Transform web workers into browserified inline Blobs with browserify.

[![browser support](https://ci.testling.com/shama/workerify.png)](https://ci.testling.com/shama/workerify)

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

### further example
Take a look at the [example module](https://github.com/shama/workerify/tree/master/example) for using with [workerstream](https://github.com/maxogden/workerstream).

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
Currently it will transform the following:

```js
// String literal
new Worker('./path/to/worker.js')

// Variable Init Earlier
var myworker = './path/to/worker.js'
new Worker(myworker)

// Or specify the workerify keyword to browserify a string anywhere
// Useful if you want to inline your worker when working with other libs
var myworker = workerify './path/to/worker.js'
var workerstream = require('workerstream')(myworker)
```

### Using with coffeescript

```shell
browserify file.coffee -t coffeeify -t workerify
```

## install

With [npm](https://npmjs.org) do:

```
npm install workerify
```

## release history
* 1.1.0 - Support for Workers as modules (@moin-qidwai).
* 1.0.0 - Upgrade browserify to 14.0.0 (@runn1ng) and other deps. Prefer window.URL over window.webkitURL.
* 0.3.0 - Upgrade browserify to 3.41.0. Allow worker to be used with watchify (@tmpvar)
* 0.2.3 - support compilation from coffeescript original source file
* 0.2.2 - string-escape dep renamed to jsesc (@mathiasbynens)
* 0.2.1 - Add missing falafel dep and bug fixes (@mikolalysenko)
* 0.2.0 - use falafel and support more formats
* 0.1.0 - initial release

## license
Copyright (c) 2017 Kyle Robinson Young<br/>
Licensed under the MIT license.
