"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const slack_block_builder_1 = require("slack-block-builder");
const fixtures_1 = require("./fixtures");
const slack_service_1 = require("../slack.service");
describe('SlackService', () => {
    it('must be defined', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const app = yield (0, fixtures_1.createApp)();
        expect(app.get(slack_service_1.SlackService)).toBeDefined();
    }));
    describe('helpers', () => {
        let service;
        beforeEach(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const app = yield (0, fixtures_1.createApp)();
            service = app.get(slack_service_1.SlackService);
            service.postMessage = jest.fn();
        }));
        describe('sendText', () => {
            it('must forward to sendMessage', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                yield service.sendText('hello world');
                expect(service.postMessage).toHaveBeenCalledWith({
                    text: 'hello world',
                });
            }));
        });
        describe('sendBlocks', () => {
            it('must forward to sendMessage', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                const blocks = (0, slack_block_builder_1.BlockCollection)(slack_block_builder_1.Blocks.Section({ text: 'hello-world' }));
                yield service.sendBlocks(blocks);
                expect(service.postMessage).toHaveBeenCalledWith({ blocks });
            }));
        });
        describe('WebClient', () => {
            it('slack sdk WebClient is available', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                expect(service.client).toBeDefined();
            }));
        });
    });
});
