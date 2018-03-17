class Notify {
    public readonly id: number;
    public readonly owner: string;
    public readonly pattern: string;


    constructor(id: number, owner: string, pattern: string) {
        this.id = id;
        this.owner = owner;
        this.pattern = pattern;
    }
}

export default Notify;