import Ember from 'ember';
import Song from '../../../models/song';

export default Ember.Route.extend({
  resetController (controller) {
    controller.set('songCreationStarted', false);
  },
  actions: {
    didTransition () {
      let band = this.modelFor('bands.band');

      document.title = `${band.get('name')} songs - Rock & Roll`;
    },
    createSong () {
      let controller = this.get('controller');
      let band = this.modelFor('bands.band');
      let title = controller.get('title');

      let song = Song.create({
        title,
        band
      });

      band.get('songs').pushObject(song);

      controller.set('title', '');
    }
  }
});
