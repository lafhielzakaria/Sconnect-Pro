const FindMyWay = require('find-my-way');
const { index } = require('../controllers/homeController');
const associationController = require('../controllers/associations/associationController');
const associationRegistrationController = require('../controllers/associations/AssociationRegistrationController');
const familyController = require('../controllers/family/familyController');
const router = FindMyWay();
router.get('/', index);
router.post('/associationRequests/:id/:response', associationRegistrationController.handleInvitationResponse);
router.post('/families/store', familyController.store);
router.post('/register', associationRegistrationController.register);
router.get('/associationCreate', associationController.create);
router.get('/familyCreate', familyController.create);
router.get('/associationDetails/:id', associationController.findById);
router.get('/inscription/:id', associationRegistrationController.index);
router.get('/associations', associationController.index);
router.get('/families', familyController.index);
router.get('/familie/:id', familyController.findObject);
router.post('/association/store', associationController.store);
function lookup(req, res) {
    router.lookup(req, res);
}
module.exports = { lookup };