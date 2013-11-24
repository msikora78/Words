var boardUtils = require('../lib/boardUtils');
var _ = require('underscore');
var CONST = require('../const')

/*
 * GET home page.
 */

var boardLetters = "PLASTERINGAJUARI"

exports.index = function(req, res){
    var board = boardUtils.lettersToBoard(boardLetters);
    res.render('index', { board: board, _:_, letterScoring: CONST.LETTER_SCORING });
};

exports.board = function(req, res) {
    var board = boardUtils.fetchBoard(boardLetters);
    board.letterScoring = CONST.LETTER_SCORING;

    res.send(board);
};
