$(function($){
	"use strict";

    $('body').hide();

	window.Draw = window.Draw || {};

    var $canvas = $('#overlayCanvas');


	var currentTouchPath, currentPoint = null, lastPoint = null, buttonDown = false;
    var activePen = new Draw.Pen($canvas);
    var touchAreas = new Words.TouchAreas($canvas.width(),4,0.7);
    var currentWord = {};
    var totalScore = 0;

    var socket = io.connect(window.location.origin);

    socket.on('message', function (data) {
        if(data.word) {
            var word = data.word;
            addWord(word,'theirs')
        } else {
            console.log("There is a problem:", data);
        }
    });

    function sendWord(word) {
        socket.emit('send', { word: word });
    };


    $canvas.on({
        'vmousedown': function(event){
            //console.log(event);
            buttonDown = true;
            lastPoint = null;
            currentTouchPath = {
                stroke: []
            };
            var point = draw(event);
            event.preventDefault();
        },

        'vmouseup vmouseout': function(event){
            //console.log(event);
            buttonDown = false;
            if(currentTouchPath) {
                var point = draw(event);
                lastPoint = null;
                processWord(currentTouchPath);
                currentTouchPath = null;
            }
            event.preventDefault();
        },

        'vmousemove': function(event){
            //console.log(event);
            if(buttonDown && currentTouchPath) draw (event);
            event.preventDefault();
        }
    });

    function draw(event){
        var x = event.offsetX || event.pageX;
        var y = event.offsetY || event.pageY;
//        var x = event.clientX;
//        var y = event.clientY;

        $('#position').text('[' + x + ',' + y + ']');

        currentPoint = {
            x: x,
            y: y
        };

        activePen.drawLine( lastPoint, currentPoint);

        if(lastPoint && currentPoint) {
            var areas = touchAreas.findIntersects( lastPoint, currentPoint);
            //console.log('areas:', areas);
            _.each(areas, function (area) {
                var coords = area.x + '-' + area.y;
                var id = '#letter-cell-'+ coords;
                $(id).parent().addClass('selected');

                if(!currentWord[id]) {
                    touchAreas.setLastCell(area.x, area.y);
                    var index = _.keys(currentWord).length + 1;
                    currentWord[id] = index;
                    displayWord();
                }
            });
        }

        lastPoint = currentPoint;
        currentTouchPath.stroke.push(currentPoint);
        return currentPoint;
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
            addWord(word,'mine');
            sendWord(word);
            addScore(word);
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
        if(!usedWords[word]) {
            usedWords[word] = true;
            className = className || "";
            var $span = $('<span>').text(word).addClass(className);
            $('#words').append($span);
        }
    }

    function processWord(request) {
        var word = getWord().toLowerCase();
        checkMyWord(word);
        activePen.clearCanvas();
        $('.letter-cell').removeClass('selected');
        currentWord = {};
        displayWord();
        touchAreas.resetLastCell();
    }

    var board = [], words = {}, usedWords = {}, letterScoring = {};

    $.ajax('/board').done(render);

    function render(resp){
        board = resp.board;
        letterScoring = resp.letterScoring;
        _.each(resp.words, function(word) {
            words[word] = true
        });

        var tpl = $('#letters-tmpl').html();
        var html = _.template(tpl, resp, {variable: 'd'});
        $('#board').html(html);
        console.log(html);
        $('body').show();
    }

});