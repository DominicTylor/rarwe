import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    let bands = this.modelFor('bands');

    return bands.findBy('slug', params.slug);
  }
});
