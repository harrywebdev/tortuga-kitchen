import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default class FeedFiltersComponent extends Component {
    @service feedFilters;

    classNames = ['feed-filters'];

    @computed('feedFilters.filters.[]')
    get isAllActive() {
        return this.feedFilters.isGroupActive('all');
    }

    @computed('feedFilters.filters.[]')
    get isGrillActive() {
        return this.feedFilters.isGroupActive('grill');
    }

    @computed('feedFilters.filters.[]')
    get isPickupActive() {
        return this.feedFilters.isGroupActive('readyForPickup');
    }

    @computed('feedFilters.filters.[]')
    get isChestActive() {
        return this.feedFilters.isGroupActive('completed');
    }

    @computed('feedFilters.filters.[]')
    get isTrashActive() {
        return this.feedFilters.isGroupActive('trashed');
    }

    @action
    noFilter() {
        this.feedFilters.resetFilters();
    }

    @action
    filterByGrill() {
        this.feedFilters.setToGrill();
    }

    @action
    filterByPickup() {
        this.feedFilters.setToReadyForPickup();
    }

    @action
    filterByChest() {
        this.feedFilters.setToCompleted();
    }

    @action
    filterByTrash() {
        this.feedFilters.setToTrashed();
    }
}
