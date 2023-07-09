function listen(eventName, callback) {
    // console.log(`监听事件${eventName}`, callback);
    window.addEventListener(eventName, callback, false);
}

function dispatch(eventName, params = null) {
    console.log(`派发事件${eventName}`, params);
    window.dispatchEvent(new CustomEvent(eventName, { detail: params }));
}

module.exports = {
    listen,
    dispatch,
};
