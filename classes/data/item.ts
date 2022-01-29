export class Item {
    static SELECTOR = '.bti3 > div'
    
    constructor(
        public readonly id: string,
        public readonly name: string,
        public disabled: boolean
    ) {}

    static from_document(document: Document) {
        return Array
                .from(document.querySelectorAll(this.SELECTOR))
                .map(div => this.from_div(div as HTMLDivElement))
    }

    static from_div(div: HTMLDivElement) {
        const id = div.id
        const name = div.textContent
        const disabled = !div.hasAttribute('onclick')

        return new Item(id, name, disabled)
    }
}