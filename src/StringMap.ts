export class StringMap<K,V> {
	protected _data: { [key: string]: [K,V] } = {}
	protected _size: number = 0
	protected _keys?: K[]
	protected _values?: V[]
	protected _entries?: [K,V][]

	static ofObject<V>( ...objects: { [key: string]: V }[] ): StringMap<string,V> {
		const result = new StringMap<string,V>()
		for ( const o of objects ) {
			for ( const k in o ) {
				if ( o.hasOwnProperty( k )) {
					result.set( k, o[k] )
				}
			}
		}
		return result
	}

	toObject(): { [key: string]: V } {
		const result: { [key: string]: V } = {}
		for ( const k in this._data ) {
			result[k] = this._data[k][1]
		}
		return result
	}

	constructor( arraylike?: [K,V][] ) {  
		if ( typeof arraylike !== 'undefined' ) {
			const data = this._data
			let size = 0
			for ( const [key,value] of arraylike ) {
				const sk = key.toString()
				if ( data.hasOwnProperty( sk )) {
					size--
				}
				data[sk] = [key,value]
				size++
			}
			this._size = size
		}
	}

	protected clearCache() {
		this._keys = undefined
		this._values = undefined
		this._entries = undefined
	}

	set( key: K, value: V ): StringMap<K,V> {
		const data = this._data
		const sk = key.toString()
		if ( !data.hasOwnProperty( sk )) {
			this._size++
		}
		data[sk] = [key,value]
		this.clearCache()
		return this
	}

	get( key: K ): undefined|V {
		const sk = key.toString()
		const kvPair: [K,V] = this._data[sk]
		return kvPair !== undefined ? kvPair[1] : undefined
	}

	clear(): void {
		if ( this._size > 0 ) {
			this._data = {}
			this._size = 0
			this.clearCache()
		}
	}

	delete( key: K ): boolean {
		const sk = key.toString()
		if ( this._data.hasOwnProperty( sk )) {
			delete this._data[sk]
			this.clearCache()
			this._size--
			return true
		} else {
			return false
		}
	}

	has( key: K ): boolean {
		return this._data.hasOwnProperty( key.toString() )
	}

	keys(): K[] {
		if ( this._keys === undefined ) {
			const keys = []
			const data = this._data
			for ( const sk in data ) {
				const [key,] = data[sk]
				keys.push( key )
			}
			this._keys = keys
		}
		return this._keys
	}

	values(): V[] {
		if ( this._values === undefined ) {
			const values = []
			const data = this._data
			for ( const sk in data ) {
				const [,value] = data[sk]
				values.push( value )
			}
			this._values = values
		}
		return this._values
	}

	entries(): [K,V][] {
		if ( this._entries === undefined ) {
			const entries: [K,V][] = []
			const data = this._data
			for ( const sk in data ) {
				const [key,value] = data[sk]
				entries.push( [key,value] )
			}
			this._entries = entries
		}
		return this._entries
	}

	forEach<Z>( callback: (this: Z, v: V, k: K, map: StringMap<K,V>) => void, thisArg?: Z ): void {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			callback.call( thisArg, value, key, this )
		}
	}

	get size(): number {
		return this._size
	}

	reduce<U,Z>( callback: (this: Z, currentValue: U, v: V, k: K, map: StringMap<K,V>) => U, initialValue: U, thisArg?: Z ): U {
		const data = this._data
		let currentValue = initialValue
		for ( const sk in data ) {
			const [key,value] = data[sk]
			currentValue = callback.call( thisArg, currentValue, value, key, this )
		}
		return currentValue
	}

	map<U,Z>( callback: (this:Z, v: V, k: K, map: StringMap<K,V>) => U, thisArg?: Z ): StringMap<K,U> {
		const data = this._data
		const result = new StringMap<K,U>()
		const resultData = result._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			resultData[sk] = [key,callback.call( thisArg, value, key, this )]
		}
		result._size = this._size
		return result
	}

	filter<Z>( callback: (this: Z, v: V, k: K, map: StringMap<K,V>) => boolean, thisArg?: Z ): StringMap<K,V> {
		const data = this._data
		const result = new StringMap<K,V>()
		let size = 0 
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( callback.call( thisArg, value, key, this )) {
				result._data[sk] = data[sk]
				size++
			}
		}
		this._size = size
		return result
	}

	every<Z>( callback: (this: Z, v: V, k: K, map: StringMap<K,V>) => boolean, thisArg?: Z ): boolean {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( !callback.call( thisArg, value, key, this )) {
				return false
			}
		}
		return true
	}
	
	some<Z>( callback: (this: Z, v: V, k: K, map: StringMap<K,V>) => boolean, thisArg?: Z ): boolean {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( callback.call( thisArg, value, key, this )) {
				return true
			}
		}
		return false
	}

	count<Z>( callback: (this: Z, v: V, k: K, map: StringMap<K,V>) => boolean, thisArg?: Z ): number {
		const data = this._data
		let counter = 0
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( callback.call( thisArg, value, key, this )) {
				counter++
			}
		}
		return counter
	}

	findKey( v: V ): K | undefined {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( v === value ) {
				return key
			}
		}
	}

	concat( ...maps: StringMap<K,V>[] ): StringMap<K,V> {
		const data = this._data
		const result = new StringMap<K,V>()
		const resultData = result._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			resultData[sk] = [key,value]
		}
		let size = this._size
		for ( const map of maps ) {
			const mapData = map._data
			for ( const sk in mapData ) {
				if ( resultData.hasOwnProperty( sk )) {
					size--
				}
				resultData[sk] = mapData[sk]
				size++
			}
		}
		result._size = size
		return result
	}
}
