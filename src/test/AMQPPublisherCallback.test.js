/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var sinon = require('sinon');
var assert = require('chai').assert;
var AMQPPublisherCallback = require('../lib/request/amqp/AMQPPublisherCallback');

suite('AMQPPublisherCallback', function(){
	var sut;
	var objCallback = {
		finished: function(){}
	};
	var objCallbackMock;
	var expFinished;

	setup(function(){
		objCallbackMock = sinon.mock(objCallback);
		expFinished = objCallbackMock.expects('finished').once();
		sut = new AMQPPublisherCallback(objCallback);
	});

	teardown(function() {
		objCallbackMock.restore();
	});

	suite('#publishFinished', function(){
		test('Should call objCallback.finished with true when passed arg is false', function(){
			expFinished.withExactArgs(true);
			sut.publishFinished(false);
			expFinished.verify();
		});
		test('Should call objCallback.finished with false when passed arg is true', function () {
			expFinished.withExactArgs(false);
			sut.publishFinished(true);
			expFinished.verify();
		});
	});
});