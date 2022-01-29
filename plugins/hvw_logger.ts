import { filter, ReplaySubject } from "rxjs"
import { Logger } from "../classes/logger"
import { execute_when_exists } from "../utils/misc_utils"

export const logEntry$ = new ReplaySubject<string[]>().pipe(
    filter(lines => lines.length > 0)
) as ReplaySubject<string[]>


function watch_log(subject$) {
    const callback = (records => subject$.next(Logger.handle_records(records)))
    const config = { childList: true, subtree: true }
    new MutationObserver(callback).observe(document.body, config)
}

function main() {
    execute_when_exists('#textlog', () => {
        const lines = Logger.handle_log_init(document)
        logEntry$.next(lines)
        watch_log(logEntry$)
    })
}

main()

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