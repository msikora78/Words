$(function($){
    "use strict";


    window.Words = window.Words || {};

    Words.TouchBoard = Class.extend({
        init: function(canvas) {
            this.canvas = canvas;
            this.currentTouchPath = {};
            this.currentPoint = null;
            this.lastPoint = null;
            this.buttonDown = false;
            this.activePen = new Draw.Pen(canvas);
            this.touchAreas = new Words.TouchAreas(canvas.width(),4,0.7);

            _.bindAll(this);

            canvas.on({
                'vmousedown': this.beginTouch,
                'vmousemove': this.moveTouch,
                'vmouseup vmouseout': this.endTouch
            });
        },

        beginTouch: function(event){
            //console.log(event);
            this.buttonDown = true;
            this.lastPoint = null;
            this.currentTouchPath = {
                stroke: []
            };
            this.draw(event);
            event.preventDefault();
        },

        moveTouch: function(event){
            //console.log(event);
            if(this.buttonDown && this.currentTouchPath) {
                this.draw (event);
            }
            event.preventDefault();
        },

        endTouch: function(event){
            this.buttonDown = false;
            if(this.currentTouchPath) {
                this.draw(event);
                this.lastPoint = null;
                this.endPath();
                this.currentTouchPath = null;
            }
            event.preventDefault();
        },

        draw: function(event){
            var x = event.offsetX || event.pageX;
            var y = event.offsetY || event.pageY;
    //        var x = event.clientX;
    //        var y = event.clientY;

            this.currentPoint = {
                x: x,
                y: y
            };

            this.activePen.drawLine( this.lastPoint, this.currentPoint);

            if(this.lastPoint && this.currentPoint) {
                var areas = this.touchAreas.findIntersects( this.lastPoint, this.currentPoint);
                //console.log('areas:', areas);
                var _this = this;
                _.each(areas, function (area) {
                    var coords = area.x + '-' + area.y;
                    _this.trigger('touchDetected',{ x: area.x, y: area.y });
                });
            }

            this.lastPoint = this.currentPoint;
            this.currentTouchPath.stroke.push(this.currentPoint);
        },

        endPath: function () {
            this.activePen.clearCanvas();
            this.touchAreas.resetLastCell();
            this.trigger('touchEnd');
        },

        setLastCell: function(x,y){
            this.touchAreas.setLastCell(x,y);
        }


    });

    BackboneEvents.mixin(Words.TouchBoard.prototype);
});

