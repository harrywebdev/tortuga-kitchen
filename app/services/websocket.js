import Service from '@ember/service';
import { inject as service } from '@ember/service';
import config from 'tortuga-kitchen/config/environment';
import Pusher from 'pusher-js';

export default class WebSocketService extends Service {
    @service appLogger;
    @service flashMessages;

    isOnline = false;
    client = null;

    constructor() {
        super(...arguments);

        const pusher = new Pusher(config.pusher.appKey, {
            cluster: config.pusher.appCluster,
            forceTLS: true,
        });

        pusher.connection.bind('error', err => {
            if (err.error.data.code === 4004) {
                this.appLogger.log('Pusher connection limit error', err);
                return;
            }

            this.appLogger.log('Pusher connection error', err);
        });

        pusher.connection.bind('state_change', states => {
            this.set('isOnline', states.current === 'connected');

            if (!this.isOnline) {
                this.flashMessages.warn(
                    `Nemám připojení k serveru v reálném čase, budu se ptát každých ${config.polling.timeout /
                        1000} vteřin.`
                );
            }
        });

        this.client = pusher;
    }

    subscribe(channelName, handlers = []) {
        const channel = this.client.subscribe(channelName);

        handlers.forEach(handler => {
            channel.bind(handler.eventName, handler.eventHandler);
        });
    }

    unsubscribe(channelName) {
        this.client.unsubscribe(channelName);
    }
}
