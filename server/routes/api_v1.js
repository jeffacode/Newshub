var express = require('express');
var router = express.Router();
var authCheckMiddleware = require('../middleware/auth_checker');

var jayson = require('jayson');

var client = jayson.client.http({
  port: 4040,
  hostname: 'localhost',
});

// fetchNotices
router.get('/notices', authCheckMiddleware, function(req, res, next) {
  client.request('getNotices', [req.uid], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// deleteNotice
router.delete('/notices/:id', authCheckMiddleware, function(req, res, next) {
  client.request('deleteNotice', [req.params.id], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchCategory
router.get('/category', function(req, res, next) {
  client.request('fetchCategory', [req.query.cid], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchSubscriptions
router.get('/subscriptions', authCheckMiddleware, function(req, res, next) {
  client.request('fetchSubscriptions', [req.uid], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// subscribe
router.post('/subscriptions', authCheckMiddleware, function(req, res, next) {
  client.request('subscribe', [req.uid, req.body.cid], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// unsubscribe
router.delete('/subscriptions/:cid', authCheckMiddleware, function(req, res, next) {
  client.request('unsubscribe', [req.uid, req.params.cid], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchSearchResults
router.get('/search', authCheckMiddleware, function(req, res, next) {
  client.request('fetchSearchResults', [req.uid], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchCategoryNewsList
router.get('/categoryNews', authCheckMiddleware, function(req, res, next) {
  var uid = req.uid;
  var cid = req.query.cid;
  var page = req.query.page;
  var t = req.query.t || 'week';
  var p = req.query.p || 'new';
  client.request('fetchCategoryNewsList', [uid, cid, page, t, p], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchFeedNewsList
router.get('/feedNews', authCheckMiddleware, function(req, res, next) {
  var uid = req.uid;
  var feed = req.query.feed;
  var page = req.query.page;
  var t = req.query.t || 'week';
  var p = req.query.p || 'new';
  client.request('fetchFeedNewsList', [uid, feed, page, t, p], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// voteNews
router.post('/votedNews', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var news_id = req.body.id;
  var state = req.body.state;
  client.request('voteNews', [user_id, news_id, state], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// saveNews
router.post('/savedNews', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var news_id = req.body.id;
  client.request('saveNews', [user_id, news_id], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// hideNews
router.post('/hiddenNews', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var news_id = req.body.id;
  client.request('hideNews', [user_id, news_id], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchVotedNews
router.get('/votedNews', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var v = req.query.v;
  var page = req.query.page;
  var t = req.query.t || 'week';
  var p = req.query.p || 'new';
  client.request('fetchVotedNews', [user_id, v, page, t, p], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchSavedNews
router.get('/savedNews', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var page = req.query.page;
  var t = req.query.t || 'week';
  var p = req.query.p || 'new';
  client.request('fetchSavedNews', [user_id, page, t, p], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// fetchHiddenNews
router.get('/hiddenNews', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var page = req.query.page;
  var t = req.query.t || 'week';
  var p = req.query.p || 'new';
  client.request('fetchHiddenNews', [user_id, page, t, p], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

// sendClickLog
router.post('/clickLog', authCheckMiddleware, function(req, res, next) {
  var user_id = req.uid;
  var news_id = req.body.id;
  client.request('sendClickLog', [user_id, news_id], function(err, response) {
    if (response && response.result) {
      return res.json(response.result);
    }
    return res.status(500).end();
  });
});

module.exports = router;
