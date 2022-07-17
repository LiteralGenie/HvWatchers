export class Buff {
    static INFO_PATTERN = /\('(.*?)', '.*?', (.*?)\)/
    static SELECTOR_PLAYER = '#pane_effects > img'
    static SELECTOR_MONSTER= '.btm6 > img'

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly duration: number | null
    ) {}

    static from_document_player(document: Document) {
        const buffs = Array
            .from(document.querySelectorAll(this.SELECTOR_PLAYER))
            .map(img => this.from_img(img as HTMLImageElement))

        const stance = document.querySelector("img[src*='spirit_a.png']")
        if(stance) buffs.push(new Buff(stance.id,  'Spirit Stance', null))

        return buffs
    }

    static from_monster(div: HTMLElement) {
        const buffs = Array
            .from(div.querySelectorAll(this.SELECTOR_MONSTER))
            .map(img => this.from_img(img as HTMLImageElement))

        return buffs
    }

    static from_img(img: HTMLImageElement) {
        const id = img.id
        
        const match = img.onmouseover.toString().match(this.INFO_PATTERN)

        const name = match[1]
        const duration = parseInt(match[2])

        return new Buff(id, name, duration)
    }
}