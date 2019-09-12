import { LinuxTargetSpecificOptions } from "..";
import { LinuxPackager } from "../linuxPackager";
import { IconInfo } from "../platformPackager";
export declare const installPrefix = "/opt";
export declare class LinuxTargetHelper {
    private packager;
    private readonly iconPromise;
    private readonly mimeTypeFilesPromise;
    maxIconPath: string | null;
    constructor(packager: LinuxPackager);
    readonly icons: Promise<Array<IconInfo>>;
    readonly mimeTypeFiles: Promise<string | null>;
    private computeMimeTypeFiles;
    private computeDesktopIcons;
    getDescription(options: LinuxTargetSpecificOptions): string;
    writeDesktopEntry(targetSpecificOptions: LinuxTargetSpecificOptions, exec?: string, destination?: string | null, extra?: {
        [key: string]: string;
    }): Promise<string>;
    computeDesktopEntry(targetSpecificOptions: LinuxTargetSpecificOptions, exec?: string, extra?: {
        [key: string]: string;
    }): Promise<string>;
}
