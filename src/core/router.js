const FindMyWay = require('find-my-way');
const { index } = require('../controllers/homeController');
const router = FindMyWay();
router.get('/', index);
function lookup(req, res) {
    router.lookup(req, res);
}
module.exports = { lookup };