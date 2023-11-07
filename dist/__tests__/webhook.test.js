"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slack_service_1 = require("../slack.service");
const fixtures_1 = require("./fixtures");
const nock = require("nock");
describe('webhook', () => {
    let service;
    const baseUrl = 'https://example.com';
    describe('simple webhook', () => {
        it('must send requests to API', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const app = yield (0, fixtures_1.createApp)({
                type: 'webhook',
                url: `${baseUrl}/simple-webhook`,
            });
            service = app.get(slack_service_1.SlackService);
            const scope = nock(baseUrl, { encodedQueryParams: true })
                .post('/simple-webhook', {
                text: 'hello-world',
            })
                .reply(200, 'ok');
            yield service.postMessage({ text: 'hello-world' });
            scope.done();
        }));
        it.skip('Should throw when request fails', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const scope = nock(baseUrl, { encodedQueryParams: true })
                .post('/failing-simple-webhook', {
                text: 'hello-world',
            })
                .reply(500, 'fail');
            const app = yield (0, fixtures_1.createApp)({
                type: 'webhook',
                url: `${baseUrl}/failing-simple-webhook`,
            });
            service = app.get(slack_service_1.SlackService);
            yield service
                .postMessage({ text: 'hello-world' })
                .catch(error => expect(error).toMatchInlineSnapshot());
            scope.done();
        }));
    });
    describe('multiple webhooks', () => {
        beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const app = yield (0, fixtures_1.createApp)({
                type: 'webhook',
                channels: [
                    {
                        name: 'test-channel',
                        url: `${baseUrl}/test-webhook`,
                    },
                    {
                        name: 'failing-test-channel',
                        url: `${baseUrl}/failing-webhook`,
                    },
                ],
            });
            service = app.get(slack_service_1.SlackService);
        }));
        it('must send requests to API', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const scope = nock(baseUrl, { encodedQueryParams: true })
                .post('/test-webhook', {
                text: 'hello-world',
            })
                .reply(200, 'ok');
            yield service.postMessage({
                text: 'hello-world',
                channel: 'test-channel',
            });
            scope.done();
        }));
        it('should throw when channel does not exist', () => {
            expect.assertions(1);
            service
                .postMessage({ text: 'hello-world', channel: 'not-a-channel' })
                .catch(e => expect(e).toMatchInlineSnapshot(`[Error: The channel not-a-channel does not exist. You must add this in the channels option.]`));
        });
    });
});
