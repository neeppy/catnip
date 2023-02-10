import { BrowserWindow, IpcMainInvokeEvent } from 'electron';

export interface Route {
    channel: string;
    handle(event: RouteHandlerData, ...args): Promise<unknown>;
}

export interface RouteHandlerData {
    event: IpcMainInvokeEvent;
    window: BrowserWindow;
}
