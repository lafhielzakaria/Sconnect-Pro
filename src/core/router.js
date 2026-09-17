const FindMyWay = require('find-my-way');
const { index } = require('../controllers/homeController');
const  associationController = require('../controllers/associations/associationController');
const  associationRegistrationController= require('../controllers/associations/AssociationRegistrationController');
const  familyController = require('../controllers/family/familyController');
const router = FindMyWay();
router.get('/', index);
router.post('/families', familyController.store);
router.get('/familyCreate', familyController.create);
router.get('/associationDetails/:id', associationController.index);
router.get('/inscription/:id', associationRegistrationController.index);

function lookup(req, res) {
    router.lookup(req, res);
}
module.exports = { lookup };