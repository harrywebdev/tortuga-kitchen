import Component from '@ember/component';
import { action } from '@ember/object';

export default class OrderNameCardComponent extends Component {
    classNames = ['order-name-card', 'card'];
    classNameBindings = ['isSelected:order-name-card---selected'];

    isSelected = false;
    orderTime = '';

    get customerStatus() {
        // HACK: implement actual customer status
        return ['new', 'trusted', 'strange'][Math.floor(Math.random() * Math.floor(2))];
    }

    get randomBurgers() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    get randomSides() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    get randomDrinks() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    click() {
        this.toggleProperty('isSelected');
    }

    @action
    toggleSelection() {
        this.toggleProperty('isSelected');
    }
}
