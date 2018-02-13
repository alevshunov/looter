export class CardDrop {
    public readonly card: string;
    public readonly owner: string;
    public readonly date: Date;


    constructor(card: string, owner: string, date: Date) {
        this.card = card;
        this.owner = owner;
        this.date = date;
    }
}