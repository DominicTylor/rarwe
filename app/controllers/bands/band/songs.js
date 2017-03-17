import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: {
		sortBy: 'sort',
		searchTerm: 's',
	},
	title: '',
	songCreationStarted: false,
	isAddButtonDisabled: Ember.computed('title', function() {
		return Ember.isEmpty(this.get('title'));
	}),
	canCreateSong: Ember.computed('songCreationStarted', 'model.songs.length', function() {
		return this.get('songCreationStarted') || this.get('model.songs.length');
	}),
	searchTerm: '',
	matchingSongs: Ember.computed('model.songs.@each.title', 'searchTerm', function () {
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
	actions: {
		updateRating (params) {
			let song = params.item;
			let rating = params.rating;

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
