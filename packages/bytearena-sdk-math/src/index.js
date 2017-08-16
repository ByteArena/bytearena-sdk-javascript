const epsilon = 0.0000001;

/**
 * Maps a numeric value from one range to another
 *
 * @param {Number}
 * @returns {Boolean}
 */
export const map = (n, start1, stop1, start2, stop2) => {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

/**
 * Check if the number is considered as equal to 0
 *
 * @param {Number}
 * @returns {Boolean}
 */
export const isZero = (val) => Math.abs(val) < epsilon
