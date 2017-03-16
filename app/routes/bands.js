import Ember from 'ember';

export default Ember.Route.extend({
	model () {
		return this.store.findAll('band');
	},

	actions: {
		didTransition () {
			document.title = 'Bands - Rock & Roll';
		},
		createBand () {
			let controller = this.get('controller');
			let band = this.store.createRecord('band', controller.getProperties('name'));

			band.save().then(() => {
				controller.set('name', '');
				this.transitionTo('bands.band.songs', band);
			});
		}
	}
});
