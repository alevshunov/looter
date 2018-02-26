export class MyLogger {
    public log(...args: any[]) {
        console.log.call(console, `[${new Date()}]:`, args.join(' | '));
    }
}