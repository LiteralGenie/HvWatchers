export interface MonsterVitalGroup {
    hp: MonsterVitals
    mp: MonsterVitals
    sp: MonsterVitals
}

export class MonsterVitals {
    constructor(
        public readonly ratio: number
    ) {}
    
    static from_div(div: HTMLElement): MonsterVitalGroup {
        const name = div.querySelector('.btm3').textContent

        if (!div.hasAttribute('onclick')) {
            return {
                hp: new MonsterVitals(0),
                mp: new MonsterVitals(0),
                sp: new MonsterVitals(0)
            }
        }

        let bars = div.querySelectorAll('.btm4 > .btm5')
        
        let hp_ratio = _get_ratio(bars[0] as HTMLElement)
        hp_ratio = Math.max(hp_ratio, 0.01)
        
        let mp_ratio = _get_ratio(bars[1] as HTMLElement)

        let sp_ratio;
        if(bars[2] !== undefined) sp_ratio = _get_ratio(bars[2] as HTMLElement)
        else sp_ratio = 0

        return {
            hp: new MonsterVitals(hp_ratio),
            mp: new MonsterVitals(mp_ratio),
            sp: new MonsterVitals(sp_ratio)
        }


        function _get_ratio(div: HTMLElement) {
            const width_max = div.clientWidth
            const width_current = div.querySelector('img').clientWidth
            
            const ratio = width_current / width_max
            return ratio
        }
    }
}