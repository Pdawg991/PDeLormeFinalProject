const State = require('../model/State');
const data = {}
data.states = require('../model/states.json');

const getAllStates = async (req, res) => {
    const states = await State.find();
    if (!states) return res.status(204).json({ 'message': 'No states found.' });
    res.send(data.states);
}

const createNewState = async (req, res) => {
    if (!req?.body?.code || !req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'Code Required' });
    }

    try {
        const result = await State.create({
            code: req.body.code,
            funfacts: req.body.funfacts
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateState = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Code parameter is required.' });
    }

    const state = await State.findOne({ _id: req.body.id }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches code ${req.body.id}.` });
    }
    if (req.body?.code) state.code = req.body.code;
    if (req.body?.funfacts) state.funfacts = req.body.funfacts;
    const result = await state.save();
    res.json(result);
}

const deleteState = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'State code required.' });

    const state = await State.findOne({ _id: req.body.id }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches Code ${req.body.id}.` });
    }
    const result = await state.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getState = async (req, res) => {
    if (!req?.params?.code) return res.status(400).json({ 'message': 'State code required.' });
    
    const state = await State.findOne({}, {code:res.body.code, _id:0}).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches code ${req.params.id}.` });
    }
    res.json(state);
}

const getStatePopulation = async (req, res) => {
    let population =  0;
    for (i = 0; i < 50; i++){
        if (data.states[i]['code'] == req.params.code){
            population = data.states[i]['population']
        }
    }
    res.json({"code": req.params.code, "population" : population});
}
module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState,
    getStatePopulation
}