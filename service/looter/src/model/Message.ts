export class Message {
    public readonly owner: string;
    public readonly message: string;
    public readonly date: Date;
    public readonly source: string;
    public readonly originalOwner: string;
    public readonly originalMessage: string;

    constructor(owner: string, message: string, date: Date, source: string, originalOwner: string, originalMessage: string) {
        this.owner = owner;
        this.date = date;
        this.message = message;
        this.source = source;
        this.originalMessage = originalMessage;
        this.originalOwner = originalOwner;
    }
}