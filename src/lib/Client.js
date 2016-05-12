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

var RequestFactory = require('./request/RequestFactory');
var ClientCloser = require('./request/ClientCloser');
var log2out = require('log2out');

var Client = function(settings, requestFactory, injectedClientCloser) {
    this.logger = log2out.getLogger('eyeos-consume-service.Client');
	this.requestFactory = requestFactory || new RequestFactory(settings);
    this.clientCloser = injectedClientCloser || new ClientCloser();
    this.lastRequest = null;
};

Client.prototype._sendRequest = function (method, url, headers, body, replyToUrl, objCallback) {
	this.logger.debug(method+': ', url, headers, body, replyToUrl);
	var request = this.requestFactory.getRequest(url);
	request.setUrl(url);
	request.setMethod(method);
	request.setHeaders(headers);
	request.setDocument(body);
	request.setReplyTo(replyToUrl);
	request.setObjCallback(objCallback);
	this.lastRequest = request;
	request.send();
};

Client.prototype.get = function(url, headers, replyToUrl, objCallback) {
    this._sendRequest("get", url, headers, null, replyToUrl, objCallback);
};

Client.prototype.post = function(url, headers, body, replyToUrl, objCallback) {
	this._sendRequest("post", url, headers, body, replyToUrl, objCallback);
};

Client.prototype.put = function (url, headers, body, replyToUrl, objCallback) {
	this._sendRequest("put", url, headers, body, replyToUrl, objCallback);
};

Client.prototype.delete = function (url, headers, body, replyToUrl, objCallback) {
	this._sendRequest("delete", url, headers, body, replyToUrl, objCallback);
};

Client.prototype.close = function(){
    if (this.lastRequest) {
        this.logger.debug('Disconnecting eyeos-consume-service.Client of type: ', this.lastRequest.getType());
        this.clientCloser.close(this.lastRequest.getReqUrl());
    }
};

module.exports = Client;
