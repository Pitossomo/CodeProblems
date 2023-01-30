/*
Pitossomo
Jan 29, 2023 23:02
https://leetcode.com/problems/lfu-cache/submissions/887797200/
*/

class LFUCache {
  private capacity: number
  private usedCapacity: number
  private keyValueMap: Map<number, number>
  private keyCounterMap: Map<number, number>
  private counterKeyMap: Map<number, number[]>
  private smallestCounter: number

  constructor(capacity: number) {
    this.capacity = capacity
    this.usedCapacity = 0
    this.keyValueMap = new Map<number, number>()
    this.keyCounterMap = new Map<number, number>()
    this.counterKeyMap = new Map<number, number[]>().set(1,[])
    this.smallestCounter = 0
  }

  updateCounter(key: number): void {
    const counter = this.keyCounterMap.get(key)
    this.keyCounterMap.set(key, counter + 1)
    this.counterKeyMap.has(counter + 1) ? this.counterKeyMap.get(counter + 1).push(key) : this.counterKeyMap.set(counter + 1, [key])
    this.counterKeyMap.get(counter).splice(this.counterKeyMap.get(counter).indexOf(key),1)
    if (counter === this.smallestCounter && this.counterKeyMap.get(counter).length === 0) this.smallestCounter++
  } 

  get(key: number): number {
    if (this.capacity === 0) return -1
    
    if (this.keyValueMap.has(key)) {
      this.updateCounter(key)
      return this.keyValueMap.get(key)
    } else return -1
  }

  put(key: number, value: number): void {
    if (this.capacity === 0) return

    if (this.keyValueMap.has(key)) {
      this.updateCounter(key)
    } else {
      if (this.usedCapacity === this.capacity) {
        const leastUsedKey = this.counterKeyMap.get(this.smallestCounter).shift()
        this.keyCounterMap.delete(leastUsedKey)
        this.keyValueMap.delete(leastUsedKey)
      } else this.usedCapacity++

      this.keyCounterMap.set(key,1)
      this.counterKeyMap.get(1).push(key)
      this.smallestCounter = 1
    }
    this.keyValueMap.set(key,value)
  }
}

/**
 * Your LFUCache object will be instantiated and called as such:
 * var obj = new LFUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
