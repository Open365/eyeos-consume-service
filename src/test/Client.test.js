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
var Client = require('../lib/Client');
var FakeRequest = require('../lib/request/fake/').Request;
var RequestFactory = require('../lib/request/RequestFactory');
var settings = require('../settings-test.js');
var ClientCloser = require('../lib/request/ClientCloser');

suite('Client', function(){
	var sut;
	var requestFactory, requestFactoryMock;
	var fakeRequest, fakeRequestMock;
    var clientCloser, clientCloserMock;

	var expGetRequest, expSetUrl, expSetMethod, expSetHeaders, expSetDocument, expSetReplyTo
		,expRequestSend, expRequestObjCallback;

	var url = 'fake://service/v1/some/stuff';
    var headers = {card: 'a card', signature: 'a signature'};
    var body = {param1: 'param1', param2: 'param2'};

	var replyToInfo = {
		method: 'post',
		url: 'fake://another/v1/foo'
	};

	var objCallback = {};
	setup(function(){
        fakeRequest = new FakeRequest();
        fakeRequestMock = sinon.mock(fakeRequest);
        requestFactory = new RequestFactory();
        requestFactoryMock = sinon.mock(requestFactory);
        expGetRequest = requestFactoryMock.expects('getRequest').once().withExactArgs(url).returns(fakeRequest);
        expSetUrl = fakeRequestMock.expects('setUrl').once().withExactArgs(url);
        expSetHeaders = fakeRequestMock.expects('setHeaders').once().withExactArgs(headers);
        expSetReplyTo = fakeRequestMock.expects('setReplyTo').once().withExactArgs(replyToInfo);

		expRequestObjCallback = fakeRequestMock.expects('setObjCallback').once().withExactArgs(objCallback);
        expRequestSend = fakeRequestMock.expects('send').once();
        clientCloser = new ClientCloser();
        clientCloserMock = sinon.mock(clientCloser);
        sut = new Client(settings, requestFactory, clientCloser);
    });

	suite('#get', function(){

        setup(function(){
            expSetMethod = fakeRequestMock.expects('setMethod').once().withExactArgs('get');
            expSetDocument = fakeRequestMock.expects('setDocument').once().withExactArgs(null);
        });

        function exerciseGet() {
            sut.get(url, headers, replyToInfo, objCallback);
        };

		test('Should call RequestFactory.getRequest to get a request appropiate for url', function(){
            exerciseGet();
			expGetRequest.verify();
		});

		test('To the returned Request, the url information should be setup', function () {
            exerciseGet();
            expSetUrl.verify();
		});
        test('To the returned Request, the method information should be setup', function () {
            exerciseGet();
            expSetMethod.verify();
        });
        test('To the returned Request, the headers information should be setup', function () {
            exerciseGet();
            expSetHeaders.verify();
        });
        test('To the returned Request, the document information should be setup', function () {
            exerciseGet();
            expSetDocument.verify();
        });
        test('To the returned Request, the reply-to information should be setup', function () {
            exerciseGet();
            expSetReplyTo.verify();
        });
		test('To the returned Request, the objCallback information should be setup', function () {
			exerciseGet();
			expRequestObjCallback.verify();
		});
		test('The Request should be send by calling the send method', function () {
            exerciseGet();
			expRequestSend.verify();
		});
	});

    suite('#post', function(){

        setup(function(){
            expSetMethod = fakeRequestMock.expects('setMethod').once().withExactArgs('post');
            expSetDocument = fakeRequestMock.expects('setDocument').once().withExactArgs(body);
        });

        function exercisePost() {
            sut.post(url, headers, body, replyToInfo, objCallback);
        };

        test('Should call RequestFactory.getRequest to get a request appropiate for url', function(){
            exercisePost();
            expGetRequest.verify();
        });

        test('To the returned Request, the url information should be setup', function () {
            exercisePost();
            expSetUrl.verify();
        });
        test('To the returned Request, the method information should be setup', function () {
            exercisePost();
            expSetMethod.verify();
        });
        test('To the returned Request, the headers information should be setup', function () {
            exercisePost();
            expSetHeaders.verify();
        });
        test('To the returned Request, the document information should be setup', function () {
            exercisePost();
            expSetDocument.verify();
        });
        test('To the returned Request, the reply-to information should be setup', function () {
            exercisePost();
            expSetReplyTo.verify();
        });

		test('To the returned Request, the objCallback information should be setup', function () {
			exercisePost();
			expRequestObjCallback.verify();
		});

        test('The Request should be send by calling the send method', function () {
            exercisePost();
            expRequestSend.verify();
        });
    });

    suite('#close', function() {

        setup(function () {

        });

        function exerciseClose() {
            sut.post(url, headers, body, replyToInfo, objCallback);
            sut.close();
        };

        test('Should call ClientCloser.close', function () {
            sinon.stub(fakeRequest, 'getReqUrl').returns(url);
            var expClientCloserClose = clientCloserMock.expects('close').once().withExactArgs(url);

            exerciseClose();

            expClientCloserClose.verify();
        });
    });
});
