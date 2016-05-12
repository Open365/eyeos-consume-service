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
var eyeosBind = require('eyeos-bind');
var AMQPPublisherCallback = require('../lib/request/amqp/AMQPPublisherCallback');
var AMQPQueuePublisher = require('../lib/request/amqp/AMQPQueuePublisher');


suite('AMQPQueuePublisher', function(){
    var sut;
    var connection, connectionMock;
	var eyeosBindMock;
	var expEyeosbind;
    var busRequest, request;
    var queueName = 'vdibrokerTest.v1';
    var queue = {name: queueName};

	var callback = function(){};
	var objCallback = new AMQPPublisherCallback();

    setup(function(){
		queue.close = sinon.spy();
		eyeosBindMock = sinon.mock(eyeosBind);
		expEyeosbind = eyeosBindMock.expects('bind').once().withExactArgs(objCallback, objCallback.publishFinished).returns(callback);
        request = {whatever: 'si'};
        busRequest = {getRequest: function(){return request;}};

        connection = {publish: function(){}, disconnect: function(){}};
		sinon.stub(connection);

        sut = new AMQPQueuePublisher(eyeosBind);
    });

	teardown(function() {
		eyeosBindMock.restore();
	});

    suite('publish', function(){

		test('Should create a binding for the callback', function () {
            sut.publish(busRequest, connection, queue, objCallback);
            expEyeosbind.verify();
		});
        test('when called should call connection.publish', function(){
            sut.publish(busRequest, connection, queue, objCallback);
            sinon.assert.calledWithExactly(connection.publish, queueName, JSON.stringify(request), null, sinon.match.func);
        });

		test('Should close the queue once message has bene published', function () {
			connection.publish.yields();
			sut.publish(busRequest, connection, queue);
			sinon.assert.calledOnce(queue.close);
		});
    });

});
