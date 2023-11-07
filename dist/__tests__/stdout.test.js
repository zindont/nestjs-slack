"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slack_service_1 = require("../slack.service");
const fixtures_1 = require("./fixtures");
describe('stdout', () => {
    let service;
    let output;
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        output = jest.fn();
        const app = yield (0, fixtures_1.createApp)({ type: 'stdout', output });
        service = app.get(slack_service_1.SlackService);
    }));
    it('must output requests to stdout', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const request = {
            text: 'hello-world',
            channel: 'hello-world',
        };
        yield service.postMessage(request);
        expect(output).toHaveBeenCalledWith(request);
    }));
});
