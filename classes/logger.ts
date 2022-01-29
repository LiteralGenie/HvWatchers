import { arraysAreEqual } from "../utils/misc_utils"

export class Logger {
    static LOCAL_STORAGE_KEY = 'hvw_turn_log'

    static handle_records(records: Array<MutationRecord>) {
        const lines = records
            .filter(r => r.type === 'childList' && (r.target as HTMLElement).parentElement.id === 'textlog')
            .flatMap(l => Array.from(l.addedNodes))
            .map(l => l.textContent)
            .filter(l => l !== '')

        Logger.dump(lines)
        return lines
    }

    /**
     * Should only be used as a callback for document.onload
     * @param document 
     */
    static handle_log_init(document: Document) {
        const lines = Array
                        .from(document.querySelectorAll('#textlog tr'))
                        .map(l => l.textContent)
                        .filter(l => l !== '')
                        .reverse()
        
        if(Logger._is_duplicate(lines, Logger.read()) === false) {
            Logger.dump(lines, true)
            return lines
        }

        return []
    }

    static dump(lines: Array<string>, is_new_turn?: boolean) {
        if(lines.length === 0) return

        const old_log = Logger.read()
        let result = is_new_turn ? [lines] : [...old_log, lines]
        localStorage.setItem(Logger.LOCAL_STORAGE_KEY, JSON.stringify(result))
    }

    static read(): Array<Array<string>> {
        let val = localStorage.getItem(Logger.LOCAL_STORAGE_KEY) || '[]'
        return JSON.parse(val) as Array<Array<string>>
    }

    static _is_duplicate(lines: Array<string>, log: Array<Array<string>>) {
        // empty localstorage means new turn
        if(log.length === 0) {
            return false
        }

        // check if local storage value exactly matches lines (which means a duplicate)
        if(log.length === 1 && arraysAreEqual(log[0], lines)) {
            return true
        }

        // else if these set of lines matches more than one turn, we have a new log
        let line_ind = -1
        let turn_ind
        let turns_matched = 0

        for(turn_ind=0; turn_ind<log.length; turn_ind++) {
            const turn = log[turn_ind]

            for(let i=0; i<=turn.length; i++) {
                line_ind += 1
                if(line_ind >= lines.length) {
                    break
                } else if(lines[line_ind] !== turn[i]) {
                    return false
                } else if(i === turn.length-1) {
                    turns_matched += 1
                }
            }
        }

        if(turns_matched < 1) {
            console.error(`wtf ${turns_matched}`, lines)
            throw new EvalError()
        } else if(turns_matched === 1) {
            return false
        } else if(turns_matched > 1) {
            return true
        }
    }
}