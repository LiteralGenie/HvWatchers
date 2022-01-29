export class Castable {
    static INFO_PATTERN = /\('(.*?)',/
    static SELECTOR = 'td.bts > div'
    
    constructor(
        public readonly id: string,
        public readonly name: string,
        public disabled: boolean
    ) {}

    static from_document(document: Document) {
        const castables = Array
                .from(document.querySelectorAll(this.SELECTOR))
                .map(div => this.from_div(div as HTMLDivElement))
        
        const stance = document.querySelector("#ckey_spirit")
        castables.push(new Castable(stance.id, 'Spirit Stance', false))

        return castables
    }

    static from_div(div: HTMLDivElement) {
        const id = div.id
        
        const name = div.onmouseover
                        .toString()
                        .match(this.INFO_PATTERN)
                        //@ts-ignore
                        .at(1)
        
        const disabled = !div.hasAttribute('onclick')

        return new Castable(id, name, disabled)
    }
}