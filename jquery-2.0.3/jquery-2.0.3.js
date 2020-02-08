/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z   此版本不考虑IE6,7,8
 */
// 立即执行函数--（函数内的变量都是局部，无法被外部污染）
// 传入window：
// 1.不用向上寻找window变量（不穿局部变量也可寻找到），提高性能
// 2.压缩版可以被单个字母替代
// 传入undefined：
// 由于部分浏览器undefined可以被重复赋值
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	// jQuery(document)根节点
	// 变量名见识义，压缩可替换
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	// 兼容老版本
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	// 网址信息
	location = window.location,
	// 文档对象
	document = window.document,
	// HTML标签
	docElem = document.documentElement,

	// 下面两行是防止引入Jquery前，jQuery与$这两个变量赋了其他值
	// 若没有赋值则是undefined，否则有相应值
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,
	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	// 判断对象类型的 $.type()
	// class2type = { '[Object String]':'string','[Object Array]':'array' ....}
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	// 空数组
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	// 局部变量存储相应方法
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	// 去空格方法
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	// 一、定义一些变量和函数
	// 代码最后会将名为jQuery的函数挂载到window上：window.jQuery = window.$ = jQuery;
	// 可以通过jQuery()或$()调用此函数，最终会返回一个对象
	// 见demo1
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	// 数字
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	// 空格
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// HTML标签 <p>aaa  或者  #id
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	// 成对的标签<p></p>
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	// margin-left : marginLeft
	// -webkit-margin-left : webkitMarginLeft
	// -ms-margin-left : msMarginLeft(ms为IE标识，但是IE只认MsMarginLeft,需要特殊匹配并处理)
	rmsPrefix = /^-ms-/,
	// 转 margin-left -> marginLeft
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	// margin-top  正则匹配的是-t
	// all：-t  letter：t
	fcamelCase = function( all, letter ) {
		// 转成大写T，替换-t
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	// dom加载完，会调用
	completed = function() {
		// 取消
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};
// 二、给jQuery对象添加一些方法和属性
// fn就是代表prototype
// 见demo2
jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	// 版本
	jquery: core_version,
	// 修正指向：new出的对象中的一个属性，指向所属的构造函数
	constructor: jQuery,
	// 初始化和参数管理 见demo3
	// $('li', 'ul')  li->selector指定dom的特征  ul->context指定dom存在的上下文（父元素及以上）
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		// 不存在的直接返回init对象
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		// $('#div1') $('.box') $('div1') $('#div1 div.box') $('<li>hello')
		// $('<li>') $('<li>2</li>') 创建标签
		// $内传字符串
		if ( typeof selector === "string" ) {
			// $('<li>') $('<li>2</li>') 创建标签
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				// match = ['<li>hello','<li>',null]  $('<li>hello') 
				// match = ['#div1',null,'div1']  $('#div1')
				// match = null  $('.box') $('div1') $('#div1 div.box')
				match = rquickExpr.exec( selector ); //返回匹配上的内容，以数组形式返回
			}

			// Match html or make sure no context is specified for #id
			// match有值的情况：创建标签、id选择器
			// match[1]有值 创建标签
			// match[1]无值 并且 !context id选择器
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					// $(document)与document两种情况
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					// jQuery.parseHTML(1, 2, 3) 传入字符串格式HTML标签，返回值是dom数组
					// 1.字符串格式的HTML标签  2.所属的根节点document  3.是否允许script生成dom
					// jQuery.merge(1, 2) 合并数组（jquery内部使用此方法将数组合并到类数组中）
					// 1,2.数组、类数组
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					// $('<li>', {title:'hi', html:'abcd'}).appendTo( 'ul' ); 下面是处理这种加Json属性的
					// rsingleTag只匹配单标签
					// isPlainObject必须是Json对象
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						// 循环{title:'hi', html:'abcd'}
						for ( match in context ) {
							// Properties of context are called as methods if possible
							// 判断json中key是否为this指向上的函数（jQuery.prototype）
							if ( jQuery.isFunction( this[ match ] ) ) {
								// 通过this调用相应方法，并将json中key对应的value传入函数
								// this.html('abcd');
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								// dom元素上加属性
								// this.attr('title', 'hi');
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					// elem.parentNode 兼容Blackberry 4.6
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			// 没有传context --> !context --> rootjQuery：$(document).find('ul li.box')  -->  sizzle
			// 传context --> // $('ul', $(document)).find('li') -->  context.jquery -->  $(document).find('li')
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			// $('ul', document).find('li') --> this.constructor( context ) --> Jquery(document)  与上面return是一致的
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		// $(this)  $(document)  $内传dom对象
		// 节点一定会有nodeType
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		// $内传函数
		// $(function(){})   <==>  $(doucment).ready(function(){}) 怎么调用都是一样的
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		// $('#div1')  <==  $( $('#div1') )
		// 兼容$内传入Jquery对象，Jquery对象内会有selector字段
		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}
		// $([])  $({})  $内传数组或Json
		// makeArray：类数组转成真正数组
		// 一个入参：转数组
		// 两个入参：转Json Jquery内部使用：将selector内容挂载到this上，类数组形式呈现
		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		// slice截取一部分数组（给定 起 始 位置）
		// 通过call改变slice函数内的this指向，不穿任何参数，表示截取全部
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	// 内部调用toArray方法，判断传入位置返回指定位置的DOM对象
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			// 不传位置   将Jquery对象转成DOM数组
			this.toArray() :

			// Return just the object
			// 传入位置  负数：数组长度+负数，倒着来   正数：指定位置
			// 这里的this是对象，num变量值是this对象的属性（可不是数组的下标哟）
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	// Jquery对象入栈处理（先入后出）（之前说的队列是先进先出） 见demo4
	// $('div').pushStack( $('span') ).css('background','red') 
	// 栈内先入div的Jquery对象，后入span的Jquery对象，最后的css最作用到最后入的对象上
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		// this.constructor()：空的Juqery对象   elems：$('span') 数组或对象
		// 合并两个值
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this; // this => $('div')
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	// 遍历集合
	each: function( callback, args ) {
		// 调用工具方法
		return jQuery.each( this, callback, args );
	},
	// 等待dom加载完进行回调
	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},
	// Jquery对象截取（起位置  始位置）
	slice: function() {
		// arguments将调用slice时传入的参数传入
		// 将截取好的DOM数组放入栈中并返回
		return this.pushStack( core_slice.apply( this, arguments ) );
	},
	// Jquery对象（集合）内第一项
	first: function() {
		return this.eq( 0 );
	},
	// Jquery对象（集合）内最后一项
	last: function() {
		return this.eq( -1 );
	},
	// Jquery对象（集合）内指定项
	eq: function( i ) {
		// 处理传入的i为负数和正数的情况（需不需要加整体长度）
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		// 符合要求取对象中的指定属性并转成数组，放入栈中
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},
	// 与ES6中数组的map方法一样  见demo4
	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	// 取当前Jquery对象的来源对象（找到栈的下一层）
	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	// 将数组上的方法挂载到Jquery对象上，是Jquery内部使用，外部不建议使用
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
// $()返回的对象是init类的实例，但是能访问到toArray那些静态方法，是由于下面这步，改变init类的原型指向
jQuery.fn.init.prototype = jQuery.fn;

// jQuery.extend：将一个方法扩展到jQuery函数下，扩展静态方法
// jQuery.fn.extend：将一个方法扩展到jQuery原型下，扩展实例方法
// 见demo5
// 情况1：$.extend({})
// 情况2：$.extend({}, {age:18}, {name:'peter'});
// 情况3：$.extend(true, {}, {name:{age:30}});
jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
	// 目标参数
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		// 默认浅拷贝
		deep = false;

	// Handle a deep copy situation
	// 情况3：指定拷贝方式
	if ( typeof target === "boolean" ) {
		deep = target;
		// 替换目标参数
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	// 检验参数是否正确
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	// 是否为插件方式，扩展到jQuery 或 jQuery.fn上
	// 如果目标参数的位置与参数个数一致（没有指定参数给目标参数赋值）
	// 将目标参数改为jQuery 或 jQuery.fn，视调用方式看
	if ( length === i ) {
		target = this;
		--i;
	}
	// 循环遍历（arguments中多个参数的情况）
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		// 取arguments中的对象
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			// 遍历对象的属性
			for ( name in options ) {
				// 目标参数中指定属性的值
				src = target[ name ];
				// 拷贝参数中指定属性的值
				copy = options[ name ];

				// Prevent never-ending loop
				// 防止目标参数===拷贝参数中指定属性的值（引用同一个对象类型的参数）
				// 例如：var a = {};  $.extend(a, {name:a}); ===> {}
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				// 深拷贝 情况2：$.extend({}, {age:18}, {name:'peter'});
				// deep为true && copy有值 && (copy是否为对象 || copy是否为数组)
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						// var a = {name:{job:'it'}}; var b = {name:{age:18}};
						// $.extend(true, a, b);  ===>  {name:{job:'it', age:18}}
						// src就是{job:'it'},有值并未对象，返回本身并赋值clone
						// 下次jQuery.extend( deep, clone, copy )时会进入else if（浅拷贝）(copy再次进入遍历属性时，不是对象和数组了)
						// 将copy中的age字段赋值给clone对象
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					// 递归调用，一直到指定对象的属性值不是对象，进入浅拷贝情况，递归停止，并返回值
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				// 浅拷贝
				// 情况2：$.extend({}, {age:18}, {name:'peter'});
				} else if ( copy !== undefined ) {
					// 简单赋值
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// \D将非数的部分替换成空字符
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// 见demo6
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	// 推迟ready事件触发 见demo8
	holdReady: function( hold ) {
		if ( hold ) {
			// 不一定在执行回调时前方有一个js在加载；若多个就多次++
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	// 触发DOM加载完的回调（内部会判断各种变量是否符合要求）
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		// isReady默认false，执行过后就true
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		// 触发之前done函数内fn参数（函数）
		// $y(function(arg){
        //     alert(this);  ==>  document
        //     alert(arg);  ==>  jQuery
        // })
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			// 下面的语句用于触发这个写法 $(document).on('ready', function(){})
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		// null、undefined与null取== 返回true（三等就undefined和null返回false，类型不同）  
		// 只有window下有window（window是最大的全局变量）
		// 只有null和undefined取属性是会报错,中断执行语句
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// 为什么不用typeof：NaN和数字1都会返回number
		// parseFloat(obj)不能转化的都是NaN
		// isFinite判断是否为有限数字（计算机能正常运算），无限数字返回false
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},
	// 判断参数类型
	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		// core_toString是{}.toString()
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},
	// 判断是否是通过字面量{}、new构造函数产生的对象
	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes 由于type方法传入dom节点会返回object，所以需要通过nodeType判断是否为节点
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			// window.location
			// 构造函数 && 传入参数的原型是否有isPrototypeOf方法，只有对象有
			// 例如：数组arrary也可以使用isPrototypeOf方法，但是它是通过array的原型的原型找到
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object 成功
		return true;
	},
	// 这里的object是typeof判断出来的对象
	isEmptyObject: function( obj ) {
		var name;
		// 有属性有方法会被for in到（系统的除外）
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		// 抛出自定义的错误
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	// 见demo9
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		// 可以省略context（执行上下文）传参
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;
		// 判断是否为单标签<li></li>
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		// 单标签直接创建放入数组并返回
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}
		// 多标签<li></li><li></li><script><\/script>：利用文档碎片创建节点
		parsed = jQuery.buildFragment( [ data ], context, scripts );
		// false：scripts标签不会被删   true：删除
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		// 通过merge将子节点们转化为数组 返回
		return jQuery.merge( [], parsed.childNodes );
	},
	// JSON.parse支持ie9以及向上 见demo9
	// JSON.parse与eval效果一致，前者更严谨，只能解析指定格式的json；后者不安全
	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	// 见demo9
	parseXML: function( data ) {
		var xml, tmp;
		// 判断入参类型
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9 parseFromString会抛异常
		try {
			// 此实例对象可将xml转换为document
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}
		// 判断是否报错（格式不正确）
		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},
	// 插件可以使用？？
	noop: function() {},

	// Evaluates a script in a global context
	// 执行传入语句，并将变量作用域改为全局  见demo10
	globalEval: function( code ) {
		// eval需要存储，此时赋值给indirect是window.eval
		// 若下方else中直接调用eval，会作为关键字调用，此时解析后语句中变量就是局部的了
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			// use strict 严格模式下不支持eval解析，改为动态插入script标签形式引入
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				// 引入后记得移除
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	// margin-top -> marginTop
	// -ms-transform -> msTransform  IE要求
	// -moz-transform -> MozTransform
	camelCase: function( string ) {
		// rmsPrefix = /^-ms-/   -ms-transform  ->  ms-transform
		// rdashAlpha = /-([\da-z])/gi   获取-加数字或字母部分
		// fcamelCase 回调函数
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},
	// 节点名称与指定名称是否一致  BODY、HTML
	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	// each循环针对的是jquey对象，for循环针对原生js
	// 支持类数组、数组、json对象
	// args：内部使用传入此值
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				// 数组、类数组
				for ( ; i < length; i++ ) {
					// 执行回调
					value = callback.call( obj[ i ], i, obj[ i ] );
					// 使用each者在callback中return false，value值为false，直接break，停止循环
					if ( value === false ) {
						break;
					}
				}
			} else {
				// json
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},
	// 去除前后空格
	trim: function( text ) {
		// core_trim 字符串下的一个方法
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	// 见demo12 
	// results参数：内部使用
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			// Object(123) -> Number:123  转化为对应类型
			//isArraylike只要有长度的会返回真
			if ( isArraylike( Object(arr) ) ) {
				// 不是数组和类数组的使用[arr],符合的情况使用arr
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				// 数组push
				core_push.call( ret, arr );
			}
		}

		return ret;
	},
	// 数组版indexOf
	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},
	// 合并数据：first参数必须有length   见demo12 
	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;
		// 数组、类数组
		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			// 特殊json：key为0、1、2  {0:'qq',1:'ww'}
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}
		// 最终返回的长度
		first.length = i;

		return first;
	},
	// 过滤新数组  见demo12 
	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		// !!转boolean
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			// 没有指定回调函数内的this指向
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		// 普通json对象
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		// callback函数返回的value若是数组形式，不做下面的处理会变成[[1], [2], [3], [4]]
		// 数组的concat操作会对复合数组进行合并操作
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	// 见demo13
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	// 改变this指向 见demo13
	proxy: function( fn, context ) {
		var tmp, args, proxy;
		// 简写方式的处理
		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		// 截取数组中第二个元素往后的所有元素
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			// 									args与调用proxy函数的入参 拼接数组
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		// 加唯一标识
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		// 返回这个函数，接收方使用$.proxy(show, document)(3, 4)
		// 调用返回的proxy函数并传参3, 4  走上面的那个proxy赋值的函数
		return proxy;
	},

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
	// 当前时间距离1970年多少毫秒数（ 等同于new Date().getTime() )
	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	// 见demo15.hmtl  偷梁换柱大法好
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		// 将页面上的元素的样式存在old中，并帮预先需要加在元素的样式赋值上
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
		// 对元素进行获取值的操作
		ret = callback.apply( elem, args || [] );

		// Revert the old values
		// 将旧值赋值回给页面上的元素
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});
// 通过readyState以及监听器判断DOM是否加载完
jQuery.ready.promise = function( obj ) {
	// 第一次进入此方法，readyList为空，可以创建延迟对象
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		// DOM加载完毕的标志readyState  complete
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			// IE会提前将标志置为完成，加上setTimeout防止IE上DOM没有真正的完成
			setTimeout( jQuery.ready );

		} else {
			// DOM没有加载完，开启监听器
			// 两个监听器，为了兼容部分浏览器
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	// 返回延迟对象，并加上promise，让其外部无法修改状态
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	// class2type[object Boolean] = boolean
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );
	// 最后判断的属性，有可能window下有，提前将window情况排除
	if ( jQuery.isWindow( obj ) ) {
		return false;
	}
	// nodeType === 1：元素节点
	// length：有个数
	// 满足两种情况 ===> 类数组
	if ( obj.nodeType === 1 && length ) {
		return true;
	}
	// 先要满足是数组或者不是函数，因为函数下面也可以挂载&&符号后面判断的属性
	// &&后面判断的是类数组以及arguments
	return type === "array" || type !== "function" &&
		// show()  arguments ==> length=0
		( length === 0 ||
		// show(a, b, c)  arguments ==> length=3 && 2 in arguments 完美
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	// options.match( core_rnotwhite )通过非空格进行分割
	// "once memory" ==> ["once", "memory"]
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		// 每个存储在缓存当中
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	// options ==> "once memory" ==> {once:true, memory:true}
	// optionsCache ==> {
	// 	   "once memory":{once:true, memory:true}
	// }
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		// 没有传参，赋值options为空对象
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		// 允许触发几次标志量（fireWith中使用） 
		// stack 堆
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			// 有memory:true  否则是data值
			memory = options.memory && data;
			// 是否触发过
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			// 触发中状态
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				// 调用队列中函数，this指向data[0]，参数为data[1]
				// 返回值为false并且传入stopOnFalse参数，直接break
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					// memory置为false，要不后面再add函数时会直接触发fire函数，因为memory在开始赋值true或者data
					memory = false; // To prevent further calls using add
					break;
				}
			}
			// 触发结束状态
			firing = false;
			// 
			if ( list ) {
				// 处理在firing中，再调用fire函数的情况
				// stack中存着this执行与调用fire是的入参
				// 调用fire方法时，会将循环list中函数，并将参数传入函数
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				// 传入once参数时 stack为false  并且在传入memory参数时
				// 清空list，下次fire时遍历空数组
				} else if ( memory ) {
					list = [];
				// once、memory参数都不传
				} else {
					// 直接全清
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					// 匿名函数自执行 用于 cb.add(aaa, bbb)一次添加多个函数
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								// 唯一的标志量 || list中是否存在arg函数（self对象中has函数）
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							// cb.add( [aaa, bbb] ) arguments: {0:[aaa, bbb]; length:1}
							// each遍历后再调add([aaa, bbb]),参数args接收的直接是[aaa, bbb]
							// 不再通过arguments接收值
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					// 正在fire中，添加函数到list，更新firingLenth
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					// 在第一次fire时，若传入memory会保存变量状态，在下次add判断此变量状态，确定是否立刻触发fire方法
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					// 支持一次移除多个参数
					jQuery.each( arguments, function( _, arg ) {
						var index;
						// 判断参数是否存在在数组中
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							// 存在就切除
							list.splice( index, 1 );
							// Handle firing indexes
							// 正在fire中，将函数移除list
							if ( firing ) {
								// 移除的函数位置小于队列长度
								// 总数减一
								if ( index <= firingLength ) {
									firingLength--;
								}
								// 移除的函数位置小于正在执行的函数位置
								// 记录正在执行的函数位置减一
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			// 判断list中是否存在指定函数
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			// 情况
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			// 禁止使用（所有方法都无效）
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			// 锁住（只是调用fire方法无效，在fireWith那卡住）
			// 对外fire --> fireWith --> 对内fire
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				// 默认第一次fired为undefined，!fired为真
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					// [作用域，具体参数]
					// args.slice：判断是否为数组
					args = [ context, args.slice ? args.slice() : args ];
					// firing为true时，代表正在for循环调用list中函数
					// 正在进行，所以讲其参数放入队列中
					if ( firing ) {
						stack.push( args );
					} else {
						// 触发上面fire函数，并将参数带上
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				// 当前对象，参数
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			// 是否调用过fire方法
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				// 见deferred1.html
				// 数组中第一个元素对应Callback中fire方法
				// 数组中第二个元素对应Callback中add方法
				// memory记忆   once只处罚一次
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				// 三种状态 resolved  rejected  pending
				state: function() {
					return state;
				},
				// dfd.always(函数1)，always会将done和fail两个函数都绑定上
				// 这样不管失败成功，都会触发函数1
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				// 三种情况都可以同时传入
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						// 遍历对应关系
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								// 判断pipe传入的是函数
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								// 判断pipe传入的是字符串
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		// 循环对应关系
		jQuery.each( tuples, function( i, tuple ) {
			// 声明一个回调对象（队列）
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			// 将数组中第二个元素赋值为add方法作为属性放在promise对象上
			promise[ tuple[1] ] = list.add;

			// Handle state
			// stateString无值状态是进行中
			// 其余都有值
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				// 0^1 = 1  1^1 = 0
				// done：将fail队列回调对象禁用  fail：将done队列回调对象禁用
				// progress必锁
				// 同时将三个函数放入队列
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]赋值方法，内部调用resolveWith，其实还是调用list.fireWith
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		// 调用此方法并传入deferred，会将promise中的方法全部加载deferred上（deffered原来有resolve、reject、notify三种方法）
		// 调用此方法无入参，会直接返回promise对象
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	// 见deferred2.html
	// 考虑入参参数为0个，入参参数为多个、有入参但不是延迟对象，多个入参但中间掺杂不是延迟对象的情况 四种情况
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			// 转数组
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			// 计数器 
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					// 进行中情况
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					// 完成情况，每次触发都会减一，直到减为0，触发resolveWith-->done函数
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		// 入参数超过一个时
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				// 过滤入参中不是延迟对象的那些项
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						// updateFunc:内部计算有几个延迟对象的入参触发了done，若与计算器一致，触发内部维护的延迟对象的done函数
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						// 只要有一个触发，就直接触发内部维护的延迟对象的fail函数
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				// 不是延迟对象，直接减少计算器
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		// 不传参数，remaining为0，直接触发resolve方法，触发done
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
// 检测相应浏览器下的具体方法是否支持 见support1.html
// 立即执行函数,传入参数空对象,在函数内赋值,最终返回此对象
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	// 这里只是提供变量判断是否支持,具体让其在不同浏览器展示同一种效果是hooks的作用
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	// 这些检测需要在dom加载完才可以判断
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	// 禁用下拉选，判断下拉选中的option是否也被禁用
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	// 必须是先设置value，后设置type
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	// 背景相关样式是否会被克隆样式影响
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			// -webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box 不同浏览器下的观影模式
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		// 填充一个div并将其放置可视区域之外
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		// zoom放大倍数，若设置了放大倍数，让其暂时还原为1倍状态
		// 设置完，会触发回调，会获取offsetWidth值(border-box怪异模式下，width就是offsetWidth --> 内容+内边距+边框)
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		// node.js下无getComputedStyle此属性
		if ( window.getComputedStyle ) {
			// 获取div元素的top值，除火狐外都会返回px值
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
// 见data1.html
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;
// 数据缓存  的构造函数
function Data() {
	// Support: Android < 4,
	// Object.preventExtensions/freeze防止修改对象的属性值（但是Android4以下不支持这些方法）
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	// 0是公用的，其余数字是某个元素独享的
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});
	// 随机数（唯一标识），这是dom元素的属性，对应的值就是固定数字123456
	// <div 唯一标识 = "1" ></div>
	// 每次加载jquery时就会生成一个唯一数字
	this.expando = jQuery.expando + Math.random();
}
// cache对象中的key
Data.uid = 1;
// 判断节点类型
Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	// 若为节点，只有元素节点1、文档节点9能在缓存中设置值
	// 若没有nodeType，认为是对象，可以在缓存中设置值
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};
// data中的实例方法
Data.prototype = {
	// 给dom元素上加唯一标识，并返回唯一标识对应的值
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			// 指定元素是否之前缓存数据
			unlock = owner[ this.expando ];

		// If not, create one
		// 没有则累加数字，作为cache中的key关联dom与json
		if ( !unlock ) {
			unlock = Data.uid++;
			// dom上加属性
			// Secure it in a non-enumerable, non-writable property
			try {
				// 默认通过defineProperties向dom设置属性，默认是不可修改的
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				// 若不支持上面的方法，通过extend方法将{唯一标识："1"}copy到dom元素上
				// 缺点：人为可以修改此属性
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}
		// 判断缓存中是否存放映射关系
		// 没有会给赋值空对象，有就不管了
		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	// $.data()会调用set方法
	// 在指定元素上设置缓存数据
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			// 获取cache中的值，没有就是空对象，有就维护的对象
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		// 存入的数据是字符串，直接赋值  
		// $.data($("#div1"), 'name', 'hello')
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		// 否则是数组或对象
		// $.data($("#div1"), {'name', 'hello'})
		} else {
			// Fresh assignments by object are shallow copied
			// 缓存中的值为空对象
			if ( jQuery.isEmptyObject( cache ) ) {
				// 直接使用extend方法copy
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			// 存储中的对象内有值
			} else {
				// for循环赋值
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	// 获取指定元素上缓存的数据（传入key，就会获取缓存对象对应key的值）
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		// this.key( owner )获取元素的唯一标识对应的值
		// 在cache中取
		var cache = this.cache[ this.key( owner ) ];
		// 若传入key，就获取缓存对象中key对应的值
		// 没传入key，就直接返回缓存对象
		return key === undefined ?
			cache : cache[ key ];
	},
	// 通过参数判断调用set或get方法（入口）
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		// 1.key没有传值
		// 2.key有值并且为字符串类型，value没值（key为json对象，就会调用set）
		// 两种情况会调用get方法
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );
			// jQuery.camelCase(key)兼容设置时为驼峰式，传入的参数是-连接的
			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		// 不符合get方法的参数时，就调用set方法
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		// 传value证明是set方法，返回value值，否则返回key
		return value !== undefined ? value : key;
	},
	// 移除指定元素上缓存的数据（传入key，就去除缓存对象对应key的值）
	remove: function( owner, key ) {
		var i, name, camel,
			//开始不出意料都会获取指定元素对应唯一标识的值，以及对应缓存中的对象
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];
		// 不指定key，就将指定元素上的所有缓存数据清空
		if ( key === undefined ) {
			this.cache[ unlock ] = {};
		// 指定key
		} else {
			// Support array or space separated string of keys
			// 判断是是否是数组
			// $.removeData($("#div1"), ['name', 'hello']);
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				// key.map( jQuery.camelCase ) 将数组中每个元素转驼峰
				// concat将key数组与转驼峰后的数组合并
				name = key.concat( key.map( jQuery.camelCase ) );
			// key不是数组
			} else {
				// 转驼峰
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				// 指定key若存在cache中，则将key与转驼峰的key以数组形式存储在name中
				if ( key in cache ) {
					name = [ key, camel ];
				// 若key不存在cache中，就判断转完驼峰之后的key是否存在cache中
				// 存在则返回，不存在则把转驼峰后的key去空格返回，都没有值就返回空数组
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}
			// 循环删除cache中的指定key的数据
			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	// 判断指定元素是否有缓存数据
	hasData: function( owner ) {
		// 判断指定元素在缓存中的缓存对象是否为空对象{}
		// 为{}：无缓存数组 返回false   否则返回true
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	// 删除指定元素在cache中的缓存数据(1：{})
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();

// 扩展数据缓存相关的工具方法
jQuery.extend({
	// 判断是否可以创建私有key的传入值
	acceptData: Data.accepts,
	// 判断指定元素是否有缓存数据
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},
	// 设置或获取指定元素的缓存数据
	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},
	// 移除指定元素上缓存的数据（传入key，就去除缓存对象对应key的值）
	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	// 猜测是内部使用的，data_priv新new的Data对象，里面维护的数据也是自己的
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});
// 扩展数据缓存相关的实例方法
jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			// 获取第一个元素
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		// 不传入key，默认获取全部缓存数据
		// $('#div1').data();
		if ( key === undefined ) {
			if ( this.length ) {
				// 获取指定元素缓存数据
				data = data_user.get( elem );
				// dom元素 && 第一个判断元素，hasDataAttrs属性一定没有（在私有对象data_priv中维护的）
				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					// 获取don元素中所有属性的集合 [title='',class='',id='']
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						// title  class  id
						name = attrs[ i ].name;
						// 判断name中是否还有data-
						if ( name.indexOf( "data-" ) === 0 ) {
							// 截取data-后面的部分，转驼峰(js中尽量不要有-)
							name = jQuery.camelCase( name.slice(5) );
							// 通过此方法将data-这类数据放入缓存数据中
							// data中设置了data-后面的属性值，就会直接返回缓存数据中的值
							// 不理会html上设置的值
							// data[ name ]
							dataAttr( elem, name, data[ name ] );
						}
					}
					// 将data-这类数据放入缓存数据后，给指定元素增加hasDataAttrs属性，
					// 使其下次不用进入处理data-这个方法，因为get就可以直接拿到
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		// $('#div1').data( {name:'yl', said:'hello'} );
		if ( typeof key === "object" ) {
			// 遍历目标元素调用set方法
			return this.each(function() {
				data_user.set( this, key );
			});
		}
		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			// value没有传入，获取值   $('#div1').data('name');
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				// 通过key找缓存数据
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				// 通过驼峰key找缓存数据
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				// 通过data-后面的数据找html上对应的值
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			/* 
			// $('#div1').data('name-age', 'hello');
			this.cache = {
				1:	{
						'nameAge':'hello',
					}
			}
			// $('#div1').data('nameAge', 'hi');
			// $('#div1').data('name-age', 'hello');
			// 第一次将nameAge的属性值设置为hi
			// 第二次name-age在get后，执行set方法传入了name-age转驼峰后的key，hello的value
			// 所以，将之前nameAge的hi值置为hello
			// 接下来判断字符串是否包含“-”，之后调用set方法传入name-age的key，hello的value
			// this.cache = {
				1:	{
						'nameAge':'hello',
						'name-age':'hello'
					}
				}
			*/
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},
	// 遍历元素调用移除指定key
	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

// key是data-后面的数据转驼峰
// data 缓存数据中第二个参数为key对应的value值
function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	// data无值,取html上对应的属性值
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );
		// getAttribute出来的都是字符串   字符串 --> 具体类型
		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					// 字符串类型的数字
					// +"100"  --> 100  不是数字的都是NaN
					+data + "" === data ? +data :
					// 是否为json格式
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			// 在指定元素上设置指定key对应的属性值
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
// 队列管理的工具方法  见queue1.html
// $.queue(doucment, 'q1', aaa);	q1 ： [aaa]
// $.queue(doucment, 'q1', bbb); 	q1 ： [aaa, bbb]
// $.queue(doucment, 'q1', [ccc]); 	q1 ： [ccc]
// $.queue(doucment, 'q1'); 		q1 ： [ccc]
// 利用的是缓存数据$.data相关的方法
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			// 默认fx类型
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},
	// $.queue(doucment, 'q1', aaa);	q1 ： [aaa]
	// $.queue(doucment, 'q1', bbb); 	q1 ： [aaa, bbb]
	// $.dequeue(doucment, 'q1')
	/*
	$('#div1').animate({width:300}, 2000);    
	$('#div1').animate({height:300}, 2000);
	$('#div1').animate({left:300}, 2000);
	第一次调用实例方法queue，会立刻调用dequeue工具方法，由于fn不是inprogress，没有移出队列
	由于动画默认fx，在队列头部插入inprogress，回调内调用next()，执行dequeue，在从队列头移出
	是inprogress，再次从队列中移出函数赋值fn，动画默认fx，在队列头部插入inprogress，再回调，
	没完没了到startLength为0
	注意：第一次不用再次在头推出赋值fx，之后都需要。
	*/

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),  //aaa()
			hooks = jQuery._queueHooks( elem, type ),
			// 最后回调的参数，所以说在回调函数中执行next()与dequeue效果一样
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				// 入队
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		// get有值就返回
		// 没有值，就通过access设置值设置缓存对象，empty对应设置回调对象，向队列中加一个函数
		// 这个函数是移出指定元素的 type + "queueHooks"  type + "queue",
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});
// 队列管理的实例方法
jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;
		// $('#div1').queue( function(next){} );
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}
		// $('#div1').queue( 'q1' );  查看操作
		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
		// $('#div1').queue( function(next){} );
			this :
			// $('#div1').queue( 'q1', function aaa(){} ); 设置操作
			this.each(function() {
				// 遍历每个元素设置到缓存数据中
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				// 这里确保将相应数据设置到缓存中
				jQuery._queueHooks( this, type );
				// 针对移动动画，第一个入队后，立刻出队，出队调用的是工具方法
				// 会立马在queue中加入inprogress，下次就不会立刻出队
				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	// 出队
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	// 延迟队列执行  见queue2.html
	delay: function( time, type ) {
		// time可以传指定字符串或者直接数字
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			// 延时调用next的时间
			var timeout = setTimeout( next, time );
			// 延时过程中可以调用，停止延迟
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	// 清空指定元素中缓存数据type对应的值
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			// 计算器
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			// empty内部会触发队列中的resolve函数
			// 每次触发，计算器都加一
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		// 最后触发一次，这是count为0，执行了defer的resolveWith函数
		// 这时队列中所有操作都完成，触发resolveWith --> done函数
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		// jQuery.attr回调函数（工具方法attr）
		// 回调函数会接收的参数name, value
		// arguments.length > 1 设置或获取属性
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},
	// 同attr方法
	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		// 直接遍历删除指定元素上的属性(此属性若propFix中定义对应关系，使用对应关系中的值；否则使用传入值)
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			// 字符串类型，返回传入参数；否则，返回false
			proceed = typeof value === "string" && value;
		// 传入参数为函数
		// 循环指定元素组，对每个元素进行addClass操作
		// addClass操作中的值为调用回调函数return的值
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				// this：回调函数的this指向
				// j：指定元素在所有元素中的位置
				// this.className：指向元素的拥有的类选择器
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}
		// 字符串类型
		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			// 字符串分隔为数组
			classes = ( value || "" ).match( core_rnotwhite ) || [];
			// 循环指定元素组
			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// 元素节点 && 是否有类选择器，
				// 有：在原有的基础上两边加空格并替换掉制表符等一系列转义字符；没有：返回空格字符串
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);
				// 空格字符串也是真
				if ( cur ) {
					j = 0;
					// classes：addClass方法传入参数转化成的数组
					// cur：指定元素本身拥有的类选择器字符串
					while ( (clazz = classes[j++]) ) {
						// 返回-l 证明要添加的class在目标元素中没有，进行字符串拼接
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					// 最终将前后的空格去除，赋值给指定元素
					elem.className = jQuery.trim( cur );

				}
			}
		}
		// 支持链式操作的必要返回值(返回对象)
		return this;
	},
	// 大多数操作与addClass相同
	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			// && 优先级大于 ||
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						// 不返回-l，就进行删除操作
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					// 若没有传入参数，直接赋值为空字符串（清空）
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;
		// 见elem2.html
		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			// value类型为字符串
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					// 存在class就删除，不存在就添加
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			// value类型为undefined 或者 布尔
			// $('#div2').toggleClass(false); 
			// 清空class，jq会将清空前的拥有的类选择器与对象进行绑定，存储在缓存数据中
			// $('#div2').toggleClass(true); 
			// 还原指定元素的类选择器，若私有对象存储了，则还原，否则就为空字符串
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					// 先存
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			// 节点类型 && 元素拥有的所有类选择器的字符串，将所有转义字符转成空字符串，再判断传入参数是否在其字符串
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];
		// 无传入值，进行获取值操作（获取只获取元素数组中的第一个元素）
		if ( !arguments.length ) {
			if ( elem ) {
				// 根据第一个元素类型与节点名称判断是否需要兼容性处理
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}
				// 无需兼容性处理的情况
				ret = elem.value;
				// 类型处理
				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}
			// 只要进行获取操作，就不会走下面了，最终会return
			return;
		}
		// 传入值 -----------在这以下就是设置属性值的操作
		// 判断传入值为函数
		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}
			// 获取值
			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			// $('#input2').val(null);
			if ( val == null ) {
				val = "";
			// $('#input2').val(234555);
			} else if ( typeof val === "number" ) {
				val += "";
			// $('#input2').val(['qqqq']);
			// 会拿qqqq和 与#input2匹配的元素 的value值进行比较，一致则选中，不一致取消选中（checkbox）
			} else if ( jQuery.isArray( val ) ) {
				// 遍历数组，判断每个元素是否为null，进行类型转换
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		// 下拉菜单的子选项
		option: {
			// alert( $('option').eq(0).get(0).value); 见elem3.html
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				// 为兼容黑莓4.7和ie低版本，使用elem.attributes.value与elem.attributes.value.specified值进行区分
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		// 下拉框
		select: {
			get: function( elem ) {
				var value, option,
					// 多少个选项
					options = elem.options,
					// 选中index
					index = elem.selectedIndex,
					// one： true单选框情况  false多选框情况
					one = elem.type === "select-one" || index < 0,
					// 多选框为数组，否则为null
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				// 单选框max为1，只会循环一次
				// 多选框就是选项的长度，循环多次
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					// 下拉框重置后选项的selected会出问题
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							// 是否支持禁用属性
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						// 单选框直接返回值
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						// 多选框，推数组
						values.push( value );
					}
				}
				// 返回数组
				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					// 若value是可以转换为数组
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					// jQuery(option).val() 获取当前option选项的值
					// values是传入的值转换为的数组
					// jQuery.inArray( jQuery(option).val(), values ) 判断当前option值是否在数组中
					// 存在 就选中效果为true
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				// 没选中selectedIndex就置为-1
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},
	// $('#div2').attr('title', 'hello');
	// elem是每个与#div2匹配的元素
	// name：'title'
	// value：'hello'
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		// 节点不存在、节点类型为文本、注释、属性   不支持set/getAttribute方法
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		// 元素无法使用getAttribute方法，内部调用prop方法
		// $(document).attr('title', 'hello')   doucument不支持set/getAttribute方法
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		// 是元素节点并且是xml节点，不走if判断内的语句
		// 其余情况需要执行if内语句，兼容处理
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			// attrHooks是一个大对象，内部存储需要处理兼容的字段
			// 每个字段内分别有get/set方法
			// 判断是否有兼容性处理方法，通过判断hooks内是否存在set/get方法
			hooks = jQuery.attrHooks[ name ] ||
				// jQuery.expr = Sizzle.selectors  bool是字符串，一堆html标签中的属性值
				// 匹配上，使用boolHook进行兼容性处理
				// 未匹配，直接返回undefined
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}
		// 设置属性值
		if ( value !== undefined ) {
			// 设置属性值为null，那么进行清除指定元素的指定属性值
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
			// 兼容性处理
			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;
			// 无兼容性处理需求，直接调用底层setAttribute的API方法
			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}
		// 获取属性值（需要兼容性处理的情况）
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;
		// 获取属性值（不需要兼容性处理的情况）
		} else {
			// jQuery.find = Sizzle，调用Sizzle中的attr方法来获取指定元素的指定属性值
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},
	// $('#div2').removeAttr('id yl class');
	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			// 通过match返回数组，循环调用js原生方法移除属性
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				// 符合propFix定义的key，使用key值；否则，使用外部传入的
				// "for": "htmlFor","class": "className"  js中for、class是关键字，只能用其他将其替换
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				// 将符合bool中定义的name值对应的propName值设置为false
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		// 当jQuery.attrHooks[name]中name为type时，需要兼容处理 
		type: {
			set: function( elem, value ) {
				// 不支持input设置radio属性值 && 设置radio属性值 && elem元素为input框
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					// 这里是ie下，radio类型的input设置value属性值。若先设置value，后设置type会导致value设置失败
					// 兼容方式是，先设置type属性，再设置value属性
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
		// 不是xml，兼容性处理
		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			// 兼容tabIndex：设置光标切换的属性
			hooks = jQuery.propHooks[ name ];
		}
		// 设置属性值
		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				// prop底层使用的原生的元素挂载值的方法
				( elem[ name ] = value );
		// 获取属性值
		} else {
			// 兼容性有get方法并且返回值不为null，返回ret
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		// ie下不是input，设置此属性，也可以获取相应设置的值
		// 正常情况下，应该获取不到相应值，统一为-1
		tabIndex: {
			get: function( elem ) {
				// 有tabindex属性 或者 input select textarea button其中一个 或者 href
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
// $('input').attr('checked', true); 
// value： true
// name： checked
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			// 找到optGroup，接着找到它的父元素select，设置select的index
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	// 方便使用者，使用者写成全小写，jq会自动将其转成底层js方法接收的值
	// jQuery.propFix[tabindex] = tabIndex;
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
// 遍历在jQuery.valHooks添加key："radio", "checkbox"
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		// 同下拉框一致逻辑
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			// 默认value值为null返回"on"
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});

// ------------------------------------------------------------------
// (4300, 5128) on() trigger()：事件操作的相关方法
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},
	// 见eventOper4.html(对照elemData结构)
	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			// 缓存数据的应用data
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			// 真正的事件函数（后续事件操作dispatch）
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// $('#div2').on('click mouseenter mouseover', function(a){ alert(222) })
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			// 确定命名空间
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			// 命名空间不止写成click.bbb  还可以更复杂 click.bbb.aaa
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			// 处理特殊事件（用其他事件模拟）
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			// 获取模拟事件
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			// 这个是事件类型对应的数组内的元素对象
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				// 创建事件类型对应的数组
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				// 有特殊操作有特殊操作，没有在执行if内部语句   undefiend === false --> false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						// 是否自定义事件，都会走，不过自定义无法生效
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			// 委托事件情况（放置在数组头部）
			if ( selector ) {
				// delegateCount记录当前事件类型中委托事件个数
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			// 后期优化
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		// 防止内存泄漏
		elem = null;
		console.log('elemData===',elemData);
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );
		// events是给元素绑定的所有函数
		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		// $('#div2').off('mouseenter click');
		// 需要移除的事件类型集合 ['mouseenter', 'click']
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			// 移除绑定事件时无类型只有命名空间
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					// 移除指定事件类型
					handlers.splice( j, 1 );
					// 若是委托事件，数量减一
					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			// 全部移除的情况
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		// events变成空对象的情况
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		// 是否支持冒泡
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			// 遍历向上取父元素，放入数组中
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		// 不阻止冒泡情况下，循环寻找满足当前触发条件的父元素
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				// 调用执行
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		// 没有阻止默认行为情况下，执行代码制造默认行为
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		// 将所有绑定的函数形成队列，按队列执行
		// 分两种：普通绑定、委托绑定
		// 委托绑定在最前面执行，层次越深，越在前面执行；剩下的按添加顺序执行
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		// 循环执行队列，执行对应的回调函数
		// 见propagationStopped.html  阻止冒泡 isPropagationStopped为true 不执行循环（阻止父级元素同类型事件触发）
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			// 阻止 isImmediatePropagationStopped为true不走循环（阻止同类型的事件触发）
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;
					// 特殊兼容性处理，最后apply是调用的绑定的回调函数，若有返回值，下面会继续处理
					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						/*
							$('#div2').on('click', function(event){
								// event.preventDefault()
								// event.stopPropagation()
								// false:两个都阻止，也可以自己手动在回调函数中写
								return false;
							})
						*/
						// 返回false，阻止默认行为与冒泡操作
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		// 判断是否绑定了关闭页面触发函数，设置了调用相应方法
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},
	// 队列按相应顺序执行触发函数（委托层级越深，执行越早）
	// event：jq中event对象		
	// handlers：存在缓存数据中的绑定函数的数组集合
	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";
						// 一般事件：undefined
						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ]).length;
						}
						// 委托事件指定的子元素是span:first伪元素：true
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		// 把不是委托事件加入handlerQueue队列中
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// 公用的
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},
	// onkeydown  onkeypress
	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		// 需要将原生js中的event属性  拷贝到jq中even对象中（特殊的）
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		// 鼠标相关的兼容性操作
		// event：jq中的event对象    original：原始的event对象
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			// 解释见pageClient.html
			// pageY是有兼容性的，不是所有浏览器都支持这个属性
			// pageX无 && clientX有
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;
				// 兼容方式，pageY === clientY + 滚动距离srollTop - 边框高clientTop
				// chrome浏览器不兼容doc.scrollTop，所以使用body.scrollTop
				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// 键盘与鼠标点击的键值	  见mouse.html
			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				// 低版本不支持which，使用button兼容（位运算符知识）
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},
	// event对象的兼容处理
	fix: function( event ) {
		// 是否有缓存
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			// 原生的event是dispatch函数传来的
			originalEvent = event,
			// 是否需要兼容性处理
			fixHook = this.fixHooks[ type ];
		// 不需要兼容性处理情况下，也会使用正则进行处理
		// 符合正则要求，那么也会有兼容性处理
		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
		// jquery中的event对象
		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			// 拷贝原生event中属性值到jq中的even对象
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		// 移动端 deviceready 无事件源
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		// 事件源不能是文本节点
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}
		// 返回兼容后的event对象
		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},
	// 特殊事件的处理（mouseenter -> mouseover）  见eventSpecial.html
	special: {
		// 加载
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			// 触发图片的load事件，不允许冒泡操作
			noBubble: true
		},
		// 聚焦
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			// focus不支持冒泡操作
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			/*
				$('#div2').delegate('#input2', 'focus', function(){ alert('input2'); })
				这种情况jq会内部用focusin模拟focus，由于focus没有冒泡机制
			*/
			delegateType: "focusin"
		},
		// 失焦  同focus
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		// 点击
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				// 复选框 
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					// 触发后会选中(默认行为)
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			// a标签情况下，不会进行默认行为 跳转页面
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},
		// 关闭页面
		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				// 兼容火狐
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},
	// 模拟触发操作
	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			// 支持冒泡
			jQuery.event.trigger( e, null, elem );
		} else {
			// 不支持冒泡
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

// jq中的even对象的构造方法
jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	// 不是new的，是直接调用，内部会通过判断来兼容错误
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		// 原生的event对象
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		// 是否有阻止默认行为属性
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	// 通过入参加强jq中event对象的属性
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	// 设置缓存
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	// 判断是否阻止了默认事件
	isDefaultPrevented: returnFalse,
	// 判断是否阻止冒泡
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	// 阻止默认事件
	preventDefault: function() {
		var e = this.originalEvent;
		// 触发相应函数，则将判断函数赋值返回true的函数
		this.isDefaultPrevented = returnTrue;
		// 调用原生js中的preventDefault
		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	// 阻止冒泡  见propagation.html
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	// 阻止其他正常会调用的函数
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
// 所有浏览器兼容mouseenter、mouseleave  见mouseenter.html
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		// 代理类型
		delegateType: fix,
		// 当前类型
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			// 判断是否有包含关系
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				// 触发用户通过on绑定的回调函数
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				// 模拟主动触发-->冒泡
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			// 上面会判断 有特殊的走特殊的，没有的直接addEventListener、removeEventListener
			setup: function() {
				if ( attaches++ === 0 ) {
					// 捕获focus、blur
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({
	// 见eventOper1.html
	// 兼容多参数
	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		/*
			一次绑定多个事件，传入对象
			$('#div2').on({
				'click': function(){ alert(234); },
				'mouseover': function(){ alert(567); }
			})
		*/
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			// 循环对象，挨个绑定事件
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}
		// 传参两个的情况
		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		//三个参数 
		} else if ( fn == null ) {
			// 委托事件
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			// 在回调函数内获取外部参数
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}
		// $('#div2').one('click', function(){ alert(234); })  只触发一次点击事件
		// one函数内部也会调用on函数，不过在调用on函数时，会将one参数置为1
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				// 取消事件（下次无法触发）
				jQuery().off( event );
				// 调用回调函数（达到只触发一次的效果）
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			// 函数标识
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			// on函数只是参数处理，最终事件与元素的绑定在add函数中处理
			// add: function( elem, types, handler, data, selector )
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		// 。。。。。。
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		// 参数为对象类型的
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		// 参数处理
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			// 最终执行remove操作
			jQuery.event.remove( this, types, fn, selector );
		});
	},
	// 立刻触发事件（会触发事件的默认行为）
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	// 立刻触发事件（不会触发事件的默认行为）
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	/*
		正则：开头为第一个字符为任意字符，第二个字符除去:#\[\.,这几种情况
		匹配成功：.box  div  #div  :odd  ul  li
		匹配不成功：div:odd  ul#li  ul[title='hello']  div.box  ul,ol
	*/
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	// 见  domOperate2.html
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;
		// dom对象或者jq对象
		// $('ul').find($('li')).css('background', 'red');
		if ( typeof selector !== "string" ) {
			// 把满足条件的jq对象集合推入栈中
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					// 判断通过筛选条件找的jq对象是是否在指定jq对象内
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}
		// 筛选条件为字符串情况
		// $('ul').find('li').css('background', 'red');
		for ( i = 0; i < len; i++ ) {
			// Sizzle  ret用于存储筛选完的jq对象
			jQuery.find( selector, self[ i ], ret );
		}
		/*
			<ul>
				<li>
					<ul>
						<li>2</li>
						<li>3</li>
					</ul>
				</li>
				<li></li>
			</ul>
			这样的结构，导致内容为2、3的li被获取到了两次，所以需要jQuery.unique把jq对象去重
		*/
		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		// 筛选字段赋值到返回值上
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	// 见  domOperate1.html
	has: function( target ) {
		// 在this中的子级元素中寻找符合target要求的(指定范围内找符合要求的$(target, this))
		// 有可能有多个结果
		var targets = jQuery( target, this ),
			l = targets.length;
		// 循环this指向的目标集合
		return this.filter(function() {
			var i = 0;
			// 循环符合target要求的结果是否在this内
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		// 借助入栈  先入后出
		// 过滤操作通过winnow函数实现
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	// 见  domOperate3.html
	is: function( selector ) {
		return !!winnow(
			// 指定jq对象内过滤
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			// 过滤条件
			// 字符串类型并且是伪类(div:last)--> 获取jq对象  $('div:first').is('div:last')
			// 不符合上面条件的--> 直接使用传入的过滤条件
			typeof selector === "string" && rneedsContext.test( selector ) ?
				//全局获取jq对象 
				jQuery( selector ) :
				selector || [],
			// 方式为过滤
			false
		).length;
	},
	// 见  domOperate3.html
	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			// 结果
			matched = [],
			// 筛选条件：rneedsContext伪类正则 或者 不是字符串类型
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				// pos是在指定范围内通过筛选条件查到符合要求的jq对象
				jQuery( selectors, context || this.context ) :
				0;
		// 循环jq对象集合
		for ( ; i < l; i++ ) {
			// 每个指定jq对象对应的元素都要向上寻找
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				// 节点类型要求cur.nodeType < 11
				if ( cur.nodeType < 11 && (pos ?
					// 判断目标对象是否为指定对象，是的找到了（伪类情况或者不是字符串类型）
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					// 匹配成功（其他情况）
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {
					// 指定的元素有一个满足条件直接停止for循环，继续找jq集合中的下一个对象
					cur = matched.push( cur );
					break;
				}
			}
		}
		/*
			<ul>
				<li>
					<ul>
						<li>2</li>
						<li>3</li>
					</ul>
				</li>
				<li></li>
			</ul>
			$('li').closest('ul')
			这样的结构，导致最外层的ul被获取到了两次，所以需要jQuery.unique把jq对象去重
		*/
		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	// 见  domOperate3.html
	index: function( elem ) {

		// No argument, return index in parent
		// $('#div2').index()
		if ( !elem ) {
			// this.first() 获取指定jq对象集合中的第一个jq对象
			// .prevAll()  获取第一个jq对象上面的所有兄弟节点
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		// $('#span2').index('span')
		if ( typeof elem === "string" ) {
			// 查找范围：jQuery( elem )
			// 获取操作，只取指定对象的第一个 this[ 0 ]
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		// $('span').index( $('#span2') )
		// 支持反着写
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},
	// 见  domOperate4.html
	// $('div').add('span')
	// selector：span
	// this：$('div')
	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				// 字符串类型，在指定范围内找过滤条件的元素
				jQuery( selector, context ) :
				// jq对象、dom对象 --> 数组
				// dom对象有此值 selector.nodeType
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			// this.get()：jq对象调用实例方法get获取dom元素
			// 通过merge将通过selector找到的jq对象，合并到this指向对象中的dom元素（数组），最终返回数组
			all = jQuery.merge( this.get(), set );
		// 去重并入栈
		return this.pushStack( jQuery.unique(all) );
	},
	// 见  domOperate4.html
	// $('div').find('span').addBack()
	addBack: function( selector ) {
		// this：$('div').find('span')
		// this.prevObject：$('div')
		return this.add( selector == null ?
			// selector未传值：找到栈中下一层jq对象作为参数传入add
			// 传值：在栈中下一层jq对象$('div')通过此值进行过滤，并作为参数传入add
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	// 排除元素节点中的文本节点
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}
// 见  domOperate4.html
jQuery.each({
	parent: function( elem ) {
		// 返回每个指定节点的父节点
		var parent = elem.parentNode;
		// ll：排除文档碎片的情况
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		// 调用工具方法，并依赖原生dom的属性
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		// 比parents方法多传一个参数 
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		// 返回每个指定节点的下一兄弟节点
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	// 排除自己的所有兄弟元素
	siblings: function( elem ) {
		// (指定元素的父节点的第一个节点，不被处理的元素)
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	// 指定元素的所有子元素
	children: function( elem ) {
		// 指定元素的第一子元素
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		// contentDocument：获取iframe页面下的doucment对象（兼容iframe元素）
		// elem.childNodes 原生获取子节点方法，不区分类型（其他情况）
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	// 实例方法
	// until：有上下限的方法的入参
	// selector：过滤条件
	jQuery.fn[ name ] = function( until, selector ) {
		// 遍历指定jq对象集合，fn是不同方法内部处理的逻辑
		// 最终，在指定jq对象基础上，返回符合条件的数组
		// until最终会传入fn回调中
		var matched = jQuery.map( this, fn, until );
		// 兼容不需要上下限的方法(只有一个入参)
		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}
		// 字符串类型的过滤条件
		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}
		// 指定jq对象集合内个数
		if ( this.length > 1 ) {
			// Remove duplicates
			// 在可能出现方法情况下，进行去重（例如：parents()）
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			// 正则匹配：parents prev 从内到外
			if ( rparentsprev.test( name ) ) {
				// 由于去重内部会重现排序，所以需要处理
				// [2, 3, 4]  -> [4, 3, 2]
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	// 过滤条件  目标元素集合  是filter/not
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];
		// 兼容filter和not两种情况
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
		// 一个元素执行jQuery.find.matchesSelector
		// 多个元素执行jQuery.find.matches
		// jQuery.find为Sizzle，复杂的dom元素过滤都是通过Sizzle的
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			// 在调用matches前，先通过grep过滤一遍目标集合中不是元素的
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},
	// 指定元素		决定是取父级还是同级	上下限
	dir: function( elem, dir, until ) {
		var matched = [],
			// 是否有上下限
			truncate = until !== undefined;
		// 循环指定元素  
		// elem取父级或同级赋值给elem 
		// doucment不参与，html的父级是document，document的节点类型是9 
		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			// 必须是元素节点
			if ( elem.nodeType === 1 ) {
				// 有上下限情况下，通过is函数判断指定对象与过滤条件是否一致
				// 一致直接停止循环		不一致继续组装数据
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];
		// 从n开始向下遍历
		for ( ; n; n = n.nextSibling ) {
			// 元素节点 && 遍历值 !== 指定值
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
// $('div').filter('.div2')
// elements：$('div')  
// qualifier：'.div2'  过滤条件
// not：调用filter是false，调用not是true
// 返回值都为数组
function winnow( elements, qualifier, not ) {
	// 过滤条件为函数
	// $('div').filter(function(elem){ return true });
	// 回调函数返回：true 留下  false：丢弃
	// not函数与filter相反
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			// 通过回调函数的返回值 与 not值
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}
	// 过滤条件为dom对象(document.getElementById返回值)
	if ( qualifier.nodeType ) {
		// grep：过滤集合
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}
	// 过滤条件为字符串
	if ( typeof qualifier === "string" ) {
		// 匹配成功(值匹配简单的筛选条件)
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}
		// 匹配失败
		// 这里没有传值not，因为复杂过滤条件qualifier，sizzle底层不支持not过滤
		qualifier = jQuery.filter( qualifier, elements );
	}
	// sizzle由于不支持复杂过滤条件传not，所以在这里进行not值过滤
	return jQuery.grep( elements, function( elem ) {
		// 过滤结果是否在目标集合中 !== not
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	// 定义特殊元素插入的必要前提
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		// 
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				// value值为传入,获取操作  
				// jQuery.text = Sizzle.getText:获取文本节点的方法
				jQuery.text( this ) :
				// 有value值传入,设置操作
				// 先清空,再把内容通过createTextNode方法转成文本形式放入指定位置
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},
	// 见domOperate6.html
	// 接收四种的入参 dom对象、jq对象、字符串、函数
	append: function() {
		return this.domManip( arguments, function( elem ) {
			// $('span').append('<div></div>');
			// 回调函数中this：$('span')	elem：'<div></div>'对应的jq对象
			// 1：元素	11：文档碎片	9：document
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				// 兼容ie6、7版本的问题
				// $('table').append('<tr></tr>');
				// table会自动生成tbody，此时若不经过manipulationTarget处理，会在table下添加tr，造成添加失败
				// 所以通过manipulationTarget把target改为tbody
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				// 在指定元素下，把目前元素放在指定元素下第一个子元素前面
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				// 在指定元素的父元素下，把目标元素放到指定元素前面
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				// 在指定元素的父元素下，把目标元素放到指定元素的下一元素前面
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	// 移除元素（是否移除事件和数据缓存） // 见domOperate5.html
	remove: function( selector, keepData ) {
		var elem,
			// 先按筛选条件筛选目标jq对象集合
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;
		// 循环筛选后的对象集合
		for ( ; (elem = elems[i]) != null; i++ ) {
			// 不保持数据和事件并且是元素节点
			if ( !keepData && elem.nodeType === 1 ) {
				// cleanData清空指定元素相关缓存的数据和事件
				// getAll( elem )：获取指定元素下的后代元素与自己本身，返回一个集合
				jQuery.cleanData( getAll( elem ) );
			}
			// 指定元素的父元素存在
			if ( elem.parentNode ) {
				// 保持数据
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					// 通过数据缓存设置，保证指定元素下的script标签只执行一次
					setGlobalEval( getAll( elem, "script" ) );
				}
				// 移除指定元素
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},
	// 清空指定元素内容，以及它后代元素的事件以及数据缓存 见domOperate5.html
	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				// getAll第二参数传入false，只会返回elem的后代元素
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				// 清空elem下的所有内容(类似于innerHTML)
				elem.textContent = "";
			}
		}

		return this;
	},
	// 克隆元素（是否克隆指定元素的事件以及缓存数据，还有后代元素的相关数据是否克隆）
	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},
	// 见domOperate6.html
	html: function( value ) {
		// jQuery.access多功能值操作(获取、设置)
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;
			// 获取操作(使用js中的innerHTML实现)
			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			// 字符串类型 && 不是script|style|link标签 && 检测是否符合原生js中innerHTML方法的规范(不符合不走if)
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
				
				// 处理不规则传参
				// $('span').html('<input />');  //<span><input></span>
				// $('span').html('<div/>');        //<span><div></div></span>
				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							// 清空指定元素的后代元素的事件以及数据缓存
							jQuery.cleanData( getAll( elem, false ) );
							// 使用原生js的innerHTML方法情况并赋值指定dom结构
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}
			// 处理不满足上面if条件的情况
			if ( elem ) {
				// 先清空，再放入
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			// $('span').replaceWith( $('div') ); 
			// this：$('span')
			// args 获取每个span的下一个元素以及它的父元素
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		// elem：$('div')每回返回一个	args：$('span')	  this：$('span')每次一个
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				// 指定元素的下一个元素的父级元素 !== 指定元素的父级元素  -->  证明元素被移动了
				if ( next && next.parentNode !== parent ) {
					// 被移动了，就重新获取指定元素的下一个元素
					next = this.nextSibling;
				}
				// 移除指定元素
				jQuery( this ).remove();
				// 在指定元素的下一个元素前插入目标元素
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},
	// 移除元素并且将数据缓存和事件清空 // 见domOperate5.html
	detach: function( selector ) {
		return this.remove( selector, true );
	},
	// 类数组的目标字符串、dom、jq对象、函数	 回调函数		
	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		// 转数组
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		// 入参为函数情况 || 克隆复选框（状态无法克隆，直接调用三次回调，执行三次domManip进行添加）
		// $('span').append(function(i, html){ return 'hello'; });
		// this：$('span')	value：function(){ return 'hello'; }
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					// args[ 0 ] 被赋值为hello
					args[ 0 ] = value.call( this, index, self.html() );
				}
				// 再次调用，这次args不再是函数，是字符串
				// $('span').append(function(i, html){ return 'hello'; }); -->  $('span').append( 'hello' );
				self.domManip( args, callback, allowIntersection );
			});
		}
		// 正式创建dom并且调用如何处置dom的回调方法
		if ( l ) {
			// 创建文档碎片 通过字符串变成html元素结构 '<div>div</div><h1></h1><p>p</p>'
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			// <div>div</div>
			first = fragment.firstChild;
			// 文档碎片长度为一
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				// <script type="true">alert(222)</script> 将script标签加上type类型，让其类型和实际不符，不解析内部
				// 遍历getAll( fragment, "script" )返回的数组，调用disableScript方法处理
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				// 若只有一个script标签，但是要插入多个指定元素中，需要克隆多个
				// 但是插入后，只触发一次script加载，scripts长度为l
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
					// iNoClone：集合总数-l
					// 最后一个不使用克隆，其他向指定元素中插入的元素都是克隆出来的
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}
					// 调用append,prepend,before,after方法指定的回调
					callback.call( this[ i ], node, i );
				}
				// 判断是否有script需要加载解析
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					// 恢复script元素原有type值
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						// globalEval 只能执行一次
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {
							// script有src属性
							if ( node.src ) {
								// Hope ajax is available...
								// 通过ajax的方式请求外部文件
								jQuery._evalUrl( node.src );
							} else {
								// node.textContent清除老式的兼容写法
								// globalEval全局执行
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

// 提供两种类似的dom操作，是便于后续的链式操作
// 在div元素中插入span元素，返回div相关的jq对象集合
// $('div').append( $('span') );
// span元素插入到div元素中,返回span相关的jq对象集合
// console.log( $('span').appendTo( $('div') ) );
jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	// $('span').appendTo( $('div') );   -->    $('div').append( $('span') );
	// selector：$('div')	this：$('span')
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			// 若被插入的last位置多个，就进行克隆$('span')
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			// 把指定元素放入数组，准备入栈
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			// 原生js克隆元素 true：克隆标签中的内容（只克隆html元素，不会克隆事件以及数据缓存）
			clone = elem.cloneNode( true ),
			// 是否在当前页
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		// 不支持克隆复选框
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				// 解决IE9、l0下，克隆选中的checkbox,不会复制选中状态
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			// 克隆指定元素以及它后代元素的事件
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					// 克隆指定元素的事件
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			// 只克隆指定的元素的事件
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		// 克隆元素中含有script标签
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			// 全局化操作，此script标签只会触发一次
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			// 原生js的文档碎片创建
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				// 区分创建dom对象的方式，最终都会放到nodes数组内

				// 情况l：
				// $('span').append(oDiv);
            	// $('span').append($('div'));
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					// elem有nodeType：原生dom对象；没有：jq对象
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				// 情况2：
				// $('span').append('hello');
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				// 情况3：
				// $('span').append('<div></div>'); 一种或多种标签
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					// 在innerHTML操作时，部分不符要求的不可以添加，需要兼容性处理，
					// 以下三行就是根据定义好的对象进行兼容性处理
					// table与tr
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					// wrap第一个元素是定义需要遍历几层
					// 兼容是在需要添加的外层又增加了包裹，所以需要获取遍历层数，来获取真正添加的元素
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					// 合并到nodes数组中
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					// 记住顶级容器
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					// 清空内容，防止内存泄漏
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		// 清空内容，防止内存泄漏
		fragment.textContent = "";

		i = 0;
		// 遍历节点
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			// replaceWith会传入第三个参数  selection为false
			// 其他默认会传$('span')  例如：$('span').append( $('div') );
			// elem: $('div')	selection：$('span') 
			// elem若在selection里面，则不进行任何操作
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			// fragment.appendChild( elem )：将每个节点放入文档碎片中
			// 处理script标签
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},
	// 清空指定元素相关缓存的数据和事件
	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			// 
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];
				// 私有的数据缓存中指定key值存在
				if ( key && (data = data_priv.cache[ key ]) ) {
					// 取数据缓存的事件
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						// 循环事件类型与对应函数的对象
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							// 特殊事件的移除（由于是模拟的）
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								// 普通事件的移除
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					// 删除缓存数据
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		// 同步方式请求script数据
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	// 判断节点名称
	// 两种情况
	// l、elem为table内插content为tr：返回tbody
	// 2、其他情况，返回elem
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
// 给dom加上type属性值
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
// dom恢复原来的type属性值
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		// 参数refElements未传入时，会在数据缓存中将元素对象的globalEval值设置为true
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}
// 被克隆元素  克隆元素（dest需要克隆src上的事件）
function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	// 克隆事件操作
	if ( data_priv.hasData( src ) ) {
		// 取缓存数据（私有数据）
		pdataOld = data_priv.access( src );
		// 将克隆元素设置上缓存数据（用户数据）
		pdataCur = data_priv.set( dest, pdataOld );
		// 缓存内的事件
		events = pdataOld.events;

		if ( events ) {
			// 先清了克隆元素缓存中事件，在下面通过add进行添加处理
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					// 循环给指定克隆元素加上事件
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	// 克隆数据操作
	if ( data_user.hasData( src ) ) {
		// 取缓存数据（用户数据）
		udataOld = data_user.access( src );
		// copy到空对象上
		udataCur = jQuery.extend( {}, udataOld );
		// 将克隆元素设置上缓存数据（用户数据）
		data_user.set( dest, udataCur );
	}
}

// 获取context下面的指定tag的对象数组
// 不传入tag，获取context下面的所有jq对象
function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		// 将子元素与指定元素合并到一起
		jQuery.merge( [ context ], ret ) :
		// getAll(elem, false)
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	// 判断是否为复选框、单选框
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// 复制选中状态
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	// 兼容textarea的默认值
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
// 见domOperate7.html
jQuery.fn.extend({
	wrapAll: function( html ) {
		// 若多个span元素的同级元素有其他元素，jq内部就把他移动到与div同级（其实是移动的所有span）
        // $('span').wrapAll('<div>');
		// this:$('span')	html:'<div>'
		var wrap;
		// $('span').wrapAll(function(){ return '<div>';}); -> $('span').wrapAll('<div>');
		if ( jQuery.isFunction( html ) ) {
			// 由于每个元素都调用，每个wrap元素都会包裹div元素(与wrap效果一致)
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			// jQuery( html, this[ 0 ].ownerDocument ) 传入字符串进行dom创建(单标签多便签，最终只会创建一个jq对象)
			// 取第一个jq对象进行克隆
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				// 将div插在span元素前
				wrap.insertBefore( this[ 0 ] );
			}
			// $('span').wrapAll('<div><p></p></div>');
			// 多标签的情况下，span元素需要插入p元素内，需要遍历到最里面
			// 这时wrap是div，需要通过while找到div中最内部的元素
			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			// this是$('span')，全部放到div中最内部的元素里
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}
		// 每个span元素内增加div元素，span的内容（文本元素）移动到div内
		// $('span').wrapInner('<div>');
		return this.each(function() {
			var self = jQuery( this ),
			// span下所有子元素
				contents = self.contents();

			if ( contents.length ) {
				// 若有子元素，将所有子元素外层包裹'<div>'
				contents.wrapAll( html );

			} else {
				// 没有子元素，直接内部填充'<div>'
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		// 将每个span外层都包裹div元素
		// $('span').wrap('<div>');
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			// 函数：遍历每个span元素 用调用回调的结果作为参数调用wrapAll
			// 不是函数：遍历每个span元素 用入参作为参数调用wrapAll
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		// 移除span的父级元素（无参数、若父级元素为body，不会被移除）
        // $('span').unwrap();
		return this.parent().each(function() {
			// 若父级元素为body，不执行if内语句
			if ( !jQuery.nodeName( this, "body" ) ) {
				// 用于指定元素的父级元素的子元素将指定元素的父级元素替换
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});

// ----------------------------------
// css()：样式的操作

var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	// 谷歌  Opera	火狐  IE
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	// 先检查是否存在
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	// css样式的浏览器产商前缀兼容
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	// 获取最终样式是否为隐藏 || 是否是当前页面的元素(刚创建的元素，还没放页面)
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

// $('#div4').hide();
// elements：$('#div4')		show：undefined
// $('#div4').show();
// elements：$('#div4')		show：true
function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		// values[ index ]根据指定元素的块级还是行内元素，添加相对应的block inline
		// a、先调用hide：hide情况负责存相对应的block inline，show情况负责取
		// b、先调用show：通过css_defaultDisplay内部获取相对应的block inline
		// 下面这个循环是处理这个问题的
		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		// 显示元素
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			// 不存在数据缓存 && 隐藏状态
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			// 行内样式display无值 && 隐藏的元素
			if ( elem.style.display === "" && isHidden( elem ) ) {
				// css_defaultDisplay(elem.nodeName) ：获取对应标签是块级还是行内元素
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		// 隐藏元素
		} else {
			// 判断缓存数据是否有值，没有值通过if内部判断并设置上
			if ( !values[ index ] ) {
				// 判断元素现在是否正隐藏
				hidden = isHidden( elem );
				// 没值 && 有值不等于none || 没有隐藏 !false
				if ( display && display !== "none" || !hidden ) {
					// 隐藏：用元素自身上的样式
					// 没隐藏：调用工具方法，获取当前元素的display值，这时获取值是区别块级与行内元素的
					// 最终设置都数据缓存中
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	// 真正的设置元素的display样式
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		// 不能操作style的节点，直接过滤
		if ( !elem.style ) {
			continue;
		}
		// 目的为隐藏元素 || 元素样式为none ||  ""  --> 元素现在在页面显示
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			// show ：false  隐藏(none)
			// show ：true	 显示(没有指定值就用空字符串)
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	/*
	入参要求
		获取：一个属性字符串、多属性组成的数组
		设置：一对属性与属性值、多个属性与属性值组成的对象、一对属性与函数
	*/
	// 见cssOperate1.html
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;
			// 获取情况一：数组 || 设置情况一：多个属性与属性值组成的对象
			if ( jQuery.isArray( name ) ) {
				// 获取指定元素最终样式
				styles = getStyles( elem );
				// 需要获取多少个属性值
				len = name.length;

				for ( ; i < len; i++ ) {
					// css方法内部的curCSS方法内若styles值不传，会调用getStyles方法
					// 防止每次循环都调用，耗费性能，直接传入
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}
				// 返回对象
				return map;
			}

			return value !== undefined ?
				// 设置情况二：一对属性与属性值
				// 设置情况三：一对属性与函数
				jQuery.style( elem, name, value ) :
				// 获取情况二：一个属性字符串
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	// none：元素为隐藏
	// block或者""：元素为显示
	// 见cssOperate1.html
	show: function() {
		return showHide( this, true );
	},
	// 见cssOperate1.html
	hide: function() {
		return showHide( this );
	},
	// 见cssOperate1.html
	toggle: function( state ) {
		// 根据参数指定显示还是隐藏
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			// 判断当前元素是否是隐藏
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					// 获取指定元素的透明度属性值
					var ret = curCSS( elem, "opacity" );
					// 没设置透明度，默认返回"1"
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		// float是js中关键字，避免使用
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	// 设置、获取指定元素属性的内部方法
	// $('#div2').css('color', 'yellow')
	// elem：$('#div2')   name：'color'   value：'yellow'   extra：与计算元素尺寸有关
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		// 文本 注释
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		// 设置指定元素属性值
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			// $('#div2').css('width', '+=200'); 在原来的基础上加200，赋值宽度
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				// ret[1] -> +   ret[2] -> 200   parseFloat( jQuery.css( elem, name ) ) -> 原有值
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				// 类型改为number，后续给加px
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			// value值为null 或者 数字类型的NaN直接返回(数据写法不正确)
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			// 数字类型 && 不在cssNumber范围内
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			// 防止修改克隆元素背景，影响之前的元素
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			// 兼容性处理  extra用于处理高度、宽度
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				//是否需要兼容都会执行此语句 
				style[ name ] = value;
			}

		} else {
			// 获取属性值
			// If a hook was provided get the non-computed value from there
			// 兼容处理
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}
			// 不兼容性处理直接在元素样式上取
			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},
	// 获取指定元素属性的内部方法
	// $('#div2').css('color')
	// elem：$('#div2')   name：'color'   extra：与计算元素尺寸有关   
	// styles：元素最终样式（多个属性值获取会传，单个获取不传）
	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			// 转驼峰 background-color -> backgroundColor
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		// 确定真正的css样式属性名称 
		// jQuery.cssProps[ origName ] 缓存，下次直接能取到
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		// 一些特殊css样式属性的兼容处理
		// 透明度默认是空，但应该是1
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		// 兼容性处理  extra用于处理高度、宽度
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		// 
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		// 字符间距、文字大小都有可能返回值为normal，需要进行处理
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		// $('#div2').css('width')  '234px'
		// $('#div2').width()  234
		// 若extra有值，进行数字相关处理  '234px' -> 234
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});
// 内部方法调用的最底层的获取属性值
curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		// 指定元素的最终样式
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		// getPropertyValue兼容IE9(filter:alpha(opacity=50))  其他值使用computed[ name ] 获取
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		// 存储元素的行间样式
		style = elem.style;

	if ( computed ) {
		// elem.ownerDocument是否包含elem，一般情况下都返回true；在动态创建元素并且没有将其放入页面中时，返回false
		// var $span = $('<span></span>');  $span.css('width');  这种情况下就会返回false
		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		// 匹配百分比的值 && 匹配margin  -->  margin设置百分比情况
		// 兼容在Safari 5.1下获取设置百分比的margin的值时，不会像其他浏览器会自动转化为具体px
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			// 存临时变量
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			// 通过设置把宽度设置为百分比，获取具体px
			ret = computed.width;

			// Revert the changed values
			// 恢复之前的值
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};

// subtract：augmentWidthOrHeight计算出的结果
function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		// 不能有负数，所以当计算值为负数，取最大值0
		// matches[ 2 ]单位
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}
// extra：
// width、height --> content
// innerWidth、innerHeight --> padding
// outerWidth、outerHeight --> margin || border
function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;
	// cssExpand = [ "Top", "Right", "Bottom", "Left" ]
	// i：1、3与宽度相关，0、2与高度相关
	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		// extra为margin，就加上margin相关值
		// 若后面为怪异模式，不进行其他加减
		// 若后面为普通模式，加padding、border
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}
		/*
			extra为content:
				若后面为怪异模式，减padding、border
				若后面为普通模式，加padding、border
			extra为padding:
				若后面为怪异模式，减border
				若后面为普通模式，加padding
			extra为border:
				若后面为怪异模式、普通模式，不进行for处理 因为i==4
		*/
		// 怪异模式
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		// 普通模式
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		// offsetWidth：内容+内边距+边框
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		// 确定盒模型是标准的还是怪异模式
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	// offsetWidth、offsetHeight获取的值不正确使用curCSS函数获取
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		// curCSS内部使用getComputedStyle后返回值不正确使用行间样式
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		// 转数字
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
// 通过动态创建元素来判断元素的display属性值
function css_defaultDisplay( nodeName ) {
	var doc = document,
		// elemdisplay：存储标签对应的是块级还是行内
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		// display：块级、行内 ...
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		// 见cssOperate2.html  兼容iframe隐藏状态下无法获取其内部元素的display属性值
		// 多了一步创建iframe元素
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	// 动态创建元素放入body中
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		// 获取指定的属性值
		display = jQuery.css( elem[0], "display" );
	// 移除元素
	elem.remove();
	return display;
}

// 指定元素宽、高度兼容处理
jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				// rdisplayswap内定义了能隐藏元素的display对应的值
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					// 获取被隐藏元素的宽、高度(利用swap将cssShow暂时作用到指定元素上，让其可以获取高宽度)
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					// 获取marginRight值时，先将元素设置为行内块级元素
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						// 老版本webkit，设置百分比的定位，获取距上方、左方距离无法自动转化为具体px值
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	// 筛选隐藏的元素情况 $('div:hidden')
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};
	// 筛选显示的元素情况 $('div:visible')
	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
// $('div').animate({margin:"20px 30px 40px 35px"}) 
// 此cssHooks目的是将合并赋值的margin分解，marginTop:20px,marginLeft:30px,marginBottom:40px,marginRight:35px
// 方便运动效果的实现
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				// 通过空格分解
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				// 进行key-value对象数据组装
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	// 见ajax1.html
	// $('#form2').serialize()
	// $('#form2').serializeArray() --> [{name:'a', value:2+2}, {name:'b', value:3}]
	// jQuery.param( this.serializeArray() ) --> jQuery.param( $('#form2').serializeArray() )
	serialize: function() {
		// 对象数组 -> 编码并拼接的数据
		return jQuery.param( this.serializeArray() );
	},
	// 表单jq对象 -> 对象数组
	serializeArray: function() {
		// this：表单jq对象
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			// 获取表单下的所有控件
			var elements = jQuery.prop( this, "elements" );
			// 表单有控件就将控件转数组，否则是控件就直接用this
			return elements ? jQuery.makeArray( elements ) : this;
		})
		// 过滤数组
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			// 返回符合要求的jq对象：有name属性 && 没有被禁用的 && 节点名称 && 节点类型 && （选中true || 不是单复选框的true）
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		// 组合数据
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				// 下拉菜单多选情况为数组
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					// rCRLF兼容IE低版本 有的浏览器没有\r只有\n,统一替换成\r\n
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		// 通过get将jq对象数组转成dom对象数组
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
// json、数组对象序列化成字符串
// traditional：是否传统模式
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			// key、value进行编码并拼接，
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	// 没有第二个参数，会内部设置相应配置
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	// $.param([{'name':'2', 'value':'3'}])
	// 数组情况，内部遍历数组，再次调用add方法传入name和value属性进行拼接（对象必须有name和value两个属性）
	// jq对象：同上
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});
	// 其它情况
	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	// r20 == /%20/g 
	// encodeURIComponent( " " ) == %20
	// 将空格替换成+
	return s.join( "&" ).replace( r20, "+" );
};

/*处理此种情况：
	// aaa=2&aaa=3&bbb=3   传统模式
	console.log( decodeURIComponent($.param({'aaa':[2, 3], 'bbb':'3'}, true)) ); 
	// aaa[]=2&aaa[]=3&bbb=3  非传统模式（默认）
	console.log( decodeURIComponent($.param({'aaa':[2, 3], 'bbb':'3'}, false)) );
*/
// 属性，属性值。是否传统模式，回调函数(处理拼接参数)
function buildParams( prefix, obj, traditional, add ) {
	var name;
	// 情况l：数组类型  'aaa':[2, 3]
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			// 传统模式 || 本身就带[] 例如: 'aaa[]':[2, 3]
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				// prefix：'aaa'
				// v：2 或 3
				// add函数直接进行编码并拼接
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				// 将属性拼接上[属性值的类型或者空字符串]再递归
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});
	// 情况2：对象类型
	// aaa[al]=3
	// console.log( 'qqqq===', decodeURIComponent($.param({'aaa':{'al':'3'}})) ); 
	// 非传统模式（默认） && obj为对象 {'al':'3'}
	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			// 			aaa[al], '3'
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		// 其他情况直接调用add
		add( prefix, obj );
	}
}
// dom事件模块分析过
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});
// dom事件模块分析过
jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
// ---------------------
// 提交的数据和ajax()
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	// 存储7863行的load方法，后面会有新的load方法将其覆盖
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	// 直接“*/*”，压缩文件时会出现问题，为避免此问题使用concat连接
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	// 兼容IE下iframe无法获取当前页面路径location.href
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
// 给预处理器或分发处理器添加对应的处理方式  类型 对应 一个或多个函数（执行处理方式）的数组
// 使用js的柯里化原理实现
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {
		// 一个入参
		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			// 对应类型改为全部
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			// dataType可能有多个类型  --->  数组
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];
		// 函数参数
		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			// 循环取类型数组
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				// 若有+，数组头部添加
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				// structure[ dataType ]为undefined(未添加过此类型)，就赋值空数组，否则就在原数组尾部添加
				// 预处理器或分发处理器的空对象添加key-value关系
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
// 触发之前给预处理器或分发处理器添加对应的处理方式
// structurel两种情况 -> 预处理器：prefilters  分发处理器：transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		// 区分预处理器与分发处理器
		seekingTransport = ( structure === transports );
	// 具体触发操作
	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		// 遍历对象中每个类型对应多个函数
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			// 回调函数的调用
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			// 预处理器
			// jsonp、json情况下，上面的回调函数返回的script（最终通过script对应的函数判断是否跨域以及处理）
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				// 再次添加，从新调用inspect函数
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			// 分发处理器
			} else if ( seekingTransport ) {
				// 跨域情况：dataTypeOrTransport有值  return false
				// 不跨域：dataTypeOrTransport无值    return true
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}
	// inspect( options.dataTypes[ 0 ] )
	// 为true，不执行后面操作；
	// 为false，执行后面操作，再次使用普通形式调用inspect函数
	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
// src上的属性值拷贝到target上
function ajaxExtend( target, src ) {
	var key, deep,
		// jQuery.ajaxSettings.flatOptions内部设置不需要深拷贝的属性
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			// 不需要深拷贝：target[ key ] = src[ key ];
			// 需要深拷贝：deep[ key ] = src[ key ];
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}
// 见ajax2.html
// 加载目标页面
// $('#div2').load('ajax1.html #input2',function(a, b, c){});
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		// 调用原来的旧load方法，内部会触发on或trigger
		return _load.apply( this, arguments );
	}
	// this：$('#div2')
	var selector, type, response,
		self = this,
		// 判断是否需要过滤
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	// 两个参数
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	// 三个参数
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			// undefined -> false  post -> post
			type: type,
			// 返回数据为html字符串
			dataType: "html",
			// 向后台传输的数据
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				// 请求返回的字符串通过parseHTML创建dom对象数组插入动态创建的div
				// append目的是执行完，会返回被插入元素的jq对象
				// 这时再通过find过滤
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				// 不需要过滤直接将字符串插入
				responseText );
		// 不管成功还是失败都会回调complete内的函数
		// 先判断使用者是否传入回调函数callback，传入继续向下走
		}).complete( callback && function( jqXHR, status ) {
			// 实例的each方法，参数一：回调函数	  参数二：回调时的参数
			// 最终还是调用工具方法 each: function( obj, callback, args )
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
// ajax全局事件（应该属于自定义事件，主动触发时调用trigger方法）
// ajaxStart、ajaxStop：使用document触发
// 其余事件：使用相应元素或者doucment触发(想触发指定元素的事件，需要将修改默认配置中的context)
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},
	// jq中ajax内部默认配置
	ajaxSettings: {
		url: ajaxLocation, //默认值当前页面路径location.href
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ), //是否本地打开方式 例如 file://
		global: true, // 是否能触发全局事件
		processData: true, //是否需要串列化处理(false就不会对传输数据进行拼接)
		async: true, //默认异步请求
		// 默认编码格式
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0, // 超时处理：超过设置时长，调用error方法
		data: null, // 传输数据
		// 不设置此时类型，前台收响应值是通配的，无法确认后台给的值是什么类型
		dataType: null, // 指定返回类型
		username: null, // xhr发送请求，open时，服务器有可能需要验证用户名和密码
		password: null,
		cache: null, // 设置ajax是否缓存(IE下get请求很容易缓存) false:不走缓存(每次会在请求路径加上时间戳)
		throws: false, // 抛出错误 设置为true，一切错误都由控制台发出，不会通过jq
		traditional: false, // 传输给后台的数据的拼接方式
		headers: {}, // 请求头信息
		*/

		// 当设置了dataType，会在accepts：{ */* }基础上加上对应值，例如text/plain
		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},
		// 根据后台发来的响应头匹配数据是什么类型的，根据类型进行后续操作(converters默认设置)
		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},
		// 由于jqXHR是jq中模拟出来的，所以没有原生那些方法，需要映射
		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		// 防止深拷贝导致的内存泄漏问题
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	// 一个入参：配置参数与默认参数合并替换默认参数
	// 两个入参：配置参数与默认参数合赋值给空对象(不会影响默认参数)
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			// jQuery.ajaxSetup( {}, options )
			// 先将默认配置拷贝到空对象中返回对象a，再将配置参数拷贝到对象a中
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			// 直接将配置参数拷贝到默认参数中(相同属性会被覆盖)
			ajaxExtend( jQuery.ajaxSettings, target );
	},
	// 给预处理器添加相应的处理方式
	// addToPrefiltersOrTransports会返回一个函数，并且将入参保存在addToPrefiltersOrTransports中
	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	// 给分发处理器添加相应的处理方式
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	// 见ajax3.html
	// 常用使用方法：$.ajax( {url:'', dataType:'json', success:function(){}} )
	// 不常用使用方法：$.ajax( url:'', {dataType:'json', success:function(){}} )
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		// 兼容常见使用方法
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			// 防止多个ajax全部影响默认参数，内部会将配置参数与默认参数合并赋值给空对象
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			// 若指定context值为指定元素，globalEventContext指定元素的jq对象
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			// 延迟对象（用于ajax请求设置done、fail进行设置回调函数）
			deferred = jQuery.Deferred(),
			// 回调对象（）
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			// ajax请求前，使用者设置的参数
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			// 模拟出来的xhr对象，jq进行扩展
			jqXHR = {
				// 0、l、2、3、4  4：完成
				readyState: 0,

				// Builds headers hashtable if needed
				// 通过key获取响应头数据中的值
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				// 获取响应头整体数据(拼接的形式返回)
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				// 设置请求头
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				// 设置mimeType（让后台可以返回二进制流）
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				// 使用者设置statusCode配置
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						// ajax请求状态已返回
						} else {
							// Execute the appropriate callbacks
							// 执行之前配置的函数
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				// 超时等导致ajax请求失败都会调用此函数
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};
		/*
				readyState: 0
				getResponseHeader: ƒ ( key )
				getAllResponseHeaders: ƒ ()
				setRequestHeader: ƒ ( name, value )
				overrideMimeType: ƒ ( type )
				statusCode: ƒ ( map )
				abort: ƒ ( statusText )
				__proto__: Object
			}
				console.log('before Attach deferreds===', jqXHR);
		*/
		// Attach deferreds
		// 延迟对象的函数  以及回调对象的add函数
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		// done === success    fail === error  等同关系
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		/*
			readyState: 4
			getResponseHeader: ƒ ( key )
			getAllResponseHeaders: ƒ ()
			setRequestHeader: ƒ ( name, value )
			overrideMimeType: ƒ ( type )
			statusCode: ƒ ( map )
			abort: ƒ ( statusText )

			state: ƒ ()
			always: ƒ ()
			then: ƒ ()
			promise: ƒ ( obj )
			pipe: ƒ ()
			done: ƒ ()
			fail: ƒ ()
			progress: ƒ ()
			complete: ƒ ()
			success: ƒ ()
			error: ƒ ()
			status: 404
			statusText: "error"
			__proto__: Object

			最终$.ajax()的返回值就是jqXHR
			console.log('after Attach deferreds===', jqXHR);
		*/
		

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		// 地址中的hash值去除	  // -> http:// (http:是在当前页面的路径中截取的)
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		// 请求方式
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		// dataType:"json html xml" -> ["json", "html", "xml"]
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		// 默认不配置crossDomain属性为null，if内部会判断是否跨域
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			// 不同就是跨域（jsonp跨域时通过动态创建script，不跨域时使用ajax基础方法）
			s.crossDomain = !!( parts &&
				// 头部是否相同  主体是否相同  
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					// 端口号是否相同
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		// 是否序列化数据（将对象转化为编码后拼接的字符串）
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		// 调用预处理器对应的处理方式
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		// state为2证明请求已完成，直接返回
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// 全局变量
		fireGlobals = s.global;

		// Watch for a new set of requests
		// 在没有请求ajax前，先把doucment元素上的ajaxStart事件触发
		if ( fireGlobals && jQuery.active++ === 0 ) {
			// 没有指定元素触发trigger，默认使用document元素
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		// 大写请求方式的类型
		s.type = s.type.toUpperCase();

		// Determine if request has content
		// get||head：把参数拼接到网址的后面
		// post：通过send发送
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			// get || head
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			// 不需要缓存方式(网址拼接随机数)
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		// 设置此字段，通过与后端配合，可以达到数据不改变走缓存效果
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		// 使用者添加的header信息
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		// 映射配置项中指定属性
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			// 调用延迟对象的相应方法，参数为使用者配置的
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		// 分发器会返回一个函数
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		// 无值 -> 停止
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			// 改请求状态
			jqXHR.readyState = 1;

			// Send global event
			// 触发指定元素的ajaxSend事件
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			// 超时调用错误回调，无超时继续向下执行
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				// 调用元素的send方法
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		// 请求成功
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			// 停掉延迟
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			// 处理原生xhr返回的数据
			// {text：“jQuery24355456459966966({"name":"hello"})”}
			if ( responses ) {
				// 在返回结果中取需要的数据
				response = ajaxHandleResponses( s, jqXHR, responses );
				// jQuery24355456459966966({"name":"hello"})
			}

			// Convert no matter what (that way responseXXX fields are always set)
			// 将需要的字符串数据转换成相应类型数据
			response = ajaxConvert( s, response, jqXHR, isSuccess );
			// {data:{"name":"hello"}, state:success}

			// If successful, handle type chaining
			// 响应成功
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			// 失败
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				// 触发done函数
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				// 触发fail函数
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;
			// ajax请求回调成功后
			// 触发指定元素对应的成功/失败的回调
			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			// 触发指定元素对应的ajaxComplete/ajaxStop的回调
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},
	// 见ajax2.html
	// 固定响应值类型为JSON的get请求
	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},
	// 见ajax2.html
	// 固定响应值类型为Script的get请求 && 无传入后台的参数
	getScript: function( url, callback ) {
		// 后台返来的不是script类型，无法获取数据
		return jQuery.get( url, undefined, callback, "script" );
	}
});
// 见ajax2.html
jQuery.each( [ "get", "post" ], function( i, method ) {
	// (目标接口，传入后台的参数，成功的回调，后台返回的数据类型dataType)
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		// 无传入后台的参数
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}
		// ajax请求
		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
// 通过dataType获取后台响应值中需要的数据（前台指定的，前台没指定就返回后台数据可以正常转换的数据）
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	// 如果前台没有设置dataTypes，取后台响应值中Content-Type属性值
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	// 判断后台返回数据是否有前台设置指定的类型值
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			// 判断数据是否可以正常转换
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
// 判断ajax返回值具体类型，比对请求前配置参数
// 将字符串数据使用指定的方法进行转换
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					// 若配置了默认参数，使用控制台错误提示
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							// 解析错误，jq返回错误
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
// 预处理器(在发送请求前进行预处理)
// 实际走的函数是addToPrefiltersOrTransports，这个是此函数的第二次入参
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		// script标签不需要缓存
		s.cache = false;
	}
	if ( s.crossDomain ) {
		// 跨域情况下必须是GET请求
		s.type = "GET";
	}
});

// Bind script tag hack transport
// 分发处理器
// 跨域情况：动态创建script(另一种情况 在9073行)
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	// 跨域情况 有返回值（不跨域，没有返回值）
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				// 动态创建script的方式
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				// 成功的还需要在头部进行相应script标签
				document.head.appendChild( script[ 0 ] );
			},
			// 发生错误
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
// 修改jq内部默认参数ajaxSettings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
// json、jsonp的预处理(s默认配置，originalSettings，jqXHR模拟的xhr)
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		// 是否有jsonpCallback函数（通过jQuery.ajaxSetup函数设置的）
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			// jsonp请求路径最后的随机函数名是调用jsonpCallback函数的返回值
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			// 返回成功回调success的入参
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		// 接收指定页面的回调随机数函数的传参
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script（交给script类型对应的预处理函数判断是否跨域，进行相应处理）
		return "script";
	}
});
// 创建原生xhr对象
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	// 状态码兼容处理
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}
// xhrSupported是否支持xhr  "withCredentials"是否支持跨域
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

// 分发处理器
// 不跨域情况：使用ajax请求
jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	// 不跨域的情况
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					// 配置参数ajaxSettings中xhr对应函数
					// 创建原生xhr对象
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				// copy使用者配置的属性
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				// 是否有跨域处理
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				// 设置请求头
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								// 终止操作
								xhr.abort();
							} else if ( type === "error" ) {
								// 错误操作
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								// 完成操作
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				// 原生的相关回调会在callback函数内统一处理
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});

// ---------------------------------------
// animate()：运动的方法
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			// $('#div2').animate({width:'50%'}, 2000)
			// jq对象
			var tween = this.createTween( prop, value ),
				// 20
				target = tween.cur(),
				// {width:'50%'} 获取值 -> ["50%", undefined, "50", "%", index: 0, input: "50%", groups: undefined]
				parts = rfxnum.exec( value ),
				// 获取单位 -> %   默认是px
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				// start -> ["20px", undefined, "20", "px", index: 0, input: "20px", groups: undefined]
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;
			// px与%不等，执行if判断内的语句
			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;
				// 内部目前只知道当前元素为20px，通过改为20px为20%，在取到20%对应的具体px值a，20px/a = b/20%求出b值
				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					// 设置20%的样式
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				// tween.cur()获取当前元素的px值(获取的px值/20)
				// scale不等于1就结束循环
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			// $('#div2').animate({ width: '+=200'}, 2000);
			// parts[ 1 ] -> +=\-=
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					// 有加减运算，在原有基础进行相加
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					// 无加减运算，使用指定值
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
// 返回本地时间(1970年到现在的毫秒数)
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		// 在全局变量下取指定的属性与tweeners[ "*" ]合并
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		// 循环调用函数有值就return(此回调函数的指向的animation)
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}
/*
	// $('#div2').animate({width:400}, {
	//     duration: 4000,
	//     easing: 'linear',
	//     complete: function(){
	//         alert(234);
	//     }
	// })
*/
// animate方法内部调用的是Animation( $('#div2')，{width:400}，{duration: 4000, easing: 'linear'} )
// Animation内部会调用propFilter、defaultPrefilter、createTween
function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		// 使用延迟对象来控制多个异步的执行顺序
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		// 运动简单说就是定时器，tick就是定时器定时调用的函数(动态改变css样式)
		// 定时器每隔13毫秒调用tick，一直到指定的毫秒数，停止定时器
		tick = function() {
			if ( stopped ) {
				return false;
			}
			// 当前时间(没有记录时间，就调用函数生成)
			var currentTime = fxNow || createFxNow(),
				// 开始时间(固定不变) + 时间间隔 - 当前时间(每次运动都会变大) <= 0
				// (animation.duration, 0)
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				//  1 ~ 0
				temp = remaining / animation.duration || 0,
				//  0 ~ 1 (由于是定时器调用，增值是稳定有规律的)
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;
			// 循环调用之前存入的不同属性对应的运动
			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}
			// 对应progress函数
			deferred.notifyWith( elem, [ animation, percent, remaining ]);
			// percent小于1，运动还没达到指定时间，没有结束
			if ( percent < 1 && length ) {
				return remaining;
			} else {
				// 完成状态触发done函数并返回false，最终会被把此运动函数清除
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		// 内部存储需要许多变量以及函数
		animation = deferred.promise({
			// 指定元素
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			// 开始时间(没有记录时间，就调用函数生成)
			startTime: fxNow || createFxNow(),
			// 总时间
			duration: options.duration,
			// 存储运动的数组(每有一个属性对应一个运动)
			tweens: [],
			// 使用者调用animate传入的props每有一个属性，就会调用一次
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				// 放入一个实例对象(tween为运动算法)
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					// 直接运行到percent为1，页面显示当前运动结束的效果
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;
	// 兼容specialEasing参数的写法、属性对应数组的写法、处理复合样式
	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		// animationPrefilters内部存储的是defaultPrefilter函数
		// 调用此函数：处理queue参数、运动过程中防止元素溢出、防止布局出问题
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}
	// 循环使用者设置对象中的每个属性，调用createTween函数
	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}
	// 将指定函数加入定时调用函数内
	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	// progress：运动过程调用的函数
	// done：运动成功
	// fail：运动失败
	// always：不管什么情况，都会调用的函数
	// $('#div2').animate({ width: 300}, { progress:function(){ console.log(234);} });
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}
// 兼容specialEasing参数的写法、属性对应数组的写法、处理复合样式
function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		/*
		// specialEasing是aninmate写法中的参数二，支持将属性值变换的运动方式定义在参数二中
		$('#div2').animate({ width: 200, height:20}, {
			specialEasing: {
				width : 'linear',
				height: 'swing'
			}
		});
		*/
		easing = specialEasing[ name ];
		value = props[ index ];
		// 兼容此种方式(每个属性值变换的运动形式不同) $('#div2').animate({ width: [200, 'linear']}, 2000);
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}
		// 兼容处理复合样式(margin, padding, borderWidth)
		// 将margin转化为marginTop、marginRight、marginBottom、marginLeft
		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			// 调用兼容对象的expand函数
			value = hooks.expand( value );
			// 将使用者的设置的属性删除
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			// 遍历时需要先判断使用者是否设置了指定复合样式的字样式，没设置再复制对应的四种字样式
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {
	// 使用者可以通过此函数向tweeners中加载处理方式，目前jq内部只是一个通配符*对应的操作
	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},
	// animationPrefilters = [ defaultPrefilter ]
	// 使用者通过此函数可以增加预处理操作，prepend参数决定，放defaultPrefilter前还是后
	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});
// 处理queue参数、运动过程中防止元素溢出、防止布局出问题
function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	// 配置参数中queue为false，当前运动不会立刻fire，等到最后一个运动统一触发
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			// 先存储一下
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				// 符合判断条件在，再调用存储的函数 -> 0
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	// 在width与height动态改变时，会给指定元素设置overflow属性，防止运动过程中内容溢出，最终会恢复原状
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		// 这里先存储一下指定元素原来对应overflow的样式
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		// 防止布局出现问题，内部加样式进行处理
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		// 给指定元素设置overflow属性
		style.overflow = "hidden";
		// 运动执行过后，再将指定元素原来的样式赋值回来
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	// $('#div2').animate({width:'hide', height:'hide', opacity:'hide'}, 2000, 'linear', function(){})
	// 处理width、height、opacity为show、hide、toggle情况
	for ( prop in props ) {
		value = props[ prop ];
		// 符合show、hide、toggle情况
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			// 默认toggle为undefined，赋值value === "toggle"的返回值
			toggle = toggle || value === "toggle";
			// 使用者操作元素显隐目的 === 指定元素是否隐藏标志量 ？"hide" : "show"
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					// 指定元素是隐藏的，调用隐藏方法
					continue;
				}
			}
			// 缓存没有值，使用style方法获取指定元素的属性值
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}
	// orig有值
	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		// 切换状态专用
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		// 隐藏状态元素
		if ( hidden ) {
			// 运动前调用
			jQuery( elem ).show();
		// 显示状态元素
		} else {
			// 运动后调用
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		// 运动过程中设置属性
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		// 运动方式默认swing
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	// 获取当前元素的px值
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];
		// 是否配置时间参数
		if ( this.options.duration ) {
			// 在jQuery.easing中取运动方式
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		// 变化值 == 间距 * 比例值 + 起始位置
		this.now = ( this.end - this.start ) * eased + this.start;
		/*
		$('#div2').animate({ width: 300}, {
			progress:function(){
				console.log(234);
			},
			step:function(){
				console.log(666);
			}
		});
		*/
		// step和progress一致，在运动过程中多次调用，将部分参数传入
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}
		// 兼容性处理
		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			// 将当前变化值传入
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			// 获取指定元素指定属性值
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			// 没值 || "auto" 返回0
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			// 使用者的配置参数step
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			// 
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				// 设置有单位的值
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				// 设置没有单位的值
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
// 兼容滚动条滑动 见animate4.html
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			// 设置指定元素scrollTop属性
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	// 没有运动效果的隐藏和显示方法
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			// 没有运动
			cssFn.apply( this, arguments ) :
			// 有运动
			// $('#div2').hide(2000); -> $('#div2').animate({width:'hide', height:'hide', opacity:'hide'}, 2000)
			// genFx( name, true ) -> {width:'hide', height:'hide', opacity:'hide'}
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	// 见animate1.html  针对隐藏元素也可以生效
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		// 过滤出隐藏的设置透明度为0，调用show方法让其显示出来，出栈后对其进行运动处理
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		// prop：{} -> empty：true	 prop：有值 -> empty：false
		var empty = jQuery.isEmptyObject( prop ),
			// 进行数据重组，从animate写法一转化为写法写法二(主要是后三个入参改为一个对象)以及complete函数内增加出队操作
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				// 
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			// 对外API的finish函数内部调用的此finish方法
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			// 没有运动
			this.each( doAnimation ) :
			// 有运动（doAnimation函数入队列）
			this.queue( optall.queue, doAnimation );
	},
	// 见animate5.html
	// 停止元素运动(队列名 默认fx，是否清除队列，元素样式是否变为当前运动完的效果)
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		// $('#div2').stop(true); //停止当前运动，会影响队列的后续运动
		if ( clearQueue && type !== false ) {
			// 队列清空
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					// $('#div2').stop(true); //停止当前运动，会影响队列的后续运动
					// $('#div2').stop(true, true); //停止当前运动，会影响队列的后续运动.元素样式是当前运动结束后的样式
					timers[ index ].anim.stop( gotoEnd );
					// 由于clearQueue变量为true导致队列清空，不会出队操作
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			// $('#div2').stop();  //默认的，停止当前运动，不会影响队列的后续运动
			if ( dequeue || !gotoEnd ) {
				// 出队，继续后续运动
				jQuery.dequeue( this, type );
			}
		});
	},
	// 见animate5.html
	// $('#div2').finish(); //停止当前运动，会影响队列的后续运动,元素样式是最终所有运动结束的样式
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					//停止当前运动，会影响队列的后续运动
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					// 元素样式是最终所有运动结束的样式
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
// genFx('hide', true) -> {width:'hide', height:'hide', opacity:'hide'}  还会有margin、padding的上下左右四个参数
// 有参数二：在height的基础上增加opacity、width属性(margin、padding的上下左右四个参数都会有)；
// 没有参数二：height(margin、padding的上下两个参数会有)
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	// 有第二个参数 margin、padding的上下左右四个参数都会有
	// 没有第二个参数 margin、padding的上下两个参数会有
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		// cssExpand = [ "Top", "Right", "Bottom", "Left" ],
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}
	// 有参数二，增加opacity、width属性
	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
// 对外提供的运动接口，部分的props是写死的
// slideDown、slideUp、slideToggle是动态获取
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	// speed && typeof speed === "object" ? 写法二 ： 写法一  ->  最终都会转化为写法二
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		// 每个 || 对应一种情况
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};
	// 设置此参数jQuery.fx.off，所有运动过程的效果取消，直接显示最终效果 
	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		//duration除数字外还可以设置字符串，jQuery.fx.speeds中默认了可选的速度
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	// 默认队列名
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	// 使用者的complete只是完成时候要触发的逻辑
	// 内部jq除触发使用者设置的函数，还需要执行出队操作
	// 所以jq中将complete函数进行重新组装
	opt.old = opt.complete;

	opt.complete = function() {
		// 触发使用者设置的回调
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}
		// 触发出栈操作
		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};
// 见animate3.html
// 运动模式，jq只实现了两种模式，若想扩展，请百度tween算法
// jq调用jQuery.easing内的函数，传入五个参数，第一个参数是为了linear、swing使用的
// tween算法只会使用后四个参数,详情参考test
jQuery.easing = {
	// 缓冲：先快后慢  参数：0 ~ 1 
	linear: function( p ) {
		return p;
	},
	// 匀速
	swing: function( p ) {
		// Math.cos( p*Math.PI ) 
		// 在坐标系中是有波峰波谷的余弦函数，波谷是负数
		// 加负号，对其进行翻转；+0.5：对其进行上移；/2:变窄还是变宽？
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	},
	test: function(jq, t, b, c, d, s){
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;
	// 记录一个时间
	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		// 调用animate对象中运动函数tick，必须返回false
		if ( !timer() && timers[ i ] === timer ) {
			// 去除执行后的函数
			timers.splice( i--, 1 );
		}
	}
	// for一直去除，最终所有运动结束，调用stop方法
	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	// 先执行函数，再推入定时器数组，再调用开始函数
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

// 最适合：1秒钟变60次  大概16毫秒
jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		// 开启定时器
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	// 清除定时器
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}


// -------------------------------------------------
// offset() position()：位置和尺寸的方法

// offset设置值是相对于浏览器屏幕的
// 有参数：设置；无参数：获取top、left
jQuery.fn.offset = function( options ) {
	// 设置参数
	if ( arguments.length ) {
		return options === undefined ?
			// 写法有误
			this :
			// 遍历指定元素集合，设置
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}
	// 获取参数
	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		// 通过当前元素找到document文档对象
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}
	// 通过document的documentElement属性找到html对象
	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	// 元素是否包含在html内
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		// getBoundingClientRect函数可以获取到一些关于元素的属性值(相对于可视区域的)
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		// box.top(相对于可视区域顶部的距离) + 	win.pageYOffset(y轴滑动距离) - docElem.clientTop(html边框的宽度，一般都为0)
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {
	// 见offsetOrPosition1.html
	// 设置指定元素的指定属性(指定元素，使用者设置的属性，元素集合中的位置)
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		// 无定位元素加上相对定位
		if ( position === "static" ) {
			elem.style.position = "relative";
		}
		// 获取指定对象相对于浏览器的top、left值
		curOffset = curElem.offset();
		// 获取指定对象的top、left值
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		// 指定元素是否为绝对、固定定位
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		// 指定元素是为绝对、固定定位（获取元素间的距离）
		if ( calculatePosition ) {
			// 获取指定对象相对于有定位的祖先元素的top、left值
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		// 指定元素不为绝对、固定定位	
		} else {
			// 相对定位的情况
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}
		// 支持传入参数为函数
		if ( jQuery.isFunction( options ) ) {
			// 回调给函数，当前元素的top、left值
			// 等待回调给返回指定元素top、left目标值
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			// 用户期望top值 - 当前距离浏览器的top值 + 指定元素与祖先元素间的距离
			// $('#div3').offset({left:200, top:200});
			// 200 - 250 + 0
			props.left = ( options.left - curOffset.left ) + curLeft;
		}
		// 支持配置参数中设置using回调(不常用)
		if ( "using" in options ) {
			options.using.call( elem, props );
		// 调用css函数设置计算后的样式
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	// position 获取指定元素与有定位效果的祖先元素的距离,无定位的祖先元素，结果就与offset()一致
	// 有参数：设置；无参数：获取top、left
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		// 固定定位（只是相对于浏览器屏幕的）
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			// 获取指定元素相对于浏览器屏幕的top、left值
			offset = this.offset();
			// 如果第一个父级元素不为html，取相对于浏览器屏幕的top、left值
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			// 父级加上边框的宽度
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			// 指定元素的top、left值 - 父级元素的top、left值 - 指定元素的marginTop、marginLeft值（position不会计算指定元素的margin值）
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},
	// 寻找每个指定元素有定位的祖先元素(内部使用原生js的offsetParent查找)
	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			// 满足 有父级元素 && 此父级元素不是html元素 && 父级元素的position为static默认值，就接着向上找父级元素
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
// 获取滚动距离(使用原生js中pageXOffset进行获取)
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	// 区分left还是top
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );
			// 获取值(全部使用原生js)
			if ( val === undefined ) {
				// window ? window[pageYOffset] : elem[scrollTop]
				return win ? win[ prop ] : elem[ method ];
			}
			// 设置值
			// window下的设置(通过调用scrollTo到指定位置)
			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);
			// 指定元素的设置(设置指定元素的scrollTop属性值)
			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});
// 获取window对象
function getWindow( elem ) {
	// window返回本身,doucment返回defaultView属性
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
// 对外提供获取、设置指定元素的宽高方法
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		// funcName --> defaultExtra
		// width、height --> content
		// innerWidth、innerHeight --> padding
		// outerWidth、outerHeight --> margin(需要传参数true) || border
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				// width、innerWidth：使用defaultExtra
				// outerWidth情况：margin或者value为true，计算上margin；否则，只计算到border
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;
				// 是否为window对象
				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					// 返回可视区域的宽、高
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				// 是否为document对象
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					// 最大的上
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					// 获取元素属性值
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					// 设置元素属性值
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
// jq对象集合通过size函数获取长度(也可以通过length属性直接获取)
jQuery.fn.size = function() {
	return this.length;
};
// 兼容老版本的jq
jQuery.fn.andSelf = jQuery.fn.addBack;

// })();

// -------------------------------
// 支持模块写法


// 通过module模块引入(CMD规范)
// seajs官网有demo说明如何把jquery引入，他会在jquery源码外层加上
// define(function(require, exports, module){
// 	jQuery源码
// })
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	// CMD方式对外提供接口
	module.exports = jQuery;
// require方式 (AMD规范)
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	// 判断是否AMD模块加载
	if ( typeof define === "function" && define.amd ) {
		// define(模块标识，所依赖的模块，模块的实现或者js对象)
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );
