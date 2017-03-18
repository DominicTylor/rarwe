import Ember from 'ember';
import {capitalize} from '../../../helpers/capitalize';

export default Ember.Route.extend({
	resetController (controller) {
		controller.set('songCreationStarted', false);
	},
	actions: {
		didTransition () {
			let band = this.modelFor('bands.band');
			let name = capitalize(band.get('name'));

			document.title = `${name} songs - Rock & Roll`;
		},
		createSong () {
			let controller = this.get('controller');
			let band = this.modelFor('bands.band');
			let title = controller.get('title');

			let song = this.store.createRecord('song', {
				title,
				band
			});

			song.save().then(() => {
				controller.set('title', '');
			});
		}
	}
});
