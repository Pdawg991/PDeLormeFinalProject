const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');

router.route('/')
    .get(statesController.getAllStates)
    .post(statesController.createNewState)
    .put(statesController.updateState)
    .delete(statesController.deleteState);

router.route('/:code')
    .get(statesController.getState);
router.route('/:code/population')
    .get(statesController.getStatePopulation);
router.route('/:code/nickname')
    .get(statesController.getStateNickname);
router.route('/:code/capital')
    .get(statesController.getStateCapital);
router.route('/:code')
    .get(statesController.getState);
module.exports = router;