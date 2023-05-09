const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/:code/funfact')
    .post(statesController.createNewState)
router.route('/:code/funfact')
    .patch(statesController.updateState)
router.route('/states/?contig')
    .get(statesController.getAllStates)
router.route('/')
    .get(statesController.getAllStates)
router.route('/:code')
    .get(statesController.getState);
router.route('/:code/population')
    .get(statesController.getStatePopulation);
router.route('/:code/nickname')
    .get(statesController.getStateNickname);
router.route('/:code/capital')
    .get(statesController.getStateCapital);
router.route('/:code/admission')
    .get(statesController.getStateAdmission);
router.route('/:code/funfact')
    .get(statesController.getStateFunfact);
router.route('/:code/funfact')
    .delete(statesController.deleteStateFunfact);

module.exports = router;