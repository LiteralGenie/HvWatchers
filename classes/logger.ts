import { arraysAreEqual, splitArray } from "../utils/misc_utils"

export class Logger {
    static LOCAL_STORAGE_KEY = 'hvw_turn_log'

    /**
     * Extract log text from a list of mutation records
     * @param records usually represents a single turn
     */
    static from_records(records: Array<MutationRecord>): string[] {
        const lines = records
            .filter(r => r.type === 'childList' && (r.target as HTMLElement).parentElement.id === 'textlog')
            .flatMap(l => Array.from(l.addedNodes))
            .map(l => l.textContent)
            .filter(l => l !== '')

        return lines
    }

    /**
     * Extract log text from document body and groups into turns
     * @param document 
     */
    static from_document(document: Document): Array<Array<string>> {
        const rows =  Array.from(document.querySelectorAll('#textlog tr'))
        let lines = rows.map(r => r.textContent)
        let lineGroups = splitArray(lines, l => l === '')
                            .map(lines => lines.reverse())
                            .reverse()
        
        return lineGroups
    }

    static dump(lines: Array<string>, clear?: boolean) {
        if(lines.length === 0) return

        const old_log = Logger.read()
        let result = clear ? [lines] : [...old_log, lines]
        localStorage.setItem(Logger.LOCAL_STORAGE_KEY, JSON.stringify(result))
    }

    static read(): Array<Array<string>> {
        let val = localStorage.getItem(Logger.LOCAL_STORAGE_KEY) || '[]'
        return JSON.parse(val) as Array<Array<string>>
    }

    static clear(): void {
        localStorage.removeItem(Logger.LOCAL_STORAGE_KEY)
    }

    /**
     * Check if this set of lines is already logged
     * @param lines represents a single turn
     * @param log 
     */
    static is_duplicate(lines: Array<string>, log?: Array<Array<string>>): boolean {
        log = log || Logger.read()

        // empty localstorage means new turn
        if(log.length === 0) {
            return false
        }

        // check if the latest turn matches lines exactly
        const latest = log.slice(-1)[0]
        return arraysAreEqual(lines, latest)
    }
}