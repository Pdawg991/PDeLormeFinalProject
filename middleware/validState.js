const data = {}
data.states = require('../model/states.json');

//Validates a state if it exists, and sets data
function validState (obj){  
    data.states.some((state) => {if (state.code.toLowerCase() === obj.code.toLowerCase()) {
    obj.name = state.state
    obj.population = state.population.toLocaleString()
    obj.nickname = state.nickname
    obj.capital = state.capital_city
    obj.admission = state.admission_date
    obj.valid =  true}});
    return obj;
}

module.exports = { validState };