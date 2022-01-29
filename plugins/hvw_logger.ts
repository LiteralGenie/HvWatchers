import { filter, ReplaySubject } from "rxjs"
import { Logger } from "../classes/logger"
import { execute_when_exists } from "../utils/misc_utils"

export const logEntry$ = new ReplaySubject<string[]>().pipe(
    filter(lines => lines.length > 0)
) as ReplaySubject<string[]>


function watch_log(subject$) {
    const callback = (records => subject$.next(Logger.handle_records(records)))
    const config = { childList: true, subtree: true }
    new MutationObserver(callback).observe(document.querySelector('#textlog > tbody'), config)
}

function main() {
    execute_when_exists('#textlog', () => {
        const lines = Logger.handle_log_init(document)
        logEntry$.next(lines)
        watch_log(logEntry$)
    })
}

main()