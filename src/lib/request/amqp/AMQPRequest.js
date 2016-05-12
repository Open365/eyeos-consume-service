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
var AMQPConnection = require('./AMQPConnection');
var AMQPQueue = require('./AMQPQueue');
var AMQPDestinationFactory = require('./AMQPDestinationFactory');
var BusRequest = require('./BusRequest');
var url = require('url');

var AMQPRequest = function(settings, amqpConnection, injected_amqpDestinationFactory) {
    this.logger = log2out.getLogger('AMQPRequest');
    this.amqpConnection = amqpConnection || new AMQPConnection(settings);
    this.amqpDestinationFactory = injected_amqpDestinationFactory || new AMQPDestinationFactory();
    this.settings = settings;
    this.parameters = {};
};

AMQPRequest.prototype.send = function() {
    var busRequest = new BusRequest(this.url, this.method, this.headers, this.parameters, this.document);
    this.logger.debug('Send Request: ', busRequest, 'ToQueue: ', this.destinationName);
    var destination = this.amqpDestinationFactory.getDestination(this, this.settings);
    this.amqpConnection.connect(this.destinationName, busRequest, destination, this.objCallback, this.replyToInfo);
};

/**
 * @method setUrl parses the amqp URL
 * @param reqUrl in the form:
 *      amqp[.destinationType[.routingKey]]://<destinationName>/<version>[/<param1>/<value1>][/<param2>/<value2>]...
 */
AMQPRequest.prototype.setUrl = function(reqUrl) {
    this.reqUrl = reqUrl;
    var urlInfo = url.parse(reqUrl);
    var scheme = urlInfo.protocol.substring(0, urlInfo.protocol.length - 1);
    if (scheme.indexOf('.') > -1){ //request type of urls like amqp.queue:// ... and amqp.exchange:// is amqp
        var splittedScheme = scheme.split('.');
        this.destinationType = splittedScheme[1];
        this.routingKey = splittedScheme[2];
    } else {
        this.destinationType = 'queue';
    }

    this.destinationName = urlInfo.hostname;


    if (urlInfo.path) {
        var pathParts = urlInfo.path.split('/');
        var version = pathParts[1];
        this.destinationName = this.destinationName + '.' + version;
        for (i = 2; i < pathParts.length; i = i + 2) {
            this.parameters[pathParts[i]] = pathParts[i+1];
        }
    }
    if(!urlInfo.path) {
        urlInfo.path = "";
    }
    this.url = '/' + urlInfo.hostname + urlInfo.path;
};

AMQPRequest.prototype.setMethod = function(method) {
    this.method = method;
};

AMQPRequest.prototype.setHeaders = function(headers) {
    this.headers = headers;
};

AMQPRequest.prototype.setDocument = function(document) {
    this.document = document;
};

AMQPRequest.prototype.setReplyTo = function(replyToInfo) {
	this.replyToInfo = replyToInfo;
};

AMQPRequest.prototype.setObjCallback = function(objCallback) {
	this.objCallback = objCallback;
};

AMQPRequest.prototype.getType = function() {
	return 'amqp';
};

AMQPRequest.prototype.destinationIsQueue = function() {
    return ! this.destinationIsExchange();
};

AMQPRequest.prototype.destinationIsExchange = function() {
    return this.destinationType === 'exchange';
};

AMQPRequest.prototype.getConnection = function() {
    return this.amqpConnection;
};

AMQPRequest.prototype.getReqUrl = function() {
    return this.reqUrl;
};

AMQPRequest.prototype.getRoutingKey = function() {
    return this.routingKey || '';
};
module.exports = AMQPRequest;
