export class Timestamp {
    public readonly start: number

    constructor(
        public readonly factory: any = Date.now.bind(Date),
        public readonly unit: string = 'ms',
        public readonly num_digits = 0
    ) {
        this.start = this.factory()
    }

    get t() {
        return this.factory() - this.start
    }

    get tf() {
        return `[${this.t.toFixed(this.num_digits)}${this.unit}]`
    }
}