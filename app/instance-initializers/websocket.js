export function initialize(appInstance) {
    return appInstance.lookup('service:websocket');
}

export default {
    name: 'websocket',
    initialize,
};
