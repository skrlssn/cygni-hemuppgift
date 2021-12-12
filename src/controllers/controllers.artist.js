const ArtistService = require('../services/services.artist');

module.exports = class ArtistController {
  static async getArtistById(req, res) {
    const mbid = req.params.id;
    // error handling might need to be improved...
    try {
      const [wikiId, albums] = await ArtistService.getWikiIdAndAlbums(mbid);

      // requests are made for each albums cover, async so the code can move on
      const loadCovers = ArtistService.getCovers(albums);

      const artistTitle = await ArtistService.getArtistTitle(wikiId);

      const artistDescription = await ArtistService.getArtistDescription(artistTitle);

      // when the covers promise has resolved, it means all data has been retrieved
      loadCovers.then(() => {
        res.status(200).send({ mbid: mbid, description: artistDescription, albums: albums });
      });
    } catch (err) {
      console.error(err.message);
      res.status(400).send('Could not get artist summary');
    }
  }
};
