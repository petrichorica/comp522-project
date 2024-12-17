function matMultElement(index, B) {
    var i = index[0]; var j = index[1];
    var sum = 0; var len = this.getShape()[1];
    for(var k = 0; k < len; k++) {
        sum += this.get([i, k]) * B.get([k, j]);
    }
    return sum;
}

function MatrixMultiply(A, B) {
    return A.combine(2, matMultElement, B);
}

function sequentialMatrixMultiply(A, B) {
    var n = A.length;
    var C = new Array(n);
    for (var i = 0; i < n; i++) {
        C[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            C[i][j] = 0;
        }
    }
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            for (var k = 0; k < n; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return C;
}

"use strict";
function render() {
    var n = 2000;
    var matrixA = new Array(n);
    for (var i = 0; i < n; i++) {
        matrixA[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            matrixA[i][j] = Math.random();
        }
    }
    var matrixB = new Array(n);
    for (var i = 0; i < n; i++) {
        matrixB[i] = new Array(n);
        for (var j = 0; j < n; j++) {
            matrixB[i][j] = Math.random();
        }
    }
    // console.log("matrixA:", [].concat.apply([], matrixA));
    // console.log("matrixB:", [].concat.apply([], matrixB));
    // Sequential matrix multiplication
    var sequentialTimer = {"startDate": null, "endDate": null, "timeDiff": null};
    // sequentialTimer.startDate = new Date();
    sequentialTimer.startDate = performance.now();  // Use performance.now() instead of new Date(): https://stackoverflow.com/a/45143310/23438405
    var matrixC = sequentialMatrixMultiply(matrixA, matrixB);
    // sequentialTimer.endDate = new Date();
    // sequentialTimer.timeDiff = (sequentialTimer.endDate.getTime() - sequentialTimer.startDate.getTime()) / 1000;
    sequentialTimer.endDate = performance.now();
    sequentialTimer.timeDiff = (sequentialTimer.endDate - sequentialTimer.startDate) / 1000;

    // Parallel matrix multiplication
    var parallelTimer = {"startDate": null, "endDate": null, "timeDiff": null};
    parallelTimer.startDate = performance.now();
    var parallelMatrixA = new ParallelArray(matrixA);
    var parallelMatrixB = new ParallelArray(matrixB);
    // parallelTimer.startDate = new Date();
    var parallelMatrixC = MatrixMultiply(parallelMatrixA, parallelMatrixB);
    // parallelTimer.endDate = new Date();
    // parallelTimer.timeDiff = (parallelTimer.endDate.getTime() - parallelTimer.startDate.getTime()) / 1000;
    parallelTimer.endDate = performance.now();
    parallelTimer.timeDiff = (parallelTimer.endDate - parallelTimer.startDate) / 1000;

    const speedup = sequentialTimer.timeDiff / parallelTimer.timeDiff;

    console.log("n:", n);
    console.log("sequential:", sequentialTimer.timeDiff);
    console.log("parallel:", parallelTimer.timeDiff);
    console.log("speedup:", speedup);

    // console.log([].concat.apply([], matrixC));
    // console.log(parallelMatrixC.flatten().getArray());
}