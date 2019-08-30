import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';

export default class FeedFiltersComponent extends Component {
    @service feedFilters;
    @service metrics;

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
        this.metrics.trackPage({ page: '/vse', title: 'Vse' });
    }

    @action
    filterByGrill() {
        this.feedFilters.setToGrill();
        this.metrics.trackPage({ page: '/grill', title: 'Grill' });
    }

    @action
    filterByPickup() {
        this.feedFilters.setToReadyForPickup();
        this.metrics.trackPage({ page: '/vyzvednout', title: 'Vyzvednout' });
    }

    @action
    filterByChest() {
        this.feedFilters.setToCompleted();
        this.metrics.trackPage({ page: '/hotovo', title: 'Hotovo' });
    }

    @action
    filterByTrash() {
        this.feedFilters.setToTrashed();
        this.metrics.trackPage({ page: '/kos', title: 'Kos' });
    }
}
