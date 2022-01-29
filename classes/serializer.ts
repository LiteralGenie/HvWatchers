import { Buff } from "./data/buff";
import { Castable } from "./data/castable";
import { Item } from "./data/item";
import { Monster } from "./data/monster";
import { MonsterVitalGroup, MonsterVitals } from "./data/monster_vitals";
import { Player } from "./data/player";
import { PlayerVitalGroup, PlayerVitals } from "./data/player_vitals";
import { BattleState } from "./parser";

export class Serializer {
    static battle_state(bs: BattleState) {
        return {
            player: this.player(bs.player),
            monsters: bs.monsters.map(m => this.monster(m))
        }
    }

    static player(p: Player) {
        return {
            hp: this.player_vitals(p.hp),
            mp: this.player_vitals(p.mp),
            sp: this.player_vitals(p.sp),
            spirit: this.player_vitals(p.spirit),

            buffs: p.buffs.map(b => this.buff(b)),
            castables: p.castables.map(c => this.castable(c)),
            items: p.items.map(it => this.item(it))
        }
    }

    static monster(m: Monster) {
        return {
            name: m.name,
            hp: this.monster_vitals(m.hp),
            mp: this.monster_vitals(m.mp),
            sp: this.monster_vitals(m.sp),
            
            buffs: m.buffs.map(b => this.buff(b))
        }
    }

    static buff(b: Buff) {
        return {
            id: b.id,
            name: b.name,
            duration: b.duration
        }
    }

    static castable(c: Castable) {
        return {
            id: c.id,
            name: c.name, 
            disabled: c.disabled
        }
    }

    static item(i: Item) {
        return {
            id: i.id,
            name: i.name, 
            disabled: i.disabled
        }
    }

    static player_vitals(v: PlayerVitals) {
        return {
            ratio: v.ratio,
            current: v.current,
            max: v.max
        }
    }

    static player_vital_group(vg: PlayerVitalGroup) {
        return {
            hp: this.player_vitals(vg.hp),
            mp: this.player_vitals(vg.mp),
            sp: this.player_vitals(vg.sp),
            spirit: this.player_vitals(vg.spirit)
        }
    }

    static monster_vitals(v: MonsterVitals) {
        return {
            ratio: v.ratio,
        }
    }

    static monster_vital_group(vg: MonsterVitalGroup) {
        return {
            name: vg.hp
        }
    }
}

export interface SerializedBattleState {
    player: {
        hp: {
            ratio: number;
            current: number;
            max: number;
        };
        mp: {
            ratio: number;
            current: number;
            max: number;
        };
        sp: {
            ratio: number;
            current: number;
            max: number;
        };
        spirit: {
            ratio: number;
            current: number;
            max: number;
        };
        buffs: {
            id: string;
            name: string;
            duration: number;
        }[];
        castables: {
            id: string;
            name: string;
            disabled: boolean;
        }[];
        items: {
            id: string;
            name: string;
            disabled: boolean;
        }[];
    };
    monsters: {
        name: string;
        hp: {
            ratio: number;
        };
        mp: {
            ratio: number;
        };
        sp: {
            ratio: number;
        };
        buffs: {
            id: string;
            name: string;
            duration: number;
        }[];
    }[]
}