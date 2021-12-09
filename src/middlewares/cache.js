const apicache = require('apicache');

const cache = apicache.middleware;

exports.cache = cache('1 minute');
