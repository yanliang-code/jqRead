// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	// $('#div1').css({'background':'yellow', 'width':'300px'});
	// elems jquery对象   $('#div1')
	// fn 回调函数
	// key 属性       background
	// value 属性值    yellow
	// chainable  false获取 或 true设置
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		// 传入json对象（一定是设置）
		if ( jQuery.type( key ) === "object" ) {
			// json对象默认是设置
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		// 设置一个值
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				// value为字符串形式
				raw = true;
			}
			// 没有key值
			if ( bulk ) {
				// Bulk operations run against the entire set
				// 字符串
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				// 函数
				} else {
					bulk = fn;
					// 在下面执行时才能触发
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
			// 有没有key都会走
			if ( fn ) {
				for ( ; i < length; i++ ) {
					// 					raw真为字符串，否则函数
					// value.call( elems[i], i, fn( elems[i], key ) ) -> fn( elems[i], key ) -> value.call()
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}
		// 
		return chainable ?
		// chainable真：设置，返回元素
			elems :

			// Gets 获取
			bulk ?
			// 无key值
				fn.call( elems ) :
				// 有无元素--> 有：默认返回第一个元素 无：反无
				length ? fn( elems[0], key ) : emptyGet;
	},