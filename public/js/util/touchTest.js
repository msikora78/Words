$(function($){
    "use strict";

    function sqr(x) { return x * x }

    function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

    function distToSegmentSquared(p, v, w) {
        var l2 = dist2(v, w);
        if (l2 == 0) return dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0) return dist2(p, v);
        if (t > 1) return dist2(p, w);
        return dist2(p, { x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y) });
    }

    function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }


    window.Words = window.Words || {};

    Words.TouchAreas = Class.extend({

        init: function( baseLength, splitCount, touchRatio ) {
            this.areas = [];
            this.baseLength = baseLength;
            var segment = this.segment = baseLength / splitCount;
            this.touchSegment = this.segment * touchRatio;
            this.touchRatio = touchRatio;
            this.splitCount = splitCount;
            this.lastCell = null;


            var touchD = (segment - this.touchSegment) / 2;
            for (var y = 0; y < this.splitCount; y++) {
                for (var x = 0; x < this.splitCount; x++) {

                    var minX = x * segment + touchD;
                    var maxX = (x+1) * segment - touchD;

                    var minY = y * segment + touchD;
                    var maxY = (y+1) * segment - touchD;

                    var centerX = (maxX+minX)/2;
                    var centerY = (maxY+minY)/2;

                    this.areas.push ({
                        minX: minX,
                        maxX: maxX,
                        minY: minY,
                        maxY: maxY,
                        center: {
                            x: centerX,
                            y: centerY
                        },
                        x: x,
                        y: y
                    });
                }
            }

        },

        setLastCell: function(x,y) {
            this.lastCell = {
                x: x,
                y: y
            };
        },

        resetLastCell: function(x,y) {
            this.lastCell = null;
        },

        findIntersects: function(p1,p2) {

            var rSquared = sqr(this.touchSegment/2);
            var lastCell = this.lastCell;

            var intersects = _.filter(this.areas, function(area) {

                if(lastCell &&
                   ( Math.abs(area.x - lastCell.x) > 1 || Math.abs(area.y - lastCell.y) > 1) )
                    return false

                var minX = p1.x;
                var maxX = p2.x;

                if (p1.x > p2.x) {
                    minX = p2.x;
                    maxX = p1.x;
                }

                if (maxX > area.maxX)
                    maxX = area.maxX;

                if (minX < area.minX)
                    minX = area.minX;

                if (minX > maxX)
                    return false;

                var minY = p1.y;
                var maxY = p2.y;

                var dx = p2.x - p1.x;

                if (Math.abs(dx) > 0.0000001) {
                    var a = (p2.y - p1.y) / dx;
                    var b = p1.y - a * p1.x;
                    minY = a * minX + b;
                    maxY = a * maxX + b;
                }

                if (minY > maxY) {
                    var tmp = maxY;
                    maxY = minY;
                    minY = tmp;
                }

                if (maxY > area.maxY)
                    maxY = area.maxY;

                if (minY < area.minY)
                    minY = area.minY;

                if (minY > maxY)
                    return false;

                if(distToSegmentSquared(area.center, p1, p2) > rSquared )
                    return false;

                return true;
            });
            return intersects;
        }

    });
});

