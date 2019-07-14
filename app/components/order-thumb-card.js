import HasTapEventsComponent from 'tortuga-kitchen/components/utils/has-tap-events';
import { action } from '@ember/object';

export default class OrderThumbCardComponent extends HasTapEventsComponent {
    classNames = ['order-thumb-card', 'card'];
    classNameBindings = ['isSelected:order-thumb-card---selected', 'isOverload:order-thumb-card--overload'];

    isSelected = false;
    orderTime = '';

    isOverload = false;

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
