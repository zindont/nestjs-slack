"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
const ts_invariant_1 = require("ts-invariant");
const constants_1 = require("./constants");
let SlackService = class SlackService {
    constructor(options, client, log) {
        this.options = options;
        this.client = client;
        this.log = log;
    }
    sendText(text, opts) {
        return this.postMessage(Object.assign({ text }, opts));
    }
    sendBlocks(blocks, opts) {
        return this.postMessage(Object.assign({ blocks }, opts));
    }
    postMessage(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const requestTypes = {
                api: () => this.runApiRequest(req),
                webhook: () => this.runWebhookRequest(req),
                stdout: () => this.runStdoutRequest(req),
                google: () => this.runGoogleLoggingRequest(req),
            };
            (0, ts_invariant_1.default)(requestTypes[this.options.type], 'expected option to exist');
            yield requestTypes[this.options.type]();
        });
    }
    runApiRequest(req) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (0, ts_invariant_1.default)(this.options.type === 'api');
            (0, ts_invariant_1.default)(this.client, 'expected this.client to be WebClient');
            const channel = (_a = req.channel) !== null && _a !== void 0 ? _a : this.options.defaultChannel;
            (0, ts_invariant_1.default)(channel, 'neither channel nor defaultChannel was applied');
            yield this.client.chat.postMessage(Object.assign({ channel }, req));
        });
    }
    runWebhookRequest(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (0, ts_invariant_1.default)(this.options.type === 'webhook', 'expected type to be webhook');
            if ('channels' in this.options) {
                const { channel: userDefinedChannel = this.options.defaultChannel } = req, slackRequest = tslib_1.__rest(req, ["channel"]);
                (0, ts_invariant_1.default)(userDefinedChannel, 'neither channel nor defaultChannel was applied');
                const channel = this.options.channels.find(c => c.name === userDefinedChannel);
                if (!channel) {
                    throw new Error(`The channel ${userDefinedChannel} does not exist. You must add this in the channels option.`);
                }
                yield (0, node_fetch_1.default)(channel.url, {
                    method: 'POST',
                    body: JSON.stringify(slackRequest),
                });
                return;
            }
            (0, ts_invariant_1.default)('url' in this.options, 'expected url to be defined');
            yield (0, node_fetch_1.default)(this.options.url, {
                method: 'POST',
                body: JSON.stringify(req),
            });
        });
    }
    runStdoutRequest(req) {
        (0, ts_invariant_1.default)(this.options.type === 'stdout');
        (0, ts_invariant_1.default)(this.options.output, 'expected output to be defined');
        this.options.output(req);
    }
    runGoogleLoggingRequest(req) {
        var _a;
        (0, ts_invariant_1.default)(this.options.type === 'google');
        const metadata = {
            severity: 'NOTICE',
            'logging.googleapis.com/labels': { type: 'nestjs-slack' },
            'logging.googleapis.com/operation': {
                producer: 'github.com/bjerkio/nestjs-slack@v1',
            },
        };
        (0, ts_invariant_1.default)(this.log, 'expected Google Logger instance');
        const channel = (_a = req.channel) !== null && _a !== void 0 ? _a : this.options.defaultChannel;
        this.log.write(this.log.entry(metadata, {
            slack: Object.assign({ channel }, req),
        }));
    }
};
SlackService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(constants_1.SLACK_MODULE_OPTIONS)),
    tslib_1.__param(1, (0, common_1.Inject)(constants_1.SLACK_WEB_CLIENT)),
    tslib_1.__param(2, (0, common_1.Inject)(constants_1.GOOGLE_LOGGING)),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
], SlackService);
exports.SlackService = SlackService;
