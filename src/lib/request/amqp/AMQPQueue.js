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

var log2out = require('log2out');
var AMQPPublisherCallback = require('./AMQPPublisherCallback');

var AMQPQueue = function(settings) {
    this.logger = log2out.getLogger('AMQPQueue');
    this.settings = settings || {options:{}}; // options cannot be undefined since amqp.connection.queue fails if options is undefined and callback is third parameter
    this.destinationType = 'queue';
};

AMQPQueue.prototype.publish = function(queueName, busRequest, connection, amqpPublisher, objCallback, replyTo) {
    this.logger.debug('declaring and sending to queue:', queueName);
    var self = this;
    var queue = connection.queue(queueName, this.settings.options, function (queue) {
        self.logger.debug('queue declared!', queueName);
		var publisherCallback = new AMQPPublisherCallback(objCallback);
        amqpPublisher.publish(busRequest, connection, queue, publisherCallback, replyTo);
    });
};

module.exports = AMQPQueue;
