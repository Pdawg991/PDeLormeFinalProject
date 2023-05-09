const State = require('../model/State');
const data = {}
data.states = require('../model/states.json');

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

const updateState = async (req, res) => {
    let name = "";
    let validState = false;
    data.states.some((state) => {if (state.code.toLowerCase() === req.params.code.toLowerCase()) {
        name = state.state
        validState = true}});
    if (!validState) {
      return res.json({ 'message': "Invalid state abbreviation parameter" });
    }
    if (!req?.body?.index) {
        return res.status(400).json({ 'message': 'State fun fact index value required' });
    }
    if(!req?.body?.funfact){
        return res.status(400).json({ 'message': 'State fun fact value required' });
    }
    const state = await State.findOne({ code: req.params.code });
    if (!state) {
        return res.status(400).json({ 'message': `No Fun Facts found for ${name}` });
    }
   
    const num = req.body.index-1;
    if(!state.funfacts[num]){    
        return res.status(400).json({ 'message': `No Fun Fact found at that index for ${name}` });
    }
    state.funfacts[num] = req.body.funfact;
    await State.updateOne({code: req.params.code},{ $set: { funfacts : state.funfacts } })
    res.json(state)
}

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

const getState = async (req, res) => {
    const validState = data.states.some((state) => state.code.toLowerCase() === req.params.code.toLowerCase())
    if (!validState) {
      return res.status(400).json({ 'message': "Invalid state abbreviation parameter" });
    }
    if (!req?.params?.code) {
        return res.status(400).json({ 'message': 'Code parameter is required.' });
    }
    const state = await State.findOne({code: req.params.code});
    data_filter = data.states.find((state) => (state.code.toLowerCase() === req.params.code.toLowerCase()));
    if(state){
    data_filter['funfacts'] = state['funfacts'];
    }
    
    let obj = Object.assign({}, data_filter);
    res.send(obj);
}

const getStatePopulation = async (req, res) => {
    let validState = false;
    let population =  0;
    let name = "";
    data.states.some((state) => {if (state.code.toLowerCase() === req.params.code.toLowerCase()) {
        name = state.state
        population = state.population.toLocaleString()
        validState = true}});
    if (!validState){
        res.json({"message" : "Invalid state abbreviation parameter"});
            }
    res.json({"state": name, "population" : population});
}    

const getStateFunfact = async (req, res) => {
    let name = "";
    let validState = false;
    data.states.some((state) => {if (state.code.toLowerCase() === req.params.code.toLowerCase()) {
        name = state.state
        validState = true}});
    if (!validState){
        res.json({"message" : "Invalid state abbreviation parameter"});
    }
    req.params.code = req.params.code.toUpperCase()
    const state = await State.findOne({code: req.params.code});
    if(!state){
        res.json({"message" : `No Fun Facts found for ${name}`});
        return
    }
    if (!req?.params?.code) return res.status(400).json({ 'message': 'State code required.' });
        res.send({"funfact" : state.funfacts[Math.floor(Math.random() * state.funfacts.length)]})
}

const getStateNickname = async (req, res) => {
    let badReq = true;
    let nickname =  "";
    let state = "";
    for (i = 0; i < 50; i++){
        if (data.states[i]['code'].toLowerCase() == req.params.code.toLowerCase()){
            nickname = data.states[i]['nickname'];
            state = data.states[i]['state'];
            badReq = false;
        }
    }
    if (badReq==true){
    res.json({"message" : "Invalid state abbreviation parameter"});
        }
    res.json({"state": state, "nickname" : nickname});
}

const getStateCapital = async (req, res) => {
    let badReq = true;
    let capital_city =  "";
    let state = "";
    for (i = 0; i < 50; i++){
        if (data.states[i]['code'].toLowerCase() == req.params.code.toLowerCase()){
            capital_city = data.states[i]['capital_city']
            state = data.states[i]['state'];
            badReq = false;
        }
    }
    if (badReq==true){
    res.json({"message" : "Invalid state abbreviation parameter"});
        }
    res.json({"state": state, "capital" : capital_city});
}

const getStateAdmission = async (req, res) => {
    let badReq = true;
    let admission_date  =  "";
    let state = "";
    for (i = 0; i < 50; i++){
        if (data.states[i]['code'].toLowerCase() == req.params.code.toLowerCase()){
            admission_date  = data.states[i]['admission_date']
            state = data.states[i]['state'];
            badReq = false;
        }
    }
    if (badReq==true){
    res.json({"message" : "Invalid state abbreviation parameter"});
        }
    res.json({"state": state, "admitted" : admission_date });
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