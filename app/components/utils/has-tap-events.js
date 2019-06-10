import Component from '@ember/component';
import { later, cancel } from '@ember/runloop';

export default class HasTapEventsComponent extends Component {
    longPressHandler;

    touchStart() {
        this.longPressHandler = later(() => {
            this.longPress();
        }, 500);
        return true;
    }

    touchEnd() {
        cancel(this.longPressHandler);
        this.longPressHandler = null;
        return true;
    }

    touchCancel() {
        cancel(this.longPressHandler);
        this.longPressHandler = null;
        return true;
    }

    longPress() {
        //
    }
}
