import { Buff } from "./buff";
import { MonsterVitals } from "./monster_vitals";

export class Monster {
    static SELECTOR_MONSTERS = '#pane_monster > div'

    constructor(
        public readonly name: string,
        public readonly hp: MonsterVitals,
        public readonly mp: MonsterVitals,
        public readonly sp: MonsterVitals,

        public readonly buffs: Buff[]
    ) {}

    static from_document(document: Document) {
        return Array
                .from(document.querySelectorAll(this.SELECTOR_MONSTERS))
                .map(div => this.from_div(div as HTMLElement))
    }
    
    static from_div(div: HTMLElement) {
        const vitals = MonsterVitals.from_div(div)
        const name = div.querySelector('.btm3').textContent
        const buffs = Buff.from_monster(div)

        return new Monster(name, vitals.hp, vitals.mp, vitals.sp, buffs)
    }
}