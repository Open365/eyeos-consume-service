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
var amqpConnectionFactory = require('eyeos-amqp').amqpConnectionFactory;
var AMQPQueue = require('../lib/request/amqp/AMQPQueue');
var settings = require('../settings-test.js');

suite('AMQPConnection', function(){
    var sut;
    var amqpPublisher = {};
    var queueName = 'servicename.v1';
    var busRequest = 'busRequestInstance';
    var amqp, amqpMock;
    var connection;
    var amqpQueue, amqpQueueMock, amqpQueueDeclareQueueExpectation;
    var amqpCreateConnectionExpected;

	var objCallback = {};
    setup(function(){

        connection = {on: function() {}
            , exchange: function() {}
            , publish: function() {}
            , disconnect: function() {}
            , setImplOptions: function() {}
            , removeAllListeners: function() {}
            , once: function() {}
        };
        amqp = require('amqp');
        amqpMock = sinon.mock(amqp);

        amqpCreateConnectionExpected = amqpMock.expects('createConnection').once().withExactArgs({host: settings.host, port: settings.port}).returns(connection);

        amqpQueue = new AMQPQueue();
        amqpQueueMock = sinon.mock(amqpQueue);
        amqpQueueDeclareQueueExpectation = amqpQueueMock
            .expects('publish').once().withExactArgs(queueName, busRequest, connection, amqpPublisher, objCallback);



        sut = new AMQPConnection(settings, amqp, amqpPublisher, connection);
    });

    teardown(function(){
        amqpMock.restore();
    });

    suite('connect', function(){

        test('when called should call amqpQueue.publish', function(){
            var destinationFake = {publish: function(){}};
            var destinationMock = sinon.mock(destinationFake);
            var expDestinationPublish = destinationMock.expects('publish').once();
            var getInstanceAmqpConnStub = sinon.stub(amqpConnectionFactory, 'getInstance', function (settings, callback) {
                callback(null, connection);
            });

            sut.connect(queueName, busRequest, destinationFake, objCallback);
            expDestinationPublish.verify();


        });

    });

    suite('#disconnect', function () {
        var connectionMock,
            expConnectionSetImplOptions,
            expConnectionRemoveAllOnErrorListeners,
            expConnectionDisconnect,
            expConnectionOnError;

        setup(function(){
            connectionMock = sinon.mock(connection);
            expConnectionSetImplOptions = connectionMock.expects('setImplOptions').once().withExactArgs(sinon.match({reconnect:false}));
            expConnectionRemoveAllOnErrorListeners = connectionMock.expects('removeAllListeners').once().withExactArgs('error');
            expConnectionDisconnect = connectionMock.expects('disconnect').once().withExactArgs();
            expConnectionOnError = connectionMock.expects('on').once().withExactArgs('error', sinon.match.func);
        });
        test('calls connection.setImplOptions with reconnect=false', function () {
            sut.disconnect();
            expConnectionSetImplOptions.verify();
        });
        test('removes connection error listeners', function(){
            sut.disconnect();
            expConnectionRemoveAllOnErrorListeners.verify();
        });
        test('calls connection.disconnect', function(){
            sut.disconnect();
            expConnectionDisconnect.verify();
        });
        test('registers an on error listener for tracing disconnection', function(){
            sut.disconnect();
            expConnectionOnError.verify();
        });
    });

});
