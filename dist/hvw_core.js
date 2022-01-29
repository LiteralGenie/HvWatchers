var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("classes/data/buff", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Buff = void 0;
    class Buff {
        constructor(id, name, duration) {
            this.id = id;
            this.name = name;
            this.duration = duration;
        }
        static from_document_player(document) {
            const buffs = Array
                .from(document.querySelectorAll(this.SELECTOR_PLAYER))
                .map(img => this.from_img(img));
            const stance = document.querySelector("img[src='/isekai/y/battle/spirit_a.png']");
            if (stance)
                buffs.push(new Buff(stance.id, 'Spirit Stance', null));
            return buffs;
        }
        static from_monster(div) {
            const buffs = Array
                .from(div.querySelectorAll(this.SELECTOR_MONSTER))
                .map(img => this.from_img(img));
            return buffs;
        }
        static from_img(img) {
            const id = img.id;
            const match = img.onmouseover.toString().match(this.INFO_PATTERN);
            const name = match[1];
            const duration = parseInt(match[2]);
            return new Buff(id, name, duration);
        }
    }
    exports.Buff = Buff;
    Buff.INFO_PATTERN = /\('(.*?)', '.*?', (.*?)\)/;
    Buff.SELECTOR_PLAYER = '#pane_effects > img';
    Buff.SELECTOR_MONSTER = '.btm6 > img';
});
define("classes/data/monster_vitals", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MonsterVitals = void 0;
    class MonsterVitals {
        constructor(ratio) {
            this.ratio = ratio;
        }
        static from_div(div) {
            const name = div.querySelector('.btm3').textContent;
            if (!div.hasAttribute('onclick')) {
                return {
                    hp: new MonsterVitals(0),
                    mp: new MonsterVitals(0),
                    sp: new MonsterVitals(0)
                };
            }
            let bars = div.querySelectorAll('.btm4 > .btm5');
            let hp_ratio = _get_ratio(bars[0]);
            hp_ratio = Math.max(hp_ratio, 0.01);
            let mp_ratio = _get_ratio(bars[1]);
            let sp_ratio;
            if (bars[2] !== undefined)
                sp_ratio = _get_ratio(bars[2]);
            else
                sp_ratio = 0;
            return {
                hp: new MonsterVitals(hp_ratio),
                mp: new MonsterVitals(mp_ratio),
                sp: new MonsterVitals(sp_ratio)
            };
            function _get_ratio(div) {
                const width_max = div.clientWidth;
                const width_current = div.querySelector('img').clientWidth;
                const ratio = width_current / width_max;
                return ratio;
            }
        }
    }
    exports.MonsterVitals = MonsterVitals;
});
define("classes/data/monster", ["require", "exports", "classes/data/buff", "classes/data/monster_vitals"], function (require, exports, buff_1, monster_vitals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Monster = void 0;
    class Monster {
        constructor(name, hp, mp, sp, buffs) {
            this.name = name;
            this.hp = hp;
            this.mp = mp;
            this.sp = sp;
            this.buffs = buffs;
        }
        static from_document(document) {
            return Array
                .from(document.querySelectorAll(this.SELECTOR_MONSTERS))
                .map(div => this.from_div(div));
        }
        static from_div(div) {
            const vitals = monster_vitals_1.MonsterVitals.from_div(div);
            const name = div.querySelector('.btm3').textContent;
            const buffs = buff_1.Buff.from_monster(div);
            return new Monster(name, vitals.hp, vitals.mp, vitals.sp, buffs);
        }
    }
    exports.Monster = Monster;
    Monster.SELECTOR_MONSTERS = '#pane_monster > div';
});
define("classes/data/castable", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Castable = void 0;
    class Castable {
        constructor(id, name, disabled) {
            this.id = id;
            this.name = name;
            this.disabled = disabled;
        }
        static from_document(document) {
            const castables = Array
                .from(document.querySelectorAll(this.SELECTOR))
                .map(div => this.from_div(div));
            const stance = document.querySelector("#ckey_spirit");
            castables.push(new Castable(stance.id, 'Spirit Stance', false));
            return castables;
        }
        static from_div(div) {
            const id = div.id;
            const name = div.onmouseover
                .toString()
                .match(this.INFO_PATTERN)
                //@ts-ignore
                .at(1);
            const disabled = !div.hasAttribute('onclick');
            return new Castable(id, name, disabled);
        }
    }
    exports.Castable = Castable;
    Castable.INFO_PATTERN = /\('(.*?)',/;
    Castable.SELECTOR = 'td.bts > div';
});
define("classes/data/item", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Item = void 0;
    class Item {
        constructor(id, name, disabled) {
            this.id = id;
            this.name = name;
            this.disabled = disabled;
        }
        static from_document(document) {
            return Array
                .from(document.querySelectorAll(this.SELECTOR))
                .map(div => this.from_div(div));
        }
        static from_div(div) {
            const id = div.id;
            const name = div.textContent;
            const disabled = !div.hasAttribute('onclick');
            return new Item(id, name, disabled);
        }
    }
    exports.Item = Item;
    Item.SELECTOR = '.bti3 > div';
});
define("classes/data/player_vitals", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayerVitals = void 0;
    class PlayerVitals {
        constructor(ratio, current, max) {
            this.ratio = ratio;
            this.current = current;
            this.max = max;
        }
        static from_document(document) {
            const pane = document.querySelector(this.SELECTOR_PANE);
            return this.from_pane(pane);
        }
        static from_pane(pane) {
            const id_map = {
                hp: ['#dvbh', '#dvrhb,#dvrhd'],
                mp: ['#dvbm', '#dvrm'],
                sp: ['#dvbs', '#dvrs'],
                spirit: ['#dvbc', '#dvrc'],
            };
            const vitals = {};
            Object.entries(id_map).forEach(([k, v]) => {
                vitals[k] = _from_pair(...v);
            });
            return vitals;
            function _from_pair(bar_id, text_id) {
                const bar = document.querySelector(bar_id);
                const text = document.querySelector(text_id);
                const ratio = _get_ratio(bar);
                const current = parseInt(text.textContent);
                const max = current / ratio;
                return new PlayerVitals(ratio, current, max);
                function _get_ratio(div) {
                    const width_max = div.clientWidth;
                    const width_current = div.querySelector('img').clientWidth;
                    const ratio = width_current / width_max;
                    return ratio;
                }
            }
        }
    }
    exports.PlayerVitals = PlayerVitals;
    PlayerVitals.SELECTOR_PANE = '#pane_vitals';
});
define("classes/data/player", ["require", "exports", "classes/data/buff", "classes/data/castable", "classes/data/item", "classes/data/player_vitals"], function (require, exports, buff_2, castable_1, item_1, player_vitals_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = void 0;
    class Player {
        constructor(hp, mp, sp, spirit, buffs, castables, items) {
            this.hp = hp;
            this.mp = mp;
            this.sp = sp;
            this.spirit = spirit;
            this.buffs = buffs;
            this.castables = castables;
            this.items = items;
        }
        static from_document(document) {
            const vitals = player_vitals_1.PlayerVitals.from_document(document);
            const buffs = buff_2.Buff.from_document_player(document);
            const castables = castable_1.Castable.from_document(document);
            const items = item_1.Item.from_document(document);
            return new Player(vitals.hp, vitals.mp, vitals.sp, vitals.spirit, buffs, castables, items);
        }
    }
    exports.Player = Player;
});
define("classes/parser", ["require", "exports", "classes/data/monster", "classes/data/player"], function (require, exports, monster_1, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Parser = void 0;
    class Parser {
        static from_document(document) {
            const player = player_1.Player.from_document(document);
            const monsters = monster_1.Monster.from_document(document);
            return { player, monsters };
        }
    }
    exports.Parser = Parser;
});
define("classes/serializer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Serializer = void 0;
    class Serializer {
        static battle_state(bs) {
            return {
                player: this.player(bs.player),
                monsters: bs.monsters.map(m => this.monster(m))
            };
        }
        static player(p) {
            return {
                hp: this.player_vitals(p.hp),
                mp: this.player_vitals(p.mp),
                sp: this.player_vitals(p.sp),
                spirit: this.player_vitals(p.spirit),
                buffs: p.buffs.map(b => this.buff(b)),
                castables: p.castables.map(c => this.castable(c)),
                items: p.items.map(it => this.item(it))
            };
        }
        static monster(m) {
            return {
                name: m.name,
                hp: this.monster_vitals(m.hp),
                mp: this.monster_vitals(m.mp),
                sp: this.monster_vitals(m.sp),
                buffs: m.buffs.map(b => this.buff(b))
            };
        }
        static buff(b) {
            return {
                id: b.id,
                name: b.name,
                duration: b.duration
            };
        }
        static castable(c) {
            return {
                id: c.id,
                name: c.name,
                disabled: c.disabled
            };
        }
        static item(i) {
            return {
                id: i.id,
                name: i.name,
                disabled: i.disabled
            };
        }
        static player_vitals(v) {
            return {
                ratio: v.ratio,
                current: v.current,
                max: v.max
            };
        }
        static player_vital_group(vg) {
            return {
                hp: this.player_vitals(vg.hp),
                mp: this.player_vitals(vg.mp),
                sp: this.player_vitals(vg.sp),
                spirit: this.player_vitals(vg.spirit)
            };
        }
        static monster_vitals(v) {
            return {
                ratio: v.ratio,
            };
        }
        static monster_vital_group(vg) {
            return {
                name: vg.hp
            };
        }
    }
    exports.Serializer = Serializer;
});
define("utils/misc_utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.arraysAreEqual = exports.execute_when_exists = void 0;
    function execute_when_exists(selector, cb) {
        if (document.querySelector(selector)) {
            cb();
        }
        else {
            new MutationObserver((records, self) => {
                if (document.querySelector(selector)) {
                    self.disconnect();
                    cb();
                }
            }).observe(document.body, { childList: true, subtree: true });
        }
    }
    exports.execute_when_exists = execute_when_exists;
    function arraysAreEqual(l, r) {
        if (l.length !== r.length)
            return false;
        for (let i = 0; i < l.length; i++) {
            if (l[i] !== r[i])
                return false;
        }
        return true;
    }
    exports.arraysAreEqual = arraysAreEqual;
});
define("hvw_core", ["require", "exports", "rxjs", "classes/parser", "classes/serializer", "utils/misc_utils"], function (require, exports, rxjs_1, parser_1, serializer_1, misc_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stateMutation$ = exports.stateLoad$ = void 0;
    exports.stateLoad$ = new rxjs_1.ReplaySubject();
    exports.stateMutation$ = new rxjs_1.ReplaySubject();
    function watch_state(subject$) {
        // Emit when log is appended to (does not emit on round start / after refreshes)
        new MutationObserver((records, self) => __awaiter(this, void 0, void 0, function* () {
            const state = parser_1.Parser.from_document(document);
            const data = serializer_1.Serializer.battle_state(state);
            subject$.next(data);
        })).observe(document.querySelector('#textlog > tbody'), { childList: true });
    }
    function main() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, misc_utils_1.execute_when_exists)('#textlog', () => {
                const state = parser_1.Parser.from_document(document);
                const data = serializer_1.Serializer.battle_state(state);
                exports.stateLoad$.next(data);
                watch_state(exports.stateMutation$);
            });
        });
    }
    main();
});
