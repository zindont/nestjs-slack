"use strict";
var SlackModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const ts_invariant_1 = require("ts-invariant");
const constants_1 = require("./constants");
const slack_service_1 = require("./slack.service");
let SlackModule = SlackModule_1 = class SlackModule {
    static forRoot(opts = {}) {
        const providers = [
            {
                provide: constants_1.SLACK_MODULE_USER_OPTIONS,
                useValue: opts,
            },
            this.createAsyncConfig(),
            this.createAsyncGoogleLogger(),
            this.createAsyncWebClient(),
        ];
        return {
            global: opts.isGlobal,
            module: SlackModule_1,
            providers,
            exports: providers,
        };
    }
    static forRootAsync(opts) {
        const providers = [
            this.createAsyncOptionsProvider(opts),
            this.createAsyncConfig(),
            this.createAsyncGoogleLogger(),
            this.createAsyncWebClient(),
        ];
        return {
            global: opts.isGlobal,
            module: SlackModule_1,
            imports: opts.imports,
            providers,
            exports: providers,
        };
    }
    static createAsyncOptionsProvider(opts) {
        var _a;
        if (opts.useFactory) {
            return {
                provide: constants_1.SLACK_MODULE_USER_OPTIONS,
                useFactory: opts.useFactory,
                inject: (_a = opts.inject) !== null && _a !== void 0 ? _a : [],
            };
        }
        (0, ts_invariant_1.default)(opts.useClass);
        return {
            provide: constants_1.SLACK_MODULE_USER_OPTIONS,
            useFactory: (optionsFactory) => tslib_1.__awaiter(this, void 0, void 0, function* () { return optionsFactory.slackConfigModuleOptions(); }),
            inject: [opts.useClass],
        };
    }
    static createAsyncConfig() {
        return {
            provide: constants_1.SLACK_MODULE_OPTIONS,
            inject: [constants_1.SLACK_MODULE_USER_OPTIONS],
            useFactory: (opts) => (Object.assign({ output: (out) => process.stdout.write(`${JSON.stringify(out)}\n`) }, opts)),
        };
    }
    static createAsyncGoogleLogger() {
        return {
            provide: constants_1.GOOGLE_LOGGING,
            inject: [constants_1.SLACK_MODULE_OPTIONS],
            useFactory: (opts) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (opts.type !== 'google') {
                    return {
                        provide: constants_1.GOOGLE_LOGGING,
                        useValue: null,
                    };
                }
                const { Logging } = yield Promise.resolve().then(() => require('@google-cloud/logging'));
                const logging = new Logging();
                return logging.logSync('slack');
            }),
        };
    }
    static createAsyncWebClient() {
        return {
            provide: constants_1.SLACK_WEB_CLIENT,
            inject: [constants_1.SLACK_MODULE_OPTIONS],
            useFactory: (opts) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (opts.type !== 'api') {
                    return {
                        provide: constants_1.SLACK_WEB_CLIENT,
                        useValue: null,
                    };
                }
                const { WebClient } = yield Promise.resolve().then(() => require('@slack/web-api'));
                return new WebClient(opts.token, opts.clientOptions);
            }),
        };
    }
};
SlackModule = SlackModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [slack_service_1.SlackService],
        exports: [slack_service_1.SlackService],
    })
], SlackModule);
exports.SlackModule = SlackModule;
