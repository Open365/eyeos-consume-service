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

var AMQPQueue = require('../lib/request/amqp/AMQPQueue');
var AMQPQueuePublisher = require('../lib/request/amqp/AMQPQueuePublisher');
var settings = require('../settings-test');


suite('AMQPQueue', function(){
    var sut;
    var queueName = 'servicename.v1';
    var busRequest = "a busRequest instance";
    var connection;
	var objCallback = {};
	var replyTo = 'returnQueue';
    var amqpPublisher, amqpPublisherMock, amqpPublisherPublishExpectation;

    setup(function(){

        connection = {queue: function(){}};
        amqpPublisher = new AMQPQueuePublisher();
        amqpPublisherMock = sinon.mock(amqpPublisher);
        amqpPublisherPublishExpectation = amqpPublisherMock
            .expects('publish').once().withExactArgs(busRequest, connection, settings.name, sinon.match.object, replyTo);

        sut = new AMQPQueue(settings);
    });


    suite('publish', function(){

        test('when called should call amqpPublisher.publish', function(){
            sinon.stub(connection, 'queue', function (passedQueue, options, callback) {
                callback(passedQueue);
            });

            sut.publish(queueName, busRequest, connection, amqpPublisher, objCallback, replyTo);
            amqpPublisherPublishExpectation.verify();
        });

    });

});
