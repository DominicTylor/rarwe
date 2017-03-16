import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'div',
	classNames: ['rating-panel'],
	rating: 0,
	maxRating: 5,
	item: null,
	'on-click': null,

	stars: Ember.computed('rating', 'maxRating', function() {
		return this.starRange(this.maxRating, this.get('rating'));
	}),

	starRange (end, rating) {
		let starsData = [];

		for (let i = 1; i <= end; i++) {
			starsData.push({
				rating: i,
				full: i <= rating
			});
		}

		return starsData;
	},

	actions: {
		setRating (newRating) {
			this.get('on-click')({
				item: this.get('item'),
				rating: newRating
			});
		}
	}
});
