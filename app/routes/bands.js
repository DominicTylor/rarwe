import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.store.findAll('band');
  },

  actions: {
    didTransition () {
      document.title = 'Bands - Rock & Roll';
    },
    /*createBand () {
      let controller = this.get('controller');
      let name = controller.get('name');
      let band = Band.create({
        name
      });

      this.modelFor('bands').pushObject(band);

      controller.set('name', '');

      this.transitionTo('bands.band.songs', band);
    }*/
  }
});
