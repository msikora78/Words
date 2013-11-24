var boardUtils = require('../lib/boardUtils');
var _ = require('underscore');
var CONST = require('../const')

var boardLetters = "PLASTERINGAJUARI"

exports.board = function(req, res) {
    var board = boardUtils.fetchBoard(boardLetters);
    board.letterScoring = CONST.LETTER_SCORING;
    res.send(board);
};
