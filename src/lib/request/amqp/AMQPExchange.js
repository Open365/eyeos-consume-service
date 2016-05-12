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
var log2out = require('log2out');
var AMQPPublisherCallback = require('./AMQPPublisherCallback');

/**
 * AMQPExchange wrapper
 * @param settings should include exchange options as settings.options with properties as of:
 *          https://github.com/postwait/node-amqp#connectionexchangename-options-opencallback
 * @constructor
 */
var AMQPExchange = function(settings, amqpRequest) {
    this.logger = log2out.getLogger('AMQPExchange');
    this.settings = settings;
    this.destinationType = 'exchange';
    this.amqpRequest = amqpRequest || {getRoutingKey: function(){return '';}};

	if (!this.settings) {
		this.settings = {};
	}

	if (this.settings.options) {
		this.settings.options.confirm = true;
	}
};

AMQPExchange.prototype.publish = function (exchangeName, busRequest, connection, amqpQueuePublisher, callback, replyTo){
    var options = this.settings && this.settings.options || {noDeclare: true, confirm: true};
    var self = this;
    this.logger.debug('declaring and sending to exchange:', exchangeName, options);
    var routingKey = this.amqpRequest.getRoutingKey();
    connection.exchange(exchangeName, options, function(exchange){
        self.logger.debug('declared and sending to exchange:', exchange.name, exchange.state);
		var options = {};
		if (replyTo) {
			options.replyTo = replyTo;
		}
        exchange.publish(routingKey, JSON.stringify(busRequest.getRequest()), options, function() {
			if (callback) {
				callback(true);
			}
			exchange.close();
		});
    });
};

module.exports = AMQPExchange;
