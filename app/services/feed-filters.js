import Service from '@ember/service';

export default class FeedFiltersService extends Service {
    groups = {
        all: [],
        grill: ['received', 'accepted'],
        readyForPickup: ['made'],
        completed: ['completed'],
        trashed: ['rejected', 'cancelled'],
    };

    filters = this.groups.all;

    resetFilters() {
        this.set('filters', this.groups.all);
    }

    setToGrill() {
        this.set('filters', this.groups.grill);
    }

    setToReadyForPickup() {
        this.set('filters', this.groups.readyForPickup);
    }

    setToCompleted() {
        this.set('filters', this.groups.completed);
    }

    setToTrashed() {
        this.set('filters', this.groups.trashed);
    }

    isGroupActive(group) {
        return this.filters === this.groups[group];
    }

    isStatusActive(status) {
        return !this.filters.length || this.filters.includes(status);
    }
}
