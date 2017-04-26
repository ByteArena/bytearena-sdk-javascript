const epsilon = 0.0000001;

export const map = (n, start1, stop1, start2, stop2) => {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export const isZero = (val) => Math.abs(val) < epsilon
