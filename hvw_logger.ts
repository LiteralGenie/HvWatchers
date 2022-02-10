import { filter, ReplaySubject } from "rxjs"
import { Logger } from "./classes/logger"
import { LogChecker } from "./classes/log_checker"
import { execute_when_exists } from "./utils/misc_utils"

/**
 * Warning:
 *   When checking the battle log at page load, HV will only show log text for the last turn.
 *   This means any actions taken from another browser or with the logger inactive will not be logged.
 */

// Emits on refresh OR when the battle log contains new entries
export const logEntryAll$ = new ReplaySubject<string[]>()

// Emits when the battle log contains new entries
export const logEntryUnique$ = logEntryAll$.pipe(
    filter(lines => {
        if(!Logger.is_duplicate(lines)) {
            Logger.dump(lines)
            return true
        } else {
            return false
        }
    })
)

// Emits at the start of a round
// Refreshes will cause this to re-emit
export const roundStart$ = logEntryAll$.pipe(
    filter(LogChecker.is_round_start)
)

// Emits at the end of a round 
export const roundEnd$ = logEntryAll$.pipe(
    filter(LogChecker.is_round_end)
)

// Emits at the start of a battle
// Refreshes will cause this to re-emit
export const battleStart$ = logEntryAll$.pipe(
    filter(LogChecker.is_battle_start)
)

// Emits at the end of a battle
export const battleEnd$ = logEntryAll$.pipe(
    filter(_ => null !== document.querySelector('#btcp img[src*=finishbattle]'))
)

function watch_log(subject$) {
    const callback = (records => subject$.next(Logger.from_records(records)))
    const config = { childList: true, subtree: true }
    new MutationObserver(callback).observe(document.querySelector('#textlog > tbody'), config)
}

function main() {
    execute_when_exists('#textlog', () => {
        const lineGroups = Logger.from_document(document)
        const first_turn = lineGroups[0]
        logEntryAll$.next(first_turn)

        // Clear localStorage log at start of new battle
        if(lineGroups.length === 1 && LogChecker.is_battle_start(first_turn)) {
            console.log('Clearing HVW turn log')
            Logger.clear()
        }

        watch_log(logEntryAll$)
    })
}

main()