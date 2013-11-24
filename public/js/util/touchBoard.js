$(function($){
    "use strict";


    window.Words = window.Words || {};

    Words.TouchBoard = Class.extend({
        init: function(canvas) {
            var currentTouchPath, currentPoint = null, lastPoint = null, buttonDown = false;
            var activePen = new Draw.Pen(canvas);
            var touchAreas = new Words.TouchAreas($canvas.width(),4,0.7);

        }

    });
});

