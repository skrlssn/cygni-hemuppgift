const express = require('express');
const router = express.Router();
const ArtistController = require('../controllers/controllers.artist');

router.get('/:id', ArtistController.getArtistById);

module.exports = router;
