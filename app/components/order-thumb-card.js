import Component from '@ember/component';

export default class OrderThumbCardComponent extends Component {
    classNames = ['order-thumb-card', 'card'];

    slotTime = '';

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
}
