import Ember from 'ember';
import {capitalize} from '../../../helpers/capitalize';

export default Ember.Controller.extend({
	queryParams: {
		sortBy: 'sort',
		searchTerm: 's',
	},
	title: '',
	songCreationStarted: false,
	isAddButtonDisabled: Ember.computed.empty('title'),
	hasSongs: Ember.computed.bool('model.songs.length'),
	canCreateSong: Ember.computed.or('songCreationStarted', 'hasSongs'),
	searchTerm: '',
	matchingSongs: Ember.computed('model.songs.@each.title', 'searchTerm', function() {
		let searchTerm = this.get('searchTerm').toLowerCase();
		return this.get('model.songs').filter(song => {
			return song.get('title').toLowerCase().indexOf(searchTerm) !== -1;
		});
	}),
	sortBy: 'ratingDesc',
	sortProperties: Ember.computed('sortBy', function(){
		let options = {
			'ratingDesc': 'rating:desc,title:asc',
			'ratingAsc': 'rating:asc,title:asc',
			'titleDesc': 'title:desc',
			'titleAsc': 'title:asc'
		};
		return options[this.get('sortBy')].split(',');
	}),
	sortedSongs: Ember.computed.sort('matchingSongs', 'sortProperties'),
	newSongPlaceholder: Ember.computed('model.name', function () {
		let bandName = this.get('model.name');
		return `new ${capitalize(bandName)} song`;
	}),
	actions: {
		/* for block form stars rating
		updateRating (song, rating) {
			if (song.get('rating') === rating) {
				rating = 0;
			}

			song.set('rating', rating);

			return song.save();
		}*/
		updateRating (params) {

			let {item: song, rating} = params;

			if (song.get('rating') === rating) {
				rating = 0;
			}

			song.set('rating', rating);

			return song.save();
		},
		enableSongCreation () {
			this.set('songCreationStarted', true);
		}
	}
});
