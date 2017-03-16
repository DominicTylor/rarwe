import {test} from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';
import httpStubs from '../helpers/http-stubs';

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

let server;

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