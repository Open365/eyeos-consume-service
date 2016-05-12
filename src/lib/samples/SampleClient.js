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

var Client = require('../../index').Client;

var client = new Client({host: 'localhost', port: 5672, options: {autoDelete: false, durable: true}});

var replyto = "amqp://whereilisten2/v1/machine/";

client.post("amqp.queue://queuingtorabbit/v1/vm", "post", {day: 'monday monday'}, replyto);

client.post("amqp://zz-jija2/v1/vm", "post", {day: 'monday monday'}, replyto);

function send(i) {
    console.log('***********************************', i);
    client.post("amqp://zz-jija2/v1/vm", "post", {day: 'monday monday'}, replyto);
    var j = i - 1;
    if(j > 0) {
        setTimeout(function(){send(j);}, 20);
    } else {
        client.close();
    }
};

send(50000);
