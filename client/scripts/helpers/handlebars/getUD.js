module.exports = function(key) {
    return JSON.parse(localStorage.getItem('UserData'))[key];
}