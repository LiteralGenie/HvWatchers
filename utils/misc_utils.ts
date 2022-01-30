

export function execute_when_exists(selector, cb) {
    if(document.querySelector(selector)) {
        cb()
    } else {
        new MutationObserver((records, self) => {
            if(document.querySelector(selector)) {
                self.disconnect()
                cb()
            }
        }).observe(document.body, { childList: true, subtree: true })
    }
}

export function arraysAreEqual<T>(l: Array<T>, r: Array<T>): boolean {
    if(l.length !== r.length) return false

    for(let i=0; i<l.length; i++) {
        if(l[i] !== r[i]) return false
    }

    return true
}

export function splitArray<T>(arr: Array<T>, condition: (item: T) => boolean): Array<Array<T>> {
    let result = []

    let buffer = []
    for(let i=0; i<=arr.length; i++) {
        if(i === arr.length && buffer.length > 0) {
            result.push(buffer)
            break
        }    
        
        const line = arr[i]
        if(condition(line)) {
            result.push(buffer)
            buffer = []
            continue
        }

        buffer.push(line)
    }

    return result
}