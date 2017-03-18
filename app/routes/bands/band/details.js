import Ember from 'ember';
import {capitalize} from '../../../helpers/capitalize';

export default Ember.Route.extend({
	actions: {
		willTransition (transition) {
			let controller = this.get('controller');
			let leave;

			if (controller.get('isEditing')) {
				leave = window.confirm('You have unsaved changes. Are yoy sure you want to leave?');
				if (leave) {
					controller.set('isEditing', false);
				} else {
					transition.abort();
				}
			}
		},
		didTransition () {
			let band = this.modelFor('bands.band');
			let name = capitalize(band.get('name'));

			document.title = `${name} details - Rock & Roll`;
		},
		save () {
			let band = this.get('controller').get('model');

			return band.save();
		}
	}
});
