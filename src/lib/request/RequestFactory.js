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

var url = require('url');

var RequestFactory = function(settings) {
    this.settings = settings;
};

RequestFactory.prototype.getRequest = function(reqUrl) {
	var urlInfo = url.parse(reqUrl);
	var scheme = urlInfo.protocol.substring(0, urlInfo.protocol.length - 1); //Remove last char which is :

    if (scheme.indexOf('.') > -1){ //request type of urls like amqp.queue:// ... and amqp.exchange:// is amqp
        scheme = scheme.split('.')[0];
    }
	var Request = new require('./' + scheme).Request;
	var instance = new Request(this.settings);

	return instance;
};

module.exports = RequestFactory;
