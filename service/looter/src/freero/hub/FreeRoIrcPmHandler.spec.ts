import {FreeRoEventArgs} from './FreeRoEventArgs';
import {handlers} from 'irc';
import FreeRoIrcPmHandler from './FreeRoIrcPmHandler';
import {EmptyLogger} from "my-core/MyLogger";

describe('FreeRoIrcHub', () => {

    const fakeIrc = {
        _cb: {},

        addListener(e: string, cb: () => void) { this._cb[e] = cb; return this; },

        connect(retryCount?: number | handlers.IRaw, callback?: handlers.IRaw) {},

        doMessage(from: string, message: string) {
            this._cb['message#freero'] && this._cb['message#freero'](from, message);
        },

        doPmMessage(from: string, message: string) {
            this._cb['pm'] && this._cb['pm'](from, message);
        },

        doError(msg: string) {
            this._cb['error'](msg);
        },

        say() {}
    };


    it('should handle irc pm messages and dispatch', () => {
        const mockCallback = jest.fn();
        const from = 'FreeRo';
        const msg = 'Hello world';

        const hub = new FreeRoIrcPmHandler(fakeIrc, new EmptyLogger());
        hub.onEvent().subscribe(mockCallback);

        fakeIrc.doPmMessage(from, msg);

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe(hub);
        expect(mockCallback.mock.calls[0][1]).toBeInstanceOf(FreeRoEventArgs);
        expect(mockCallback.mock.calls[0][1].author).toBe(from);
        expect(mockCallback.mock.calls[0][1].message).toBe(msg);
        expect(mockCallback.mock.calls[0][1].date).not.toBeNull();
    });


    it('should not handle irc common messages', () => {
        const mockCallback = jest.fn();
        const from = 'FreeRo';
        const msg = 'Hello world';

        const hub = new FreeRoIrcPmHandler(fakeIrc, new EmptyLogger());
        hub.onEvent().subscribe(mockCallback);

        fakeIrc.doMessage(from, msg);

        expect(mockCallback.mock.calls.length).toBe(0);
    });
});