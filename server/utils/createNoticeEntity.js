var Notice = require('../models/notice');

function createNoticeEntity(uid, username) {
  return new Notice({
    uid: uid,
    title: 'New message to ' + username,
    message: '' + Date.now(),
  });
}

module.exports = createNoticeEntity;