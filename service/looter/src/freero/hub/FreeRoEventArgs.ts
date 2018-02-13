export class FreeRoEventArgs {
    public readonly author: string;
    public readonly message: string;
    public readonly date: Date;

    constructor(author: string, message: string, date: Date) {
        this.message = message;
        this.author = author;
        this.date = date;
    }
}