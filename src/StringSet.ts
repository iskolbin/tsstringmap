export class StringSet<T> {
	protected _data: { [key: string]: T } = {}
	protected _size: number = 0
	protected _values?: T[]
	protected _entries?: [T,T][]

	constructor( arraylike?: T[] ) {
		if ( arraylike !== undefined ) {
			const data = this._data
			let size = 0
			for ( const value of arraylike ) {
				const sk = value.toString()
				if ( data.hasOwnProperty( sk )) {
					size--
				}
				data[sk] = value
				size++
			}
			this._size = size
		}
	}

	protected clearCache() {
		this._values = undefined
		this._entries = undefined
	}
	
	add( value: T ): StringSet<T> {
		const data = this._data
		const sk = value.toString()
		if ( !data.hasOwnProperty( sk )) {
			this._size++
		}
		data[sk] = value
		this.clearCache()
		return this
	}

	clear(): void {
		if ( this.size > 0 ) {
			this._data = {}
			this._size = 0
			this.clearCache()
		}
	}

	delete( value: T ): boolean {
		const sk = value.toString()
		const data = this._data
		if ( data.hasOwnProperty( sk )) {
			delete data[sk]
			this.clearCache()
			this._size--
			return true
		} else {
			return false
		}
	}

	has( value: T ): boolean {
		return this._data.hasOwnProperty( value.toString() )
	}

	values(): T[] {
		if ( this._values === undefined ) {
			const values = []
			const data = this._data
			for ( const sk in data ) {
				values.push( data[sk] )
			}
			this._values = values
		}
		return this._values
	}

	entries(): [T,T][] {
		if ( this._entries === undefined ) {
			const entries: [T,T][] = []
			const data = this._data
			for ( const sk in data ) {
				const value = data[sk]
				entries.push( [value, value] )
			}
			this._entries = entries
		}
		return this._entries
	}

	forEach( callback: (v: T, k?: T, set?: StringSet<T>) => void, thisArg?: any ): void {
		const data = this._data
		for ( const sk in data ) {
			const value = data[sk]
			callback.call( thisArg, value, value, this )
		}
	}

	get size(): number {
		return this._size
	}

	reduce<T>( callback: (accumulator: T, v: T, k?: T, set?: StringSet<T>) => T, initialStringalue: T ): T {
		const data = this._data
		let acc = initialStringalue
		for ( const sk in data ) {
			const value = data[sk]
			acc = callback.call( null, acc, value, value, this )
		}
		return acc
	}

	map<T>( callback: (v: T, key?: T, set?: StringSet<T>) => T, thisArg?: any ): StringSet<T> {
		const data = this._data
		const result = new StringSet<T>()
		const resultData = result._data
		for ( const sk in data ) {
			const value = data[sk]
			resultData[sk] = callback.call( thisArg, value, value, this )
		}
		result._size = this._size
		return result
	}

	filter( callback: (v: String, k?: T, set?: StringSet<T>) => boolean, thisArg?: any ): StringSet<T> {
		const data = this._data
		const result = new StringSet<T>()
		const resultData = result._data
		let size = 0 
		for ( const sk in data ) {
			const value = data[sk]
			if ( callback.call( thisArg, value, value, this )) {
				resultData[sk] = value
				size++
			}
		}
		this._size = size
		return result
	}

	every( callback: (v: T, key?: T, set?: StringSet<T>) => boolean, thisArg?: any ): boolean {
		const data = this._data
		for ( const sk in data ) {
			const value = data[sk]
			if ( !callback.call( thisArg, value, value, this )) {
				return false
			}
		}
		return true
	}
	
	some( callback: (v: T, key?: T, set?: StringSet<T>) => boolean, thisArg?: any ): boolean {
		const data = this._data
		for ( const sk in data ) {
			const value = data[sk]
			if ( callback.call( thisArg, value, value, this )) {
				return true
			}
		}
		return false
	}

	concat( ...sets: StringSet<T>[] ): StringSet<T> {
		const data = this._data
		const result = new StringSet<T>()
		const resultData = result._data
		for ( const sk in data ) {
			resultData[sk] = data[sk]
		}
		let size = this._size
		for ( const s of sets ) {
			const setData = s._data
			for ( const sk in setData ) {
				if ( !resultData.hasOwnProperty( sk )) {
					resultData[sk] = setData[sk]
					size++
				}
			}
		}
		result._size = size
		return result
	}

	intersection( ...sets: StringSet<T>[] ): StringSet<T> {
		const result = new StringSet<T>()
		const resultData = result._data
		const data = this._data
		let size = 0
		for ( const sk in data ) {
			let contains = true
			for ( const s of sets ) {
				const setData = s._data
				if ( !setData.hasOwnProperty( sk )) {
					contains = false
					break
				}
			}
			if ( contains ) {
				resultData[sk] = data[sk]
				size++
			}
		}
		result._size = size
		return result
	}

	union( ...sets: StringSet<T>[] ): StringSet<T> {
		const result = new StringSet<T>()
		const resultData = result._data
		const data = this._data
		let size = this._size
		for ( const sk in data ) {
			resultData[sk] = data[sk]
		}
		for ( const s of sets ) {
			const setData = s._data
			for ( const sk in setData ) {
				if ( resultData.hasOwnProperty( sk )) {
					size--
				}
				resultData[sk] = setData[sk]
				size++
			}
		}
		result._size = size
		return result
	}

	complement( ...sets: StringSet<T>[] ): StringSet<T> {
		const result = new StringSet<T>()
		const resultData = result._data
		const data = this._data
		let size = 0
		for ( const sk in data ) {
			let contains = false
			for ( const s of sets ) {
				const setData = s._data
				if ( setData.hasOwnProperty( sk )) {
					contains = true
					break
				}
			}
			if ( !contains ) {
				const value = data[sk]
				resultData[sk] = value
				size++
			}
		}
		result._size = size
		return result
	}
}
