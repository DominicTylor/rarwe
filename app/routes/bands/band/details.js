import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition () {
      let band = this.modelFor('bands.band');

      document.title = `${band.get('name')} - Rock & Roll`;
    },
  }
});
