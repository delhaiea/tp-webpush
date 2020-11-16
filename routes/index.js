const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const vapidKeys = require('../keys.js');
webpush.setVapidDetails('mailto:alexis.delhaie@yahoo.com', vapidKeys.publicKey, vapidKeys.privateKey);
const utils = require('../tools/utils')
const sub = require('../tools/subscription');
sub.initDb();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/get-vapid-public-key', function (req, res) {
    res.send({ vapidKey: vapidKeys.publicKey })
});

router.post('/api/save-subscription/', function (req, res) {
  if (!utils.isValidSaveRequest(req, res)) {
      return;
  }
  return sub.saveSubscription(req.body)
      .then(function(subscriptionId) {
        console.log(subscriptionId)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: { success: true } }));
      })
      .catch(function(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          error: {
            id: 'unable-to-save-subscription',
            message: 'The subscription was received but we were unable to save it to our database.'
          }
        }));
      });
});

router.post('/api/send-notification/', async (req, res) => {
    const title = req.body.title;
    const message = req.body.message;
    const tag = req.body.tag;
    const picture = req.body.picture;
    const icon = req.body.icon;
    let success = 0;
    let failed = 0;
    const arr = await sub.getAll();
    arr.forEach((subscription) => {
        try {
            webpush.sendNotification(JSON.parse(subscription.endpoint), JSON.stringify({title, message, tag, picture, icon}))
            success++;
        } catch (e) {
            failed++;
        }
    })
    res.send({status: "ok", success, failed})
});

module.exports = router;
