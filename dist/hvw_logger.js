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
define("classes/logger", ["require", "exports", "utils/misc_utils"], function (require, exports, misc_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    class Logger {
        static handle_records(records) {
            const lines = records
                .filter(r => r.type === 'childList' && r.target.parentElement.id === 'textlog')
                .flatMap(l => Array.from(l.addedNodes))
                .map(l => l.textContent)
                .filter(l => l !== '');
            Logger.dump(lines);
            return lines;
        }
        /**
         * Should only be used as a callback for document.onload
         * @param document
         */
        static handle_log_init(document) {
            const lines = Array
                .from(document.querySelectorAll('#textlog tr'))
                .map(l => l.textContent)
                .filter(l => l !== '')
                .reverse();
            if (Logger._is_duplicate(lines, Logger.read()) === false) {
                Logger.dump(lines, true);
                return lines;
            }
            return [];
        }
        static dump(lines, is_new_turn) {
            if (lines.length === 0)
                return;
            const old_log = Logger.read();
            let result = is_new_turn ? [lines] : [...old_log, lines];
            localStorage.setItem(Logger.LOCAL_STORAGE_KEY, JSON.stringify(result));
        }
        static read() {
            let val = localStorage.getItem(Logger.LOCAL_STORAGE_KEY) || '[]';
            return JSON.parse(val);
        }
        static _is_duplicate(lines, log) {
            // empty localstorage means new turn
            if (log.length === 0) {
                return false;
            }
            // check if local storage value exactly matches lines (which means a duplicate)
            if (log.length === 1 && (0, misc_utils_1.arraysAreEqual)(log[0], lines)) {
                return true;
            }
            // else if these set of lines matches more than one turn, we have a new log
            let line_ind = -1;
            let turn_ind;
            let turns_matched = 0;
            for (turn_ind = 0; turn_ind < log.length; turn_ind++) {
                const turn = log[turn_ind];
                for (let i = 0; i <= turn.length; i++) {
                    line_ind += 1;
                    if (line_ind >= lines.length) {
                        break;
                    }
                    else if (lines[line_ind] !== turn[i]) {
                        return false;
                    }
                    else if (i === turn.length - 1) {
                        turns_matched += 1;
                    }
                }
            }
            if (turns_matched < 1) {
                console.error(`wtf ${turns_matched}`, lines);
                throw new EvalError();
            }
            else if (turns_matched === 1) {
                return false;
            }
            else if (turns_matched > 1) {
                return true;
            }
        }
    }
    exports.Logger = Logger;
    Logger.LOCAL_STORAGE_KEY = 'raw_turn_log';
});
define("plugins/hvw_logger", ["require", "exports", "rxjs", "classes/logger", "utils/misc_utils"], function (require, exports, rxjs_1, logger_1, misc_utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.logEntry$ = void 0;
    exports.logEntry$ = new rxjs_1.ReplaySubject().pipe((0, rxjs_1.filter)(lines => lines.length > 0));
    function watch_log(subject$) {
        const callback = (records => subject$.next(logger_1.Logger.handle_records(records)));
        const config = { childList: true, subtree: true };
        new MutationObserver(callback).observe(document.body, config);
    }
    function main() {
        (0, misc_utils_2.execute_when_exists)('#textlog', () => {
            const lines = logger_1.Logger.handle_log_init(document);
            exports.logEntry$.next(lines);
            watch_log(exports.logEntry$);
        });
    }
    main();
});
/**
 * Initializing Grindfest (Round 747 / 1000) ...
 * Spawned Monster A: MID=190505 (Duanduan670010) LV=500 HP=251060
 * Spawned Monster B: MID=207231 (Ganjinzero) LV=500 HP=161382
 * ...
 *
 * You cast Imperil.
 * Duanduan670010 gains the effect Imperiled.
 * Ganjinzero gains the effect Imperiled.
 * ...
 *
 * You cast Ragnarok.
 * Ragnarok blasts Duanduan670010 for 165210 dark damage (50% resisted)
 * Duanduan670010 gains the effect Blunted Attack.
 * ...
 */ 
