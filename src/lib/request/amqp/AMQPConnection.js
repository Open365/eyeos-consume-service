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
var AMQPQueuePublisher = require('./AMQPQueuePublisher');
var amqpConnectionFactory = require('eyeos-amqp').amqpConnectionFactory;

/**
 * @function prepareConnectionSettings
 *              prepares the settings for AMQP connection.
 * @param settings object in one of the following forms:
 *      { ...
 *          amqpConnection: {...
 *          // see: https://github.com/postwait/node-amqp#connection-options-and-url
 *          }
 *      }
 *
 *      { ...
 *          host: 'host',
 *          port: port,
 *        ...}
 *
 *      undefined
 * @returns connection settings object compatible with https://github.com/postwait/node-amqp#connection
 */
function prepareConnectionSettings(settings) {
    if (! settings) {
        return;
    }
    if (settings.amqpConnection) {
        return settings.amqpConnection;
    }
    if (settings.host || settings.port) {
        return {
                    host: settings.host,
                    port: settings.port,
                    login: settings.login,
                    password: settings.password
               };
    }
}

var AMQPConnection = function(settings, amqp, amqpPublisher, connection) {
    this.logger = log2out.getLogger('AMQPConnection');
    this.settings = prepareConnectionSettings(settings);
    this.amqp = amqp || require('amqp');
    this.connection = connection;
    this.amqpQueuePublisher = amqpPublisher || new AMQPQueuePublisher();

    if (!this.settings) {
        this.settings = {};
    }
    this.settings.defaultExchange = {confirm: true};
};

AMQPConnection.prototype.connect = function(destinationName, busRequest, destination, objCallback, replyTo) {
    this.logger.debug('connecting to:', this.settings);
    this.destinationName = destinationName;
    var self = this;

    amqpConnectionFactory.getInstance(this.settings, function (err, connection) {
        if (err) {
            self.logger.error('error connecting to broker:', self.settings, err);
            return;
        }
        self.connection = connection;
        self.logger.debug('connected! to:', self.settings);
        destination.publish(destinationName, busRequest, self.connection, self.amqpQueuePublisher, objCallback, replyTo);
    });
};

AMQPConnection.prototype.disconnect = function () {
    var logger = this.logger;
    var connection = this.connection;
    var settings = this.settings;
    var destinationName = this.destinationName;

    logger.debug('Disconnecting with settings:', settings);

    connection.setImplOptions({reconnect: false});
    connection.removeAllListeners('error');
    connection.disconnect();
    connection.on('error', function () {
        logger.debug('Disconnected connection for ', destinationName);
    });
};


AMQPConnection.prototype.exchange = function() {
    var args = Array.prototype.slice.call(arguments);
    this.connection.exchange.apply(this.connection, args);
};

AMQPConnection.prototype.publish = function() {
    var args = Array.prototype.slice.call(arguments);
    this.connection.publish.apply(this.connection, args);
};

AMQPConnection.prototype.queue = function() {
    var args = Array.prototype.slice.call(arguments);
    this.connection.queue.apply(this.connection, args);
};

module.exports = AMQPConnection;
