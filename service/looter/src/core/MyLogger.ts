export class MyLogger {
    public log(...args: any[]) {
        console.log.apply(console, args);
    }
}