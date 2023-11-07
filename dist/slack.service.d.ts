import type { LogSync } from '@google-cloud/logging';
import type { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import type { SlackBlockDto } from 'slack-block-builder';
import { Channels } from './plugin';
import type { SlackConfig } from './types';
export type SlackMessageOptions<C = Channels> = Partial<ChatPostMessageArguments & {
    channel: C;
}>;
export declare class SlackService<C = Channels> {
    private readonly options;
    readonly client: WebClient | null;
    private readonly log;
    constructor(options: SlackConfig, client: WebClient | null, log: LogSync | null);
    sendText(text: string, opts?: Omit<SlackMessageOptions<C>, 'text' | 'blocks'>): Promise<void>;
    sendBlocks(blocks: Readonly<SlackBlockDto>[], opts?: Omit<SlackMessageOptions<C>, 'blocks'>): Promise<void>;
    postMessage(req: SlackMessageOptions<C>): Promise<void>;
    private runApiRequest;
    private runWebhookRequest;
    private runStdoutRequest;
    private runGoogleLoggingRequest;
}
