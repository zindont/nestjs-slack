"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testing_1 = require("@nestjs/testing");
const slack_module_1 = require("../slack.module");
const slack_service_1 = require("../slack.service");
const nock = require("nock");
const common_1 = require("@nestjs/common");
describe('slack.module', () => {
    const baseUrl = 'http://example.com';
    it('should construct with useFactory', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const app = yield testing_1.Test.createTestingModule({
            imports: [
                slack_module_1.SlackModule.forRootAsync({
                    useFactory: () => {
                        return {
                            type: 'webhook',
                            url: `${baseUrl}/webhook`,
                        };
                    },
                }),
            ],
        }).compile();
        const service = app.get(slack_service_1.SlackService);
        const scope = nock(baseUrl, { encodedQueryParams: true })
            .post('/webhook', {
            text: 'hello-world',
        })
            .reply(200, 'ok');
        yield service.postMessage({ text: 'hello-world' });
        scope.done();
    }));
    it('should construct with useClass', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let ConfigClass = class ConfigClass {
            slackConfigModuleOptions() {
                return {
                    type: 'webhook',
                    url: `${baseUrl}/webhook`,
                };
            }
        };
        ConfigClass = tslib_1.__decorate([
            (0, common_1.Injectable)()
        ], ConfigClass);
        let TestModule = class TestModule {
        };
        TestModule = tslib_1.__decorate([
            (0, common_1.Module)({
                exports: [ConfigClass],
                providers: [ConfigClass],
            })
        ], TestModule);
        const app = yield testing_1.Test.createTestingModule({
            imports: [
                slack_module_1.SlackModule.forRootAsync({
                    imports: [TestModule],
                    useClass: ConfigClass,
                }),
            ],
        }).compile();
        const service = app.get(slack_service_1.SlackService);
        const scope = nock(baseUrl, { encodedQueryParams: true })
            .post('/webhook', {
            text: 'hello-world',
        })
            .reply(200, 'ok');
        yield service.postMessage({ text: 'hello-world' });
        scope.done();
    }));
});
