import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { WebClientOptions } from '@slack/web-api';
import { Channels } from './plugin';
export interface SlackApiOptions {
    type: 'api';
    token: string;
    defaultChannel?: string;
    clientOptions?: WebClientOptions;
}
export interface SlackWebhookOptions {
    type: 'webhook';
    url: string;
}
export interface SlackMultipleWebhooksOptions {
    type: 'webhook';
    channels: {
        name: string;
        url: string;
    }[];
    defaultChannel?: Channels;
}
export interface SlackStdoutOptions {
    type: 'stdout';
    output?: (out: unknown) => void;
}
export interface SlackGoogleOptions {
    type: 'google';
    defaultChannel?: string;
}
export type SlackConfig = SlackApiOptions | SlackWebhookOptions | SlackMultipleWebhooksOptions | SlackStdoutOptions | SlackGoogleOptions;
export type SlackSyncConfig = SlackConfig & {
    isGlobal?: boolean;
};
export interface SlackAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    useClass?: Type<SlackConfigFactory>;
    useFactory?: (...args: unknown[]) => Promise<SlackConfig> | SlackConfig;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<SlackConfigFactory>;
    isGlobal?: boolean;
}
export interface SlackConfigFactory {
    slackConfigModuleOptions(): Promise<SlackConfig> | SlackConfig;
}
