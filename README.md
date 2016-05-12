Eyeos Consume Service Library
=============================

## Overview

This library is designed to be "Fire and Forget", meaning that you call a service and then
you do not expect a return value but instead you tell the service where to call you back.


vdiService --------------Reply to X ------------> vdiBroker

vdiBroker --------------------X-----------------> vdiService

This api is inspired by https://github.com/aacerox/node-rest-client but adapted
to our needs.

## How to use it

### URL's in eyeos-consume-service

URL's are specified in the form:

<protocol>://<destinationName>/<version>[/<param1>/<value1>][/<param2>/<value2>]...


See more info below on AMQP URL's...

#### AMQP URL's
URL's using Amqp transport are specified in the following form:
* **protocol**: (mandatory) can be: *amqp*, *amqp.exchange* or *amqp.queue*. amqp publishes to a queue.
* **destinationName**: (optional, except if routingKey is specified). Name of the exchange or queue in RabbitMQ.
* **routingKey**: (optional) routingKey used when publishing to exchange.
* **version**: (mandatory) name or the API version.
URL mapping to queue or exchange, some examples:
* amqp://login/v1 => Queue login.v1
* amqp.exchange://presence.v1 => Exchange presence.v1
* amqp.queue://vdi.user.machine.events/v1 => Queue vdi.user.machine.events.v1

### Sample usage: Simple GET

```javascript
    var Client = require('../index').Client;
    var client = new Client();
    var replyto = "amqp://whereilisten/v1/machine/";
    client.get("amqp://howlingtoyou/v1/vm", "post", replyto);
```

The code above sends a request to vdibroker and tells it to reply back to the vdiservice.

### Connection Management
In the case of sending via AMQP, the connection is got using eyeos-amqp.amqpConnectionFactory and is reused.
The connection can be closed by using ***Client.close()***.

## Quick help

* Install modules

```bash
	$ npm install
```

* Check tests

```bash
    $ grunt test
```