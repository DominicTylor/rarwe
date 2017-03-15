import Ember from 'ember';

export default Ember.Controller.extend({
  title: '',
  isAddButtonDisabled: Ember.computed('title', function() {
    return Ember.isEmpty(this.get('title'));
  }),
  actions: {
    updateRating (params) {
      let song = params.item;
      let rating = params.rating;

      song.set('rating', rating);
    }
  }
});
