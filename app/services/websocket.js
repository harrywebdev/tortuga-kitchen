import Service from '@ember/service';
import { inject as service } from '@ember/service';
import config from 'tortuga-kitchen/config/environment';
import Pusher from 'pusher-js';

export default class WebSocketService extends Service {
    @service appLogger;
    @service flashMessages;
    @service session;

    isOnline = false;
    client = null;

    connect() {
        const { access_token } = this.get('session.data.authenticated');

        const pusher = new Pusher(config.pusher.appKey, {
            cluster: config.pusher.appCluster,
            forceTLS: true,
            authEndpoint: `${config.api.host}/broadcasting/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            },
        });

        pusher.connection.bind('error', err => {
            if (err.error.data.code === 4004) {
                this.appLogger.log('Pusher connection limit error', err);
                return;
            }
        });

        pusher.connection.bind('state_change', states => {
            this.set('isOnline', states.current === 'connected');

            if (states.current === 'unavailable') {
                return this.flashMessages.warning(
                    `Nedaří se připojení k serveru v reálném čase. Objednávky budu tedy obnovovat každých ${config
                        .polling.timeout / 1000} vteřin.`
                );
            }

            if (states.current === 'connected' && states.previous === 'connecting') {
                this.flashMessages.success('Připojení k serveru v reálném čase obnoveno.');
            }
        });

        this.client = pusher;
    }

    subscribe(channelName, handlers = []) {
        const channel = this.client.subscribe(channelName);

        channel.bind('pusher:subscription_error', status => {
            this.flashMessages.danger(`Nedaří se připojení k objednávkovému kanálu. Status: ${status}`);
            this.appLogger.log(`Pusher subscription error to channel: ${channelName}`);
        });

        handlers.forEach(handler => {
            channel.bind(handler.eventName, handler.eventHandler);
        });
    }

    unsubscribe(channelName) {
        this.client.unsubscribe(channelName);
    }
}
