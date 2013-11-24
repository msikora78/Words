var _ = require('underscore');
var boggle = require('boggle');



var lettersToBoard = function(letters) {
    letters = letters || "";
    letters = letters.substr(0,16);
    return _.map( letters.split(/(?=(?:....)*$)/), function(str){return str.split("")});
}

var boardToLetters = function(board) {
    board = board || [];
    _.flatten(lettersToBoard(letters)).join("")
}

var fetchBoard = function(letters) {
    var board = lettersToBoard(letters);
    var words = boggle(letters);
    return {
        board: board,
        words: words
    };
}

exports.fetchBoard = fetchBoard;
exports.lettersToBoard = lettersToBoard;
exports.boardToLetters = boardToLetters;
