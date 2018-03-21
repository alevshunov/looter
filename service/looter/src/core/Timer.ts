class Timer {
    private _started: boolean = false;
    private _timerId: NodeJS.Timer;
    private _ticker: Function;
    private _delay: number = 1000;


    constructor(ticker: Function, delay: number) {
        this._ticker = ticker;
        this._delay = delay;
    }

    public start() {
        if (this._started) {
            return;
        }

        this._started = true;
        this.waitNext();
    }

    public stop() {
        if (!this._started) {
            return;
        }

        this._started = false;
        clearTimeout(this._timerId);
    }

    private async tick() {
        try {
            await this._ticker();
        } finally {
            this.waitNext();
        }
    }

    private waitNext() {
        this._timerId = setTimeout(this.tick.bind(this), this._delay);
    }
}

export default Timer;