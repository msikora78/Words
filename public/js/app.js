$(function($){
	"use strict";

    $('body').hide();

    var $canvas = $('#overlayCanvas');

    var touchBoard = new Words.TouchBoard($canvas);
    touchBoard
        .on('touchDetected',processTouch)
        .on('touchEnd',processWord);

    var currentWord = {};
    var totalScore = 0;
    var socket = io.connect(window.location.origin);


    socket.on('message', function (data) {
        if(data.word) {
            var word = data.word;
            var ownerId = data.owner;
            if(socket.socket && ownerId == socket.socket.sessionid) {
                addScore(word);
                addWord(word,'mine');
            } else {
                addWord(word,'theirs');
            }
        } else {
            console.log("There is a problem:", data);
        }
    });

    function sendWord(word) {
        socket.emit('send', { word: word });
    };

    function processTouch(event){
        var x = event.x, y = event.y;
        var coords = x + '-' + y;
        var id = '#letter-cell-'+ coords;
        $(id).parent().addClass('selected');

        if(!currentWord[id]) {
            touchBoard.setLastCell(x, y);
            var index = _.keys(currentWord).length + 1;
            currentWord[id] = index;
            displayWord();
        }
    }

    function processWord(request) {
        var word = getWord().toLowerCase();
        checkMyWord(word);
        $('.letter-cell').removeClass('selected');
        currentWord = {};
        displayWord();
    }

    function getWord() {
        var word = "";
        var length = _.keys(currentWord).length;
        var inverted = _.invert(currentWord);

        for(var i = 1; i <= length; i++) {
            var selector = inverted[i];
            word += $(selector).text();
        }

        return word.replace(/\s/g,'');
    }

    function displayWord() {
        $("#word").text(getWord());
    }

    function addTheirs(word){
        addWord(word,'theirs');
    }

    function checkMyWord (word){
        if(words[word] && !usedWords[word]) {
            addWord(word,'tentative');
            sendWord(word);
        }
    }

    function addScore(word) {
        word = word || "";
        var letters = word.toLowerCase().split('');
        var scoring = letterScoring.perLetter;
        var lengthMultiplier = letterScoring.lengthMultiplier;
        var score = 0;
        _.each(letters, function(letter){
            score += scoring[letter];
        });

        score *= lengthMultiplier[letters.length];
        totalScore += score;
        $('#score').text(totalScore);
    }

    function addWord(word, className) {
        usedWords[word] = true;
        className = className || "";
        if(className == 'mine') {
            var $span = $('span.tentative').filter(function(i, el) {return $(el).text() == word; })
            $span.removeClass('tentative').addClass(className);
        } else {
            var $span = $('<span>').text(word).addClass(className);
            $('#words').append($span);
        }
    }


    var board = [], words = {}, usedWords = {}, letterScoring = {};

    socket.on('connect', function() {
        console.log('On connect:', socket);
        $('body').show();

    });


    $.ajax('/board').done(render);

    function render(resp) {
        board = resp.board;
        letterScoring = resp.letterScoring;
        _.each(resp.words, function(word) {
            words[word] = true
        });

        var tpl = $('#letters-tmpl').html();
        var html = _.template(tpl, resp, {variable: 'd'});
        $('#board').html(html);
    }

});