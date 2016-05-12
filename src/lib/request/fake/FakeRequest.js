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

var FakeRequest = function() {
};

FakeRequest.prototype.send = function() {
};

//NOTE: if one more property is added here, move this into its own object
FakeRequest.prototype.setReplyTo = function(replyToInfo) {
	this.replyToInfo = replyToInfo;
};

FakeRequest.prototype.setUrl = function(url) {
    this.url = url;
}

FakeRequest.prototype.setMethod = function(method) {
    this.method = method;
}

FakeRequest.prototype.setHeaders = function(headers) {
    this.headers = headers;
}

FakeRequest.prototype.setDocument = function(document) {
    this.parameters = document;
};

FakeRequest.prototype.setObjCallback = function(objCallback) {
	this.setObjCallback = objCallback;
};


FakeRequest.prototype.getType = function() {
	return 'fake';
};

FakeRequest.prototype.getReqUrl = function() {
    return this.url;
};

module.exports = FakeRequest;
