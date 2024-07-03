function getParamValue(params, key, defaultValue) {
    let paramArr = params.find(param => param[0] === key) || [];
    return typeof paramArr[1] !== 'undefined' ? paramArr[1] : defaultValue; // eslint-disable-line no-negated-condition
}

function getHtmlElementString(key, value) {
    if (value) {
        return `${key}="${value}" `;
    }
    return '';
}

function buildSrcsetAttribute(src, widths) {
    let inputSrc = src;
    if (src.includes('width=')) {
        inputSrc = src.split('width=');
        inputSrc[1] = inputSrc[1].split(['&']).slice(1).join('&'); // eslint-disable-line newline-per-chained-call
        inputSrc = inputSrc.join('');
    } else if (src.includes('w=')) {
        inputSrc = src.split('w=');
        inputSrc[1] = inputSrc[1].split(['&']).slice(1).join('&'); // eslint-disable-line newline-per-chained-call
        inputSrc = inputSrc.join('');
    }

    // eslint-disable-next-line newline-per-chained-call
    const retVal = widths.split(',').map((width) => `${inputSrc}&w=${width} ${width}w`).join(', ');

    return retVal;
}

export default {
    getParamValue,
    getHtmlElementString,
    buildSrcsetAttribute
};
