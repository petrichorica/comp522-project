function computeVelocity(index, numBody, pos, vel, newVel, epsSqr, deltaTime) {
    const baseIndex = index * 4;
    let accX = 0, accY = 0, accZ = 0;
    for (let i = 0; i < numBody; i += 4) {
        const rx = pos[i + 0] - pos[baseIndex + 0];
        const ry = pos[i + 1] - pos[baseIndex + 1];
        const rz = pos[i + 2] - pos[baseIndex + 2];
        const rm = pos[i + 3];

        const distSqr = rx * rx + ry * ry + rz * rz;
        const invDist = 1.0 / Math.sqrt(distSqr + epsSqr);
        const invDistCube = invDist * invDist * invDist;
        const s = rm * invDistCube;

        accX += s * rx;
        accY += s * ry;
        accZ += s * rz;
    }

    newVel[baseIndex + 0] = vel[baseIndex + 0] + accX * deltaTime;
    newVel[baseIndex + 1] = vel[baseIndex + 1] + accY * deltaTime;
    newVel[baseIndex + 2] = vel[baseIndex + 2] + accZ * deltaTime;
    newVel[baseIndex + 3] = 0;
}

function computePosition(index, pos, vel, newVel, deltaTime) {
    const baseIndex = index * 4;
    pos[baseIndex + 0] = pos[baseIndex + 0] + (newVel[baseIndex + 0] + vel[baseIndex + 0]) * deltaTime / 2;
    pos[baseIndex + 1] = pos[baseIndex + 1] + (newVel[baseIndex + 1] + vel[baseIndex + 1]) * deltaTime / 2;
    pos[baseIndex + 2] = pos[baseIndex + 2] + (newVel[baseIndex + 2] + vel[baseIndex + 2]) * deltaTime / 2;
}

self.onmessage = function(event) {
    const { index, numBody, segmentSize, pos, vel, newVel, epsSqr, deltaTime } = event.data;
    for (let i = index * segmentSize; i < (index + 1) * segmentSize; i++) {
        computeVelocity(i, numBody, pos, vel, newVel, epsSqr, deltaTime);
        computePosition(i, pos, vel, newVel, deltaTime);
    }
    self.postMessage("updated");
}
