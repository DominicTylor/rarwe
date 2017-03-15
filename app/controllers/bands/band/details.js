import Ember from 'ember';

export default Ember.Controller.extend({
  isEditing: false,

  actions: {
    editToggle () {
      this.set('isEditing', !this.get('isEditing'));
    }
  }
});
