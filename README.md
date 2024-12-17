## What we did in this project
"RiverTrail" directory contains the original implementation of River Trail library. The code is fetched from https://github.com/IntelLabs/RiverTrail. We did minor changes to the code:
- Added `console.log` to the code to print the compiled OpenCL code.
- Fixed the incorrect formula in the `nbody-webgl` example.

"web-workers" directory contains the implementation of experiments using web workers.

"sharedBuffer" directory contains an example of using SharedArrayBuffer to implement `map` function.

## Launch an HTTP server to run the project
`python3 -m http.server -b 127.0.0.1 8080`


## Resources
- Web workers: https://scribbler.live/2024/04/15/Using-Web-Workers-and-Parallel-JS.html
- SharedArrayBuffer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer