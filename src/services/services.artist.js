const axios = require('axios');

module.exports = class ArtistService {
  // retireves both the id and the albums, only one call is required
  static async getWikiIdAndAlbums(mbid) {
    const [wikiId, albums] = await axios
      .get(`http://musicbrainz.org/ws/2/artist/${mbid}?&fmt=json&inc=url-rels+release-groups`)
      .then((mbRes) => {
        let albums = [];
        let wikiId;
        for (const i in mbRes.data.relations) {
          if (mbRes.data.relations[i].type === 'wikidata') {
            // remove the uri since we just want the wiki id
            wikiId = mbRes.data.relations[i].url['resource'].replace('https://www.wikidata.org/wiki/', '');
          }
        }
        mbRes.data['release-groups'].forEach((release) => {
          let album = {
            title: release.title,
            id: release.id,
          };
          albums.push(album);
        });
        return [wikiId, albums];
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error('Could not get wiki id and albums');
      });
    return [wikiId, albums];
  }

  static async getArtistTitle(wikiId) {
    const artistTitle = await axios
      .get(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wikiId}&format=json&pr`)
      .then((wikidataRes) => {
        const title = wikidataRes.data.entities[wikiId].sitelinks.enwiki['title'].replace(' ', '%20');
        return title;
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error('Could not get artist title');
      });
    return artistTitle;
  }

  static async getArtistDescription(artistTitle) {
    const artistDescription = await axios
      .get(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${artistTitle}`)
      .then((wikipediaRes) => {
        // the artist description is always under a certain page number
        // the page number is always different so we need to get it first
        const page = Object.keys(wikipediaRes.data.query.pages)[0];
        // after that we can get the description (extract) and return it
        const artistDescription = wikipediaRes.data.query.pages[page].extract;
        return artistDescription;
      })
      .catch((err) => {
        console.error(err.message);
        throw new Error('Could not get artist description');
      });
    return artistDescription;
  }

  // function that retrieves all covers to a list of albums
  // every call has to resolve or reject before the function returns a resolved promise
  static async getCovers(albums) {
    const promises = [];
    albums.forEach((album) => {
      promises.push(
        axios
          .get(`https://coverartarchive.org/release-group/${album.id}`)
          .then((res) => {
            album.image = res.data.images[0].image;
          })
          .catch((err) => {
            if (err.response.status == 404) {
              console.error(`Could not find cover image for: ${album.title}`);
            } else {
              console.error(err.message);
            }
          })
      );
    });
    return Promise.all(promises);
  }
};
