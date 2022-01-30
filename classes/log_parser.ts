export class LogParser {
    static is_round_start(lines: string[]): boolean {
        const patt = /Initializing .* .../

        return lines.some(l => {
            return l.match(patt) !== null
        })
    }

    static is_round_end(lines: string[]): boolean {
        const patts = [
            /You are Victorious!/,
            /You have escaped from the battle./,
            /You have been defeated./,
            /You gain \d+ EXP!/
        ]

        return lines.some(l => {
            return patts.some(p => l.match(p))
        })
    }

    static is_battle_start(lines: string[]): boolean {
        const patts = [
            /Initializing random encounter .../,
            /Initializing .* \(Round 1 \/ .*\) .../
        ]

        return lines.some(l => {
            return patts.some(p => l.match(p) !== null)
        })
    }

    // static is_battle_end(lines: string[]): boolean {
    //     const patts = [
    //         /You have escaped from the battle./,
    //         /You have been defeated./
    //     ]

    //     return lines.some(l => {
    //         return patts.some(p => l.match(p) !== null)
    //     })
    // }
}