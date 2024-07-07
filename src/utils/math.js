export function roundDownToPowerOfTwo(x) {
    if (x <= 0) {
        return 0;
    } else {
        let msbPosition = 0;
        while (x > 1) {
            x >>= 1;
            msbPosition++;
        }
        return 1 << msbPosition;
    }
}

export function roundToClosestPowerOfTwo(x) {
    const PREFER_LOWER = false;
    let _x = x;
    if (x <= 0) {
        return 0;
    }

    let msbPosition = 0;
    while (_x > 1) {
        _x >>= 1;
        msbPosition++;
    }

    const smaller = 1 << msbPosition;
    const larger = 1 << (msbPosition + 1);
    const resultAvg = (smaller + larger) / 2;

    // if((PREFER_LOWER && result - smaller === larger - result) || (result - smaller < larger - result)) return smaller;
    if (x === resultAvg) {
        return PREFER_LOWER ? smaller : larger;
    }
    return x < resultAvg ? smaller : larger; 
    // return larger;
}

export function numberRepresentation(num, precision) {
    if (num < 10_000) return num.toString();
    if (num >= 1000000000) {
        const result = (num / 1000000000).toFixed(precision);
        return result.replace(/\.?0*$/, '') + 'b';
    } else if (num >= 1000000) {
        const result = (num / 1000000).toFixed(precision);
        return result.replace(/\.?0*$/, '') + 'm';
    } else if (num >= 1000) {
        const result = (num / 1000).toFixed(precision);
        return result.replace(/\.?0*$/, '') + 'k';
    } else {
        return num.toString();
    }
}