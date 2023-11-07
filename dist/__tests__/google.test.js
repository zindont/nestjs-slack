"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logging_1 = require("@google-cloud/logging");
const testing_1 = require("@nestjs/testing");
const constants_1 = require("../constants");
const slack_service_1 = require("../slack.service");
const fixtures_1 = require("./fixtures");
describe('google logging', () => {
    let service;
    let write;
    beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        write = jest.fn();
        const app = yield testing_1.Test.createTestingModule({
            providers: [
                {
                    provide: constants_1.SLACK_MODULE_OPTIONS,
                    useValue: { type: 'google' },
                },
                {
                    provide: constants_1.SLACK_WEB_CLIENT,
                    useValue: null,
                },
                {
                    provide: constants_1.GOOGLE_LOGGING,
                    useValue: {
                        write,
                        entry: (metadata, message) => (Object.assign(Object.assign({}, metadata), { message })),
                    },
                },
                slack_service_1.SlackService,
            ],
        }).compile();
        service = app.get(slack_service_1.SlackService);
    }));
    it('must output requests as structured logs', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const request = {
            text: 'hello-world',
            channel: 'hello-world',
        };
        yield service.postMessage(request);
        expect(write).toHaveBeenCalledWith({
            'logging.googleapis.com/labels': { type: 'nestjs-slack' },
            'logging.googleapis.com/operation': {
                producer: 'github.com/bjerkio/nestjs-slack@v1',
            },
            message: { slack: { channel: 'hello-world', text: 'hello-world' } },
            severity: 'NOTICE',
        });
    }));
    it('must resolve @google/cloud-logging', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const app = yield (0, fixtures_1.createApp)({ type: 'google' });
        expect(app.get(constants_1.GOOGLE_LOGGING)).toBeInstanceOf(logging_1.LogSync);
    }));
});
