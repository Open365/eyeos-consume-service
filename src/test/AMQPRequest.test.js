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
var AMQPConnection = require('../lib/request/amqp/AMQPConnection');
var BusRequest = require('../lib/request/amqp/BusRequest');
var AMQPRequest = require('../lib/request/amqp/AMQPRequest');

var settings = require('../settings-test.js');


suite('AMQPRequest', function(){
    var sut, amqpConnection;
    var amqpQueue, amqpConnectionMock, amqpConnectionConnectExpectation;
    var url2 = '/service/version/parameter1/value1/parameter2/value2';
    var url = 'amqp://service/version/parameter1/value1/parameter2/value2'
    var parameters = {parameter1: 'value1', parameter2: 'value2'};
    var document = 'document', queueName = 'service.version', replyToUrl = 'replytoUrl', method = 'get', headers = 'headers';
	var objCallback = {};
    var busRequest;

    setup(function(){
        busRequest = new BusRequest(url2, method, headers, parameters, document);
        amqpQueue = 'amqpQueue instance';

        amqpConnection = new AMQPConnection();
        amqpConnectionMock = sinon.mock(amqpConnection);
        amqpConnectionConnectExpectation = amqpConnectionMock
            .expects('connect').once();//.withExactArgs(queueName, busRequest, amqpQueue, objCallback);

        sut = new AMQPRequest(settings, amqpConnection);
        sut.setUrl(url);
        sut.setMethod(method);
        sut.setHeaders(headers);
        sut.setDocument(document);
        sut.setReplyTo(replyToUrl);
		sut.setObjCallback(objCallback);
    });


    suite('#send', function(){

        test('when called should call amqpConnection.connect', function(){
            sut.send();
            amqpConnectionConnectExpectation.verify();
        });

    });

    suite('#setUrl', function(){

        test('destinationType is queue for urls like amqp://...', function(){
            var url = 'amqp://myqueue/v1/param1/value1';
            sut.setUrl(url);
            assert.equal(sut.destinationType, 'queue');
        });

        test('destinationType is queue for urls like amqp.queue://...', function(){
            var url = 'amqp.queue://myqueue/v1/param1/value1';
            sut.setUrl(url);
            assert.equal(sut.destinationType, 'queue');
        });

        test('destinationType is exchange for urls like amqp.exchange://...', function(){
            var url = 'amqp.exchange://myqueue/v1/param1/value1';
            sut.setUrl(url);
            assert.equal(sut.destinationType, 'exchange');
        });

        test('routingKey defaults to empty string', function(){
            var url = 'amqp.exchange://myqueue/v1/param1/value1';
            sut.setUrl(url);
            assert.equal(sut.getRoutingKey(), '');
        });

        test("routingKey is the third element in protocol where: <protocol>://<destinationName>/<version>", function(){
            var url = 'amqp.exchange.routingkey://myqueue/v1/param1/value1';
            sut.setUrl(url);
            assert.equal(sut.getRoutingKey(), 'routingkey');
        });

        test("routingKey in given url are converted to lowercase", function(){
            var url = 'amqp.exchange.RoutingKey://myqueue/v1/param1/value1';
            sut.setUrl(url);

            assert.notEqual(sut.getRoutingKey(), 'RoutingKey');
            assert.equal(sut.getRoutingKey(), 'routingkey');
        });


    });

});
