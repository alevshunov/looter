import {Message} from "./Message";

describe('Message', () => {
    it('should build correctly', () => {
        const owner = 'Owner';
        const text = 'Hello world!';
        const date = new Date();
        const source = 'IRC';
        const originalOwner = 'A';
        const originalMessage = 'Hey, Hello world!';

        const message = new Message(owner, text, date, source, originalOwner, originalMessage);

        expect(message).toBeInstanceOf(Message);
        expect(message.source).toBe(source);
        expect(message.owner).toBe(owner);
        expect(message.message).toBe(text);
        expect(message.date).toBe(date);
        expect(message.originalOwner).toBe(originalOwner);
        expect(message.originalMessage).toBe(originalMessage);
    });
});