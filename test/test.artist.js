let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
const ArtistService = require('../src/services/services.artist');

// assertion
let should = chai.should();
chai.use(chaiHttp);

// chai testes api routes
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

  describe('Get wiki ID and albums', () => {
    it('it should retrive a wiki id and a list of albums from MusicBrains', (done) => {
      const mbId = '5b11f4ce-a62d-471e-81fc-a69a8278c7da';
      ArtistService.getWikiIdAndAlbums(mbId).then(([id, albums]) => {
        id.should.be.a('string');
        albums.should.be.a('array');
        done();
      });
    });
  });
});
