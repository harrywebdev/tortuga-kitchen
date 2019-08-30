export function initialize(appInstance) {
    return appInstance.lookup('service:notifier');
}

export default {
    name: 'notifier',
    initialize,
};
