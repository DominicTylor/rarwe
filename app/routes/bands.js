import Ember from 'ember';

const Band = Ember.Object.extend({
  name: '',
  songs: [],
  slug: Ember.computed('name', function() {
    return this.get('name').dasherize();
  }),
});

const Song = Ember.Object.extend({
  title: '',
  band: '',
  rating: 0
});

export default Ember.Route.extend({
  model () {
    let blackDog = Song.create({
      title: 'Black dog',
      band: 'Led Zeppelin',
      rating: 3
    });

    let yellowLedbetter = Song.create({
      title: 'Yellow Ledbetter',
      band: 'Pearl Jam',
      rating: 4
    });

    let pretender = Song.create({
      title: 'The pretender',
      band: 'Foo Fighters',
      rating: 2
    });

    let daughter = Song.create({
      title: 'Daughter',
      band: 'Pearl Jam',
      rating: 5
    });

    let ledZeppelin = Band.create({
      name: 'Led Zeppelin',
      songs: [blackDog]
    });
    let pearlJam = Band.create({
      name: 'Pearl Jam',
      songs: [yellowLedbetter, daughter]
    });
    let fooFighters = Band.create({
      name: 'Foo Fighters',
      songs: [pretender]
    });

    return [ledZeppelin, pearlJam, fooFighters];
  }
});
