import { Buff } from "./buff"
import { Castable } from "./castable"
import { Item } from "./item"
import { PlayerVitals } from "./player_vitals"

export class Player {
    constructor(
        public readonly hp: PlayerVitals,
        public readonly mp: PlayerVitals,
        public readonly sp: PlayerVitals,
        public readonly spirit: PlayerVitals,

        public readonly buffs: Buff[],
        public readonly castables: Castable[],
        public readonly items: Item[]
    ) {}
    
    static from_document(document: Document) {
        const vitals = PlayerVitals.from_document(document)
        const buffs = Buff.from_document_player(document)
        const castables = Castable.from_document(document)
        const items = Item.from_document(document)

        return new Player(
            vitals.hp,
            vitals.mp,
            vitals.sp,
            vitals.spirit,
            
            buffs,
            castables,
            items,
        )
    }
}