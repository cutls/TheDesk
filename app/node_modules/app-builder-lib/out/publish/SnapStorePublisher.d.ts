import { Publisher, UploadTask, PublishContext } from "electron-publish";
import { PublishConfiguration } from "builder-util-runtime";
export declare class SnapStorePublisher extends Publisher {
    private options;
    readonly providerName = "snapStore";
    constructor(context: PublishContext, options: SnapStoreOptions);
    upload(task: UploadTask): Promise<any>;
    toString(): string;
}
/**
 * [Snap Store](https://snapcraft.io/) options.
 */
export interface SnapStoreOptions extends PublishConfiguration {
    /**
     * The list of channels the snap would be released.
     * @default ["edge"]
     */
    readonly channels?: string | Array<string> | null;
}
