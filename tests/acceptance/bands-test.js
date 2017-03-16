import {test} from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import httpStubs from '../helpers/http-stubs';

let server;

moduleForAcceptance('Acceptance | bands', {
	afterEach() {
		if (server && server.shutdown) {
			server.shutdown();
		}
	}
});

test('visiting /', assert => {
	visit('/');

	andThen(() => {
		assertCurrentURL(assert, '/bands', 'Redirect on /bands');
	});
});

test('visiting /bands', assert => {
	visit('/bands');

	andThen(() => {
		assertCurrentURL(assert, '/bands', 'Test /bands');
	});
});

test('List bands', assert => {
	server = new Pretender(function() {
		httpStubs.stubBands(this, [
				{
					id: 1,
					type: 'bands',
					attributes: {
						name: 'Radiohead'
					}
				},
				{
					id: 2,
					type: 'bands',
					attributes: {
						name: 'Long Distance Calling'
					}
				}
			]
		);
	});

	visit('/bands');

	andThen(() => {
		assertLength(assert, '.band-link', 2, 'All band links are rendered');
		assertElement(assert, '.band-link:contains("Radiohead")', 'First band link contains the band name');
		assertElement(assert, '.band-link:contains("Long Distance Calling")', 'The other band link contains the band name');
	});
});

test('Create a new band', assert =>{
	server = new Pretender(function()  {
		httpStubs.stubBands(this, [
			{
				id: 1,
				type: 'bands',
				attributes: {
					name: 'Radiohead'
				}
			}
		]);

		httpStubs.stubCreateBand(this, 2);

		httpStubs.stubSongs(this, 2, []);
	});

	visit('/bands');
	fillIn('.new-band', 'Long Distance Calling');
	click('.new-band-button');

	andThen(() => {
		assertLength(assert, '.band-link', 2, 'All band links are rendered');
		assertTrimmedText(assert, '.band-link:last', 'Long Distance Calling', 'Created band appears at the end of the list');
		assertElement(assert, '.nav a.active:contains("Songs")', 'The Songs tab is active');
	});
});

test('Create a new song in two steps', assert => {
	server = new Pretender(function() {
		httpStubs.stubBands(this, [
			{
				id: 1,
				type: 'bands',
				attributes: {
					name: 'Radiohead'
				}
			}
		]);

		httpStubs.stubCreateSong(this, 1);

		httpStubs.stubSongs(this, 1, []);
	});

	selectBand('Radiohead');
	click('a:contains("create one")');
	fillIn('.new-song', 'Killer Cars');
	submit('.new-song-form');

	andThen(() => {
		assertElement(assert, '.songs .song:contains("Killer Cars")', 'Creates the song and displays it in the list');
	});
});

test('Sort songs in various ways', assert => {
	server =  new Pretender(function() {
		httpStubs.stubBands(this, [
			{
				id: 1,
				type: 'bands',
				attributes: {
					name: 'Them Crooked Vultures'
				}
			}
		]);
		httpStubs.stubSongs(this, 1, [
			{
				id: 1,
				attributes: {
					title: 'Elephants',
					rating: 5
				}
			},
			{
				id: 2,
				attributes: {
					title: 'New Fang',
					rating: 4
				}
			},
			{
				id: 3,
				attributes: {
					title: 'Mind Eraser, No Chaser',
					rating: 4
				}
			},
			{
				id: 4,
				attributes: {
					title: 'Spinning in Daffodils',
					rating: 5
				}
			}
		]);
	});

	selectBand('Them Crooked Vultures');

	andThen(() => {
		assertCurrentURL(assert, '/bands/1/songs', 'Test /bands/1/songs');
		assertTrimmedText(assert, '.song:first', 'Elephants', 'The first song is the highest ranked, first in the alphabet');
		assertTrimmedText(assert, '.song:last', 'New Fang', 'The last song is the highest ranked, last in the alphabet');
	});

	click('button.sort-title-desc');

	andThen(() => {
		assertCurrentURL(assert, '/bands/1/songs?sort=titleDesc', 'Test /bands/1/songs?sort=titleDesc');
		assertTrimmedText(assert, '.song:first', 'Spinning in Daffodils', 'The first song is the one that is the last in the alphabet');
		assertTrimmedText(assert, '.song:last', 'Elephants', 'The last song is the one that is the last in the alphabet');
	});

	click('button.sort-rating-asc');

	andThen(() => {
		assertCurrentURL(assert, '/bands/1/songs?sort=ratingAsk', 'Test /bands/1/songs?sort=ratingAsk');
		assertTrimmedText(assert, '.song:first', 'Mind Eraser, No Chaser', 'The first song is the lowest ranked, first in the alphabet');
		assertTrimmedText(assert, '.song:last', 'Spinning in Daffodils', 'The last song is the highest ranked, last in the alphabet');
	});
});