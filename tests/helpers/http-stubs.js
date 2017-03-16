function songsUrlForBand(id) {
	return '/bands/' + id + '/songs';
}

function responseItemForBand(data, id = data.id) {
	return {
		id,
		type: 'bands',
		attributes: data.attributes,
		relationships: {
			songs: {
				links: {
					related: songsUrlForBand(id)
				}
			}
		}
	};
}

function responseItemForSong(data, id = data.id) {
	return {
		id,
		type: 'bands',
		attributes: data.attributes,
	};
}

export default {
	stubBands (pretender, data) {
		let responseForBands = [];
		data.forEach(band => {
			let responseForBand = responseItemForBand(band);
			pretender.get('/bands/' + responseForBand.id, () => {
				return [200, {
					'Content-Type': 'application/vnd.api+json'
				}, JSON.stringify({data: responseForBand})];
			});
			responseForBands.push(responseForBand);
		});
		pretender.get('/bands', () => {
			return [200, {
				'Content-Type': 'application/vnd.app+json'
			}, JSON.stringify({data: responseForBands})];
		});
	},
	stubSongs (pretender, bandId, data) {
		let response = data.map(song => {
			return responseItemForSong(song);
		});
		pretender.get(songsUrlForBand(bandId), () => {
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify({data: response})];
		});
	},
	stubCreateBand (pretender, newId) {
		pretender.post('/bands', request => {
			let response = responseItemForBand(JSON.parse(request.requestBody).data, newId);
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify({data: response})];
		});
	},
	stubCreateSong (pretender, newId) {
		pretender.post('/songs', request => {
			let response = responseItemForSong(JSON.parse(request.requestBody).data, newId);
			return [200, {
				'Content-Type': 'application/vnd.api+json'
			}, JSON.stringify({data: response})];
		});
	}
};