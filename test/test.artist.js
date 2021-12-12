let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
const ArtistService = require('../src/services/services.artist');

// assertion
let should = chai.should();
chai.use(chaiHttp);

// chai testing all the artist service functions
describe('Artist functions', () => {
  describe('Get wiki ID and albums', () => {
    it('it should retrive a wiki id and a list of albums from MusicBrains', (done) => {
      const mbId = '5b11f4ce-a62d-471e-81fc-a69a8278c7da';
      ArtistService.getWikiIdAndAlbums(mbId).then(([id, albums]) => {
        chai.assert.isString(id);
        chai.assert.isAtLeast(albums.length, 0);
        done();
      });
    });
  });
  describe('Get title', () => {
    it('it should retrive an artist title from WikiData', (done) => {
      const wikiId = 'Q131285';
      ArtistService.getArtistTitle(wikiId).then((title) => {
        chai.assert.isString(title);
        chai.assert.isAtLeast(title.length, 0);
        done();
      });
    });
  });
  describe('Get description', () => {
    it('it should retrive an artist description from Wikipedia', (done) => {
      const title = 'Nirvana%20(band)';
      ArtistService.getArtistDescription(title).then((description) => {
        chai.assert.isString(description);
        chai.assert.isAtLeast(description.length, 0);
        done();
      });
    });
  });
});

// chai testes api route
describe('Artist APIs', () => {
  describe('/GET artist', () => {
    it('it should return an artist summary by the given id', (done) => {
      const mbId = '5b11f4ce-a62d-471e-81fc-a69a8278c7da';
      chai
        .request(server)
        .get('/api/artist/' + mbId)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('mbid');
          response.body.should.have.property('description');
          response.body.should.have.property('albums');
          response.body.should.not.be.eq(0);
          done();
        });
    });
  });
});
