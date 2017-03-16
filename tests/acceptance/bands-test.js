import {test} from 'qunit';
import moduleForAcceptance from 'rarwe/tests/helpers/module-for-acceptance';
import Pretender from 'pretender';

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
		assert.equal(currentURL(), '/bands');
	});
});

test('visiting /bands', assert => {
	visit('/bands');

	andThen(() => {
		assert.equal(currentURL(), '/bands');
	});
});

let server;

test('List bands', assert => {
	server = new Pretender(function() {
		this.get('/bands', () => {
			let response = {
				data: [
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
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});
	});

	visit('/bands');

	andThen(() => {
		assert.equal(currentURL(), '/bands');
		assert.equal(find('.band-link').length, 2, 'All band links are rendered');
		assert.equal(find('.band-link:contains("Radiohead")').length, 1, 'First band link contains the band name');
		assert.equal(find('.band-link:contains("Long Distance Calling")').length, 1, 'The other band link contains the band name');
	});
});

test('Create a new band', assert =>{
	server = new Pretender(function()  {
		this.get('/bands', () => {
			let response = {
				data: [
					{
						id: 1,
						type: 'bands',
						attributes: {
							name: 'Radiohead'
						}
					}
				]
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});

		this.post('/bands', () => {
			let response = {
				data: {
					id: 2,
					type: 'bands',
					attributes: {
						name: 'Long Distance Calling'
					}
				}
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});

		this.get('/bands/2/songs', () => {
			let response = {
				data: []
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});
	});

	visit('/bands');
	fillIn('.new-band', 'Long Distance Calling');
	click('.new-band-button');

	andThen(() => {
		assert.equal(find('.band-link').length, 2, 'All band links are rendered');
		assert.equal(find('.band-link:last').text().trim(), 'Long Distance Calling', 'Created band appears at the end of the list');
		assert.equal(find('.nav a.active:contains("Songs")').length, 1, 'The Songs tab is active');
	});
});

test('Create a new song in two steps', assert => {
	server = new Pretender(function() {
		this.get('/bands', () => {
			let response = {
				data: [
					{
						id: 1,
						type: 'bands',
						attributes: {
							name: 'Radiohead'
						}
					}
				]
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});

		this.get('/bands/1', () => {
			let response = {
				data: {
					id: 1,
					type: 'bands',
					attributes: {
						name: 'Radiohead'
					}
				}
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});

		this.post('/songs', () => {
			let response = {
				data: {
					id: 1,
					type: 'songs',
					attributes: {
						name: 'Killer Cars'
					}
				}
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});

		this.get('/bands/1/songs', () => {
			let response = {
				data: []
			};
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify(response)];
		});
	});

	visit('/');
	click('.band-link:contains("Radiohead")');
	click('a:contains("create one")');
	fillIn('.new-song', 'Killer Cars');
	triggerEvent('.new-song-form', 'submit');

	andThen(() => {
		assert.equal(find('.songs .song:contains("Killer Cars")').length, 1, 'Creates the song and displays it in the list');
	});
});