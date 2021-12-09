const ArtistService = require('../services/services.artist');

module.exports = class ArtistController {
  static async getArtistById(req, res) {
    const mbid = req.params.id;

    try {
      const [wikiId, albums] = await ArtistService.getWikiIdAndAlbums(mbid);

      // requests are made for each albums cover, async so the code can move on
      const coversRequest = ArtistService.getCovers(albums);

      const artistTitle = await ArtistService.getArtistTitle(wikiId);

      const artistDescription = await ArtistService.getArtistDescription(artistTitle);
      // when the covers promise has resolved, it means all data has been retrieved
      coversRequest.then(() => {
        res.json({ mbid: mbid, description: artistDescription, albums: albums });
      });
    } catch (err) {
      console.error(err.message);
      res.send(err.message);
    }
  }
};
