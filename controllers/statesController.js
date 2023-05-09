const State = require('../model/State');
const data = {}
data.states = require('../model/states.json');
const { validState } = require('../middleware/validState.js');

// Retrieves all states data, and combines the funfacts array into the JSON data. 
const getAllStates = async (req, res) => {
    if(req.query.contig == 'true'){
            var data_filter = data.states.filter( element => element.code != "AK" && element.code != "HI")
                res.send(data_filter);
            return
        }
        if(req.query.contig == 'false'){
            var data_filter = data.states.filter( element => element.code == "AK" || element.code == "HI")
                res.send(data_filter);  
            return      
        }
        const states = await State.find();
        for (i = 0; i < 50; i++){
            for(j = 0; j < states.length; j++){
                if(data.states[i]['code'] == states[j]['code']){
                    data.states[i]['funfacts'] = states[j]['funfacts']
                    break
                }
            }
        }
    if (!states) return res.status(204).json({ 'message': 'No states found.' });
        res.send(data.states);
}

// Creates new MONGODB document
const createNewState = async (req, res) => {
    if (!req?.body?.funfacts) {
        return res.status(400).json({ 'message': 'State fun facts value required' });
    }
    if (!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ 'message': 'State fun facts value must be an array' });
    }
    const state = await State.findOne({code: req.params.code});
    if(state){  
        await State.updateOne({code: req.params.code}, {$push: { funfacts : { $each: req.body.funfacts }}})
        
        res.status(201).json(await State.findOne({code: req.params.code}));
        return
    }
    else{
        const result = await State.create({
            code: req.params.code,
            funfacts: req.body.funfacts
        });
    res.status(201).json(result);
    }
}

// Updates the MONGODB state funfact at a specified index
const updateState = async (req, res) => {
    let obj = { code: req.params.code, name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: "" }
    validState(obj)
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }
    if(!req?.body?.funfact){
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }
    const state = await State.findOne({ code: obj.code});
    if (!state) {
        return res.status(400).json({ 'message': `No Fun Facts found for ${obj.name}` });
    }
    const num = req.body.index-1;
    if(!state.funfacts[num]){    
        
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${obj.name}` });
    }
    state.funfacts[num] = obj.funfact;
    await State.updateOne({code: obj.code},{ $set: { funfacts : state.funfacts } })
    res.json(state)
}

// Deletes the MONGODB state funfact at a given index
const deleteStateFunfact = async (req, res) => {
    if (!req?.body?.index) return res.status(400).json({ 'message': 'State fun fact index value required' });
    var stateName = data.states.find( element => element.code == req.params.code) 
    const state = await State.findOne({ code: req.params.code });
   if(!state){
        return res.json({ 'message': `No Fun Facts found for ${stateName.state}` });
   }
    const num = req.body.index-1;
    if(!state.funfacts[num]){    
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${stateName.state}` });
    }
    state.funfacts.splice(num, 1)
    await State.updateOne({code: req.params.code},{ $set: { funfacts : state.funfacts } })
    res.json(state)
}

// Gets a state at a given code
const getState = async (req, res) => {
    let obj = { code: req.params.code, name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: ""}
    validState(obj);
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    if (!req?.params?.code) {
        return res.status(400).json({ 'message': 'Code parameter is required.' });
    }
    const state = await State.findOne({code: obj.code});
    data_filter = data.states.find((state) => (state.code.toLowerCase() === obj.code.toLowerCase()));
    if(state){
        data_filter['funfacts'] = state['funfacts'];
    }
    let retData = Object.assign({}, data_filter);
    res.send(retData);
}

// Gets a states population at a given code
const getStatePopulation = async (req, res) => {
    let obj = { code: req.params.code, name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: ""}
    validState(obj)
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    res.json({"state": obj.name, "population" : obj.population});
}    

// Gets a state funfact at a given code from MONGODB
const getStateFunfact = async (req, res) => {
    let obj = { code: req.params.code.toUpperCase(), name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: ""}
    validState(obj)
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    const state = await State.findOne({code: obj.code});
    if(!state){
        return res.json({"message" : `No Fun Facts found for ${obj.name}`});
    }
    if (!req?.params?.code) return res.status(400).json({ 'message': 'State code required.' });
        return res.send({"funfact" : state.funfacts[Math.floor(Math.random() * state.funfacts.length)]})
}

// Gets a state nickname at a given code
const getStateNickname = async (req, res) => {
    let obj = { code: req.params.code.toUpperCase(), name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: ""}
    validState(obj)
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    res.json({"state": obj.name, "nickname" : obj.nickname});
}

// Gets a state capital at a given code
const getStateCapital = async (req, res) => {
    let obj = { code: req.params.code.toUpperCase(), name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: ""}
    validState(obj)
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    res.json({"state": obj.name, "capital" : obj.capital});
}

// Gets a states admission date
const getStateAdmission = async (req, res) => {
    let obj = {code: req.params.code.toUpperCase(), name: "", valid: false, funfact: req.body.funfact, population: 0, nickname: "", capital: "", admission: ""}
    validState(obj)
    if (!obj.valid) {
        return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    res.json({"state": obj.name, "admitted" : obj.admission });
}

module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteStateFunfact,
    getState,
    getStatePopulation,
    getStateNickname,
    getStateCapital,
    getStateAdmission,
    getStateFunfact
}