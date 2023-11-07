"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const testing_1 = require("@nestjs/testing");
const slack_module_1 = require("../slack.module");
const createApp = (options) => {
    return testing_1.Test.createTestingModule({
        imports: [slack_module_1.SlackModule.forRoot(options)],
    }).compile();
};
exports.createApp = createApp;
