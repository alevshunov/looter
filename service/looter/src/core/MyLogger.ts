export class MyLogger {
    static log(...args: any[]) {
        console.log(`[${new Date()}]:`, args.join('; '));
    }

    public log(...args: any[]) {
        MyLogger.log(args);
    }
}