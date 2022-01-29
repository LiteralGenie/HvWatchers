# Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Examples](#examples)
- [Building](#Building)
- [@todo](#-todo)

# Description

Extracts in-battle info like the battle log, active buffs, player health, etc.

See these files for more info on what's available in each module:
  - `hvw_core`: [[1]](https://github.com/LiteralGenie/HvWatchers/blob/master/hvw_core.ts)
    [[2]](https://github.com/LiteralGenie/HvWatchers/blob/master/classes/serializer.ts#L96) 
  - `hvw_logger`: [[1]](https://github.com/LiteralGenie/HvWatchers/blob/master/plugins/hvw_logger.ts)
# Installation

To use this in a userscript...
1. Specify `@require`s for the following dependencies
    - an AMD loader like [alameda](https://github.com/requirejs/alameda) 
       - `// @require      https://cdn.jsdelivr.net/npm/alameda@1.4.0/alameda.js`
    - [rxjs](https://rxjs.dev/guide/overview)
       - `// @require      https://cdnjs.cloudflare.com/ajax/libs/rxjs/8.0.0-alpha.0/rxjs.umd.min.js`
1. Download the .js files from the [release section](https://github.com/LiteralGenie/HvWatchers/releases) and specify them as dependencies: `// @require file:///path/to/hvw_core.js`.
    - Your userscript extension will need access to local files.
        - [Chrome / Tampermonkey](https://www.tampermonkey.net/faq.php#Q204) 
        - [Firefox / Greasemonkey](https://stackoverflow.com/a/13888886)
1. (maybe optional) Set `ajaxRound: false` in MB.

# Building
Run the typescript compiler:
   - `tsc --watch --project tsconfig.core.json`
        - vscode has a [shortcut](https://code.visualstudio.com/docs/typescript/typescript-compiling#_step-2-run-the-typescript-build) for this


# Examples

```js
// ==UserScript==
// @name         HvWatcher demo
// @author       프레이
// @match        *://*.hentaiverse.org/*
// @grant        none

// @require      file://F:\programming\js\HvWatchers\dist\hvw_core.js
// @require      file://F:\programming\js\HvWatchers\dist\hvw_logger.js

// @require      https://cdn.jsdelivr.net/npm/alameda@1.4.0/alameda.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/rxjs/8.0.0-alpha.0/rxjs.umd.min.js
// ==/UserScript==


/** 
 * Auto-click the round-completed popup (except on the final round) 
 */
const [hvw_core] = await require(['hvw_core'])
const {stateLoad$, stateMutation$} = hvw_core

stateMutation$.subscribe(_ => {
    const tgt = document.querySelector('#btcp')
    if(tgt && !tgt.querySelector('img[src*=finishbattle]')) {
        tgt.click()
        return
    }
})


/** 
 * Listen for changes to the battle log. We need both Observables because...
 *   -> stateLoad$ is only fired on page load (basically round start)
 *   -> stateMutation$ is only fired when the battle log is appended to (so doesn't include round start)
 */
const [rxjs] = await require(['rxjs']) // import cool lib that handles data streams
rxjs.merge(stateLoad$, stateMutation$)
    .subscribe(data => {
        const {player, monsters} = data

        const hp = player.hp
        console.log(`HP: ${hp.current} / ${hp.max} | ${hp.ratio}`) // HP: 20866 / 25633.602373887243 | 0.8140096618357487

        const [b1, b2, ...buffs] = player.buffs
        console.log(`Buff: ${b1.name} - ${b1.duration}`) // Buff: Spirit Shield - NaN
        console.log(`Buff: ${b2.name} - ${b2.duration}`) // Buff: Hastened - 11

        const c1 = player.castables[10]
        console.log(`Castable: ${c1.name} - ${c1.disabled ? 'Cooldown' : 'Available'}`) // Castable: Shockblast | Available

        const mob = monsters[0]
        const mobHp = (mob.hp.ratio*100).toFixed(0)
        console.log(`Enemy "${mob.name}": ${mobHp}% hp | ${mob.buffs[0].name} (${mob.buffs[0].duration})`) // Enemy "Shadowcat027": 100% hp | Imperiled (40)
    })


/**
 * Dump battle log text
 */
const [hvw_logger] = await require(['plugins/hvw_logger'])
const {logEntry$} = hvw_logger
logEntry$.subscribe(lines => console.log(lines.join('\n')))
/**
 * Initializing Grindfest (Round 747 / 1000) ...
 * Spawned Monster A: MID=190505 (Duanduan670010) LV=500 HP=251060
 * Spawned Monster B: MID=207231 (Ganjinzero) LV=500 HP=161382
 * [...]
 *
 * You cast Imperil.
 * Duanduan670010 gains the effect Imperiled.
 * Ganjinzero gains the effect Imperiled.
 * [...]
 *
 * You cast Ragnarok.
 * Ragnarok blasts Duanduan670010 for 165210 dark damage (50% resisted)
 * Duanduan670010 gains the effect Blunted Attack.
 * [...]
 */
```

# @todo
  - expose more observables for `hvw_logger`
    - round start, round end, battle start, battle end
      - by parsing log text
  - how-to for making MB play nice
  - bundle dependencies
  - docs? at least the exports / data classes?
