export class MyLogger {
    public log(...args: any[]): void {
        console.log.call(console, `[INF] [${new Date()}]:`, args.join(' '));
    }

    public error(...args: any[]): void {
        console.log.call(console, `[ERR] [${new Date()}]:`, args.join(' '));
    }
}