export class StringMap<K,V> {
	protected _data: { [key: string]: [K,V] } = {}
	protected _size: number = 0
	protected _keys?: K[]
	protected _values?: V[]
	protected _entries?: [K,V][]

	constructor( arraylike?: [K,V][] ) {  
		if ( arraylike !== undefined ) {
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
		if ( this.size > 0 ) {
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

	forEach( callback: (v: V, k?: K, map?: StringMap<K,V>) => void, thisArg?: any ): void {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			callback.call( thisArg, value, key, this )
		}
	}

	get size(): number {
		return this._size
	}

	reduce<T>( callback: (acc: T, v: V, k: K, map: StringMap<K,V>) => T, initialValue: T ): T {
		const data = this._data
		let acc = initialValue
		for ( const sk in data ) {
			const [key,value] = data[sk]
			acc = callback.call( null, acc, value, key, this )
		}
		return acc
	}

	map<T>( callback: (v: V, k?: K, map?: StringMap<K,V>) => T, thisArg?: any ): StringMap<K,T> {
		const data = this._data
		const result = new StringMap<K,T>()
		const resultData = result._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			resultData[sk] = [key,callback.call( thisArg, value, key, this )]
		}
		result._size = this._size
		return result
	}

	filter( callback: (v: V, k?: K, map?: StringMap<K,V>) => boolean, thisArg?: any ): StringMap<K,V> {
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

	every( callback: (v: V, k?: K, map?: StringMap<K,V>) => boolean, thisArg?: any ): boolean {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( !callback.call( thisArg, value, key, this )) {
				return false
			}
		}
		return true
	}
	
	some( callback: (v: V, k?: K, map?: StringMap<K,V>) => boolean, thisArg?: any ): boolean {
		const data = this._data
		for ( const sk in data ) {
			const [key,value] = data[sk]
			if ( callback.call( thisArg, value, key, this )) {
				return true
			}
		}
		return false
	}

	findKey( v: V ): K|undefined {
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
