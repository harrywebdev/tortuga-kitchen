import Service from '@ember/service';

export default class OptionsModalService extends Service {
    isOpen = false;

    title = '';
    body = [];
    contextClass = '';
    options = [];
    action() {
        //
    }

    /**
     *
     * @param {string} title Modal heading
     * @param {array} body Modal body text
     * @param {string} contextClass Contextual class (is-danger, etc)
     * @param {array} options Array of options {value: string, title: string}
     * @param {function} action Action to call on option click {return true to close modal}
     */
    open(title = '', body = [], contextClass = '', options = [], action) {
        this.setProperties({
            title,
            body,
            contextClass,
            options,
            action,
        });

        this.set('isOpen', true);
    }

    close() {
        this.set('isOpen', false);
    }
}
