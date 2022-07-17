import { Monster } from "./data/monster";
import { Player } from "./data/player";

export interface BattleState {
    player: Player
    monsters: Monster[]
}

export class Parser {
    static from_document(document: Document): BattleState {
        const player = Player.from_document(document)
        const monsters = Monster.from_document(document)

        return { player, monsters }
    }
}