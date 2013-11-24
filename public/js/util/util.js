$(function($){
	"use strict";
	
	window.Draw = window.Draw || {};
	
	var t0 = null;

	// Generate four random hex digits.
	function S4() {
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	
	
	window.Draw.Util = {
	
		// Generate a pseudo-GUID by concatenating random hexadecimal.
		 guid: function() {
		   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		   //return (S4()+S4()+S4()+S4()+S4()+S4()+S4()+S4());
		},
			
		getRelativeTimestamp: function (timestamp) {
			
			if(!timestamp) {
				timestamp = Date.now();
			}
			if(t0 === null) {
				t0 = timestamp;
			}
			
			
			return timestamp - t0;
		}

		
	
	}
		
});