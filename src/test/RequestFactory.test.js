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
var RequestFactory = require('../lib/request/RequestFactory');

suite('RequestFactory', function(){
	var sut;

	var url = 'fake://foo/v1/mao';

	setup(function(){
		sut = new RequestFactory();
	});

	suite('#getRequest', function(){
		test('Returns an appropiate request for the given fake url', function(){
			var request = sut.getRequest(url);
			assert.equal(request.getType(), 'fake');
		});

        test('Returns an appropiate request for the given amqp url', function(){
            var url = 'amqp://eo/v1/way';
            var request = sut.getRequest(url);
            assert.equal(request.getType(), 'amqp');
        });

        test('Returns an appropiate request for the given amqp.queue url', function(){
            var url = 'amqp.queue://eo/v1/way';
            var request = sut.getRequest(url);
            assert.equal(request.getType(), 'amqp');
        });

        test('Returns an appropiate request for the given amqp.exchange url', function(){
            var url = 'amqp.queue://eo/v1/way';
            var request = sut.getRequest(url);
            assert.equal(request.getType(), 'amqp');
        });

	});
});
