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

'use strict';
var sinon = require('sinon');
var assert = require('chai').assert;

var AMQPExchange = require('../lib/request/amqp/AMQPExchange');
var AMQPRequest = require('../lib/request/amqp/AMQPRequest');

suite('AMQPExchange', function () {
    var connection, exchange;
    var exchangeName, options, callback;
    var busRequest;
    var callbackWrapper;
    var sut;
    var amqpRequest;
    var amqpRequestStub;
    var settings;

    setup(function () {
        exchangeName = 'fake ExchangeName';
        options = {noDeclare: true, confirm: true};
        callbackWrapper = { callback: function () {} };
        connection = { exchange: function () {}
            , disconnect: function () {} };
        exchange = { publish: sinon.stub(), close: sinon.stub() };
        busRequest = {getRequest:function () {} };
        settings = {options: options};
        amqpRequest = new AMQPRequest({}, {}, {});
        //amqpRequestStub = sinon.stub(amqpRequest);
        sut = new AMQPExchange(settings, amqpRequest);
    });

    suite('#publish', function () {
        function execute () {
            sut.publish(exchangeName, busRequest, connection, 'fake amqpQueuePublisher', callbackWrapper.callback)
        }

        test('calls to connection.exchange', sinon.test(function () {
            this.mock(connection)
                .expects('exchange')
                .once()
                .withExactArgs(exchangeName, options, sinon.match.func);
            execute();
        }));

        test('when replyTo is set, calls to exchange.publish with replyTo in options', sinon.test(function () {
            this.stub(connection, 'exchange', function (exchangeName, option, fcallback) {
                fcallback(exchange);
            });
            sut.publish(exchangeName, busRequest, connection, 'fake amqpQueuePublisher', callbackWrapper.callback, "replyToValue")
            sinon.assert.calledWithExactly(exchange.publish, '', JSON.stringify(busRequest.getRequest()), {replyTo: "replyToValue"}, sinon.match.func);
        }));

        test('calls to exchange.publish', sinon.test(function () {
            this.stub(connection, 'exchange', function (exchangeName, option, fcallback) {
                fcallback(exchange);
            });
            execute();
            sinon.assert.calledWithExactly(exchange.publish, '', JSON.stringify(busRequest.getRequest()), {}, sinon.match.func);
        }));

        test('calls to exchange.publish with adequate routing key', sinon.test(function () {
            amqpRequest = new AMQPRequest({}, {}, {});
            amqpRequest.setUrl('amqp.exchange.hola://abc/v1/a/b/c/d');
            sut = new AMQPExchange(settings, amqpRequest);
            this.stub(connection, 'exchange', function (exchangeName, option, fcallback) {
                fcallback(exchange);
            });

            execute();
            sinon.assert.calledWithExactly(exchange.publish, 'hola', JSON.stringify(busRequest.getRequest()), {}, sinon.match.func);
        }));

        test('calls to callback', sinon.test(function () {
            this.stub(connection, 'exchange', function (exchangeName, option, fcallback) {
                fcallback(exchange);
            });
            exchange.publish.yields();
            this.mock(callbackWrapper)
                .expects('callback')
                .once()
                .withExactArgs(true);
            execute();
        }));

        test('Once message has been published, exchange should be closed', sinon.test(function () {
            this.stub(connection, 'exchange', function (exchangeName, option, fcallback) {
                fcallback(exchange);
            });
            exchange.publish.yields();
            execute();
            sinon.assert.calledOnce(exchange.close);
        }));
    })
});
