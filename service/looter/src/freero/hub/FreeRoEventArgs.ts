export class FreeRoEventArgs {
    public readonly author: string;
    public readonly message: string;
    public readonly date: Date;
    public readonly isPrivate: boolean;

    constructor(author: string, message: string, date: Date, isPrivate: boolean) {
        this.message = message;
        this.author = author;
        this.date = date;
        this.isPrivate = isPrivate;
    }
}