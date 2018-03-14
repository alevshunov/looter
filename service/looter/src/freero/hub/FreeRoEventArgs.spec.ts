import {FreeRoEventArgs} from "./FreeRoEventArgs";

describe('FreeRoEventArgs', () => {
    it('should build correctly', () => {

        const message = "Hello world, поченил нитку.";
        const author = "X";
        const date =  new Date(2038, 3, 11);
        const pm = true;

        const args = new FreeRoEventArgs(author, message, date, pm);

        expect(args).toBeInstanceOf(FreeRoEventArgs);
        expect(args.date).toBe(date);
        expect(args.message).toBe(message);
        expect(args.author).toBe(author);
        expect(args.isPrivate).toBe(pm);
    });
});