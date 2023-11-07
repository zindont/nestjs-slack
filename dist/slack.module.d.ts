import { DynamicModule } from '@nestjs/common';
import { SlackAsyncConfig, SlackSyncConfig } from './types';
export declare class SlackModule {
    static forRoot(opts?: Partial<SlackSyncConfig>): DynamicModule;
    static forRootAsync(opts: SlackAsyncConfig): DynamicModule;
    private static createAsyncOptionsProvider;
    private static createAsyncConfig;
    private static createAsyncGoogleLogger;
    private static createAsyncWebClient;
}
