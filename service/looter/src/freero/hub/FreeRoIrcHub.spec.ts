import {FreeRoIrcHub} from "./FreeRoIrcHub";
import {handlers} from "irc";
import {FreeRoEventArgs} from "./FreeRoEventArgs";

describe('FreeRoIrcHub', () => {

    const fakeIrc = {
        _cb: {},
        addListener(e: string, cb: () => void) { this._cb[e] = cb; return this; },

        connect(retryCount?: number | handlers.IRaw, callback?: handlers.IRaw) {},

        doMessage(from: string, to: string, message: string) {
            this._cb['message'](from, to, message);
        },

        doError(msg: string) {
            this._cb['error'](msg);
        }
    };


    it('should handle irc messages and dispatch', () => {
        const mockCallback = jest.fn();
        const from = 'FreeRo';
        const to = '#FreeRO';
        const msg = 'Hello world';

        const hub = new FreeRoIrcHub(fakeIrc);
        hub.onEvent().subscribe(mockCallback);

        fakeIrc.doMessage(from, to, msg);

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe(hub);
        expect(mockCallback.mock.calls[0][1]).toBeInstanceOf(FreeRoEventArgs);
        expect(mockCallback.mock.calls[0][1].author).toBe(from);
        expect(mockCallback.mock.calls[0][1].message).toBe(msg);
        expect(mockCallback.mock.calls[0][1].date).not.toBeNull();
    });
});