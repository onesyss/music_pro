module.exports = function parseStringAsArray(arrayAsString) {
    return arrayAsString.split(',').map(categoria => categoria.trim());
}