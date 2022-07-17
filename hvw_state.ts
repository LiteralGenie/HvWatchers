import { ReplaySubject } from "rxjs";
import { Parser } from "./classes/parser";
import { BattleStateDto, Serializer } from "./classes/serializer";
import { execute_when_exists } from "./utils/misc_utils";

export const stateLoad$ = new ReplaySubject<BattleStateDto>();
export const stateMutation$ = new ReplaySubject<BattleStateDto>();

function watch_state(subject$) {
    // Emit when log is appended to (does not emit on round start / after refreshes)
    new MutationObserver(async (records, self) => {
        const state = Parser.from_document(document);
        const data = Serializer.battle_state(state);
        subject$.next(data);
    }).observe(document.querySelector("#textlog > tbody"), { childList: true });
}

async function main() {
    execute_when_exists("#textlog", () => {
        const state = Parser.from_document(document);
        const data = Serializer.battle_state(state);
        stateLoad$.next(data);

        watch_state(stateMutation$);
    });
}

main();
