var assert = require('assert');
var expect = require('chai').expect;

var saveditemjs = require('../models/saveditem.js');
var Saveditem = saveditemjs.Saveditem;

describe('saveditemjs', function(){

	describe('Saveditem', function(){
		it("can export userid and items stored previously", function(){
			var storedData = [,];
			var params = [userid, saveditem];
			Saveditem([1,shoes], function(params){
				storedData.create(params);
			});
			expect(storedData).to.eql([1,shoes]);
		});
	});
});