
/**
 * Simulate a wait-like expression.
 * 
 * @param {*} ms Milliseconds to delay the execution.
 * @returns 
 */
function sleep(ms) {
    return new Promise(function(resolve, reject) {
        setTimeout(resolve, ms);
    });
};


export {
    sleep
};