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

test('visiting /', function(assert) {
	visit('/');

	andThen(function() {
		assert.equal(currentURL(), '/bands');
	});
});

test('visiting /bands', function(assert) {
	visit('/bands');

	andThen(function() {
		assert.equal(currentURL(), '/bands');
	});
});

let server;

test('List bands', function(assert) {
	server = new Pretender(function() {
		this.get('/bands', function() {
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

	andThen(function() {
		assert.equal(currentURL(), '/bands');
		assert.equal(find('.band-link').length, 2, 'All band links are rendered');
		assert.equal(find('.band-link:contains("Radiohead")').length, 1, 'First band link contains the band name');
		assert.equal(find('.band-link:contains("Long Distance Calling")').length, 1, 'The other band link contains the band name');
	});
});

test('Create a new band', function(assert) {
	server = new Pretender(function() {
		this.get('/bands', function() {
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

		this.post('/bands', function() {
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

		this.get('/bands/2/songs', function() {
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

	andThen(function() {
		assert.equal(find('.band-link').length, 2, 'All band links are rendered');
		assert.equal(find('.band-link:last').text().trim(), 'Long Distance Calling', 'Created band appears at the end of the list');
		assert.equal(find('.nav a.active:contains("Songs")').length, 1, 'The Songs tab is active');
	});
});
