import {handlers} from "irc";

export interface IIrcConnection {
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    connect(retryCount?: number | handlers.IRaw, callback?: handlers.IRaw): void;
    say(target: string, message: string): void;
}