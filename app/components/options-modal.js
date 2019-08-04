import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class OptionsModalComponent extends Component {
    @service optionsModal;

    classNames = ['options-modal', 'modal'];
    classNameBindings = ['isOpen:is-active'];

    @alias('optionsModal.isOpen') isOpen;
    @alias('optionsModal.title') title;
    @alias('optionsModal.body') description;
    @alias('optionsModal.contextClass') contextClass;
    @alias('optionsModal.options') options;

    @(task(function*(option) {
        const result = yield this.optionsModal.action(option);
        if (result) {
            this.send('close');
        }
    }).drop())
    chooseOption;

    @action
    close() {
        this.optionsModal.close();
    }
}
