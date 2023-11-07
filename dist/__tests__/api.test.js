"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jest_mock_web_client_1 = require("@slack-wrench/jest-mock-web-client");
const slack_service_1 = require("../slack.service");
const fixtures_1 = require("./fixtures");
describe('api', () => {
    let service;
    let output;
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        output = jest.fn();
        const app = yield (0, fixtures_1.createApp)({
            type: 'api',
            defaultChannel: 'my-channel',
            token: 'my-token',
        });
        service = app.get(slack_service_1.SlackService);
    }));
    it('must send requests to API', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield service.postMessage({ text: 'hello-world' });
        expect(jest_mock_web_client_1.MockedWebClient.mock.instances[0].chat.postMessage).toHaveBeenCalledWith({
            channel: 'my-channel',
            text: 'hello-world',
        });
    }));
});
