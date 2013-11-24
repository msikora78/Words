$(function($){
	"use strict";
	
	window.Draw = window.Draw || {};
	
	var DEFAULT_COLOR = '#000000';
	var DEFAULT_WIDTH = 10;
	var DEFAULT_CAP   = 'round';
	var DEFAULT_RATIO = 1;
	
	Draw.Pen = Class.extend({
		
		init: function(canvas, width, color, ratio) {
            ratio = ratio || DEFAULT_RATIO;

            if(canvas && canvas[0] && canvas[0].getContext) {
                var context = canvas[0].getContext('2d');
                this.context = context;
                this.width = width || DEFAULT_WIDTH
                this.color = color || DEFAULT_COLOR;
                this.context.lineCap = DEFAULT_CAP;
                this.setRatio(ratio)
            } else {
                throw new Error("param 'canvas' is not a jQuery canvas element!");
            }
		},
		
		setRatio: function(ratio) {
			this.ratio = ratio || DEFAULT_RATIO;
			this.inverseRatio = 1 / ratio;			
			console.log("ratio:",ratio);
		},
			
		drawLine: function ( p1, p2, width, color) {
			if(p1 && p2){
				var context = this.context;
						
				width = (width || this.width) * this.ratio;
				color = color || this.color;
				
				context.beginPath();
				context.moveTo(p1.x, p1.y);
				context.lineTo(p2.x, p2.y);
				context.lineWidth = width;
				context.strokeStyle = color;
				context.stroke();		
			}
		},
		
		drawLineFromNormalized: function ( p1, p2, width, color) {
			this.drawLine(this.pointFromNormalized(p1), this.pointFromNormalized(p2), width, color);
		},
		
		pointFromNormalized: function(point) {
			return {
				x: point.x * this.ratio,
				y: point.y * this.ratio,
				t: point.t
			};
		},
		
		pointToNormalized: function(point) {
			// round the numbers so that they are shorter digit-wise
			return {
				x: Math.round(point.x * this.inverseRatio),
				y: Math.round(point.y * this.inverseRatio),
				t: point.t
			};
		},

        clearCanvas: function() {
            var canvas = this.context.canvas;
            this.context.clearRect(0,0,canvas.width,canvas.height);
        }
		
	});
});