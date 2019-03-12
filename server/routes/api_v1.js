var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');
var authCheckMiddleware = require('../middleware/auth_checker');
var User = require('../models/user');
var News = require('../models/news');
var Notice = require('../models/notice');
var Category = require('../models/category');
var Subscription = require('../models/subscription');
var VotedNews = require('../models/votedNews');
var SavedNews = require('../models/savedNews');
var HiddenNews = require('../models/hiddenNews');
var createNoticeEntity = require('../utils/createNoticeEntity');
var news = require('./news');
var categories = require('./categories');

router.post('/notices', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  User.findById(uid, function(err, user) {
    if (err) {
      return res.status(500).end();
    }
    var newNotice = createNoticeEntity(uid, user.username);
    newNotice.save(function(err) {
      if (err) {
        return res.status(500).end();
      }
      return res.json({message: 'Mock notice data has been saved!'});
    });
  });
});

router.post('/categories', function(req, res, next) {
  Category.insertMany(categories, function(err) {
    if (err) {
      return res.status(500).end();
    }
    return res.json({message: 'Mock categories data has been saved!'});
  });
});

router.post('/news', function(req, res, next) {
  News.insertMany(news, function(err) {
    if (err) {
      return res.status(500).end();
    }
    return res.json({message: 'Mock news data has been saved!'});
  });
});

// fetchNotices
router.get('/notices', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  Notice.find({
    uid: uid,
  }, function(err, notices) {
    if (err) {
      return res.status(500).end();
    }
    return res.json(notices);
  })
});

// deleteNotice
router.delete('/notices/:id', authCheckMiddleware, function(req, res, next) {
  var id = ObjectId(req.params.id);
  Notice.findByIdAndRemove(id, function(err, notice) {
    if (err) {
      return res.status(500).end();
    }
    return res.json(notice);
  });
});

// fetchCategory
router.get('/category', function(req, res, next) {
  var cid = req.query.cid;
  if (cid) {
    Category.findById(cid, function(err, category) {
      if (err) {
        return res.status(500).end();
      }
      return res.json(category);
    });
  } else {
    return res.status(400).end();
  }
});

// fetchSubscriptions
router.get('/subscriptions', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  Subscription
    .aggregate([
      {
        $match: {
          uid: uid,
        }
      },
      {
        $lookup: {
          from: "category",
          localField: "cid",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: '$category'
      },
      {   
        $project: {
          _id: 0,
          id: "$cid",
          icon: "$category.icon",
        },
      },
    ])
    .exec(function(err, subscriptions) {
      if (err) {
        return res.status(500).end();
      }
      return res.json(subscriptions);
    });
});

// subscribe
router.post('/subscriptions', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  var cid = req.body.cid;
  if (cid) {
    // 创建新的订阅数据
    var newSubscription = new Subscription({
      uid: uid,
      cid: cid,
    });
    newSubscription.save(function(err) {
      if (err) {
        return res.status(500).end();
      }
      return res.end();
    });
    // 更新订阅人数
    Category.findById(cid, function(err, category) {
      if (err) {
        return res.status(500).end();
      }
      category.subscribers += 1;
      category.save(function(err) {
        if (err) {
           return res.status(500).end();
        }
        return res.end();
      });
    });
  } else {
    return res.status(400).end();
  }
});

// unsubscribe
router.delete('/subscriptions/:id', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  var cid = req.params.id;
  if (cid) {
    // 删除订阅数据
    Subscription.remove({
      uid: uid,
      cid: cid,
    }, function(err) {
      if (err) {
        return res.status(500).end();
      }
      return res.end();
    });
    // 更新订阅人数
    Category.findById(cid, function(err, category) {
      if (err) {
        return res.status(500).end();
      }
      category.subscribers -= 1;
      category.save(function(err) {
        if (err) {
           return res.status(500).end();
        }
        return res.end();
      });
    });
  } else {
    return res.status(400).end();
  }
});

// fetchSearchResults
router.get('/search', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  Category
    .aggregate([
      {
        $lookup: {
          from: "subscription",
          localField: "_id",
          foreignField: "cid",
          as: "subscriptions",
        },
      },
      {
        $addFields: {
          id: '$_id', // 用id代替_id
          subscribed: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: {
                      $filter: {
                        input: "$subscriptions",
                        as: "item",
                        cond: {
                          $eq: ["$$item.uid", uid],
                        },
                      },
                    },
                  }, 0],
                },
              then: false,
              else: true,
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // 去掉_id
          __v: 0, // 去掉__v
          subscriptions: 0, // 去掉subscriptions
        },
      },
    ])
    .exec(function(err, categories) {
      if (err) {
        return res.status(500).end();
      }
      return res.json(categories);
    });
});

// fetchNewsList
router.get('/news', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  var cid = req.query.cid;
  News.aggregate([
    {
      $match: {
        cid: cid, // 从news中找到当前分类下的所有新闻
      },
    },
    {
      $lookup: {
        from: "votedNews",
        localField: "_id",
        foreignField: "nid",
        as: "votedNews", // 从votedNews中找到每条新闻对应的voted数据
      },
    },
    {
      $lookup: {
        from: "savedNews",
        localField: "_id",
        foreignField: "nid",
        as: "savedNews", // 从savedNews中找到每条新闻对应的saved数据
      },
    },
    {
      $lookup: {
        from: "hiddenNews",
        localField: "_id",
        foreignField: "nid",
        as: "hiddenNews", // 从hiddenNews中找到每条新闻对应的hidden数据
      },
    },
    {
      $addFields: {
        id: '$_id',
        voted: {
          $cond: {
            if: {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$votedNews",
                      as: "item",
                      cond: {
                        $eq: ["$$item.uid", uid],
                      },
                    },
                  },
                },
                0
              ],
            },
            then: 0, // 如果没有当前用户的voted数据就置为0
            else: {
              $arrayElemAt: ['$votedNews.voted', 0], // 如有就找到voted字段的值
            }
          },
				},
        saved: {
          $cond: {
						if: {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$savedNews",
                      as: "item",
                      cond: {
                        $eq: ["$$item.uid", uid], // 过滤出当前用户的saved数据
                      },
                    },
                  },
                },
                0,
              ],
            },
            then: false, // 如果没有当前用户的saved数据就置为false
            else: true,  // 如有就置为true
					},
        },
        hidden: {
          $cond: {
						if: {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$hiddenNews",
                      as: "item",
                      cond: {
                        $eq: ["$$item.uid", uid], // 过滤出当前用户的hidden数据
                      },
                    },
                  },
                },
                0,
              ],
            },
            then: false, // 如果没有当前用户的hidden数据就置为false
            else: true,  // 如有就置为true
					},
        },
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        votedNews: 0,
        savedNews: 0,
        hiddenNews: 0,
      },
    },
  ])
  .exec(function(err, newsList) {
    if (err) {
      return res.status(500).end();
    }
    return res.json(newsList);
  });
});

// fetchFeedNewsList
router.get('/feedNews', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  var feed = req.query.feed;
  switch(feed) {
    case 'home':
      // 返回当前用户订阅的所有分类的新闻数据
      Subscription.aggregate([
        {
          $match: {
            uid: uid,
          },
        },
        {
          $lookup: {
            from: "news",
            localField: "cid",
            foreignField: "cid",
            as: "news",
          },
        },
        {
          $unwind: '$news',
        },
        {
          $replaceRoot: {
            newRoot: '$news',
          },
        },
        {
          $lookup: {
            from: "votedNews",
            localField: "_id",
            foreignField: "nid",
            as: "votedNews",
          },
        },
        {
          $lookup: {
            from: "savedNews",
            localField: "_id",
            foreignField: "nid",
            as: "savedNews",
          },
        },
        {
          $lookup: {
            from: "hiddenNews",
            localField: "_id",
            foreignField: "nid",
            as: "hiddenNews",
          },
        },
        {
          $addFields: {
            id: '$_id',
            voted: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$votedNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0
                  ],
                },
                then: 0,
                else: {
                  $arrayElemAt: ['$votedNews.voted', 0],
                }
              },
            },
            saved: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$savedNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
            hidden: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$hiddenNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            votedNews: 0,
            savedNews: 0,
            hiddenNews: 0,
          },
        },
      ])
      .exec(function(err, newsList) {
        if (err) {
          return res.status(500).end();
        }
        return res.json(newsList);
      });
      break;
    case 'popular':
      // 返回votes排名靠前的新闻数据
      News.aggregate([
        {
          $sort: {
            votes: -1,
          },
        },
        {
          $match: {
            votes: {
              $gt: 0,
            },
          },
        },
        {
          $lookup: {
            from: "votedNews",
            localField: "_id",
            foreignField: "nid",
            as: "votedNews",
          },
        },
        {
          $lookup: {
            from: "savedNews",
            localField: "_id",
            foreignField: "nid",
            as: "savedNews",
          },
        },
        {
          $lookup: {
            from: "hiddenNews",
            localField: "_id",
            foreignField: "nid",
            as: "hiddenNews",
          },
        },
        {
          $addFields: {
            id: '$_id',
            voted: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$votedNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0
                  ],
                },
                then: 0,
                else: {
                  $arrayElemAt: ['$votedNews.voted', 0],
                }
              },
            },
            saved: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$savedNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
            hidden: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$hiddenNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            votedNews: 0,
            savedNews: 0,
            hiddenNews: 0,
          },
        },
      ])
      .exec(function(err, newsList) {
        if (err) {
          return res.status(500).end();
        }
        return res.json(newsList);
      });
      break;
    case 'all':
      // 返回所有新闻数据
      News.aggregate([
        {
          $lookup: {
            from: "votedNews",
            localField: "_id",
            foreignField: "nid",
            as: "votedNews",
          },
        },
        {
          $lookup: {
            from: "savedNews",
            localField: "_id",
            foreignField: "nid",
            as: "savedNews",
          },
        },
        {
          $lookup: {
            from: "hiddenNews",
            localField: "_id",
            foreignField: "nid",
            as: "hiddenNews",
          },
        },
        {
          $addFields: {
            id: '$_id',
            voted: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$votedNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0
                  ],
                },
                then: 0,
                else: {
                  $arrayElemAt: ['$votedNews.voted', 0],
                }
              },
            },
            saved: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$savedNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
            hidden: {
              $cond: {
                if: {
                  $eq: [
                    {
                      $size: {
                        $filter: {
                          input: "$hiddenNews",
                          as: "item",
                          cond: {
                            $eq: ["$$item.uid", uid],
                          },
                        },
                      },
                    },
                    0,
                  ],
                },
                then: false,
                else: true,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            __v: 0,
            votedNews: 0,
            savedNews: 0,
            hiddenNews: 0,
          },
        },
      ])
      .exec(function(err, newsList) {
        if (err) {
          return res.status(500).end();
        }
        return res.json(newsList);
      });
      break;
    default:
      return res.status(400).end();
  }
});

// strategies[previous voted, state] => [current voted, incremental votes]
var strategies = {
  [-1]: {
    1: [1, 2],
    [-1]: [0, 1],
  },
  0: {
    1: [1, 1],
    [-1]: [-1, -1],
  },
  1: {
    1: [0, -1],
    [-1]: [-1, -2],
  },
};

// voteNews
router.post('/votedNews', authCheckMiddleware, function(req, res, next) {
  var uid,
      nid,
      state,
      newVotedNews,
      strategy;
  if (req.body.id && req.body.state) {
    uid = ObjectId(req.uid);
    nid = ObjectId(req.body.id);
    state = req.body.state;
    VotedNews.findOne({
      uid: uid,
      nid: nid,
    }, function(err, votedNews) {
      if (err) {
        return res.status(500).end();
      }
      if (!votedNews) {
        // 获取更新策略
        strategy = strategies[0][state];
        // 创建新的votedNews
        newVotedNews = new VotedNews({
          uid: uid,
          nid: nid,
          voted: strategy[0],
        });
        newVotedNews.save(function(err) {
          if (err) {
            return res.status(500).end();
          }
          // 更新当前news的votes字段
          News.findById(nid, function(err, news) {
            if (err) {
              return res.status(500).end();
            }
            news.votes += strategy[1];
            news.save(function(err) {
              if (err) {
                 return res.status(500).end();
              }
              return res.end();
            });
          });
        });
      } else {
        // 获取更新策略
        strategy = strategies[votedNews.voted][state];
        if (strategy[0] === 0) {
          // 从表中删除当前记录
          VotedNews.findByIdAndRemove(votedNews._id, function(err) {
            if (err) {
              return res.status(500).end();
            }
            // 更新当前news的votes字段
            News.findById(nid, function(err, news) {
              if (err) {
                return res.status(500).end();
              }
              news.votes = news.votes + strategy[1];
              news.save(function(err) {
                if (err) {
                  return res.status(500).end();
                }
                return res.end();
              });
            });
          });
        } else {
          // 更新当前votedNews的voted字段
          VotedNews.findByIdAndUpdate(votedNews._id, {
            voted: strategy[0],
          }, function(err) {
            if (err) {
              return res.status(500).end();
            }
            // 更新当前news的votes字段
            News.findById(nid, function(err, news) {
              if (err) {
                return res.status(500).end();
              }
              news.votes = news.votes + strategy[1];
              news.save(function(err) {
                if (err) {
                  return res.status(500).end();
                }
                return res.end();
              });
            });
          });
        }
      }
    });
  } else {
    return res.status(400).end();
  }
});

// saveNews
router.post('/savedNews', authCheckMiddleware, function(req, res, next) {
  if (req.body.id) {
    var uid = ObjectId(req.uid);
    var nid = ObjectId(req.body.id);
    SavedNews.findOne({
      uid: uid,
      nid: nid,
    }, function(err, savedNews) {
      if (err) {
        return res.status(500).end();
      }
      if (savedNews) {
        // 存在就删除
        SavedNews.findByIdAndDelete(savedNews._id, function(err) {
          if (err) {
            return res.status(500).end();
          }
          return res.end();
        });
      } else {
        // 不存在就创建
        var newSavedNews = new SavedNews({
          uid: uid,
          nid: nid,
        });
        newSavedNews.save(function(err) {
          if (err) {
            return res.status(500).end();
          }
          return res.end();
        });
      }
    });
  } else {
    return res.status(400).end();
  }
});

// hideNews
router.post('/hiddenNews', authCheckMiddleware, function(req, res, next) {
  if (req.body.id) {
    var uid = ObjectId(req.uid);
    var nid = ObjectId(req.body.id);
    HiddenNews.findOne({
      uid: uid,
      nid: nid,
    }, function(err, hiddenNews) {
      if (err) {
        return res.status(500).end();
      }
      if (hiddenNews) {
        // 存在就删除
        HiddenNews.findByIdAndDelete(hiddenNews._id, function(err) {
          if (err) {
            return res.status(500).end();
          }
          return res.end();
        });
      } else {
        // 不存在就创建
        var newHiddenNews = new HiddenNews({
          uid: uid,
          nid: nid,
        });
        newHiddenNews.save(function(err) {
          if (err) {
            return res.status(500).end();
          }
          return res.end();
        });
      }
    });
  } else {
    return res.status(400).end();
  }
});

// fetchVotedNews
router.get('/votedNews', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  var v = parseInt(req.query.v);
  if (!_.isNaN(v)) {
    VotedNews.aggregate([
      {
        $match: {
          uid: uid,
          voted: v,
        },
      },
      {
        $lookup: {
          from: "news",
          localField: "nid",
          foreignField: "_id",
          as: "news",
        },
      },
      {
        $lookup: {
          from: "savedNews",
          localField: "nid",
          foreignField: "nid",
          as: "savedNews",
        },
      },
      {
        $lookup: {
          from: "hiddenNews",
          localField: "nid",
          foreignField: "nid",
          as: "hiddenNews",
        },
      },
      {
        $addFields: {
          news: {
            $arrayElemAt: ['$news', 0],
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$nid',
          source: '$news.source',
          author: '$news.author',
          title: '$news.title',
          description: '$news.description',
          url: '$news.url',
          urlToImage: '$news.urlToImage',
          publishedAt: '$news.publishedAt',
          content: '$news.content',
          cid: '$news.cid',
          votes: '$news.votes',
          voted: 1,
          saved: {
            $eq: [
              {
                $size: {
                  $filter: {
                    input: "$savedNews",
                    as: "item",
                    cond: {
                      $eq: ["$$item.uid", uid],
                    },
                  },
                },
              },
              1
            ],
          },
          hidden: {
            $eq: [
              {
                $size: {
                  $filter: {
                    input: "$hiddenNews",
                    as: "item",
                    cond: {
                      $eq: ["$$item.uid", uid],
                    },
                  },
                },
              },
              1
            ],
          },
        },
      },
    ])
    .exec(function(err, newsList) {
      if (err) {
        return res.status(500).end();
      }
      return res.json(newsList);
    });
  } else {
    return res.status(400).end();
  }
});

// fetchSavedNews
router.get('/savedNews', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  SavedNews.aggregate([
    {
      $match: {
        uid: uid,
      },
    },
    {
      $lookup: {
        from: "news",
        localField: "nid",
        foreignField: "_id",
        as: "news",
      },
    },
    {
      $lookup: {
        from: "votedNews",
        localField: "nid",
        foreignField: "nid",
        as: "votedNews",
      },
    },
    {
      $lookup: {
        from: "hiddenNews",
        localField: "nid",
        foreignField: "nid",
        as: "hiddenNews",
      },
    },
    {
      $addFields: {
        news: {
          $arrayElemAt: ['$news', 0],
        },
        saved: true,
      },
    },
    {
      $project: {
        _id: 0,
        id: '$nid',
        source: '$news.source',
        author: '$news.author',
        title: '$news.title',
        description: '$news.description',
        url: '$news.url',
        urlToImage: '$news.urlToImage',
        publishedAt: '$news.publishedAt',
        content: '$news.content',
        cid: '$news.cid',
        votes: '$news.votes',
        voted: {
          $cond: {
            if: {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$votedNews",
                      as: "item",
                      cond: {
                        $eq: ["$$item.uid", uid],
                      },
                    },
                  },
                },
                0
              ],
            },
            then: 0,
            else: {
              $arrayElemAt: ['$votedNews.voted', 0],
            }
          },
        },
        saved: 1,
        hidden: {
          $eq: [
            {
              $size: {
                $filter: {
                  input: "$hiddenNews",
                  as: "item",
                  cond: {
                    $eq: ["$$item.uid", uid],
                  },
                },
              },
            },
            1
          ],
        },
      },
    },
  ])
  .exec(function(err, newsList) {
    if (err) {
      return res.status(500).end();
    }
    return res.json(newsList);
  });
});

// fetchHiddenNews
router.get('/hiddenNews', authCheckMiddleware, function(req, res, next) {
  var uid = ObjectId(req.uid);
  HiddenNews.aggregate([
    {
      $match: {
        uid: uid,
      },
    },
    {
      $lookup: {
        from: "news",
        localField: "nid",
        foreignField: "_id",
        as: "news",
      },
    },
    {
      $lookup: {
        from: "votedNews",
        localField: "nid",
        foreignField: "nid",
        as: "votedNews",
      },
    },
    {
      $lookup: {
        from: "savedNews",
        localField: "nid",
        foreignField: "nid",
        as: "savedNews",
      },
    },
    {
      $addFields: {
        news: {
          $arrayElemAt: ['$news', 0],
        },
        hidden: true,
      },
    },
    {
      $project: {
        _id: 0,
        id: '$nid',
        source: '$news.source',
        author: '$news.author',
        title: '$news.title',
        description: '$news.description',
        url: '$news.url',
        urlToImage: '$news.urlToImage',
        publishedAt: '$news.publishedAt',
        content: '$news.content',
        cid: '$news.cid',
        votes: '$news.votes',
        voted: {
          $cond: {
            if: {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$votedNews",
                      as: "item",
                      cond: {
                        $eq: ["$$item.uid", uid],
                      },
                    },
                  },
                },
                0
              ],
            },
            then: 0,
            else: {
              $arrayElemAt: ['$votedNews.voted', 0],
            }
          },
        },
        saved: {
          $eq: [
            {
              $size: {
                $filter: {
                  input: "$savedNews",
                  as: "item",
                  cond: {
                    $eq: ["$$item.uid", uid],
                  },
                },
              },
            },
            1
          ],
        },
        hidden: 1,
      },
    },
  ])
  .exec(function(err, newsList) {
    if (err) {
      return res.status(500).end();
    }
    return res.json(newsList);
  });
});

module.exports = router;
