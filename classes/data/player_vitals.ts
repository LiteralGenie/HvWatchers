export interface PlayerVitalGroup {
    hp: PlayerVitals
    mp: PlayerVitals
    sp: PlayerVitals
    spirit: PlayerVitals
}

export class PlayerVitals {
    static SELECTOR_PANE = '#pane_vitals'

    constructor(
        public readonly ratio: number,
        public readonly current: number,
        public readonly max: number
    ) {}
    
    static from_document(document: Document): PlayerVitalGroup {
        const pane = document.querySelector(this.SELECTOR_PANE) as HTMLElement
        return this.from_pane(pane)
    }
    
    static from_pane(pane: HTMLElement): PlayerVitalGroup {
        const id_map = {
            hp: ['#dvbh', '#dvrhb,#dvrhd'],
            mp: ['#dvbm', '#dvrm'],
            sp: ['#dvbs', '#dvrs'],
            spirit: ['#dvbc', '#dvrc'],
        } as { [id:string] : [string,string] }

        const vitals = {}
        Object.entries(id_map).forEach( ([k,v]) => {
            vitals[k] = _from_pair(...v)
        })

        return vitals as PlayerVitalGroup


        function _from_pair(bar_id: string, text_id: string) {
            const bar = document.querySelector(bar_id)
            const text = document.querySelector(text_id)

            const ratio = _get_ratio(bar as HTMLElement)
            const current = parseInt(text.textContent)
            const max = current / ratio

            return new PlayerVitals(ratio, current, max)

            function _get_ratio(div: HTMLElement) {
                const width_max = div.clientWidth
                const width_current = div.querySelector('img').clientWidth
                
                const ratio = width_current / width_max
                return ratio
            }
        }
    }
}