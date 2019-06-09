import Component from '@ember/component';
import { action } from '@ember/object';

export default class OrderCardComponent extends Component {
    classNames = ['order-card', 'card'];

    slotTime = '';
    hasOptionsMenuOpen = false;

    get randomBurgers() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    get randomSides() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    get randomDrinks() {
        return Math.floor(Math.random() * Math.floor(4));
    }

    @action
    toggleOptionsMenu() {
        this.toggleProperty('hasOptionsMenuOpen');
    }
}
