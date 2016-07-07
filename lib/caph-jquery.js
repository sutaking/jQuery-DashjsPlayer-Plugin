/* CAPH v3.0.1-160705 @ 2016-07-05 10:35:27 */

/**
 * Copyright (c) 2014 Samsung Electronics Co., Ltd All Rights Reserved 
 * PROPRIETARY/CONFIDENTIAL
 *  
 * This software is the confidential and proprietary information of SAMSUNG 
 * ELECTRONICS ("Confidential Information"). You shall not disclose such 
 * Confidential Information and shall use it only in accordance with the terms of 
 * the license agreement you entered into with SAMSUNG ELECTRONICS. SAMSUNG make 
 * no representations or warranties about the suitability of the software, either 
 * express or implied, including but not limited to the implied warranties of 
 * merchantability, fitness for a particular purpose, or non-infringement. 
 * SAMSUNG shall not be liable for any damages suffered by licensee as a result 
 * of using, modifying or distributing this software or its derivatives.
 */


(function(window, document, $) {
	'use strict';
	
	/**
	 * @name jQuery.caph.focus.Constant
	 * @memberOf jQuery.caph.focus
	 * @kind constant
	 *
	 * @description Constants.
	 */
	var Constant = {
		/**
		 * @name jQuery.caph.focus.Constant.DIRECTION
		 * @memberOf jQuery.caph.focus.Constant
		 * 
		 * @description Represents 4-way direction.
		 */
		DIRECTION: {
			/**
			 * @name jQuery.caph.focus.Constant.DIRECTION.LEFT
			 * @memberOf jQuery.caph.focus.Constant.DIRECTION
			 * 
			 * @description Represents left direction.
			 */
			LEFT: 'left',
			/**
			 * @name jQuery.caph.focus.Constant.DIRECTION.RIGHT
			 * @memberOf jQuery.caph.focus.Constant.DIRECTION
			 * 
			 * @description Represents right direction.
			 */
			RIGHT: 'right',
			/**
			 * @name jQuery.caph.focus.Constant.DIRECTION.UP
			 * @memberOf jQuery.caph.focus.Constant.DIRECTION
			 * 
			 * @description Represents up direction.
			 */
			UP: 'up',
			/**
			 * @name jQuery.caph.focus.Constant.DIRECTION.DOWN
			 * @memberOf jQuery.caph.focus.Constant.DIRECTION
			 * 
			 * @description Represents down direction.
			 */
			DOWN: 'down'			
		},
		/**
		 * @name jQuery.caph.focus.Constant.DEFAULT
		 * @memberOf jQuery.caph.focus.Constant
		 * 
		 * @description Default values.
		 */
		DEFAULT: {
			/**
			 * @name jQuery.caph.focus.Constant.DEFAULT.DEPTH
			 * @memberOf jQuery.caph.focus.Constant.DEFAULT
			 * 
			 * @description Default depth is 0.
			 */
			DEPTH: 0,
			/**
			 * @name jQuery.caph.focus.Constant.DEFAULT.GROUP
			 * @memberOf jQuery.caph.focus.Constant.DEFAULT
			 * 
			 * @description Default group is 'default'.
			 */
			GROUP: 'default',
			/**
			 * @name jQuery.caph.focus.Constant.DEFAULT.KEY_MAP
			 * @memberOf jQuery.caph.focus.Constant.DEFAULT
			 * 
			 * @description Default key map.
			 */
			KEY_MAP: {
				/**
				 * @name jQuery.caph.focus.Constant.DEFAULT.KEY_MAP.LEFT
				 * @memberOf jQuery.caph.focus.Constant.DEFAULT.KEY_MAP
				 * 
				 * @description Default left key is 37.
				 */
				LEFT: 37,
				/**
				 * @name jQuery.caph.focus.Constant.DEFAULT.KEY_MAP.RIGHT
				 * @memberOf jQuery.caph.focus.Constant.DEFAULT.KEY_MAP
				 * 
				 * @description Default right key is 39.
				 */
				RIGHT: 39,
				/**
				 * @name jQuery.caph.focus.Constant.DEFAULT.KEY_MAP.UP
				 * @memberOf jQuery.caph.focus.Constant.DEFAULT.KEY_MAP
				 * 
				 * @description Default up key is 38.
				 */
				UP: 38,
				/**
				 * @name jQuery.caph.focus.Constant.DEFAULT.KEY_MAP.DOWN
				 * @memberOf jQuery.caph.focus.Constant.DEFAULT.KEY_MAP
				 * 
				 * @description Default down key is 40.
				 */
				DOWN: 40,
				/**
				 * @name jQuery.caph.focus.Constant.DEFAULT.KEY_MAP.ENTER
				 * @memberOf jQuery.caph.focus.Constant.DEFAULT.KEY_MAP
				 * 
				 * @description Default enter key is 13.
				 */
				ENTER: 13
			},
			/**
			 * @name jQuery.caph.focus.Constant.DEFAULT.DISTANCE_CALCULATION_STRATEGY
			 * @memberOf jQuery.caph.focus.Constant.DEFAULT
			 * 
			 * @description Default distance calculation strategy is 'default'.
			 */
			DISTANCE_CALCULATION_STRATEGY: 'default'
		}
	};
	
	var sequence = 0;
	
	/**
	 * @name jQuery.caph.focus.Util.NameGenerator
	 * @memberOf jQuery.caph.focus.Util
	 * 
	 * @description Gets a unique sequential name.
	 */
	var NameGenerator = {
		/**
		 * @name jQuery.caph.focus.Util.NameGenerator.get
		 * @memberOf jQuery.caph.focus.Util.NameGenerator
		 * @kind function
		 *
		 * @description Gets a unique sequential name.
		 * @returns {string}
		 */
		get: function() {
			return 'focusable-' + sequence++;
		}
	};
	
	var NAMESPACE = '.focusable';
	
	var MOUSE_EVENTS = {
		mouseover: 'focus',
		mouseout: 'blur'
	};

	if('undefined' !== typeof window.Hammer) {
		MOUSE_EVENTS.tap = 'select';
		MOUSE_EVENTS.doubletap = 'select';
	} else {
		MOUSE_EVENTS.click = 'select';
	}
	
	var FOCUSABLE_EVENTS = ['focused', 'blurred', 'selected'];
	
	/**
	 * @name jQuery.caph.focus.Util
	 * @memberOf jQuery.caph.focus
	 * @kind constant
	 * 
	 * @description Utility functions for jQuery.caph.focus plugin.
	 */
	var Util = {
		NameGenerator: NameGenerator,
		
		/**
		 * @name jQuery.caph.focus.Util.isFocusable
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Determines whether the given item is focusable or not.
		 * 
		 * @param {DOMElement|jQuery} item The target object. If target object is an instance of jQuery, determines with the first element in the set of matched elements.
		 * @returns {boolean}
		 */
		isFocusable: function(item) {
			return isElementNode(item = getElementNode(item)) && item.getAttribute('focusable') !== null;
		},
		
		/**
		 * @name jQuery.caph.focus.Util.isElement
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Determines whether the given item is DOM element or not.
		 * 
		 * @param {DOMElement|jQuery} item The target object. If target object is an instance of jQuery, determines with the first element in the set of matched elements.
		 * @returns {boolean} 
		 */
		isElement: function(item) {
			return isElementNode(getElementNode(item));
		},
		
		/**
		 * @name jQuery.caph.focus.Util.isVisible
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Determines whether the given item is DOM element or not.
		 * 
		 * @param {DOMElement|jQuery} item The target object. If target object is an instance of jQuery, determines with the first element in the set of matched elements.
		 * @returns {boolean} 
		 */
		isVisible: function(item) {
			if (isElementNode(item = getElementNode(item))) {
				while (item) {
					if ($.css(item, 'display') === 'none' || $.css(item, 'visibility') === 'hidden') { // TODO need to check opacity?
						return false;
					}
					
					item = item.parentElement;
				}
				
				return true;
			}
			
			return false;
		},
		
		/**
		 * @name jQuery.caph.focus.Util.getElement
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Gets DOM element from the given item.
		 * 
		 * @param {DOMElement|jQuery} item The target object. If target object is an instance of jQuery, gets from the first element in the set of matched elements.
		 * @returns {DOMElement} Returns DOMElement object if the given item is a jQuery or DOMElement object. If not, returns null.  
		 */
		getElement: function(item) {
			return isElementNode(item = getElementNode(item)) ? item : null;
		},
		
		/**
		 * @name jQuery.caph.focus.Util.getData
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Gets the focusable related data from the given item's data object.
		 * 
		 * @param {DOMElement|jQuery} item The target object. If target object is an instance of jQuery, gets from the first element in the set of matched elements.
		 * @returns {Object} Returns a focusable data object. If the given item is not focusable, returns null.  
		 */
		getData: function(item) {
			if (!Util.isFocusable(item)) {
				return null;
			}
			
			return getFocusableData(getElementNode(item));
		},
		
		/**
		 * @name jQuery.caph.focus.Util.setData
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description 
		 *  Sets the focusable related data to the given item's data object.
		 *  If focusable data is not provided, gets the already specified values from the given item's data object, and then uses it as a focusable data.
		 *  The values which are not designated fill with default value.
		 * 
		 * @param {DOMElement|jQuery} item The target object.
		 * @param {Object} [option] The focusable data.
		 * @returns {String} Returns the given item's specified or generated name. If the given item is not focusable, returns null.
		 */
		setData: function(item, option) {
			if (!Util.isFocusable(item)) {
				return null;
			}
			
			return setFocusableData(item = getElementNode(item), option && $.extend(getFocusableData(item), option) || getFocusableData(item));
		},
		
		/**
		 * @name jQuery.caph.focus.Util.bindMouseEvent
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Attaches mouse events (such as mouseover, mouseout and click) handler to the given element.
		 * 
		 * @param {DOMElement|jQuery} item The target object.
		 * @param {Function} callback An event handler.
		 * @returns {jQuery.caph.focus.Util}
		 */
		bindMouseEvent: function(element, callback) {
			if (Util.isElement(element)) {
				Object.keys(MOUSE_EVENTS).forEach(function(mouseEvent) {
					$(element).on(mouseEvent + NAMESPACE, {
						method: MOUSE_EVENTS[mouseEvent]
					}, callback);
				});
			}
			return this;
		},
		
		/**
		 * @name jQuery.caph.focus.Util.bindFocusableEvent
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Attaches focusable events (such as focused, blurred and selected) handler to the given element.
		 * 
		 * @param {DOMElement|jQuery} item The target object.
		 * @param {Function} callback An event handler.
		 * @returns {jQuery.caph.focus.Util}
		 */
		bindFocusableEvent: function(element, callback) {
			if (Util.isElement(element)) {
				FOCUSABLE_EVENTS.forEach(function(focusableEvent) {
					$(element).on(focusableEvent + NAMESPACE, callback);
				});
			}
			return this;
		},
		
		/**
		 * @name jQuery.caph.focus.Util.unbindEvent
		 * @memberOf jQuery.caph.focus.Util
		 * @kind function
		 *
		 * @description Removes all attached focusable related event handlers.
		 * 
		 * @param {DOMElement|jQuery} item The target object.
		 * @returns {jQuery.caph.focus.Util}
		 */
		unbindEvent: function(element) {
			if (Util.isElement(element)) {
				$(element).off(NAMESPACE);
			}
			return this;
		}
	};
	
	function toString(data) {
		return data && data + '';
	}
	
	function getFocusableData(item) {
		var data = $(item).data();
		var nextFocus = {};
		
		Object.keys(Constant.DIRECTION).forEach(function(key) {
			var direction = Constant.DIRECTION[key];
			var property = 'focusableNextFocus' + capitalize(direction);
			var value = data[property];
			
			if (value || value === null) {
				nextFocus[direction] = toString(value);
			}
		});
		
		return {
			depth: data.focusableDepth,
			group: toString(data.focusableGroup),
			name: toString(data.focusableName),
			initialFocus: data.focusableInitialFocus,
			disabled: data.focusableDisabled,
			nextFocus: nextFocus
		};
	}
	
	function setFocusableData(item, option) {
		item = $(item);
		
		item.data({
			focusableDepth: $.isNumeric(option.depth) ? option.depth : Constant.DEFAULT.DEPTH,
			focusableGroup: option.group || Constant.DEFAULT.GROUP,
			focusableName: option.name || NameGenerator.get(),
			focusableInitialFocus: option.initialFocus === true,
			focusableDisabled: option.disabled === true
		});
		
		option.nextFocus && Object.keys(option.nextFocus).forEach(function(direction) {
			var property = 'focusableNextFocus' + capitalize(direction);
			var value = option.nextFocus[direction];
			
			if (value || value === null) {
				item.data(property, value);
			} 
		});
		
		return item.data('focusableName');
	}
	
	function getElementNode(target) {
		return target && (target instanceof $) ? target[0] : target;
	}
	
	function isElementNode(target) {
		return target && target.nodeType === Node.ELEMENT_NODE ? true : false;
	}
	
	function capitalize(str) {
		return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
	}
	
	/**
	 * @name jQuery.caph.focus.nearestFocusableFinderProvider
	 * @memberOf jQuery.caph.focus
	 * 
	 * @description The nearest focusable finder provider.
	 */
	function NearestFocusableFinderProvider() {
		var instance = null;
		
		var strategies = {};
		var beforeDistanceCalculationHandlers = [];
		var currentDistanceCalculationStrategy = Constant.DEFAULT.DISTANCE_CALCULATION_STRATEGY;
		
		function getPosition(target) {
			var element = $(target);
			var offset = element.offset();
			
			return {
				left: offset.left,
				top: offset.top,
				width: element.width(),
				height: element.height()
			};
		}
		
		strategies[Constant.DEFAULT.DISTANCE_CALCULATION_STRATEGY] = (function() {
			var OPPOSITE_DIRECTION = {
				left: 'right',
				right: 'left',
				up: 'down',
				down: 'up'
			};
			
			function getMiddlePointOnTheEdge(position, direction) {
				var point = {
					x: position.left,
					y: position.top
				};
				
				switch (direction) {
				case Constant.DIRECTION.RIGHT: // when direction is right or left 
					point.x += position.width;
				case Constant.DIRECTION.LEFT:
					point.y += position.height / 2;
					break;
				case Constant.DIRECTION.DOWN: // when direction is down or up 
					point.y += position.height;
				case Constant.DIRECTION.UP:
					point.x += position.width / 2;
					break;
				}
				
				return point;
			}
			
			function isCorrespondingDirection(fromPoint, toPoint, direction) {
				switch(direction) {
				case Constant.DIRECTION.LEFT: 
					return fromPoint.x >= toPoint.x;
				case Constant.DIRECTION.RIGHT:
					return fromPoint.x <= toPoint.x;
				case Constant.DIRECTION.UP:
					return fromPoint.y >= toPoint.y;
				case Constant.DIRECTION.DOWN:
					return fromPoint.y <= toPoint.y;
				}
				
				return false;
			}
			
			return function(from, to, direction) {
				var fromPoint = getMiddlePointOnTheEdge(from, direction);
				var toPoint = getMiddlePointOnTheEdge(to, OPPOSITE_DIRECTION[direction]);
				
				if (isCorrespondingDirection(fromPoint, toPoint, direction)) {
					return Math.sqrt(Math.pow(fromPoint.x - toPoint.x, 2) + Math.pow(fromPoint.y - toPoint.y, 2));
				}
				
				return Infinity;
			};
		})();
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.registerDistanceCalculationStrategy
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description Registers a custom distance calculation strategy.
		 * 
		 * @param {string} name The strategy name.
		 * @param {Function} strategy 
		 *  A function which calculates distance between elements. This function takes three arguments.
		 *  The first and second parameters are an object which contains element's coordinates (left, top) and dimensions (width, height); 
		 *  the former is a comparison target, and the latter is one of the nearest candidates.
		 *  The last parameter is a direction of the distance calculation.  
		 *  This function should return a calculated distance between first and second parameter.
		 * @param {boolean} [override] A boolean determines whether override the existing strategy or not.
		 * @returns {jQuery.caph.focus.nearestFocusableFinderProvider}
		 * 
		 * @example
		 *  $document.ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider) {
		 *  		nearestFocusableFinderProvider.registerDistanceCalculationStrategy('sample', function(from, to, direction) {
		 *  			return Math.sqrt(Math.pow(from.left - to.left, 2) + Math.pow(from.top - to.top, 2));
		 *  		});
		 *  	});
		 *  });
		 */
		this.registerDistanceCalculationStrategy = function(name, strategy, override) {
			if (override === false && $.isFunction(strategies[name])) {
				throw new Error('The given name "' + name + '" is already registered. If you want to override it, please do not pass the third parameter.');
			}
			
			strategies[name] = strategy;
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.useDistanceCalculationStrategy
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description 
		 *  Selects the current distance calculation strategy.
		 *  If you use unregistered strategy, will not be changed.
		 * 
		 * @param {string} name The strategy name to be used.
		 * @returns {jQuery.caph.focus.nearestFocusableFinderProvider}
		 * 
		 * @example
		 *  $document.ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider) {
		 *  		nearestFocusableFinderProvider.useDistanceCalculationStrategy('sample');
		 *  	});
		 *  }]);
		 */
		this.useDistanceCalculationStrategy = function(name) {
			if (!name) {
				currentDistanceCalculationStrategy = Constant.DEFAULT.DISTANCE_CALCULATION_STRATEGY;
			} else if ($.isFunction(strategies[name])) {
				currentDistanceCalculationStrategy = name;
			} else {
				console.warn('The given name "' + name + '" is not registered yet. Using "' + currentDistanceCalculationStrategy + '" instead.');				
			}
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.getRegisteredDistanceCalculationStrategies
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description Gets all registered strategy names.
		 * 
		 * @returns {string[]}
		 * 
		 * @example
		 *  $document.ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider) {
		 *  		console.log(nearestFocusableFinderProvider.getRegisteredDistanceCalculationStrategies());
		 *  	});
		 *  }]);
		 */
		this.getRegisteredDistanceCalculationStrategies = function() {
			return Object.keys(strategies);
		};
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.getCurrentDistanceCalculationStrategy
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description Gets the current distance calculation strategy name.
		 * 
		 * @returns {string}
		 * 
		 * @example
		 *  $document.ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider) {
		 *  		console.log(nearestFocusableFinderProvider.getCurrentDistanceCalculationStrategy());
		 *  	});
		 *  }]);
		 */
		this.getCurrentDistanceCalculationStrategy = function() {
			return currentDistanceCalculationStrategy;
		};
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.addBeforeDistanceCalculationHandler
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description 
		 *  Adds a handler which is called before distance calculation.
		 *  If at least one of the appended handlers returns false, does not calculate distance of the target element. 
		 * 
		 * @param {Function} handler 
		 *  A function to be called when checking whether the focusable element is distance calculation target or not.
		 *  This function receives a parameter which is one of the distance calculation target focusable elements.
		 * @returns {boolean} A boolean indicates whether success or not.
		 * 
		 * @example
		 *  $document.ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider) {
		 *  		nearestFocusableFinderProvider.addBeforeDistanceCalculationHandler(function(focusable) {
		 *  			if (focusable.style.opacity === 0) {
		 *  				return false;
		 *  			} 
		 *  		});
		 *  	});
		 *  });
		 */
		this.addBeforeDistanceCalculationHandler = function(handler) {
			if ($.isFunction(handler)) {
				beforeDistanceCalculationHandlers.push(handler);
				return true;
			}
			
			return false;
		};
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.removeBeforeDistanceCalculationHandler
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description Removes an appended handler.
		 * 
		 * @param {Function} handler A function to be removed.
		 * @returns {boolean} A boolean indicates whether success or not.
		 * 
		 * @example
		 *  $document.ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider) {
		 *  		var opacityCheckHandler = function(focusable) {
		 *  			if (focusable.style.opacity === 0) {
		 *  				return false;
		 *  			} 
		 *  		};
		 *  
		 *  		nearestFocusableFinderProvider.addBeforeDistanceCalculationHandler(opacityCheckHandler);
		 *  		console.log(nearestFocusableFinderProvider.removeBeforeDistanceCalculationHandler(opacityCheckHandler)); // true
		 *  	});
		 *  });
		 */
		this.removeBeforeDistanceCalculationHandler = function(handler) {
			var index = beforeDistanceCalculationHandlers.indexOf(handler);
			
			if (index > -1) {
				beforeDistanceCalculationHandlers.splice(index, 1);
				return true;
			}
			
			return false;
		};
		
		/**
		 * @name jQuery.caph.focus.nearestFocusableFinderProvider.getInstance
		 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
		 * @kind function
		 * 
		 * @description Gets the nearest focusable finder singleton instance.
		 * 
		 * @returns {jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder}
		 * 
		 * @example
		 *  function findRight(target) {
		 *  	var nearestFocusableFinder = $.caph.focus.nearestFocusableFinderProvider.getInstance();
		 *  	return nearestFocusableFinder.getNearest(target, $.caph.focus.Constant.DIRECTION.RIGHT);
		 *  }
		 */
		this.getInstance = function() {
			if (instance === null) {
				instance = createNearestFocusableFinder();
				return instance;
			}
			
			return instance;
		};
		
		function createNearestFocusableFinder() {
			var slice = Array.prototype.slice;
			var focusableElements = {};
			var observer;
			
			/**
			 * @name jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder
			 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider
			 * 
			 * @description The nearest focusable finder provider.
			 */
			var nearestFocusableFinder = {
				/**
				 * @name jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder.getInitial
				 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder
				 * @kind function
				 * 
				 * @description Gets the initial focusable DOM element.
				 * 
				 * @param {number} [depth] The focusable depth to search for. Default value is jQuery.caph.focus.Constant.DEFAULT.DEPTH.
				 * @param {string} [group] The focusable group to search for. Default value is jQuery.caph.focus.Constant.DEFAULT.GROUP.
				 * @returns {DOMElement} If there is no initial element, returns null.
				 * 
				 * @example
				 *  function initializeFocus() {
				 *  	var controller = $.caph.focus.controllerProvider.getInstance();
				 *  	var nearestFocusableFinder = $.caph.focus.nearestFocusableFinderProvider.getInstance();
				 *  
				 *  	controller.focus(nearestFocusableFinder.getInitial());
				 *  }
				 */
				getInitial: function(depth, group) {
					var initial;
					
					depth = depth || Constant.DEFAULT.DEPTH;
					group = group || Constant.DEFAULT.GROUP;
					
					Object.keys(focusableElements).some(function(name) {
						var focusable = focusableElements[name];
						var data = Util.getData(focusable);
						
						if (Util.isVisible(focusable) && (!data.disabled || $.caph.focus.controllerProvider.isFocusWhenDisabled()) && data.depth === depth && data.group === group) {
							initial = focusable;
							return true;
						}
					});

					return initial;
				},
				
				/**
				 * @name jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder.getNearest
				 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder
				 * @kind function
				 * 
				 * @description Gets the DOM element closest to the specific direction of the given element.
				 * 
				 * @param {DOMElement|jQuery} target The base element. 
				 * @param {string} direction The direction to search for.
				 * @returns {DOMElement} If there is no nearest element, returns null.
				 * 
				 * @example
				 * 	function focusRight(from) {
				 * 		var controller = $.caph.focus.controllerProvider.getInstance();
				 *  	var nearestFocusableFinder = $.caph.focus.nearestFocusableFinderProvider.getInstance();
				 * 
				 * 		controller.focus(nearestFocusableFinder.getNearest(from, $.caph.focus.Constant.DIRECTION.RIGHT));
				 *  }
				 */
				getNearest: function(target, direction) {
					var distance, bestMatch, bestDistance = Infinity;
					var targetPosition, neighborPosition;
					var targetFocusableData;
					
					if (Util.isFocusable(target = Util.getElement(target)) && (targetFocusableData = Util.getData(target))) {
						targetPosition = getPosition(target);
						
						Object.keys(focusableElements).forEach(function(name) {
							var focusable = focusableElements[name];
							var neighborFocusableData = Util.getData(focusable);
							
							if (focusable !== target && Util.isVisible(focusable) && (!neighborFocusableData.disabled || $.caph.focus.controllerProvider.isFocusWhenDisabled()) && targetFocusableData.depth === Util.getData(focusable).depth) {
								if (beforeDistanceCalculationHandlers.some(function(handler) {
									return handler(focusable) === false;
								})) {
									return;
								}
								
								neighborPosition = getPosition(focusable);
								distance = strategies[currentDistanceCalculationStrategy](targetPosition, neighborPosition, direction);
								
								if (distance < bestDistance) {
									bestMatch = focusable;
									bestDistance = distance;
								}
							}
						});
					} 

					return bestMatch;
				},
				
				/**
				 * @name jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder.$$put
				 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder
				 * @kind function
				 * 
				 * @description
				 *  Puts the focusable element by setting the given option.
				 *  In normal case, this method is called internally only. 
				 *  But, if you use this method directly, don't forget to bind all focusable related events.
				 * 
				 * @param {DOMElement|jQuery} focusable A focusable element. 
				 * @param {Object} option The focusable options such as depth, group, name and so on.
				 * @returns {jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder}
				 * 
				 * @example
				 *  $.caph.focus.nearestFocusableFinderProvider.getInstance().$$put($('[focusable]')[0], {
				 *  	depth: 10,
				 *  	group: 'group1',
				 *  	name: 'test1'
				 *  });
				 *  
				 * @see {@link jQuery.caph.focus.Util.bindMouseEvent}
				 * @see {@link jQuery.caph.focus.Util.bindFocusableEvent}
				 */
				$$put: function(focusable, option) {
					var name;
					
					if (Util.isFocusable(focusable = Util.getElement(focusable)) && (name = Util.setData(focusable, option))) {
						focusableElements[name] = Util.getElement(focusable);	
					}
					
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder.$$get
				 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder
				 * @kind function
				 * 
				 * @description Gets the focusable element of the given name.
				 * 
				 * @param {string} name The focusable element name. 
				 * @returns {DOMElement}
				 * 
				 * @example
				 *  $.caph.focus.nearestFocusableFinderProvider.getInstance().$$get('focusable-0');
				 */
				$$get: function(name) {
					return focusableElements[name];
				},
				
				/**
				 * @name jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder.$$remove
				 * @memberOf jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder
				 * @kind function
				 * 
				 * @description 
				 *  Removes the focusable element of the given name.
				 *  In normal case, this method is called internally only. 
				 *  But, if you use this method directly, don't forget to unbind all focusable related events.
				 *  
				 * @param {string|DOMElement|jQuery} target 
				 *  The focusable element name to be removed.
				 *  If target is not a string, gets the focusable element name from the given element.
				 * @returns {DOMElement}
				 * 
				 * @example
				 *  $.caph.focus.nearestFocusableFinderProvider.getInstance().$$remove('focusable-0');
				 *  
				 * @see {@link jQuery.caph.focus.Util.unbindEvent}
				 */
				$$remove: function(target) {
					var name, element;
					
					if (typeof target !== 'string') {
						target = Util.getData(target);
					}
					
					if (target) {
						name = target.name;
						element = focusableElements[name];
						
						if (element) {
							delete focusableElements[name];
						}
					}
					
					return element;
				}
			};
			
			function iterate(nodeList, callback, useSetData) {
				slice.call(nodeList).forEach(function(node) {
					if (Util.isElement(node) && Util.isFocusable(node)) {
						if (useSetData === true) {
							callback(Util.setData(node), node);	
						} else {
							callback(Util.getData(node).name, node);
						}
					}
				});
			}
			
			if (window.MutationObserver) {
				observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						if (mutation.type === 'childList') {
							iterate(mutation.addedNodes, function(name, addedNode) {
								$.caph.focus.$$toAvailable(addedNode);
							}, true);
							
							iterate(mutation.removedNodes, function(name, removedNode) {
								Util.unbindEvent(nearestFocusableFinder.$$remove(removedNode));
							});
						}
					});
				});
				
				observer.observe(document, {
					childList: true,
					subtree: true
				});
			}
			
			return nearestFocusableFinder;
		}
	}
	
	/**
	 * @name jQuery.caph.focus.controllerProvider
	 * @memberOf jQuery.caph.focus
	 * 
	 * @description The focus controller provider.
	 */
	function ControllerProvider() {
		var instance = null;
		
		var NAMESPACE = '.focus-controller';
		var GROUP_PREFIX = 'group:';
		
		var initialDepth = Constant.DEFAULT.DEPTH;
		var initialGroup = {};
		
		var currentKeyMap = Constant.DEFAULT.KEY_MAP;
		
		var beforeHandlers = [];
		var afterHandlers = [];
		
		var callbacks = {
			focused: $.noop,
			blurred: $.noop,
			selected: $.noop
		};
		
		var focusWhenDisabled = false;
			
		function addHandler(target, handler) {
			if ($.isFunction(handler)) {
				target.push(handler);
				return true;
			}
			
			return false;
		}
		
		function byOrder(a, b) {
			return a.order - b.order;
	    }
		
		function removeHandler(target, handler) {
			var index = target.indexOf(handler);
			
			if (index > -1) {
				target.splice(index, 1);
				return true;
			}
			
			return false;
		}
		
		function setCallback(type, callback) {
			if ($.isFunction(callback)) {
				callbacks[type] = callback;
			}
		}
		
		initialGroup[Constant.DEFAULT.DEPTH] = Constant.DEFAULT.GROUP;
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.setInitialDepth
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Sets the initial depth.
		 * 
		 * @param {number} depth A number to be initial depth.
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.setInitialDepth(1);
		 *  	});
		 *  });
		 */
		this.setInitialDepth = function(depth) {
			initialDepth = depth;
			return this;
		};

		/**
		 * @name jQuery.caph.focus.controllerProvider.setInitialGroupOfDepth
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description 
		 *  Sets the initial group of depth. 
		 *  If at least one default group does not exist on the specific depth, you have to set the proper initial group to that depth.
		 *  If not, you have to change the group using the controller API at an appropriate time.
		 * 
		 * @param {number|string|Object} depth 
		 *  The number indicates the depth to set initial group to. 
		 *  If the string is passed, depth is used as 0. 
		 *  If an object is passed, property name will be depth and property value will be group.
		 * @param {string} [group] A string to be initial group.
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.setInitialGroupOfDepth('group1');
		 *  		controllerProvider.setInitialGroupOfDepth(1, 'group2');
		 *  		controllerProvider.setInitialGroupOfDepth({
		 *  			2: 'group3',
		 *  			3: 'group4'
		 *  		});
		 *  	});
		 *  });
		 */
		this.setInitialGroupOfDepth = function(depth, group) {
			var data = {};
			
			if (group === undefined) {
				group = depth;
				depth = Constant.DEFAULT.DEPTH;
			}
			
			if ($.isPlainObject(group)) {
				data = group;
			} else {
				data[depth] = group;	
			}
			
			$.extend(initialGroup, data);
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.setKeyMap
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Sets the key map.
		 * 
		 * @param {Object} keyMap 
		 *  An object to set key map. 
		 *  The property name should be upper case string such as 'LEFT', 'RIGHT', 'UP', 'DOWN' and 'ENTER'. 
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.setKeyMap({
		 *  			LEFT: 1,
		 *  			RIGHT: 2,
		 *  			UP: 3,
		 *  			DOWN: 4
		 *  		});
		 *  	});
		 *  });
		 */
		this.setKeyMap = function(keyMap) {
			$.extend(currentKeyMap, keyMap);
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.getKeyMap
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Gets the key map.
		 * 
		 * @returns {Object} The key map object which consists of 'LEFT', 'RIGHT', 'UP', 'DOWN' and 'ENTER'.
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		console.log(controllerProvider.getKeyMap());
		 *  	});
		 *  });
		 */
		this.getKeyMap = function() {
			return $.extend({}, currentKeyMap);
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.addBeforeKeydownHandler
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Adds a function to be called before key input processing. If one of them returns false, key input processing is stopped.
		 * 
		 * @param {Function} handler 
		 *  A function to be called before key input processing. 
		 *  This function can take two parameters. 
		 *  The first parameter is an object which contains current controller's state including event object.
		 *  - event: The current event object.
		 *  - previousFocusedItem: The previous focused item.
		 *  - currentFocusItem: The current focus item.
		 *  The second parameter is controller itself.
		 * @param {number} [order] 
		 *  The order is used to sort the handlers before they are called.
		 *  Order is defined as a number. Handlers with less numerical order are called first. 
		 *  The default order is 0.
		 * @returns {boolean} A boolean indicates whether success or not.
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.addBeforeKeydownHandler(function(context, controller) {
		 *  			if (context.code === $.caph.focus.Constant.DEFAULT.KEY_MAP.RIGHT) {
		 *  				controller.setGroup('test');
		 *  				return false;
		 * 				}
		 * 			});
		 *  	});
		 *  });
		 */
		this.addBeforeKeydownHandler = function(handler, order) {
			if (addHandler(beforeHandlers, handler)) {
				handler.order = order || 0;
				beforeHandlers.sort(byOrder);
				return true;
			}
			
			return false;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.addAfterKeydownHandler
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Adds a function to be called after key input processing. These functions are always invoked unless one of the before handlers returns false.
		 * 
		 * @param {Function} handler 
		 *  A function to be called after key input processing. 
		 *  This function can take two parameters. 
		 *  The first parameter is an object which contains current controller's state including pressed key information.
		 *  - event: The current event object.
		 *  - previousFocusedItem: The previous focused item.
		 *  - currentFocusItem: The current focus item.
		 *  The second parameter is controller itself.
		 * @returns {boolean} A boolean indicates whether success or not.
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.addAfterKeydownHandler(function(context, controller) {
		 *  			console.log('after moving');
		 * 			});
		 *  	});
		 *  });
		 */
		this.addAfterKeydownHandler = function(handler) {
			return addHandler(afterHandlers, handler);
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.removeBeforeKeydownHandler
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Removes an attached function which is called before key input processing.
		 * 
		 * @param {Function} handler A function to be removed.
		 * @returns {boolean} A boolean indicates whether success or not. 
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		var calledOnce = false;
		 *  
		 *  		var beforeHandler = function(context, controller) {
		 *  			calledOnce = true;
		 *  			console.log('before moving');
		 *  		};
		 *  
		 *  		controllerProvider.addBeforeKeydownHandler(beforeHandler);
		 *  
		 *  		controllerProvider.addAfterKeydownHandler(function(context, controller) {
		 *  			console.log('after moving');
		 *  		
		 *  			if (!calledOnce) {
		 *  				controllerProvider.removeBeforeKeydownHandler(beforeHandler);
		 *  				console.log('remove handler');
		 *  			}
		 *  		});
		 *  	});
		 *  });
		 */
		this.removeBeforeKeydownHandler = function(handler) {
			return removeHandler(beforeHandlers, handler);
		};
				
		/**
		 * @name jQuery.caph.focus.controllerProvider.removeAfterKeydownHandler
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Removes an attached function which is called after key input processing.
		 * 
		 * @param {Function} handler A function to be removed. 
		 * @returns {boolean} A boolean indicates whether success or not.
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		var calledOnce = false;
		 *  
		 *  		var afterHandler = function(context, controller) {
		 *  			calledOnce = true;
		 *  			console.log('after moving');
		 *  		};
		 *  
		 *  		controllerProvider.addAfterKeydownHandler(afterHandler);
		 *  
		 *  		controllerProvider.addBeforeKeydownHandler(function(context, controller) {
		 *  		console.log('before moving');
		 *  		
		 *  		if (!calledOnce) {
		 *  			controllerProvider.removeAfterKeydownHandler(afterHandler);
		 *  			console.log('remove handler');
		 *  		}
		 *  	});
		 *  });
		 */
		this.removeAfterKeydownHandler = function(handler) {
			return removeHandler(afterHandlers, handler);
		};
				
		/**
		 * @name jQuery.caph.focus.controllerProvider.setFocusWhenDisabled
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description 
		 *  Determines whether set focus to the focusable element, even if it is disabled.
		 *  Remember that the disabled element always do not receive the 'selected' event.
		 * 
		 * @param {boolean} bool If true, will set focus when the focusable element is disabled.
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.setFocusWhenDisabled(true);
		 *  	});
		 *  });
		 */
		this.setFocusWhenDisabled = function(bool) {
			focusWhenDisabled = bool;
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.isFocusWhenDisabled
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Gets the current status about whether set the focus when the target is disabled or not.
		 * 
		 * @returns {boolean} If true, will set focus when the focusable element is disabled.
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		console.log(controllerProvider.isFocusWhenDisabled());
		 *  	});
		 *  });
		 */
		this.isFocusWhenDisabled = function() {
			return focusWhenDisabled;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.getInstance
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Gets the controller singleton instance.
		 * 
		 * @returns {jQuery.caph.focus.controllerProvider.controller}
		 * 
		 * @example
		 *  function blurCurrentFocusItem() {
		 *  	var controller = $.caph.focus.controllerProvider.getInstance();
		 *  	controller.blur();
		 *  }
		 */
		this.getInstance = function() {
			if (instance === null) {
				instance = createController();
				return instance;
			}
			
			return instance;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.onFocused
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Attaches the focused event handler.
		 * 
		 * @param {Function} callback An event handler.
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.onFocused(function(event, originalEvent) {
		 *  			console.log('focused');
		 *  		});
		 *  	});
		 *  });
		 */
		this.onFocused = function(callback) {
			setCallback('focused', callback);
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.onBlurred
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Attaches the blurred event handler.
		 * 
		 * @param {Function} callback An event handler.
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.onBlurred(function(event, originalEvent) {
		 *  			console.log('blurred');
		 *  		});
		 *  	});
		 *  });
		 */
		this.onBlurred = function(callback) {
			setCallback('blurred', callback);
			return this;
		};
		
		/**
		 * @name jQuery.caph.focus.controllerProvider.onSelected
		 * @memberOf jQuery.caph.focus.controllerProvider
		 * @kind function
		 * 
		 * @description Attaches the selected event handler.
		 * 
		 * @param {Function} callback An event handler.
		 * @returns {jQuery.caph.focus.controllerProvider}
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		controllerProvider.onSelected(function(event, originalEvent) {
		 *  			console.log('selected');
		 *  		});
		 *  	});
		 *  });
		 */
		this.onSelected = function(callback) {
			setCallback('selected', callback);
			return this;
		};
		
		function createController() {
			var nearestFocusableFinder = $.caph.focus.nearestFocusableFinderProvider.getInstance();
			
			var currentDepth = initialDepth;
			var currentGroup = initialGroup[initialDepth] || Constant.DEFAULT.GROUP;
			var currentFocusItem;
			
			var initialFocusItem = {}, previousFocusedItem = {};
			
			function getNextFocusItem(direction) {
				var previousItem;
				var nextFocusItemName, nextFocusItem, nextFocusItemData;
				
				if (currentFocusItem) {
					nextFocusItemName = Util.getData(currentFocusItem).nextFocus[direction];
					
					if (nextFocusItemName === undefined) {
						return nearestFocusableFinder.getNearest(currentFocusItem, direction);
					}
					
					if (nextFocusItemName) {
						if (nextFocusItemName.indexOf(GROUP_PREFIX) === 0) {
							return nextFocusItemName.replace(GROUP_PREFIX, '');
						}
						
						nextFocusItem = nearestFocusableFinder.$$get(nextFocusItemName);
						
						if (Util.isVisible(nextFocusItem)) {
							nextFocusItemData = Util.getData(nextFocusItem);
							
							if ((!nextFocusItemData.disabled || focusWhenDisabled) && Util.getData(currentFocusItem).depth === nextFocusItemData.depth) {
								return nextFocusItem;
							}
						}
					}
					
					return null;
				}
				
				previousItem = getItem(previousFocusedItem);
				
				if (previousItem) {
					return previousItem;
				}
				
				return getInitialFocusItem();
			}
			
			function getInitialFocusItem(depth, group) {
				return getItem(initialFocusItem, depth, group) || nearestFocusableFinder.getInitial(normalizeDepth(depth), normalizeGroup(group));
			}
			
			function blurItem(item, originalEvent) {
				var data;
				
				if (Util.isFocusable(item = Util.getElement(item))) {
					data = Util.getData(item);
					
					if (data.depth === currentDepth) {
						trigger(item, 'blurred', [originalEvent]);
						
						if (item === currentFocusItem) {
							setItem(previousFocusedItem, item);
							currentFocusItem = null;
						}
					}
				}
			}
			
			function focusItem(item, originalEvent) {
				var data;

				if (Util.isFocusable(item = Util.getElement(item)) && item !== currentFocusItem) {
					data = Util.getData(item);
					
					if (data.depth === currentDepth && (!data.disabled || focusWhenDisabled)) {
						if (currentFocusItem) {
							blurItem(currentFocusItem, originalEvent);
						}
						
						trigger(item, 'focused', [originalEvent]);
						currentGroup = data.group;
						currentFocusItem = item;
					}
				}
			}
			
			function selectItem(item, originalEvent) {
				if (Util.isFocusable(item = Util.getElement(item)) && Util.isVisible(item)) {
					if (item === currentFocusItem && !Util.getData(item).disabled) {
						trigger(item, 'selected', [originalEvent]);
					}  else {
						focusItem(item, originalEvent);
					}
				} else {
					item = getItem(previousFocusedItem);
					
					if (item) {
						focusItem(item, originalEvent);
					} else {
						focusItem(item = getInitialFocusItem(), originalEvent);
					}
				}
			}
			
			function trigger(item, type, param) {
				item && $(item).trigger(type, param);
			}
			
			function setItem(target, item, depth, group) {
				depth = normalizeDepth(depth);
				group = normalizeGroup(group);
				
				target[depth] = target[depth] || {};
				target[depth][group] = item;
			}
			
			function getItem(target, depth, group) {
				var item;
				
				depth = normalizeDepth(depth);
				group = normalizeGroup(group);
				
				if (Util.isVisible(item = target[depth] && target[depth][group]) && (!Util.getData(item).disabled || focusWhenDisabled)) {
					return item;
				}
				
				return null;
			}
			
			function normalizeDepth(depth) {
				return depth === undefined ? currentDepth : depth;
			}
			
			function normalizeGroup(group) {
				return group === undefined ? currentGroup : group;
			}
			
			function normalizeItem(item) {
				if (!item) {
					return currentFocusItem;
				}
				
				return typeof item === 'string' ? nearestFocusableFinder.$$get(item) : item;
			}
			
			function changeDisabled(item, bool, callback) {
				var data;
				
				if (Util.isFocusable(item = Util.getElement(item))) {
					data = Util.getData(item);
					
					if (data.disabled !== bool) {
						data.disabled = bool;
						
						Util.setData(item, data);
						
						if (callback) {
							callback(item);
						}
					}
				}
			}
			
			/**
			 * @name jQuery.caph.focus.controllerProvider.controller
			 * @memberOf jQuery.caph.focus.controllerProvider
			 * 
			 * @description The focus controller service.
			 */
			var controller = {
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.getCurrentDepth
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description Gets the current focusable depth.
				 * 
				 * @returns {number}
				 * 
				 * @example
				 *  function getCurrentFocusableDepth() {
				 *  	return $.caph.focus.controllerProvider.getInstance().getCurrentDepth();
				 *  }
				 */
				getCurrentDepth: function() {
					return currentDepth;
				},

				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.getCurrentGroup
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description Gets the current focusable group.
				 * 
				 * @returns {string}
				 * 
				 * @example
				 *  function getCurrentFocusableGroup() {
				 *  	return $.caph.focus.controllerProvider.getInstance().getCurrentGroup();
				 *  }
				 */
				getCurrentGroup: function() {
					return currentGroup;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.getCurrentFocusItem
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description Gets the current focus DOM element.
				 * 
				 * @returns {DOMElement}
				 * 
				 * @example
				 *  function getCurrentFocusItem() {
				 *  	return $.caph.focus.controllerProvider.getInstance().getCurrentFocusItem();
				 *  }
				 */
				getCurrentFocusItem: function() {
					return currentFocusItem;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.setDepth
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description 
				 *  Sets the current focusable depth if the given value is different from current value. 
				 *  If the current focus item exists, it will be blurred. And then, finds a proper next focus item and focuses it.
				 *  If there was a previously focused item in the new depth, it will be next focus item.
				 *  Otherwise searches for a initial focus item from the new depth and then uses it to next focus item.
				 * 
				 * @param {number} depth A number to be set.
				 * @param {string} [group] 
				 *  A group to be set. 
				 *  If not passed, use the initial focus group of the given depth. 
				 *  If there is no initial focus group, use default group.
				 * @param {boolean} [useHistory]
				 *  A boolean determines whether searches for a focusable element from the focus change history in advance.
				 *  Default value is true.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function changeDepth(depth) {
				 *  	$.caph.focus.controllerProvider.getInstance().setDepth(depth);
				 *  }
				 */
				setDepth: function(depth, group, useHistory) {
					var nextFocusItem, nextGroup;
					
					if ($.isNumeric(depth) && currentDepth !== depth) {
						if (useHistory === false) {
							nextFocusItem = getInitialFocusItem(depth, nextGroup = initialGroup[depth] || $.caph.focus.Constant.DEFAULT.GROUP);
						} else {
							nextFocusItem = getItem(previousFocusedItem, depth, nextGroup = group || initialGroup[depth] || $.caph.focus.Constant.DEFAULT.GROUP) || getInitialFocusItem(depth, nextGroup);
						}
						
						if (nextFocusItem) {
							blurItem(currentFocusItem);
							
							currentDepth = depth;
							currentGroup = nextGroup;
							
							focusItem(nextFocusItem);
						}
					}
					
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.setGroup
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description 
				 *  Sets the current focusable group if the given value is different from current value. 
				 *  If the current focus item exists, it will be blurred. And then, finds a proper next focus item and focuses it.
				 *  If there was a previously focused item in the new group, it will be next focus item.
				 *  Otherwise searches for a initial focus item from the new group and then uses it to next focus item.
				 * 
				 * @param {string} depth A string to be set.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function changeGroup(group) {
				 *  	$.caph.focus.controllerProvider.getInstance().setGroup(group);
				 *  }
				 */
				setGroup: function(group) {
					var nextFocusItem;
					
					if (group && currentGroup !== group && (nextFocusItem = getItem(previousFocusedItem, currentDepth, group) || getInitialFocusItem(currentDepth, group))) {
						blurItem(currentFocusItem);
						currentGroup = group;
						focusItem(nextFocusItem);
					}
					
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.focus
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description 
				 *  Changes the current focus item. 
				 *  If the given item is the current focus item, or the given item's depth is not equal to current depth, the focus will not be changed.
				 *  If there already exists the focused item, blurs it before changing the focus.
				 * 
				 * @param {DOMElement|string} item 
				 *  A DOM element to be focused. If the string value is passed, it represents the name of the focusable.
				 * @param {Event} [originalEvent] 
				 *  The original event. If you want to know about the original event in the handler function, pass it to second parameter.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function changeFocus(name) {
				 *  	$.caph.focus.controllerProvider.getInstance().focus(name);
				 *  }
				 */
				focus: function(item, originalEvent) {
					focusItem(normalizeItem(item), originalEvent);
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.blur
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description 
				 * 	Blurs the given item, or the current focus item if not passed anything else.
				 *  If the given item's depth is not equal to current depth, will not be blurred.
				 * 
				 * @param {DOMElement|string} [item] 
				 *  A DOM element to be blurred. If the string value is passed, it represents the name of the focusable. 
				 *  If not passed anything else, blurs the current focus item.
				 * @param {Event} [originalEvent] 
				 *  The original event. If you want to know about the original event in the handler function, pass it to second parameter.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function blurCurrentFocusItem() {
				 *  	$.caph.focus.controllerProvider.getInstance().blur();
				 *  }
				 */
				blur: function(item, originalEvent) {
					blurItem(normalizeItem(item), originalEvent);
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.select
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description 
				 * 	Selects the given item if it is equal to the current focus item.
				 *  If the given item is not equal to the current focus item, changes the current focus item to the given item. 
				 *  If not passed anything else, selects the current focus item.
				 *  But if there is no current focus item, searches for the previously focused item or initial focus item and then focuses it.
				 * 
				 * @param {DOMElement|string} [item] 
				 *  A DOM element to be selected. If the string value is passed, it represents the name of the focusable. 
				 *  If not passed anything else, selects the current focus item.
				 * @param {Event} [originalEvent] 
				 *  The original event. If you want to know about the original event in the handler function, pass it to second parameter.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function selectCurrentFocusItem() {
				 *  	$.caph.focus.controllerProvider.getInstance().select();
				 *  }
				 */
				select: function(item, originalEvent) {
					selectItem(normalizeItem(item), originalEvent);	
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.enable
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description Enables the given item. The 'disabled' class is removed.
				 * 
				 * @param {DOMElement|string} [item] 
				 *  A DOM element to be enabled. If the string value is passed, it represents the name of the focusable. 
				 *  If not passed anything else, enables the current focus item.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function enable(name) {
				 *  	$.caph.focus.controllerProvider.getInstance().enable(name);
				 *  }
				 */
				enable: function(item) {
					changeDisabled(normalizeItem(item), false, function(element) {
						$(element).removeClass(DISABLED_CLASS_NAME);
					});
					return this;
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.disable
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description Disables the given item. The 'disabled' class is added. If the given item is equal to the current focus item, it will be blurred automatically. 
				 * 
				 * @param {DOMElement|string} [item] 
				 *  A DOM element to be disabled. If the string value is passed, it represents the name of the focusable. 
				 *  If not passed anything else, disables the current focus item.
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  function disable(name) {
				 *  	$.caph.focus.controllerProvider.getInstance().disable(name);
				 *  }
				 */
				disable: function(item) {
					changeDisabled(normalizeItem(item), true, function(element) {
						if (element === currentFocusItem) {
							blurItem(currentFocusItem, $.Event('disabled'));
						}
						
						$(element).addClass(DISABLED_CLASS_NAME);
					});
					return this;
				},
				
				$$getNextFocusItem: getNextFocusItem,
				$$getInitialFocusItem: getInitialFocusItem,
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.$$setInitialFocusItem
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description 
				 *  Sets the initial focus item.
				 *  In normal case, this method is called internally only.
				 * 
				 * @param {DOMElement|jQuery} item A focusable element. 
				 * @returns {jQuery.caph.focus.controllerProvider.controller}
				 * 
				 * @example
				 *  $.caph.focus.controllerProvider.getInstance().$$setInitialFocusItem($('[focusable]')[0]);
				 *  
				 * @see {@link jQuery.caph.focus.$$toAvailable}
				 */
				$$setInitialFocusItem: function(item) {
					var data;
					
					if (Util.isFocusable(item = Util.getElement(item))) {
						data = Util.getData(item);
						
						if (data.initialFocus) {
							setItem(initialFocusItem, item, data.depth, data.group);
						}
					}
					
					return this;
				},
				
				$$invoke: function(type, event, originalEvent) {
					var callback = callbacks[type];
					
					if (callback) {
						callback(event, originalEvent);
					}
				},
				
				/**
				 * @name jQuery.caph.focus.controllerProvider.controller.$$unbind
				 * @memberOf jQuery.caph.focus.controllerProvider.controller
				 * @kind function
				 * 
				 * @description Note that if you call this method, no longer use key navigation.
				 * 
				 * @example
				 *  $.caph.focus.controllerProvider.getInstance().$$unbind();
				 */
				$$unbind: function() {
					$(document).off(NAMESPACE);
				}
			};
		
			$(window).on('load', function(event) {
				setTimeout(function() {
					focusItem(getItem(initialFocusItem), event);
				}, 0);
			});
			
			$(document).on('keydown' + NAMESPACE, function (event) {
				var keyCode = event.keyCode || event.which || event.charCode;
				var nextFocusItem;
				
				if (beforeHandlers.some(function(handler) {
					return handler({
						event: event,
						previousFocusedItem: getItem(previousFocusedItem),
						currentFocusItem: currentFocusItem
					}, controller) === false;
				})) {
					return;
				}
				
				switch (keyCode) {
				case currentKeyMap.LEFT:
					nextFocusItem = getNextFocusItem(Constant.DIRECTION.LEFT); 
					break;
				case currentKeyMap.RIGHT:
					nextFocusItem = getNextFocusItem(Constant.DIRECTION.RIGHT); 
					break;
				case currentKeyMap.UP:
					nextFocusItem = getNextFocusItem(Constant.DIRECTION.UP); 
					break;
				case currentKeyMap.DOWN:
					nextFocusItem = getNextFocusItem(Constant.DIRECTION.DOWN); 
					break;
				case currentKeyMap.ENTER:
					selectItem(currentFocusItem, event);
					break;
				}
				
				if (nextFocusItem) {
					if (typeof nextFocusItem === 'string') {
						controller.setGroup(nextFocusItem);
					} else {
						blurItem(currentFocusItem, event);
						focusItem(nextFocusItem, event);
					}
				}
				
				afterHandlers.forEach(function(handler) {
					handler({
						event: event,
						previousFocusedItem: getItem(previousFocusedItem),
						currentFocusItem: currentFocusItem
					}, controller);
				});
			});
			
			return controller;
		}
	}
	
	var FOCUSED_CLASS_NAME = 'focused';
	var DISABLED_CLASS_NAME = 'disabled';
	
	function toggleClass(element, type) {
		switch (type) {
		case 'focused':
			$(element).addClass(FOCUSED_CLASS_NAME);
			break;
		case 'blurred':
			$(element).removeClass(FOCUSED_CLASS_NAME);
			break;
		}
	}
	
	function toggleDisabledClass(element) {
		element = $(element);
		
		if (element.data().focusableDisabled) {
			element.addClass(DISABLED_CLASS_NAME);
		} else {
			element.removeClass(DISABLED_CLASS_NAME);
		}
	}
	
	$.caph = $.caph || {};
	
	/**
	 * @name jQuery.caph.focus
	 * @memberOf jQuery.caph
	 * @kind jq-plugin
	 * 
	 * @description
	 *  This is a jQuery extension module which provides functionality to navigate the focusable elements 
	 *  using the remote controller which is a main input device of TV.
	 *  It consists of 3 parts: the 'focusable' attribute which represents focusable elements, 
	 *  the 'nearestFocusableFinder' which is in charge of searching for the nearest focusable elements, 
	 *  and the 'controller' which provides the focus related behaviors.
	 *
	 *  Example
	 *  --
	 *  
	 *  **js**
	 *  ~~~~~~
	 *  $(document).ready(function() {
	 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
	 *  		controllerProvider.onFocused(function(event, originalEvent) {
	 *  			$(event.currentTarget).css({
	 *  				border: '1px solid yellow'
	 *  			});
	 *  		});
	 *  
	 *  		controllerProvider.onBlurred(function(event, originalEvent) {
	 *  			$(event.currentTarget).css({
	 *  				border: ''
	 *  			});
	 *  		});
	 *  	});
	 *  });
	 *  ~~~~~~
	 *  
	 *  **html**
	 *  ~~~~~~
	 *  <body>
	 *  	<div>
	 *  		<div focusable>UP</div>
	 *  		<div focusable>DOWN</div>
	 *  	</div>
	 *  </body>
	 *  ~~~~~~
	 */
	$.caph.focus = $.caph.focus || {};
	
	/**
	 * @name jQuery.caph.focus.focusable
	 * @memberOf jQuery.caph.focus
	 *
	 * @description 
	 *  An attribute which represents the focusable element.
	 *  When you want to use key navigation, just add this attribute to target element.
	 *  ~~~~~~
	 *  <div focusable></div>
	 *  ~~~~~~
	 *  All elements which are specified by this attribute automatically have three additional properties such as depth, group and name.
	 *  By default, depth value will be 0 and group value will be 'default' and name value will be sequential string like 'focusable-0'.
	 *  
	 *  These properties and their values are also stored in the element's data object through jQuery's .data() API.
	 *  jQuery's .data() API will be automatically associated with HTML5 data attributes. (So this plug-in depends on jQuery 1.7 above.)
	 *  So you can change these values like below. (Note that each property has 'focusable' prefix.)
	 *  ~~~~~~
	 *  <div focusable data-focusable-depth="0" data-focusable-group="default" data-focusable-name="focusable-0"></div>
	 *  ~~~~~~
	 *  
	 *  Of course, you can set those values to whatever you want.
	 *  ~~~~~~
	 *  <div focusable data-focusable-depth="1" data-focusable-group="test" data-focusable-name="focus1"></div>
	 *  ~~~~~~
	 *  
	 *  So then, what is 'depth', 'group' and 'name'?
	 *  
	 *  The 'depth' is used when moving focus to another focusable element.
	 *  The focus will be changed only between the same depth.
	 *  So if there is no same depth focusable element, the focus will not be changed.
	 *  
	 *  The 'group' separates focusable area semantically.
	 *  Even if group is not equal to each other, the focus can be changed if each depth is same.
	 *  Separating groups is useful when you manage each group's previous focusable element history by calling controller's 'setGroup API.
	 *  
	 *  The 'name' is used when setting the next focus to the specific element, 
	 *  or changing focus to another focusable element by calling controller's 'focus' API.
	 *  Each name should be an unique value.
	 *  
	 *  If you need more information about the controller API, refer to the controller documentation.
	 *  
	 *  This module automatically finds the nearest focusable element from the given direction using 'nearestFocusableFinder'.
	 *  If you want to set the next focusable element manually, you can do it by using 'next-focus-direction' option.
	 *  The direction values are 'left', 'right', 'up', 'down'.
	 *  ~~~~~~
	 *  <div focusable data-focusable-name="focus1" data-focusable-next-focus-right="focus2"></div>
	 *  <div focusable data-focusable-name="focus2"></div>
	 *  ~~~~~~
	 *  
	 *  The 'next-focus-direction' option supports to change the group.
	 *  You can change the group easily by concatenating 'group:' prefix and option value. (You can also change the group by using 'setGroup' API.)
	 *  ~~~~~~
	 *  <div focusable data-focusable-group="test1" data-focusable-next-focus-down="group:test2"></div>
	 *  <div focusable data-focusable-group="test2" data-focusable-next-focus-up="group:test1"></div>
	 *  ~~~~~~
	 *  
	 *  If you do not want to change the focus to the specific direction anymore, set the corresponding 'next-focus-direction' option to null.
	 *  ~~~~~~
	 *  <div focusable data-focusable-next-focus-left="null"></div>
	 *  ~~~~~~
	 *  
	 *  You can set auto focus element by setting 'initial-focus' option to true.
	 *  ~~~~~~
	 *  <div focusable data-focusable-initial-focus="true"></div>
	 *  ~~~~~~
	 *  The initial focus should be only one per depth and group.
	 *  If you set multiple initial focus, the first matched focusable element will become an initial focus.
	 *  
	 *  Every focusable element invokes event when focused, blurred or selected.
	 *  So you can attach the event handler to receive corresponding events.
	 *  ~~~~~~
	 *  $(document).ready(function() {
	 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
	 *  		controllerProvider.onFocused(function(event, originalEvent) {
	 *  			// your code
	 *  		});
	 *  
	 *  		controllerProvider.onBlurred(function(event, originalEvent) {
	 *  			// your code
	 *  		});
	 *  
	 *  		controllerProvider.onSelected(function(event, originalEvent) {
	 *  			// your code
	 *  		});
	 *  	});
	 *  });
	 *  ~~~~~~
	 *  The event handler function can have two arguments such as 'event' and 'originalEvent'.
	 *  The 'event' parameter is a custom jQuery event object such as 'focused', 'blurred' and 'selected'.
	 *  So if you want to know where this event comes from, you should refer to the 'originalEvent'.
	 *  The 'originalEvent' is real DOM jQuery event object such as 'keydown', 'mouseover', 'mouseout' and 'click'.
	 *  
	 *  You can receive the events through attaching event handler to DOM directly.
	 *  ~~~~~~
	 *  $('[focusable]').on('focused blurred selected', function(event) {
	 *  	// your code here
	 *  });
	 *  ~~~~~~
	 *  Note that you should properly detach the appended event handlers by yourself when DOM is removed.
	 *  
	 *  By default, add 'focused' class to focusable element when focused. If blurred, 'focused' class will be removed.
	 *  So, if you define the corresponding 'focused' style, will be able to make focus effect without attaching event handlers.
	 *  
	 *  All focusable elements are able to be disabled or enabled.
	 *  If you want to enable or disable focusable element, change the 'disabled' option.
	 *  ~~~~~~
	 *  <div focusable data-focusable-disabled="true"></div>
	 *  ~~~~~~
	 *  If you want to change the status, use controller's APIs.
	 *  The controller conveniently provides 'enable' and 'disable' APIs for these functionality.
	 *  See the controller documentation for more API details.
	 *  ~~~~~~
	 *  <div focusable data-focusable-name="test" data-focusable-disabled="true"></div>
	 *  ~~~~~~
	 *  ~~~~~~
	 *  $.caph.focus.controllerProvider.getInstance().enable('test');
	 *  ~~~~~~
	 *  When focusable element is disabled, 'disabled' class is added to it. If enabled, 'disabled' class will be removed.
	 *  
	 *  By default, if a focusable element is disabled, it will no longer receive a focus event.
	 *  But you can get a focus event even if focusable element is disabled, using the controller provider's 'setFocusWhenDisabled' API.
	 *  See the controller provider documentation for more API details.
	 */
	$.extend($.caph.focus, {
		Constant: Constant,
		Util: Util,
		controllerProvider: new ControllerProvider(),
		nearestFocusableFinderProvider: new NearestFocusableFinderProvider(),
		/**
		 * @name jQuery.caph.focus.activate
		 * @memberOf jQuery.caph.focus
		 * @kind function
		 * 
		 * @description 
		 *  This method finds all focusable elements, and then activates them to be focusable using {@link jQuery.caph.focus.$$toAvailable}.
		 *  Before activating, this method invoke the given config function if provided.
		 * 
		 * @param {Function} [config]
		 *  A callback function to configure provider settings.
		 *  This function has two arguments.
		 *  The first parameter is a nearestFocusableFinderProvider.
		 *  The second parameter is a  controllerProvider.
		 * 
		 * @example
		 *  $(document).ready(function() {
		 *  	$.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider) {
		 *  		// provider configuration 
		 *  	});
		 *  });
		 */
		activate: function(config) {
			if ($.isFunction(config)) {
				config($.caph.focus.nearestFocusableFinderProvider, $.caph.focus.controllerProvider);
			}
			
			$('[focusable]').each(function() {
				$.caph.focus.$$toAvailable(this);
			});
		},
		
		/**
		 * @name jQuery.caph.focus.$$toAvailable
		 * @memberOf jQuery.caph.focus
		 * @kind function
		 * 
		 * @description 
		 *  Makes the given focusable element available.
		 *  The focus plug-in uses MutationObserver to make the dynamically appended focusable element available automatically.
		 *  But if there is no MutationObserver, you have to call this method manually.
		 *  If the given element is not activated yet, this method puts the given focusable element to nearest focusable finder and binds all focusable related events to it 
		 * 
		 * @param {DOMElement|jQuery} element A focusable element.
		 * @return {DOMElement|jQuery}
		 * 
		 * @example
		 *  $(document.body).append($.caph.focus.$$toAvailable($('<div focusable></div>')));
		 *  
		 * @see {@link jQuery.caph.focus.nearestFocusableFinderProvider.nearestFocusableFinder.$$put}
		 * @see {@link jQuery.caph.focus.Util.bindMouseEvent}
		 * @see {@link jQuery.caph.focus.Util.bindFocusableEvent}
		 */
		$$toAvailable: function(element) {
			var nearestFocusableFinder = $.caph.focus.nearestFocusableFinderProvider.getInstance();
			var controller = $.caph.focus.controllerProvider.getInstance();

			if('undefined' !== typeof window.Hammer) { // Support touch & gesture events.
				Hammer.defaults.domEvents = true;

				if(element instanceof jQuery){
					new Hammer(element[0]);
				} else {
					new Hammer(element);
				}
			}

			if (!nearestFocusableFinder.$$get(Util.getData(element).name)) {
				nearestFocusableFinder.$$put(element);
				controller.$$setInitialFocusItem(element);
				
				toggleDisabledClass(element);
				
				Util.bindMouseEvent(element, function(event) {
					var target = event.currentTarget || event.target;
					
					if (controller.$$ignoreMouseEvent !== true && Util.getData(target).depth === controller.getCurrentDepth()) {
						controller[event.data.method](target, event);
					}
				});
				
				Util.bindFocusableEvent(element, function(event, originalEvent) {
					toggleClass(element, event.type);
					controller.$$invoke(event.type, event, originalEvent);
				});
			}
			
			return element;
		}
	});
})(this, document, jQuery);
/**
 * @name jQuery.fn.caphButton
 * @kind jq-plugin
 * @memberOf jQuery.fn
 * @description
 * caph-button provides button supporting the caph's focus and key navigation  {@link caph.focus}
 * In button option, you can modify the focus option using focusOption such as depth, group, name, and style of button through css.
 * Additionally, you can set button as 'toggle button'.
 * When you select toggle button, you can get the $toggle variable(Button is selected or not) as a parameter of selected event handler.
 * If caph button is focused or blurred, 'focused' css class attached and detached automatically. You can set the focus class using 'focused'
 *  Also you can set the event handler action through handler like example
 * Details about the focus option or event handling, please check the {@link caph.focus}
 *
 *
 *  | type     | option                   | description                                                                                                                                                                                                                    |
 *  |----------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | boolean  | 'toggle'                 | Decide button used as toggle button or not
 *  | string   | 'buttonClass'            | css class name which applied to button
 *  | object   | 'focusOption'            | focus name, focus group, disabled, initialfocus....
 *  | function | 'onFocused'              | Set the event handler when button is focused. Button passes two parameters 'event' and 'originalEvent'
 *  | function | 'onBlurred'	          | Set the event handler when button is blurred. Button passes two parameters 'event' and 'originalEvent'
 *  | function | 'onSelected'             | Set the event handler when button is selected. Button passes two parameters 'event' and 'originalEvent'. In toggle button, selected  indicating selected or not is passed as third parameter additionally.
 * 
 * Example
 * --
 *
 * **js**
 * ~~~~~~
 *  $('#button').caphButton({
 *  	onFocused :function(event,originalEvent){
 *  	  // add the action you want in Focused
 *  		},
 *  	onBlurred:function(event,originalEvent){
 *  	// add the action you want in Blurred
 *  	},
 *  	focusOption: {
 *  		name :"testtest",
 *  		depth : 0,
 *  		group : "testgroup",
 *  		disabled : false,
 *  		initialFocus: true
 *  		},
 *  	toggle : true,
 *  	onSelected :function(event,originalEvent,selected){
 *  		//In toggle button, 'selected' is passed additionally. Through selected , you can check toggle button is selected or not.
 *  		//In normal button, 'selected' isn't passed to select event handler
 *  	}
 * });
 * ~~~~~~
 *
 * **html**
 * ~~~~~~
 * <div id="button">Sample Button</div>
 * ~~~~~~
 *
 */
(function ($) {
	'use strict';

	$.fn.caphButton=function(options) {

		// apply default options
		options = options || {};
		var settings = $.extend({}, $.fn.caphButton.defaults, options);


		return this.each(function() {
			var toggleMode = options.toggle || false;
			var selected = false;
			var self = $(this);
						
			self.attr('focusable','');
			$.caph.focus.Util.setData(this, options.focusOption);
			$.caph.focus.$$toAvailable(this);

			self.addClass(settings.buttonClass);
			self.on('focused', function(event, originalEvent){
				$.isFunction(options.onFocused) && options.onFocused(event, originalEvent);
			});

			self.on('blurred', function(event, originalEvent){
				$.isFunction(options.onBlurred) && options.onBlurred(event, originalEvent);
			});
			self.on('selected', function(event, originalEvent){
				if(toggleMode) {
					//pass the selected which informs the button is clicked or not.
					selected = !selected;
					$.isFunction(options.onSelected) && options.onSelected(event,originalEvent, selected);
					self.toggleClass('selected');
				}
				else {
					$.isFunction(options.onSelected)&& options.onSelected(event,originalEvent);
				}
			});

		});
	};
	// define default options
	$.fn.caphButton.defaults = {
		buttonClass : 'caph-button'
	};

})(jQuery);
/**
 *
 * @name jQuery.fn.caphCheckbox
 * @kind jq-plugin
 * @memberOf jQuery.fn
 * @description
 *
 * caph-checkbox provides checkbox supporting the caph's focus and key navigation  {@link caph.focus}
 * With caph-checkbox, you can set basic checkbox which provides the text and checkbox.
 * Caph checkbox set default action, you can change style or action through option and event handler.
 * When checkbox is focused or blurred, 'focused' class is attached or detached automatically
 * Details about available focus option
 * Also, when checked the 'checked' class attached at the checkbox. You can set focus/blur/check action easily through css class
 * You can set the event handler actions like example.
 *
 *  | type     | option                   | description                                                                                                                                                                                                                    |
 *  |----------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | object   | 'focusOption'            | focus name, focus group, disabled, initialfocus....
 *  | string   | 'checkboxClass'          | Default checkbox class which applied in unchecked checkbox. When checked, 'checked' css class added automatically.
 *  | boolean  | 'checked'                | Set the initial status of checkbox (checked, unchecked)
 *  | function | 'onFocused'                | Set the event handler when Checkbox is focused. Checkbox passes two parameters '$event' and '$originalEvent'
 *  | function | 'onBlurred'	              | Set the event handler when Checkbox is blurred. Checkbox passes two parameters '$event' and '$originalEvent'
 *  | function | 'onSelected'               | Set the event handler when Checkbox is selected. Checkbox passes three parameters '$event', '$originalEvent' ,and 'checked'. 'checked' variable notifies checkbox is checked or not.
 *
 *
 * Example
 * --
 *
 *
 * **js**
 * ~~~~~~
 *   $('#checkbox').caphCheckbox({
 *                   focusOption: {
 *                       depth : 0,
 *                       group : "testgroup"
 *                   },
 *                   checked : true,
 *                   onFocused :function(event,originalEvent){
 *
 *                   },
 *                   onBlurred:function(event,originalEvent){
 *                   },
 *                   onSelected :function(event,originalEvent,selected){
 *
 *                   }
 *               }
 * );
 *
 * ~~~~~~
 *
 * **html**
 * ~~~~~~
 * <div id="checkbox">Checkbox</div>
 * ~~~~~~
 *
 *
 */

(function ($) {
    'use strict';

    $.fn.caphCheckbox=function(options) {

        // apply default options
        options = options || {};
        var settings = $.extend({}, $.fn.caphCheckbox.defaults, options);


        return this.each(function() {
        	
        	var self = $(this);
            self.attr('focusable','');
            $.caph.focus.Util.setData(this, options.focusOption);
            $.caph.focus.$$toAvailable(this);
            
            self.addClass(settings.checkboxClass);
            var checked = settings.checked || false;
            if(checked) {
                self.addClass('checked');
                self.attr('checked','');
            }

            self.on('focused', function(event, originalEvent){
                $.isFunction(options.onFocused) && options.onFocused(event, originalEvent);
            });
            self.on('blurred', function(event, originalEvent){
                $.isFunction(options.onBlurred) && options.onBlurred(event, originalEvent);
            });
            self.on('selected', function(event, originalEvent){
                checked = !checked;
                if(self.attr('checked')) {
                	self.removeAttr('checked');
                }
                else {
                	self.attr('checked','');
                }
                
                $.isFunction(options.onSelected) && options.onSelected(event,originalEvent, checked);
                self.toggleClass('checked');
            });

        });
    };
    // define default options
    $.fn.caphCheckbox.defaults = {
        checkboxClass : 'caph-checkbox'
    };

})(jQuery);
/**
 * @name jQuery.fn.caphContextMenu
 * @memberOf jQuery.fn
 * @kind jq-plugin
 * @description
 *  caph-context-menu plugin is used to provide users with an easy hierarchical menu.
 *
 *  There are some templates for decorating each item.
 *  (caph-context-menu-item-template, caph-context-menu-arrow-up-template, caph-context-menu-arrow-down-template)
 *
 *  ###Options###
 *  This plugin's init function need option object to define behavior. It's properties can be defined like below.
 *
 *  ####items####
 *  Context-menu needs a specific format to work with JSON. It is array type of the object and each item has two required fields: id & content.
 *  Each menu-item of the sub-menu is represented by an object. So all objects should be arranged by you want to show.
 *  * id (required) : identifier of each menu-item. It is used as parameter of 'on-select-item' callback function.
 *  * content (required) : string or tags, it is served as the menu-item content.
 *  * parent : If the menu-item is child of any other one, 'parent' property should be set to parent's id.
 *  * disabled : If the menu-item should be not selectable, this should be set to true.
 *  ~~~~~~
 *  [
 *      {
 *          id          : "string", // required
 *          content     : "string", // required
 *          parent      : "string", // parent's id
 *          disabled     : boolean
 *      },
 *      ...
 *  ]
 *  ~~~~~~
 *  If you need any other properties, define it on each object. Then you can use it on item template.
 *
 *
 *  ####menuOption####
 *  Menu's option for each depth that is start from 0. it can contain the property like below.
 *  * style : Used to decorate each sub-menu.
 *  * offset (only for sub-menu) : Used to define position of sub-menu.
 *  * class : Used to set class name for sub-menu.
 *  * visibleItemCount : Used to limit menu-item count to view. If this value is set and item count is bigger than it, arrow buttons will be show on each menu.
 *
 *
 *  ####position####
 *  absolute coordinate of context menu. If you don't set this value, menu's position will depend on css style.
 *
 *  ####focusableDepth####
 *  Initial number of depth for focusable element. Focusable depth of each sub-menu will increase from this value. So it's important to avoid possible duplication.
 *
 *  ####onSelectItem####
 *  the callback function of the select event on each item. This function can have parameters as '$itemId' and '$event'. '$itemId' is the item's id user select. '$event' is event object of jQuery.
 *
 *  ####onFocusItem####
 *  the callback function of the focus event on each item. This function can have parameters as '$event' that is event object of jQuery.
 *
 *  ####onBlurItem####
 *  the callback function of the blur event on each item. This function can have parameters as '$event' that is event object of jQuery.
 *
 *
 *  ###Templates###
 *
 *  ####item template####
 *  'caph-context-menu' can contain 'caph-context-menu-item-template' element for decorating each menu-item.
 *
 *  'caph-context-menu-item-template' is a template element of each menu item. it can contain html in the tag.
 *  So user can use properties of each menu item and decorate text or add image or another html elements.
 *  If you add more property to item, you can use this property in 'caph-context-menu-item-template'
 *  ~~~~~~
 *  [item]
 *  {id: 'korea', content: 'Korea, KR', textColor: 'white'}
 *
 *  [template]
 *  <div class="caph-context-menu-item-template"><span style="color:{{textColor}}">{{content}} ({{name}})</span></div>
 *  ~~~~~~
 *  When you use this template, you can see dom structure like below
 *  ~~~~~~
 *  <div class="caph-context-menu">
 *      <ul>
 *          <li>
 *              <span style="color:white;">Korea, KR (KR)</span>
 *          </li>
 *      </ul>
 *  </div>
 *  ~~~~~~
 *
 *  ####arrow-up / arrow-down button templates####
 *  'caph-context-menu-arrow-up-template' and 'caph-context-menu-arrow-down-template' also provide templates for arrow buttons.
 *  If visibleItemCount option is set, each sub-menu have arrow buttons for scrolling.
 *  You can define these elements for decorating arrow buttons.
 *  ~~~~~~
 *  <div class="caph-context-menu-arrow-up-template">▲</div>
 *  <div class="caph-context-menu-arrow-down-template">▼</div>
 *  ~~~~~~
 *
 *
 * ###Example###
 *
 * **js**
 * ~~~~~~
 *  var menu0 = $('#contextMenu0').caphContextMenu({
 *      items : [
 *          {id: 'korea', content: 'Korea, KR'},
 *          {id: 'usa', content: 'United State, US'},
 *          {id: 'la', content: 'LA', parent: 'usa'},
 *          {id: 'ny', content: 'Newyork', parent: 'usa'},
 *          {id: 'te', content: 'Texas', parent: 'usa'},
 *          {id: '1', content: 'One', parent: 'te'},
 *          {id: '2', content: 'Twe', parent: 'te'},
 *          {id: '3', content: 'Three', parent: 'te'},
 *          {id: 'china', content: 'China, CN'},
 *          {id: 'japan', content: 'Japan, JP'},
 *          {id: 'tiwan', content: 'TIWAN, TW'}
 *      ],
 *      menuOption: {
 *          0: {
 *              style: {
 *                  width: '300px'
 *              }
 *          },
 *          1: {
 *              offset: {x: -50, y:0}
 *          }
 *      },
 *      position: {x: 200, y: 140},
 *      focusableDepth: 2000,
 *      onSelectItem: function($itemId, $event){
 *          console.log($itemId + ' is selected. +++++++++++++++++++++++++++++++++++++++++++++++++++');
 *          menu0.caphContextMenu('close');
 *      },
 *      onFocusItem: function($event){
 *          console.log('focusItem');
 *      },
 *      onBlurItem: function($event){
 *          console.log('blurItem');
 *      }
 *  });
 *  $('#btnContextMenu0').on('selected', function(){
 *      menu0.caphContextMenu('open');
 *  });
 * ~~~~~~
 *
 * **html**
 * ~~~~~~
 *  <div id="btnContextMenu0" class="sample-button" focusable data-focusable-depth="0" data-focusable-initial-focus="true">
 *      <div class="button-text">Sample</div>
 *  </div>
 *
 *  <div id="contextMenu0">
 *      <div class="caph-context-menu-item-template">${content}</div>
 *      <div class="caph-context-menu-arrow-up-template">▲</div>
 *      <div class="caph-context-menu-arrow-down-template">▼</div>
 *  </div>
 *  ~~~~~~
 */
(function($){
    'use strict';
    var Constant = {
        DEFAULT : {
            focusableDepth : 10000
        }
    };

    var privateMethods = {
        itemCount: 0,
        createUniqueId: function(){
            return (this.itemCount++) + '_' + Math.random().toString(36).substr(2, 6);
        },
        translateTo: function(element, x, y){
            if(element) {
                element.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
            }
        },
        getSuitablePosition: function(element, positionList, checkOnlyWidth){
            var offset = element.offset();
            for(var i in positionList){
                if(offset.left + positionList[i].x > 0 &&
                    offset.left + positionList[i].x + element.outerWidth() < $(window).width() &&
                    (checkOnlyWidth || (offset.top + positionList[i].y > 0 && offset.top + positionList[i].y + element.outerHeight() < $(window).height()))){
                    return positionList[i];
                }
            }
            return positionList.length > 0 ? positionList[0] : undefined;
        },
        getCalculatedOffset: function(element, position){
            var offset = element.offset();
            return {
                x: position.x - offset.left,
                y: position.y - offset.top
            };
        },
        convertTemplateToHtml: function(templateString, data){
            var ret = templateString.replace( /([\\'])/g, '\\$1' )
                .replace( /[\r\t\n]/g, ' ' )
                .replace( /\$\{([^\}]*)\}/g,
                function(matched, p1) {
                    return data[p1] || '';
                });
            return ret;
        },
        makeSubMenu: function(menuId, menuData, menuList, itemTemplate, arrowUpTemplate, arrowDownTemplate){
            menuData.option = menuData.option || {};

            var menuWrapper = $('<div class="caph-context-menu"></div>')
                .data('option', menuData.option || {}).data('focusableDepth', menuData.focusableDepth)
                .data('parentId', menuData.parentId).data('previousDepth', menuData.previousDepth);
            if(menuId !== 'root'){
                menuWrapper.attr('id', 'sub_'+menuId);
            }
            if(menuData.option.class){
                menuWrapper.addClass(menuData.option.class);
            }
            var itemWrapper = $('<ul></ul>').data({ subMenuId: menuId, scrollCount: 0, visibleItemCount: menuData.option.visibleItemCount });
            if(menuData.itemList) {
                for (var i in menuData.itemList) {
                    var content = itemTemplate ? this.convertTemplateToHtml(itemTemplate, menuData.itemList[i]) : menuData.itemList[i].content;
                    var menuItem = $('<li focusable id="' + menuData.itemList[i].id + '"></li>').append(content);

                    menuList[menuData.itemList[i].id] && menuItem.addClass('hasSubMenu');
                    $.caph.focus.Util.setData(menuItem, {
                        depth: menuData.focusableDepth,
                        initialFocus: (i === 0),
                        disabled: menuData.itemList[i].disabled
                    });
                    if(menuData.itemList[i].disabled){
                        menuItem.addClass('disabled');
                    }
                    $.caph.focus.$$toAvailable(menuItem);
                    itemWrapper.append(menuItem);
                }
            }

            if(menuData.option && menuData.option.visibleItemCount && menuData.option.visibleItemCount < menuData.itemList.length){
                var arrowUp = $('<div class="arrow-up"></div>').append(arrowUpTemplate);
                var arrowDown = $('<div class="arrow-down"></div>').append(arrowDownTemplate);
                menuWrapper.append(arrowUp).append(itemWrapper).append(arrowDown);
            } else {
                menuWrapper.append(itemWrapper);
            }

            if(menuId !== 'root'){
                menuWrapper.hide(); // If menu has parentId, it is sub-menu.
            }
            return menuWrapper;
        },
        createSubMenuData: function(data, focusableDepth, menuOption){ // Convert data for context menu directive.
            var dataObj = {};
            for(var i in data){
                if(!data[i].parent){
                    data[i].parent = 'root';
                }
                if(!data[i].id || !data[i].content){
                    throw $.error('each data should have properties \'id\' and \'content\'');
                }
                if(dataObj[data[i].id]){
                    throw $.error('Item\'s id is duplicated. (id = \'' + data[i].id  + '\')');
                }
                dataObj[data[i].id] = data[i];
            }

            var menuList = {};
            var createInitialSubMenu = function(menuId, focusableDepth){
                menuList[menuId] = {
                    focusableDepth: focusableDepth + Object.keys(menuList).length,
                    previousDepth: undefined,
                    menuDepth: undefined,
                    itemList: [],
                    option: {},
                    show: false
                };
            };
            createInitialSubMenu('root', focusableDepth);

            for(var j in data){
                if(!menuList[data[j].parent]){
                    createInitialSubMenu(data[j].parent, focusableDepth);
                }
                menuList[data[j].parent].itemList.push(data[j]);
            }
            for(var key in menuList){
                if(key === 'root'){
                    menuList[key].menuDepth = 0;
                } else {
                    if(!dataObj[key]){
                        throw $.error('Parent item is not exist for the item (id = \'' + key  + '\')');
                    }
                    var searchKey = key;
                    var count = 1;
                    var previousDepth = menuList[dataObj[searchKey].parent].focusableDepth;
                    while(dataObj[searchKey] && dataObj[searchKey].parent !== 'root'){
                        searchKey = dataObj[searchKey].parent;
                        count++;
                    }
                    menuList[key].previousDepth = previousDepth;
                    menuList[key].menuDepth = count;
                    menuList[key].parentId = dataObj[key].parent;
                }
                if (menuOption[menuList[key].menuDepth]) {
                    menuList[key].option = menuOption[menuList[key].menuDepth];
                }
            }
            return menuList;
        },
        showSubMenu: function(subMenuId, parentElement){
            var subMenuElement = $('#sub_' + subMenuId);
            var menuOption = subMenuElement.data('option');
            subMenuElement.show();
            parentElement.addClass('opened');
            var contextMenuOffset = subMenuElement.parent().offset();
            var targetOffset = parentElement.offset();
            var customOffset = menuOption.offset || {x:0, y:0};
            var finalOffset = privateMethods.getSuitablePosition(subMenuElement, [
                {
                    x: parentElement.outerWidth() + targetOffset.left - contextMenuOffset.left + customOffset.x,
                    y: targetOffset.top - contextMenuOffset.top + customOffset.y
                },
                {
                    x: targetOffset.left - contextMenuOffset.left - subMenuElement.outerWidth() - customOffset.x,
                    y: targetOffset.top - contextMenuOffset.top + customOffset.y
                }
            ], true);

            privateMethods.translateTo(subMenuElement, finalOffset.x, finalOffset.y);
            $.caph.focus.controllerProvider.getInstance().setDepth(subMenuElement.data('focusableDepth'));

            // set menu's height if visibleItemCount > 0
            var childrenElements = subMenuElement.find('>ul>li');
            menuOption.visibleItemCount = Math.min(childrenElements.length, menuOption.visibleItemCount);
            if(menuOption.visibleItemCount){
                if(!menuOption.style){
                    menuOption.style = {};
                }
                menuOption.style['height'] = childrenElements.outerHeight() * menuOption.visibleItemCount;
                menuOption.style['overflow'] = 'hidden';
            }
            if(menuOption.style){
                subMenuElement.find('ul:first').css(menuOption.style);
            }
        },
        hideSubMenu: function(subMenuId){
            var menuList = $('#sub_' + subMenuId).closest('.caph-context-menu').parent().data('menuList');
            if(menuList) {
                $('#' + subMenuId).removeClass('opened');
                $('#sub_' + subMenuId).hide();
                for (var key in menuList) {
                    if (menuList[key].parentId === subMenuId) {
                        $('#' + key).removeClass('opened');
                        $('#sub_' + key).hide();
                    }
                }
                var focusController = $.caph.focus.controllerProvider.getInstance();
                if (focusController.getCurrentDepth() === menuList[subMenuId].focusableDepth) {
                    focusController.setDepth(menuList[subMenuId].previousDepth);
                }
            }
        },
        hideAllSubMenu: function(subMenuList){
            for(var key in subMenuList){
                if(key !== 'root'){
                    $('#' + key).removeClass('opened');
                    $('#sub_'+key).hide();
                }
            }
            $.caph.focus.controllerProvider.getInstance().setDepth(subMenuList['root'].focusableDepth);
        },
        scrollUpDown: function(target, direction, visibleItemCount, count){
            var targetObjects = target.find('li');
            count = Math.abs(count) || 1;

            if(direction === 'up' && target.data('scrollCount') > 0){
                target.data('scrollCount', target.data('scrollCount') - count);
            } else if(direction === 'down' && target.data('scrollCount') < targetObjects.length - visibleItemCount){
                target.data('scrollCount', target.data('scrollCount') + count);
            }
            this.translateTo(targetObjects, 0, target.data('scrollCount') * targetObjects.eq(0).outerHeight() * (-1));
        }
    };

    // event handlers
    var onSelectItem = function($event){
        var menuItemElement = $($event.currentTarget);
        var menuId = menuItemElement.attr('id');
        var rootElement = $($event.currentTarget).closest('.caph-context-menu').parent();
        var menuList = rootElement.data('menuList');

        if(menuList && menuList[menuId]){ // the menu item has sub-menu. toggle sub menu.
            if($('#sub_' + menuId).css('display') === 'none'){
                privateMethods.showSubMenu(menuId, menuItemElement);
            } else {
                privateMethods.hideSubMenu(menuId);
            }
        } else {
            (rootElement.data('option').onSelectItem || $.noop)(menuItemElement.attr('id'), event);
        }
    };
    var onClickItem = function($event){ // Sub-menu is opened, but mouse is not moved to the sub-menu element. then sub-menu should be closed.
        var menuId = $($event.currentTarget).attr('id');
        var menuElement = $('#sub_'+menuId);
        var timeout = setTimeout(function () {
            privateMethods.hideSubMenu(menuId);
            menuElement.data('timeout', undefined);
        }, 700);
        menuElement.data('timeout', timeout);
    };
    var onSelectUpButton = function($event){ // for click arrow-up button.
        var target = $($event.currentTarget).next();
        privateMethods.scrollUpDown(target, 'up', target.data('visibleItemCount'));
    };
    var onSelectDownButton = function($event){ // for click arrow-down button.
        var target = $($event.currentTarget).prev();
        privateMethods.scrollUpDown(target, 'down', target.data('visibleItemCount'));
    };
    var onMouseOverEachItem = function($event){ // for mouse over on each menu-item. focus each item.
        $.caph.focus.controllerProvider.getInstance().setDepth($($event.currentTarget).data('focusableDepth'));
        $.caph.focus.controllerProvider.getInstance().focus($event.currentTarget);
    };
    var onMouseLeaveSubmenu = function($event){ // for mouse leave on each sub-menu, Set timeout of hiding sub-menu.
        var menuElement = $($event.currentTarget);
        var subMenuId = menuElement.find('ul:first').data('subMenuId');
        if(subMenuId !== 'root') {
            if (subMenuId) {
                var timeout = setTimeout(function () {
                    privateMethods.hideSubMenu(subMenuId); // menuList is required at here.
                    menuElement.data('timeout', undefined);
                }, 50);
                menuElement.data('timeout', timeout);
            }
        }
    };
    var onMouseOverSubmenu = function($event){ // for mouse over on each sub-menu, Cancel timeout of hiding sub-menu.
        var menuElement = $($event.currentTarget);
        var subMenuId = menuElement.find('ul:first').data('subMenuId');
        if(subMenuId !== 'root'){
            var parentId = menuElement.data('parentId');
            if(menuElement.data('timeout')) {
                clearTimeout(menuElement.data('timeout'));
                menuElement.data('timeout', undefined);
            }

            if(parentId){
                var element = $('#sub_' + parentId);
                clearTimeout(element.data('timeout'));
                element.data('timeout', undefined);
            }
        }
    };
    var onClickDocument = function(){ // If use click the outside of context-menu, the context-menu should be closed.
        var contextMenuElement = $('.caph-context-menu').parent();
        contextMenuElement.each(function(){
            if($(this).css('display') !== 'none'){
                methods.close.apply($(this));
            }
        });
    };
    var keydownHandler = function(context){
        var itemWrapperElement, targetObjects, curIndex;
        if(context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.LEFT) {
            var contextMenuElement = $(context.currentFocusItem).closest('.caph-context-menu').parent();
            var subMenuId = $(context.currentFocusItem).parent().data('subMenuId');

            if(subMenuId === 'root'){
                methods.close.apply(contextMenuElement);
                return false;
            } else {
                privateMethods.hideSubMenu(subMenuId);
            }
        } else if(context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.DOWN){
            itemWrapperElement = $(context.currentFocusItem).parent();
            if(itemWrapperElement.data('visibleItemCount')) {
                targetObjects = itemWrapperElement.find('li');
                curIndex = jQuery.inArray(context.currentFocusItem, targetObjects);

                var count = curIndex - itemWrapperElement.data('scrollCount') - itemWrapperElement.data('visibleItemCount') + 1;
                if(curIndex - itemWrapperElement.data('scrollCount') >= itemWrapperElement.data('visibleItemCount')){
                    privateMethods.scrollUpDown(itemWrapperElement, 'down', itemWrapperElement.data('visibleItemCount'), count);
                }
            }
        } else if(context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.UP){
            itemWrapperElement = $(context.currentFocusItem).parent();
            if(itemWrapperElement.data('visibleItemCount')) {
                targetObjects = itemWrapperElement.find('li');
                curIndex = jQuery.inArray(context.currentFocusItem, targetObjects);

                if(curIndex - itemWrapperElement.data('scrollCount') < 0){
                    privateMethods.scrollUpDown(itemWrapperElement, 'up', itemWrapperElement.data('visibleItemCount'), itemWrapperElement.data('scrollCount') - curIndex);
                }
            }
        }
    };
    var onMouseOverContextMenu = function(){
        $(document).off('click', onClickDocument);
    };
    var onMouseLeaveContextMenu = function($event){
        var originDepth = $($event.currentTarget).data('originDepth');
        $.caph.focus.controllerProvider.getInstance().setDepth(originDepth);
        $(document).on('click', onClickDocument);
    };

    var methods = {
        init: function(param, update){
            var menuOption = param.menuOption || {};
            var items = param.items || {};
            var option = {};
            option.focusableDepth = param.focusableDepth || Constant.DEFAULT.focusableDepth;
            option.position = param.position;
            option.onSelectItem = param.onSelectItem || $.noop;
            option.onBlurItem = param.onBlurItem || $.noop;
            option.onFocusItem = param.onFocusItem || $.noop;

            if(!update) {
                if(this.data('initialized')){
                    throw $.error('This element is already initialized as a context menu.');
                }
            }
            var menuList = privateMethods.createSubMenuData(items, option.focusableDepth, menuOption);
            var itemTemplate = this.find('.caph-context-menu-item-template:first').hide().html();
            var arrowUpTemplate = this.find('.caph-context-menu-arrow-up-template:first').hide().html();
            var arrowDownTemplate = this.find('.caph-context-menu-arrow-down-template:first').hide().html();

            for(var id in menuList){
                this.append(privateMethods.makeSubMenu(id, menuList[id], menuList, itemTemplate, arrowUpTemplate, arrowDownTemplate));
            }
            this.data('initialized', true);
            this.data('option', option);
            this.data('menuOption', menuOption);
            this.data('menuList', menuList);
            this.hide();

			if('undefined' !== typeof window.Hammer) { // Support touch & gesture events.
				var scrollWrapper = this.find('.caph-context-menu > ul');
				var caphHammerController = new Hammer.Manager(scrollWrapper[0], {
					recognizers: [
						[
							Hammer.Pan, {direction: Hammer.DIRECTION_ALL}
						]
					]
				});

				var oldTransition;
				var targetObjs;
				var currentScrollHeight = 0;
				caphHammerController.on('panmove', function(ev){
					var ul = $(ev.target).parents('div.caph-context-menu>ul');
					if(!ul.data('subMenuId') || !checkScrollableElement(ul.data('visibleItemCount'), menuList[ul.data('subMenuId')].itemList.length)){
						return false;
					}
					privateMethods.translateTo(targetObjs, 0, currentScrollHeight + ev.deltaY);
				});
				caphHammerController.on('panstart', function(ev){
					var ul = $(ev.target).parents('div.caph-context-menu>ul');
					if(!ul.data('subMenuId') || !checkScrollableElement(ul.data('visibleItemCount'), menuList[ul.data('subMenuId')].itemList.length)){
						return false;
					}
					targetObjs = scrollWrapper.find('> li');
					currentScrollHeight = scrollWrapper.data('scrollCount') * targetObjs.outerHeight() * -1;

					oldTransition = targetObjs.css('transition');
					targetObjs.css('transition', 'transform 0s ease');
				});
				caphHammerController.on('panend', function(ev){
					var ul = $(ev.target).parents('div.caph-context-menu>ul');
					if(!ul.data('subMenuId') || !checkScrollableElement(ul.data('visibleItemCount'), menuList[ul.data('subMenuId')].itemList.length)){
						return false;
					}

					var itemHeight = targetObjs.outerHeight();
					if(ev.deltaY > 0){
						var deltaScrollIndex = Math.ceil(ev.deltaY / itemHeight) * -1;
					} else {
						var deltaScrollIndex = Math.floor(ev.deltaY / itemHeight) * -1;
					}

					var maxScrollableCount = ul.find('li').length - ul.data('visibleItemCount');
					if(scrollWrapper.data('scrollCount') + deltaScrollIndex < 0){ // Scroll 범위를 위로 벗어난 경우
						deltaScrollIndex = 0;
						scrollWrapper.data('scrollCount', 0);
					} else if(scrollWrapper.data('scrollCount') + deltaScrollIndex > maxScrollableCount){ // Scroll 범위를 아래로 벗어난 경우
						deltaScrollIndex = 0;
						scrollWrapper.data('scrollCount', maxScrollableCount);
					}

					var scrollHeight = (scrollWrapper.data('scrollCount') + deltaScrollIndex) * itemHeight * -1;
					privateMethods.translateTo(targetObjs, 0, scrollHeight);
					scrollWrapper.data('scrollCount', scrollWrapper.data('scrollCount') + deltaScrollIndex);

					oldTransition && targetObjs.css('transition', oldTransition);
				});

				var checkScrollableElement = function(visibleItemCount, itemCount){
					if($.isNumeric(visibleItemCount) && $.isNumeric(itemCount)) {
						return visibleItemCount < itemCount;
					} else {
						return false;
					}
				}
			}

            return this;
        },
        update: function(items){
            this.data('previous_focused_id', $($.caph.focus.controllerProvider.getInstance().getCurrentFocusItem()).attr('id'));
            methods.close.call(this);
            this.find('.caph-context-menu').remove();
            var option = this.data('option');
            methods.init.call(this, {
                items: items,
                menuOption: this.data('menuOption'),
                focusableDepth: option.focusableDepth,
                position: option.position,
                onSelectItem: option.onSelectItem,
                onBlurItem: option.onBlurItem,
                onFocusItem: option.onFocusItem
            }, true);
            return this;
        },
        open: function(position){
            position = position || this.data('option').position;
            this.show();
            var menuElement = this.find('.caph-context-menu:first');

            // move to specific position.
            if(position && jQuery.isNumeric(position.x) && jQuery.isNumeric(position.y)){
                privateMethods.translateTo(menuElement, 0, 0);
                var offset = privateMethods.getCalculatedOffset(menuElement, position);
                privateMethods.translateTo(menuElement, offset.x, offset.y);
            }

            // set menu's height if visibleItemCount > 0
            var childrenElements = menuElement.find('>ul>li');
            var menuOption = menuElement.data('option');
            menuOption.visibleItemCount = Math.min(childrenElements.length, menuOption.visibleItemCount);
            if(menuOption.visibleItemCount > 0){
                if(!menuOption.style){
                    menuOption.style = {};
                }
                menuOption.style['height'] = childrenElements.outerHeight() * menuOption.visibleItemCount;
                menuOption.style['overflow'] = 'hidden';
            }
            if(menuOption.style){
                menuElement.find('ul:first').css(menuOption.style);
            }
            // set focusable depth
            var focusController = $.caph.focus.controllerProvider.getInstance();
            this.data('originDepth', focusController.getCurrentDepth());
            focusController.setDepth(this.data('option').focusableDepth);
            if(!focusController.getCurrentFocusItem()){
                var previousFocusItem = menuElement.find('#' + this.data('previous_focused_id'));
                if(previousFocusItem.length > 0){
                    focusController.focus(previousFocusItem);
                } else {
                    focusController.focus(menuElement.find('>ul>li:first-child'));
                }
            }

            // add event handler
            $.caph.focus.controllerProvider.addAfterKeydownHandler(keydownHandler);
            this.find('.arrow-up').on('click', onSelectUpButton);
            this.find('.arrow-down').on('click', onSelectDownButton);
            this.find('.caph-context-menu > ul > li')
                .on('mouseover', onMouseOverEachItem)
                .on('focused', this.data('option').onFocusItem)
                .on('blurred', this.data('option').onBlurItem)
                .on('selected', onSelectItem)
                .on('click', onClickItem);
            this.find('.caph-context-menu').on('mouseover', onMouseOverSubmenu).on('mouseleave', onMouseLeaveSubmenu);
            this.on('mouseover', onMouseOverContextMenu).on('mouseleave', onMouseLeaveContextMenu);
            setTimeout(function(){
                $(document).on('click', onClickDocument);
            }, 10);
            return this;
        },
        close: function(){
            privateMethods.hideAllSubMenu(this.data('menuList'));
            this.hide();
            // restore focusable depth
            var focusController = $.caph.focus.controllerProvider.getInstance();
            focusController.setDepth(this.data('originDepth'));

            // remove event handler
            $.caph.focus.controllerProvider.removeAfterKeydownHandler(keydownHandler);

            this.find('.arrow-up').off('click', onSelectUpButton);
            this.find('.arrow-down').off('click', onSelectDownButton);
            this.find('.caph-context-menu > ul > li')
                .off('mouseover', onMouseOverEachItem)
                .off('focused', this.data('option').onFocusItem)
                .off('blurred', this.data('option').onBlurItem)
                .off('selected', onSelectItem)
                .off('click', onClickItem);
            this.find('.caph-context-menu').off('mouseover', onMouseOverSubmenu).off('mouseleave', onMouseLeaveSubmenu);
            this.off('mouseover', onMouseOverContextMenu).off('mouseleave', onMouseLeaveContextMenu);
            setTimeout(function(){
                $(document).off('click', onClickDocument);
            }, 10);
            return this;
        }
    };

    $.fn.caphContextMenu = function(options){
        if(this.length < 1){
            $.error('jQuery object is NOT selected.');
        }
        if(methods[options]){
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(!this.data('initialized') && (typeof options === 'object' || !options)) {
            if(this.length > 1){
                $.error('Select just one element for creating a dialog.');
            }
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.dialog');
        }
    };
})(jQuery);
/**
 * @name jQuery.fn.caphDialog
 * @memberOf jQuery.fn
 * @kind jq-plugin
 * @description
 *  'caph-dialog' is a floating window that contains title area, content area and button area.
 *  Each area can represent with each template described below.
 *
 *  ###Options###
 *  This plugin's init function need option object to define behavior. It's properties can be defined like below.
 *
 *  ####center####
 *  If this is true, the dialog will locate center of the screen.
 *
 *  ####position####
 *  The dialog's position which contains properties such as 'x' and 'y'. This value is available when 'center' is not defined.
 *
 *  ####focusOption####
 *  When the dialog is opened, focusable depth is changed to this value for focus control.
 *  Depth and group in properties are available for buttons of the dialog.
 *
 *  ####timeout####
 *  The time in milliseconds to hide after.
 *
 *  ####onOpen####
 *  After opening a dialog, this callback function is called.
 *
 *  ####onClose####
 *  After closing a dialog, this callback function is called.
 *
 *
 *  ###Templates###
 *  This plugin consists of 3 templates : 'caph-dialog-title', 'caph-dialog-content', 'caph-dialog-buttons'.
 *  Each template represents each area. So, If you put html tags into 'caphDialog' tag with other templates, then you can customize the layout of dialog.
 *  You also put html into template for decorating.
 *  ~~~~~~
 *  <div id="dialog3" class="caph-dialog" style="width: 1000px;">
 *      <div style="float:right;width: 80%;">
 *          <div class="caph-dialog-title" style="color:red;">My Title</div>
 *      </div>
 *  </div>
 *  ~~~~~~
 *
 *  'caph-dialog-buttons' template has an attribute: 'button-type'.
 *
 *  ####button-type####
 *  You can set 'button-type' as 'confirm' or 'alert'. Then dialog will have the buttons that is already defined.
 *  * confirm : Dialog have 2 buttons named 'Yes' and 'No'.
 *  * alert : Dialog have 1 button named 'OK'.
 *  button-type can be added in the future.
 *
 *
 *  ###Methods###
 *
 *  You can open or close by using 'open' or 'close' method.
 *  After opening or closing a dialog, the callback function is called that defined by option 'onOpen' or 'onClose'.
 *  ~~~~~~
 *  dialog2.caphDialog('open'); // Use with 'close' if you want to close the dialog.
 *  ~~~~~~
 *
 *
 * ###Example###
 *
 * **js**
 * ~~~~~~
 *  var dialog1 = $('#dialog1').caphDialog({
 *      center: true,
 *      focusOption: {
 *          depth: 1
 *      },
 *      onOpen: function(){
 *          console.log('dialog1 is opened.');
 *      },
 *      onClose: function(){
 *          console.log('dialog1 is closed.');
 *      },
 *      onSelectButton: function(buttonIndex, event){
 *          console.log('dialog1 buttonCallback' + buttonIndex, event);
 *          dialog1.caphDialog('close');
 *      }
 *  });
 * ~~~~~~
 *
 * **html**
 * ~~~~~~
 *  <div id="dialog1" class="caph-dialog">
 *      <div class="caph-dialog-title" style="color:red;">My Title</div>
 *      <div class="caph-dialog-content" style="color:orange">
 *          There is immeasurable power in it.<br/>
 *          There is immeasurable power in it.
 *      </div>
 *      <div class="caph-dialog-buttons" button-type="confirm"></div>
 *  </div>
 *  ~~~~~~
 */
(function($){
    'use strict';
    var Constant = {
        DEFAULT : {
            focusableDepth : 9999
        }
    };

    var dialogManager = {
        dialogCount: 0,
        _dialogs: {},
        _dim: undefined,
        generateDialogId: function(){
            return (this.dialogCount++) + '_' + new Date().getTime();
        },
        addDialog: function(id, element, option){
            if(!this.getDialog(id)){
                this._dialogs[id] = {
                    element: element,
                    option: option,
                    isOpened: false
                };
            } else {
                $.error('Dialog ID (' + id + ') is already registered.');
            }
        },
        removeDialog: function(id){
            if(this._dialogs[id]) {
                delete this._dialogs[id];
                this.dialogCount--;
            }
        },
        getDialog: function(id){
            return this._dialogs[id];
        },
        createDim: function(){
            if(!this._dim){
                this._dim = $('<div class="caph-dim-init"></div>');
                $('body').append(this._dim);
            }
        },
        activateDim: function(){
            if(!this._dim){
                this.createDim();
            }
            this._dim.addClass('caph-dim-translucent');
        },
        deactivateDim: function(){
            if(this._dim){
                this._dim.removeClass('caph-dim-translucent');
            }
        },
        manageModal: function(id, isOpened){
            var dialog = this.getDialog(id);
            if(!dialog){
                $.error('Dialog (' + id + ') is not registered. Is this id correct?');
            }
            dialog.isOpened = isOpened;

            if(dialog.option.modal) {
                if (isOpened) {
                    this.activateDim();
                } else {
                    this.deactivateDim();
                }
                for(var i in this._dialogs){
                    if(i !== id && this._dialogs[i].option.modal && this._dialogs[i].isOpened){
                        this._dialogs[i].element.hide();
                        this._dialogs[i].isOpened = false;
                    }
                }
            }
        }
    };

    var DialogUtil = {
        /**
         * @name DialogUtil#translateTo
         * @kind function
         * @memberOf caph
         * @description Translate the element to designated position which is specified by params
         *
         * @param {DOMElement|jQuery} element The target object.
         * @param {number} x x-coordinate of the position to move. (unit: pixel)
         * @param {number} y y-coordinate of the position to move. (unit: pixel)
         */
        translateTo: function(element, x, y){
            if(element && element.length > 0) {
                var translateString = 'translate3d(' + x + 'px,' + y + 'px, 0)';
                element.css({
                    'transform': translateString
                });
            }
        },
        /**
         * @name DialogUtil#moveToCenter
         * @kind function
         * @memberOf caph
         * @description Translate the element to center of window.
         *
         * @param {DOMElement|jQuery} element The target object.
         */
        moveToCenter: function(element){
            if(element && element.length > 0){
                var left = Math.max($(window).width()/2 - element.width()/2, 0);
                var top = Math.max($(window).height()/2 - element.height()/2, 0);
                left = left - (element.get(0).offsetLeft * 1);
                this.translateTo(element, left, top);
            }
        },
        /**
         * @name DialogUtil#makeTitleWrapper
         * @kind function
         * @memberOf caph
         * @description Create dom element for title area.
         *
         * @returns {DOMElement}
         */
        makeTitleWrapper: function(){
            return $('<div class="title-area"><div class="title-wrapper"><div class="title"></div></div></div>');
        },
        /**
         * @name DialogUtil#makeContentWrapper
         * @kind function
         * @memberOf caph
         * @description Create dom element for content area.
         *
         * @returns {DOMElement}
         */
        makeContentWrapper: function(){
            return $('<div class="content-area"><div class="content"></div></div>');
        },
        /**
         * @name DialogUtil#makeDialogButton
         * @kind function
         * @memberOf caph
         * @description Create dom element for button.
         *
         * @param {String} btnText Text to show on the button.
         * @param {Number} index Number to represent the order of buttons.
         * @param {Function} callback The function to be called when the button is clicked or selected.
         * @param {Object} focusable Fucusable information for the button. it should include focusable-depth, initial-focus.
         *
         * @returns {DOMElement}
         */
        makeDialogButton: function(btnText, index, callback, focusable){
            var button = $('<div focusable class="caph-dialog-button"></div>');
            var buttonText = $('<div class="button-text"></div>').html(btnText);
            button.append(buttonText).on('selected', function(event){
                callback && callback(index, event);
            });
            if(focusable){
                $.caph.focus.Util.setData(button, focusable);
            }
            if(!window.MutationObserver){
                $.caph.focus.$$toAvailable(button[0]);
            }
            return button;
        }
    };

    var methods = {
        /**
         * @name caph.dialog-plugin.init
         * @memberOf caph
         * @kind function
         * @description Make each areas(title, content, buttons) and apply options which is delivered through parameter.
         *
         * @param {Object} option Option values which apply to a dialog.
         */
        init: function(option){
            option = option || {};
            option.modal = true;
            option.focusOption = option.focusOption || {depth: Constant.DEFAULT.focusableDepth, group: 'default'};
            option.focusOption.group = option.focusOption.group || 'default';

            this.addClass('caph-dialog');
            if(this.data('initialized')){
                throw $.error('This element is already initialized as a dialog.');
            }
            var titleElements = this.find('.caph-dialog-title');
            var contentElements = this.find('.caph-dialog-content');
            var buttonsElements = this.find('.caph-dialog-buttons');
            titleElements.each(function(){
                $(this).wrap(DialogUtil.makeTitleWrapper());
            });
            contentElements.each(function(){
                $(this).wrap(DialogUtil.makeContentWrapper());
            });
            buttonsElements.each(function(){
                var button_area = $('<div>').addClass('caph-dialog-button-area');
                var button_wrapper = $(this).addClass('button-wrapper');
                button_wrapper.wrap(button_area);
                if(button_wrapper.attr('button-type') === 'confirm') {
                    var yesButton = DialogUtil.makeDialogButton('Yes', 0, option.onSelectButton, {
                        depth: option.focusOption.depth,
                        group: option.focusOption.group,
                        initialFocus: true
                    });
                    var noButton = DialogUtil.makeDialogButton('No', 1, option.onSelectButton, {
                        depth: option.focusOption.depth,
                        group: option.focusOption.group,
                        initialFocus: false
                    });
                    button_wrapper.append(yesButton);
                    button_wrapper.append(noButton);
                } else if(button_wrapper.attr('button-type') === 'alert') {
                    var okButton = DialogUtil.makeDialogButton('OK', 0, option.onSelectButton, {
                        depth: option.focusOption.depth,
                        group: option.focusOption.group,
                        initialFocus: true
                    });
                    button_wrapper.append(okButton);
                }
            });

            this.data('initialized', true);
            this.data('id', dialogManager.generateDialogId());

            dialogManager.addDialog(this.data('id'), this, option);
            this.hide();

            return this;
        },
        /**
         * @name caph.dialog-plugin.open
         * @memberOf caph
         * @kind function
         * @description Show a dialog
         *
         * @param {Number} time Time to hide a dialog. (unit: miliseconds)
         */
        open: function(timeToClose){
            this.show();
            var dialog = dialogManager.getDialog(this.data('id'));
            var option = dialog.option;
            if (!dialog) {
                $.error('Dialog (' + this.data('id') + ') is not registered. Is this id correct?');
            }
            if(option){
                if(option.center){
                    DialogUtil.moveToCenter(this);
                } else if(dialog.option.position) {
                    DialogUtil.translateTo(this, option.position.x, option.position.y);
                }
            }
            dialogManager.manageModal(this.data('id'), true);

            var focusController = $.caph.focus.controllerProvider.getInstance();

            this.data('originFocusOption', {
                depth: focusController.getCurrentDepth(),
                group: focusController.getCurrentGroup()
            });
            focusController.setDepth(option.focusOption.depth, option.focusOption.group);

            if(option && jQuery.isFunction(option.onOpen)){
                option.onOpen();
            }
            if(this.data('timeout')){
                clearTimeout(this.data('timeout'));
                this.removeData('timeout');
            }
            if(jQuery.isNumeric(timeToClose) || option && jQuery.isNumeric(option.timeout)){
                var timeout = setTimeout(function(){
                    methods.close.apply(this);
                    this.removeData('timeout');
                }.bind(this), timeToClose || option.timeout);
                this.data('timeout', timeout);
            }
        },
        /**
         * @name caph.dialog-plugin.close
         * @memberOf caph
         * @kind function
         * @description Hide a dialog
         */
        close: function(){
            var dialog = dialogManager.getDialog(this.data('id'));
            var option = dialog.option;
            if(!dialog){
                $.error('Dialog (' + this.data('id') + ') is not registered. Is this id correct?');
            }
            dialogManager.manageModal(this.data('id'), false);
            this.hide();

            var focusController = $.caph.focus.controllerProvider.getInstance();
            if(this.data('originFocusOption')){
                focusController.setDepth(this.data('originFocusOption').depth, this.data('originFocusOption').group);
            }
            if(this.data('timeout')){
                clearTimeout(this.data('timeout'));
                this.removeData('timeout');
            }
            if(option && typeof option.onClose === 'function'){
                option.onClose();
            }
        },
        /**
         * @name caph.dialog-plugin.destroy
         * @memberOf caph
         * @kind function
         * @description Destroy dom of the dialog and unregister the dialog from dialogManager.
         */
        destroy: function(){
            dialogManager.removeDialog(this.data('id'));
            this.remove();
        }
    };

    $.fn.caphDialog = function(options){
        if(methods[options]){
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(!this.data('initialized') && (typeof options === 'object' || !options)) {
            if(this.length > 1){
                $.error('Select just one element for creating a dialog.');
            }
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.dialog');
        }
    };
})(jQuery);
/**
 * @name jQuery.fn.caphDropdownList
 * @memberOf jQuery.fn
 * @kind jq-plugin
 * @description
 *  caph-dropdown-list provides users with toggleable list that allows the user to choose one from a predefined list.
 *
 *  ###Options###
 *  This plugin's init function need option object to define behavior. It's properties can be defined like below.
 *
 *  ####items####
 *  Dropdown list needs a specific format to work with JSON. It is array type of the object and each item has two required fields: id & content.
 *  Each item of the list is represented by an object. So all objects should be arranged by you want to show.
 *  * id (required) : identifier of each item. It is used as parameter of 'on-select-item' callback function.
 *  * content (required) : string or tags, it is served as the item content.
 *  * disabled : If the item should be not selectable, this should be set to true.
 *  ~~~~~~
 *  [
 *      {id: 'copy', content: 'Copy'},
 *      {id: 'cut', content: 'Cut'},
 *      {id: 'paste', content: 'Paste', disabled: true},
 *      {id: 'forward', content: 'Forward'}
 *  ]
 *  ~~~~~~
 *
 *  ####visibleItemCount####
 *  Used to limit item count to view. If this value is set and item count is bigger than it, arrow buttons will be show on list.
 *
 *  ####focusOption####
 *  Values to be set on this dropdown list. If you need to know more information, refer to focus directive document.
 *
 *  ####onSelectItem####
 *  the callback function of the select event on each item. This function can have parameters as '$itemId' and '$event'.
 *  '$itemId' is the item's id user select.
 *  '$event' is event object of jQuery.
 *
 *
 *  ###Templates###
 *  Dropdown list provides 4 templates for customizing.
 *  Your code in the templates will be place in predefined 'div' tags.
 *
 *  ####item template####
 *  User can decorate each item of list using 'caph-dropdown-list-item-template' class.
 *  In this tag, you can use properties of each item.
 *  ~~~~~~
 *  [item]
 *  {id: 'korea', content: 'Korea, KR', textColor: 'blue'}
 *
 *  [template]
 *  <div id="dropdownList0">
 *      <div class="caph-dropdown-list-item-template">
 *          <span style="color:{{textColor}}">{{content}}</span> ({{id}})
 *      </div>
 *  </div>
 *  ~~~~~~
 *  When you use this template, you can see dom structure like below
 *  ~~~~~~
 *  <div id="dropdownList0" class="caph-dropdown-list">
 *      <div class="textbox">
 *          <div class="label">
 *              <span style="color:blue;">Korea, KR</span> (korea)
 *          </div>
 *      </div>
 *  </div>
 *  ~~~~~~
 *
 *  ####placeholder template####
 *  User also can decorate placeholder using 'caph-dropdown-list-placeholder-template' class.
 *  ~~~~~~
 *  <div id="dropdownList0">
 *      <div class="caph-dropdown-list-placeholder-template">
 *          <div class="textbox"><div class="label">Action</div></div>
 *          <div class="button"><div class="label">▽</div></div>
 *      </div>
 *  </div>
 *  ~~~~~~
 *  After that, you can see 'action' and '▽' in placeholder area.
 *  ~~~~~~
 *  <div id="dropdownList0" class="caph-dropdown-list">
 *      <div class="placeholder">
 *          <div class="textbox">
 *              <div class="label">
 *                  <div class="textbox"><div class="label">Action</div></div>
 *                  <div class="button"><div class="label">▽</div></div>
 *              </div>
 *          </div>
 *      </div>
 *  </div>
 *  ~~~~~~
 *  'textbox' and 'button' classes are pre-defined for the most popular dropdown list.
 *  'textbox' class has properties 'width 95%, vertical align middle'.
 *  'button' class has properties 'float right, width 40px'.
 *  If you don't want to see this style, you can change this tags and classes.
 *
 *  ####arrow-up / arrow-down button templates####
 *  If the dropdown list need to be scrolled, user can define arrow buttons using 'caph-dropdown-list-arrow-up-template' and 'caph-dropdown-list-arrow-down-template'
 *  If it is not defined, dropdown list will not show you arrow buttons.
 *  ~~~~~~
 *  <div class="caph-dropdown-list-arrow-up-template">▲</div>
 *  <div class="caph-dropdown-list-arrow-down-template">▼</div>
 *  ~~~~~~
 *
 *
 * ###Example###
 *
 * **js**
 * ~~~~~~
 *  var dropdown0 = $('#dropdownList0').caphDropdownList({
 *      items: [
 *          {id: 'copy', content: 'Copy'},
 *          {id: 'cut', content: 'Cut'},
 *          {id: 'paste', content: 'Paste', disabled: true},
 *          {id: 'forward', content: 'Forward'}
 *      ],
 *      focusOption: {
 *          depth: 0
 *      },
 *      onSelectItem: function($itemId, $event){
 *          $('#selectedItemName').html($itemId);
 *      }
 *  });
 * ~~~~~~
 *
 * **html**
 * ~~~~~~
 *  <div id="dropdownList0">
 *      <div class="caph-dropdown-list-placeholder-template">
 *          <div class="textbox"><div class="label">Action</div></div>
 *          <div class="button"><div class="label">▽</div></div>
 *      </div>
 *      <div class="caph-dropdown-list-item-template">${content}</div>
 *  </div>
 *  ~~~~~~
 */
(function($){
    'use strict';
    var Constant = {
        DEFAULT : {
            focusableDepth : 20000
        }
    };

    var privateMethods = {
        translateTo: function(element, x, y){
            if(element) {
                element.css('transform', 'translate3d(' + x + 'px,' + y + 'px, 0)');
            }
        },
        convertTemplateToHtml: function(templateString, data){
            var ret = templateString.replace( /([\\'])/g, '\\$1' )
                .replace( /[\r\t\n]/g, ' ' )
                .replace( /\$\{([^\}]*)\}/g,
                function(matched, p1) {
                    return data[p1] || '';
                });
            return ret;
        },
        makePlaceholder: function(focusOption, placeholderTemplate){
            var placeholder = $('<div focusable class="placeholder"></div>').append(placeholderTemplate);
            $.caph.focus.Util.setData(placeholder, focusOption);
            if(!window.MutationObserver){
                $.caph.focus.$$toAvailable(placeholder);
            }
            return placeholder;
        },
        makeListItem: function(items, onSelectItem, visibleItemCount, focusOption, templates){
            var listContainer = $('<div class="list-container"></div>');
            var itemsView = $('<div class="list-items"></div>').data({
                visibleItemCount: visibleItemCount,
                scrollCount : 0
            });

            var selectedCallback = function($event){
                onSelectItem($($event.currentTarget).attr('id'), $event);
                var dropdownListElement = $($event.currentTarget).closest('.caph-dropdown-list');
                privateMethods.closeList.apply(dropdownListElement);
            };
            itemsView.on('selected', 'div', selectedCallback);
            if(items && items.length > 0){
                for(var i in items){
                    var contentView = templates.itemTemplate ? this.convertTemplateToHtml(templates.itemTemplate, items[i]) : items[i].content;
                    var itemView = $('<div focusable class="textbox"></div>').append($('<div class="label"></div>').append(contentView));
                    $.caph.focus.Util.setData(itemView, focusOption);
                    if(items[i].disabled){
                        itemView.data('disabled', true);
                        itemView.addClass('disabled');
                    }
                    if(!window.MutationObserver){
                        $.caph.focus.$$toAvailable(itemView);
                    }
                    itemsView.append(itemView.attr('id', items[i].id));
                }
            }
            var arrowUp = '', arrowDown = '';
            if(visibleItemCount && visibleItemCount < items.length){
                arrowUp = templates.arrowUpTemplate ? $('<div class="textbox arrow-up"></div>').append($('<div class="label center"></div>').append(templates.arrowUpTemplate)) : '';
                arrowDown = templates.arrowDownTemplate ? $('<div class="textbox arrow-down"></div>').append($('<div class="label center"></div>').append(templates.arrowDownTemplate)) : '';
            }
            return listContainer.append(arrowUp).append(itemsView).append(arrowDown).hide();
        },
        openList: function(){
            var listContainer = this.find('.list-container');
            var visibleItemCount = this.data('visibleItemCount');
            var items = this.data('items');
            var focusForList = this.data('focusForList');
            listContainer.show();

            if(visibleItemCount > 0 && visibleItemCount < items.length){
                this.find('.list-items').css({
                    height: visibleItemCount * this.find('.list-items>.textbox').outerHeight(),
                    overflow: 'hidden'
                });
            }

            var focusController = $.caph.focus.controllerProvider.getInstance();
            this.find('.list-items>.textbox').each(function(){
                if($(this).data('focusableDisabled') === true && $(this).data('disabled') !== true){
                    focusController.enable(this);
                    $.caph.focus.$$toAvailable(this);
                }
            });
            focusController.setDepth(focusForList.depth);
            $.caph.focus.controllerProvider.addBeforeKeydownHandler(beforeKeydownHandler);
            $.caph.focus.controllerProvider.addAfterKeydownHandler(afterKeydownHandler);
            listContainer.on('mouseover', onMouseOverDropdownList).on('mouseleave', onMouseLeaveDropdownList);
            setTimeout(function(){
                $(document).on('click', onClickDocument);
            }, 0);
        },
        closeList: function(){
            var focusController = $.caph.focus.controllerProvider.getInstance();
            this.find('.list-items>.textbox').each(function(){
                focusController.disable(this);
            });

            var listContainer = this.find('.list-container');
            listContainer.hide();
            var focusForPlaceholder = this.data('focusForPlaceholder');
            focusController.setDepth(focusForPlaceholder.depth);
            $.caph.focus.controllerProvider.removeBeforeKeydownHandler(beforeKeydownHandler);
            $.caph.focus.controllerProvider.removeAfterKeydownHandler(afterKeydownHandler);
            listContainer.off('mouseover', onMouseOverDropdownList).off('mouseleave', onMouseLeaveDropdownList);
            $(document).off('click', onClickDocument);
        },
        scrollUpDown: function(target, direction, visibleItemCount, count){
            var targetObjects = target.find('div.textbox');
            count = Math.abs(count) || 1;

            if(direction === 'up' && target.data('scrollCount') > 0){
                target.data('scrollCount', target.data('scrollCount') - count);
            } else if(direction === 'down' && target.data('scrollCount') < targetObjects.length - visibleItemCount){
                target.data('scrollCount', target.data('scrollCount') + count);
            }
            this.translateTo(targetObjects, 0, target.data('scrollCount') * targetObjects.eq(0).outerHeight() * (-1));
        }
    };

    // event handlers
    var beforeKeydownHandler = function(context){
        if (context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.LEFT || context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.RIGHT) {
            var dropdownListElement = $(context.currentFocusItem).closest('.caph-dropdown-list');
            privateMethods.closeList.apply(dropdownListElement);
            return false;
        }
    };
    var afterKeydownHandler = function(context){
        var target, targetObjects, curIndex;
        if (context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.DOWN) {
            target = $(context.currentFocusItem).parent();
            if (target.data('visibleItemCount')) {
                targetObjects = target.find('.textbox');
                curIndex = jQuery.inArray(context.currentFocusItem, targetObjects);

                var count = curIndex - target.data('scrollCount') - target.data('visibleItemCount') + 1;
                if (curIndex - target.data('scrollCount') >= target.data('visibleItemCount')) {
                    privateMethods.scrollUpDown(target, 'down', target.data('visibleItemCount'), count);
                }
            }
        } else if (context.event.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.UP) {
            target = $(context.currentFocusItem).parent();
            if (target.data('visibleItemCount')) {
                targetObjects = target.find('.textbox');
                curIndex = jQuery.inArray(context.currentFocusItem, targetObjects);
                if (curIndex - target.data('scrollCount') < 0) {
                    privateMethods.scrollUpDown(target, 'up', target.data('visibleItemCount'), target.data('scrollCount') - curIndex);
                }
            }
        }
    };

    var onSelectUpButton = function($event){ // for click arrow-up button.
        var target = $($event.currentTarget).next();
        privateMethods.scrollUpDown(target, 'up', target.data('visibleItemCount'));
    };
    var onSelectDownButton = function($event){ // for click arrow-down button.
        var target = $($event.currentTarget).prev();
        privateMethods.scrollUpDown(target, 'down', target.data('visibleItemCount'));
    };

    var onClickDocument = function () { // If use click the outside of dropdown-list, the dropdown-list should be closed.
        var dropdownListElements = $('.caph-dropdown-list');
        dropdownListElements.each(function(){
            if($(this).find('.list-container').css('display') !== 'none'){
                privateMethods.closeList.apply($(this));
            }
        });

    };

    var onMouseOverDropdownList = function () {
        $(document).off('click', onClickDocument);
    };
    var onMouseLeaveDropdownList = function () {
        $(document).on('click', onClickDocument);
    };

    var methods = {
        init: function(param){
            var items = param.items || [];
            var visibleItemCount = param.visibleItemCount || 0;
            var focusController = $.caph.focus.controllerProvider.getInstance();
            var focusForPlaceholder = param.focusOption || {depth : focusController.getCurrentDepth()};
            var onSelectItem = (typeof param.onSelectItem === 'function')?param.onSelectItem : $.noop;
            var focusForList = {
                depth: focusForPlaceholder.depth + Constant.DEFAULT.focusableDepth || Constant.DEFAULT.FOCUSABLE_DEPTH,
                group: focusForPlaceholder.group,
                disabled: true
            };
            this.data('visibleItemCount', visibleItemCount);
            this.data('items', items);
            this.data('focusForList', focusForList);
            this.data('focusForPlaceholder', focusForPlaceholder);

            if(this.data('initialized')){
                throw $.error('This element is already initialized as a context menu.');
            }

            var placeholderTemplate = this.find('.caph-dropdown-list-placeholder-template:first').hide().html();
            var itemTemplate = this.find('.caph-dropdown-list-item-template:first').hide().html();
            var arrowUpTemplate = this.find('.caph-dropdown-list-arrow-up-template:first').hide().html();
            var arrowDownTemplate = this.find('.caph-dropdown-list-arrow-down-template:first').hide().html();

            this.addClass('caph-dropdown-list');
            var placeholder = privateMethods.makePlaceholder(focusForPlaceholder, placeholderTemplate);
            placeholder.on('selected', function(){
                var listContainer = this.find('.list-container');
                if(listContainer.css('display') === 'none'){
                    privateMethods.openList.call(this, visibleItemCount);
                } else {
                    privateMethods.closeList.call(this);
                }
            }.bind(this));
            this.append(placeholder);
            this.append(privateMethods.makeListItem(items, onSelectItem, visibleItemCount, focusForList, {
                itemTemplate: itemTemplate,
                arrowUpTemplate: arrowUpTemplate,
                arrowDownTemplate: arrowDownTemplate
            }));
            this.find('.arrow-up').on('click', onSelectUpButton);
            this.find('.arrow-down').on('click', onSelectDownButton);

			if('undefined' !== typeof window.Hammer) { // Support touch & gesture events.
				var wrapper = this;
				var listItems = this.find('.list-container > .list-items');
				var caphHammerController = new Hammer.Manager(listItems[0], {
					recognizers: [
						[
							Hammer.Pan, {direction: Hammer.DIRECTION_ALL}
						]
					]
				});

				var oldTransition;
				var targetObjs;
				var currentScrollHeight = 0;
				caphHammerController.on('panmove', function(ev){
					privateMethods.translateTo(targetObjs, 0, currentScrollHeight + ev.deltaY);
				});
				caphHammerController.on('panstart', function(){
					if(!checkScrollableElement(wrapper.data('visibleItemCount'), items.length)){
						return false;
					}
					targetObjs = listItems.find('.textbox');
					currentScrollHeight = listItems.data('scrollCount') * listItems.find('.textbox').outerHeight();

					oldTransition = targetObjs.css('transition');
					targetObjs.css('transition', 'transform 0s ease');
				});
				caphHammerController.on('panend', function(ev){
					var itemHeight = listItems.find('.textbox').outerHeight();

					if(ev.deltaY > 0){
						var deltaScrollIndex = Math.ceil(ev.deltaY / itemHeight);
					} else {
						var deltaScrollIndex = Math.floor(ev.deltaY / itemHeight);
					}

					if(deltaScrollIndex + listItems.data('scrollCount') > 0){ // Scroll 범위를 위로 벗어난 경우
						deltaScrollIndex = 0;
						listItems.data('scrollCount', 0);
					}

					var maxScrollableCount = items.length - wrapper.data('visibleItemCount');
					if(maxScrollableCount < Math.abs(listItems.data('scrollCount') + deltaScrollIndex)){ // Scroll 범위를 아래로 벗어난 경우
						deltaScrollIndex = 0;
						wrapper.data('scrollCount', maxScrollableCount * (-1));
					}

					privateMethods.translateTo(targetObjs, 0, (listItems.data('scrollCount') + deltaScrollIndex) * itemHeight);
					listItems.data('scrollCount', listItems.data('scrollCount') + deltaScrollIndex);

					oldTransition && targetObjs.css('transition', oldTransition);
				});
				var checkScrollableElement = function(visibleItemCount, itemCount){
					if($.isNumeric(visibleItemCount) && $.isNumeric(itemCount) && visibleItemCount > 0) {
						return visibleItemCount < itemCount;
					} else {
						return false;
					}
				}
			}

            this.data('initialized', true);
            return this;
        }
    };

    $.fn.caphDropdownList = function(options){
        if(this.length < 1){
            $.error('jQuery object is NOT selected.');
        } else if(this.length > 1){
            $.error('Select just one element for creating a dialog.');
        }
        if(methods[options]){
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(!this.data('initialized') && (typeof options === 'object' || !options)) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.dialog');
        }
    };
})(jQuery);
/**
 *
 * @name jQuery.fn.caphInput
 * @kind jq-plugin
 * @memberOf jQuery.fn
 * @description
 *
 *
 * caph-input provides input supporting the caph's focus and key navigation  {@link caph.focus}
 * With caph-input, you can set input which provides the input:text and input:password.
 * Caph input is set default action, you can change style or action through option and event handler.
 * When input is focused or blurred, 'focused' class is attached or detached automatically
 * 
 * You can set the input value in the option and bind to input's value. 
 * If user changes input value, changed value can be checked through 'value' attribute.
 * Caph-input as jquery plugin only can be used with 'input' tag. If try use with other tag such as 'div' or something, caph-button throws a error.
 *  
 * Below are the options of the caph-input.
 * 
 *  | type     | option                   | description                                                                                                                                                                                                                    |
 *  |----------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | object   | 'focusOption'            | focus name, focus group, disabled, initialfocus....
 *  | string   | 'inputClass'             | Input class which applied to input. Default inputClass is 'caph-input'
 *  | string   | 'type'                   | Set the type of input. caph-input supports 'password' and 'text'
 *  | string   | 'value'                  | Set the value of input. Default value is empty string.
 *  | number   | 'maxLength'              | Set the maxLength of input. Default value is '40'
 *  | string   | 'placeHolder'            | Set the placeHolder of input. Default value is blank.       
 *  | function | 'onFocused'              | Set the event handler when Input is focused. Input passes two parameters 'event' and 'originalEvent'
 *  | function | 'onBlurred'	          | Set the event handler when Input is blurred. Input passes two parameters 'event' and 'originalEvent'
 *  | function | 'onSelected'             | Set the event handler when Input is selected. Input passes two parameters 'event' and 'originalEvent' 
 *  | function | 'onChanged'              | Set the event handler when Input is changed. Input passes two parameters 'event' and 'value'. Parameter 'value' passes a input value when value is changed.  
 * 
 * Example
 * --
 * 
 * 
 * **js**
 * ~~~~~~
 *     $('#Input1').caphInput({
 *              onFocused :function(event,originalEvent){
 *              	 $(event.currentTarget).css({
 *                       border : '1px solid red'
 *                   });
 *              },
 *              onBlurred :function(event,originalEvent){
 *                  $(event.currentTarget).css({
 *                      border : ''
 *                  });
 *              },
 *              onChanged :function(event,value){
 *              	console.log("value", value);
 *              },
 *            	type : 'text',
 *				maxLength : 40,
 *				placeHolder : 'place-holder',
 *				value:'input1'
 *          });
 *~~~~~~
 *
 *
 * **html**
 * ~~~~~~
 * <input id="Input1">
 * ~~~~~~ 
 * 
 *
 */

(function ($) {
	'use strict';

	$.fn.caphInput=function(options) {

		// apply default options
		options = options || {};
		var settings = $.extend({}, $.fn.caphInput.defaults, options);


		return this.each(function() {
			var self = $(this);
			if(self[0].tagName !== 'INPUT'){
				throw $.error('CAPH INPUT Should be used with INPUTTAG');
			}

			
			self.attr('focusable','');
			$.caph.focus.Util.setData(this, options.focusOption);
			$.caph.focus.$$toAvailable(this);
		   
			self.addClass(settings.inputClass);
			
			var inputType = options.type || 'text';
			var inputValue = options.value || '';
			var maxLength = options.maxLength || 40;
			var placeHolder = options.placeHolder ||'';
			var inputStatus = false;
			
			
			self.attr('type',inputType);
			self.attr('value',inputValue);
			self.attr('maxlength',maxLength);
			self.attr('placeholder', placeHolder);
			
			$.caph.focus.controllerProvider.addBeforeKeydownHandler(function(context, controller){
				var inputTarget = self.find('>input').context;
				var currentTarget = context.currentFocusItem;
				
				if(!inputStatus)
					return true;
				
				
				if(inputTarget !== currentTarget) {
					return false;
				}
				
				var cursorPoint = inputTarget.selectionStart;
				var inputLength = inputTarget.value.length;
				var keyCode = context.event.keyCode;
				if (keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.RIGHT && cursorPoint < inputLength || keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.LEFT && 0 < cursorPoint) {
					return false;
				}

			});
			
			self.on('change', function(event){
				var changedValue = event.target.value;
				self.attr('value', changedValue);
				$.isFunction(options.onChanged) && options.onChanged(event, changedValue);
			});
			self.on('focus', function(event){
				inputStatus = true;
			});        
			self.on('blur', function(event){
				inputStatus = false;
			});
		  
			self.on('focused', function(event, originalEvent){
				$.isFunction(options.onFocused) && options.onFocused(event, originalEvent);
				if(originalEvent && originalEvent.type == 'keydown' && originalEvent.keyCode === $.caph.focus.Constant.DEFAULT.KEY_MAP.ENTER){
					self.focus();
				}
			});
		  
			self.on('blurred', function(event, originalEvent){
				if(originalEvent && originalEvent.type === 'keydown'){
					self.blur();
				}
				$.isFunction(options.onBlurred) && options.onBlurred(event, originalEvent);
			});
			self.on('selected', function(event, originalEvent){
					self.blur();
					self.focus();             
				$.isFunction(options.onSelected) && options.onSelected(event,originalEvent);
			});

		});
	};
	// define default options
	$.fn.caphInput.defaults = {
		inputClass : 'caph-input'
	};

})(jQuery);
/**
 * @name jQuery.fn.caphList
 * @kind jq-plugin
 * @memberOf jQuery.fn
 * @description
 *  A jQuery plug-in which provides a high performance scrollable list component.
 *  This plug-in creates container and wrapper element to arrange the item view, and calculates the item view count per a page to fit container size, and then creates current, previous and next page.
 *  The item views in each page are updated by the given template view and item data, and then they are arranged to the corresponding position on each page.
 *  This plug-in updates the item views in each page when moving to the previous or next page by scrolling the wrapper element to previous or next position.  
 *  
 *  You can create it easily by only setting options and template view.
 *  Note that the template view should be a focusable.
 *  
 *  At first, prepare data to be decorated.
 *  Usually use AJAX to request the data. (Refer to the details in {@link http://api.jquery.com/jQuery.get/}.)
 *  ~~~~~~
 *  var items;
 *  
 *  $.get('/someUrl', function(response) {
 *  	items = response;
 *  });
 *  ~~~~~~
 *  
 *  And then, define a template view to decorate the items in the list. 
 *  ~~~~~~
 *  <div id="list1"></div> <!-- container element -->
 *  
 *  <!-- template view -->
 *  <script id="template1" type="text/template">
 *  	<div class="item" focusable><%= index %></div> <!-- you can also use each object of array throughout 'item' variable. e.g. <%= item.title %> -->
 *  </script>
 *  ~~~~~~
 *  This plug-in instantiates a template once per item from a collection. 
 *  Each template instance gets its own scope, where the 'item' variable is set to the current collection item, and 'index' is set to the item index.
 *  Special properties are exposed on the local scope of each template instance, including:
 *  
 *  | type    | variable | description                                                     |
 *  |---------|----------|-----------------------------------------------------------------|
 *  | Object  | `item`   | the current collection item.                                    |
 *  | number  | `index`  | iterator offset of the repeated element (0..length-1).          |
 *  | boolean | `first`  | true if the repeated element is first in the iterator.          |
 *  | boolean | `last`   | true if the repeated element is last in the iterator.           |
 *  | boolean | `even`   | true if the iterator position index is even (otherwise false).  |
 *  | boolean | `odd`    | true if the iterator position index is odd (otherwise false).   |
 *  
 *  Refer to the template syntax details in {@link https://lodash.com/docs#template}.
 *  
 *  Finally, create a 'caphList' using the prepared resources such as 'items' and 'template1'.
 *  ~~~~~~
 *  $('#list1').caphList({
 *  	items: items,
 *  	template: 'template1'
 *  });
 *  ~~~~~~
 *  
 *  After initializing, each element has an initialized instance 'caphList' as property.
 *  You can refer to the instance and use helpful methods.
 *  ~~~~~~
 *  $('#list1').caphList({
 *  	...
 *  })[0].caphList.resize();
 *  ~~~~~~
 *  
 *  The followings are all available methods.
 *  
 *  | method      | description                                                                                                                                                                                                                            |
 *  |-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | update()    | Update the item views. You should call this method to update item views when appending new data to collection or removing the existing data from the tail of collection. This method will update only visible item views if necessary. |
 *  | reload()    | Update the entire item views. If you change the all data of collection, you should call this method to update item views.                                                                                                              |
 *  | reset()     | Reset the entire item views. This method will reset the list to initial state.                                                                                                                                                         |
 *  | resize()    | If you change the list size manually, you should call this method. The window's resize event is processed automatically.                                                                                                               |
 *  | destroy()   | Destroy the list.                                                                                                                                                                                                                      |
 *  | moveLeft()  | Move to the left item.                                                                                                                                                                                                                 |
 *  | moveRight() | Move to the right item.                                                                                                                                                                                                                |
 *  | moveUp()    | Move to the up item.                                                                                                                                                                                                                   |
 *  | moveDown()  | Move to the down item.                                                                                                                                                                                                                 |
 *    
 *  The above example creates a list with the following structure.
 *  ~~~~~~
 *  <div id="list1" class="caph-list-container"> <!-- container -->
 *  	<div class="caph-list-wrapper> <!-- wrapper -->
 *  		<div>
 *  			<div class="item" focusable>0</div> <!-- template view -->
 * 			</div>
 * 			<div>
 *  			<div class="item" focusable>1</div> <!-- template view -->
 *  		</div>
 *  		<div>
 *  			<div class="item" focusable>2</div> <!-- template view -->
 *  		</div>
 *  		...
 *  	</div>
 *  </div>
 *  ~~~~~~
 *  
 *  By default, the scroll direction is 'horizontal'.
 *  If you want to change the scroll direction to vertical, set the 'direction' option to 'vertical'.
 *  ~~~~~~
 *  $('#list1').caphList({
 *  	items: items,
 *  	template: 'template1',
 *  	direction: 'vertical'
 *  });
 *  ~~~~~~
 *  
 *  You can also change the class name of container and wrapper.
 *  ~~~~~~
 *  $('#list1').caphList({
 *  	items: items,
 *  	template: 'template1',
 *  	containerClass: 'container',
 *  	wrapperClass: 'wrapper'
 *  });
 *  ~~~~~~
 *  Then, you can see a list with the following structure.
 *  ~~~~~~
 *  <div id="list1" class="container"> <!-- container -->
 *  	<div class="wrapper> <!-- wrapper -->
 *  		...
 *  	</div>
 *  </div>
 *  ~~~~~~
 *  
 *  Note that container and template view should have their own size such as width and height.
 *  Because this plug-in arranges the views based on that sizes.
 *  Suppose that style is defined like below.
 *  ~~~~~~
 *  .container {
 *  	width: 1000px;
 *  	height: 600px;
 *  }
 *  
 *  .item {
 *  	width: 100px;
 *  	height: 200px;
 *  }
 *  ~~~~~~
 *  If you create a 'caph-list' like below, its row count will be 3 and column count will be 10.
 *  ~~~~~~
 *  $('#list1').caphList({
 *  	items: items,
 *  	template: 'template1',
 *  	containerClass: 'container'
 *  });
 *  ~~~~~~
 *  So if your data count is greater than 30, you can scroll the list horizontally after reaching the last column.
 *  
 *  You can change the scroll effect by setting 'duration' and 'ease' option.
 *  These option values are same as CSS3 transition value.
 *  Refer to the 'transition-duration' and 'transition-timing-function' in {@link http://www.w3schools.com/css/css3_transitions.asp}.
 *  
 *  The followings are all available options.
 *  
 *  | type     | option                | description                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
 *  |----------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | Object[] | `items`               | The data to be decorated to the views. Note that it can't be used together with `itemLoader` option.                                                                                                                                                                                                                                                                                                                                                              |
 *  | string   | `itemLoader`          | The item loader to request required data to be decorated to the views. You can specify the item loader name which is registered to the {@link jQuery.caph.ui.listItemLoaderProvider}. Each template instance gets its own scope, where the 'item' variable is set to the current collection item. Special properties are exposed on the local scope of each template instance like using `items` option. Note that it can't be used together with `items` option. |
 *  | string   | `template`            | The template to be used when decorating the views. You can use template element id or HTML. You can use the {@link https://lodash.com/docs#template} syntax in the template definition.                                                                                                                                                                                                                                                                           |
 *  | string   | `direction`           | The scroll direction such as 'horizontal' and 'vertical'. Default value is 'horizontal'.                                                                                                                                                                                                                                                                                                                                                                          |
 *  | string   | `containerClass`      | The container element's class name. Default value is 'caph-list-container'. You have to set the size such as 'width' and 'height'.                                                                                                                                                                                                                                                                                                                                |
 *  | string   | `wrapperClass`        | The wrapper element's class name. Default value is 'caph-list-wrapper'.                                                                                                                                                                                                                                                                                                                                                                                           |
 *  | string   | `duration`            | The scroll duration. Default value is '0.5s'. Refer to the details in {@link http://www.w3schools.com/cssref/css3_pr_transition-duration.asp}.                                                                                                                                                                                                                                                                                                                    |
 *  | string   | `ease`                | The scroll timing function. Default value is 'ease-out'. Refer to the details in {@link http://www.w3schools.com/cssref/css3_pr_transition-timing-function.asp}.                                                                                                                                                                                                                                                                                                  |
 *  | boolean  | `loop`                | The continuous circular loop mode. Default value is false. If this option is set to true, move to the first item view when moving to the next item view on the last item view. The opposite situation is same. This option can't be used with `itemLoader` option.                                                                                                                                                                                                |
 *  | number   | `delay`               | The millisecond which indicates the scroll delay time. Default value is 100.                                                                                                                                                                                                                                                                                                                                                                                      |
 *  | number   | `initialItemIndex`    | The initial item index. Default value is 0. This value should be less than the item count.                                                                                                                                                                                                                                                                                                                                                                        |
 *  | number   | `mouseScrollAreaSize` | The mouse scroll area pixel size. Default value is 20. If the mouse pointer is located from the edge of the list container up to as much as mouse scroll area pixel size, the list is scrolled to the corresponding direction.                                                                                                                                                                                                                                    |
 *  | number   | `pageBufferSize`      | The page buffer size. One page consists of the number of visible item views. It prepares the previous and next page just as much as the given page buffer size to scroll wrapper smoothly. Default value is 1.                                                                                                                                                                                                                                                    |
 *  | Function | `onDecorateItemView`  | The callback handler which is called after decorating an item view using template. This callback handler receives one parameter which contains each item view's element and scope.                                                                                                                                                                                                                                                                                |
 *  | Function | `onFocusItemView`     | The callback handler which is called when an item view is focused. This callback handler receives one parameter which contains current list indices such as item index, row index, column index, page index, maximum page index, item count and item view count per page.                                                                                                                                                                                         |
 *  | Function | `onReachStart`        | The callback handler which is called when reaching the item view at the very left or top. This callback handler receives one parameter which contains current list indices such as item index, row index, column index, page index, maximum page index, item count and item view count per page.                                                                                                                                                                  |
 *  | Function | `onReachEnd`          | The callback handler which is called when reaching the item view at the very right or bottom. This callback handler receives one parameter which contains current list indices such as item index, row index, column index, page index, maximum page index, item count and item view count per page.                                                                                                                                                              |
 *  | Function | `onScrollStart`       | The callback handler which is called when the scroll is started. This callback handler receives one parameter which contains current list indices such as item index, row index, column index, page index, maximum page index, item count and item view count per page.                                                                                                                                                                                           |
 *  | Function | `onScrollFinish`      | The callback handler which is called when the scroll is finished. This callback handler receives one parameter which contains current list indices such as item index, row index, column index, page index, maximum page index, item count and item view count per page.                                                                                                                                                                                          |
 */
(function(window, document, $) {
	'use strict';
	
	var NAMESPACE = '.caph-list';
	
	var KEY_MAP = $.caph.focus.controllerProvider.getKeyMap();
	
	var DEFAULT = {
		ROW_COUNT: 1,
		COLUMN_COUNT: 1,
		DIRECTION: 'horizontal',
		CONTAINER_CLASS: 'caph-list-container',
		WRAPPER_CLASS: 'caph-list-wrapper',
		DURATION: '0.5s',
		EASE: 'ease-out',
		LOOP: false,
		DELAY: 100,
		MOUSE_SCROLL_AREA_SIZE: 20,
		PAGE_BUFFER_SIZE: 1
	};
	
	var defaultOptions = {
		items: null,
		template: '<div style="width: 100%; height: 100%"></div>',
		direction: DEFAULT.DIRECTION,
		containerClass: DEFAULT.CONTAINER_CLASS,
		wrapperClass: DEFAULT.WRAPPER_CLASS,
		duration: DEFAULT.DURATION,
		ease: DEFAULT.EASE,
		loop: DEFAULT.LOOP,
		delay: DEFAULT.DELAY,
		initialItemIndex: 0,
		mouseScrollAreaSize: DEFAULT.MOUSE_SCROLL_AREA_SIZE,
		pageBufferSize: DEFAULT.PAGE_BUFFER_SIZE
	};
	
	var focusController = $.caph.focus.controllerProvider.getInstance();
	
	function getSize(element) {
		return {
			width: element.width(),
			height: element.height()
		};
	}
	
	function getTemplate(template) {
		var source;
		
		if (template[0] === '<' && template[template.length - 1] === '>' && template.length >= 3) {
			source = template;
		} else {
			source = document.getElementById(template).innerHTML;
		}
		
		return {
			source: source,
			link: _.template(source)
		};
	}
	
	function getItemViewSize(wrapper, template, onDecorateItemView) {
		var itemView = $('<div style="position: absolute"></div>').addClass('jq-hide').hide();
		var templateView = $(template.source);
		var size = {};

		itemView.appendTo(wrapper);
		itemView.append(templateView);
		
		if ($.isFunction(onDecorateItemView)) {
			onDecorateItemView({
				element: itemView,
				scope: {}
			});
		}
		
		size.width = itemView.outerWidth(true);
		size.height = itemView.outerHeight(true);
		
		templateView.remove();
		itemView.remove();
		
		return size;
	}
	
	function isValidCount(count) {
		return count > 0 && count !== Infinity;
	}
	
	function prepareUtils(containerOffset, containerSize, itemViewSize, mouseScrollAreaSize, pageBufferSize) {
		var containerWidth = containerSize.width,
			containerHeight = containerSize.height;
		
		var itemWidth = itemViewSize.width,
			itemHeight = itemViewSize.height;
		
		var floorRowCount, floorColumnCount;
		var ceilRowCount, ceilColumnCount;
		
		var rawRowCount = containerHeight / itemHeight;
		var rawColumnCount = containerWidth / itemWidth;

		if (!isValidCount(rawRowCount) || !isValidCount(rawColumnCount)) {
			throw new Error('The caphList\'s container and template view should have their own size such as width and height.');
		}
		
		floorRowCount = Math.floor(rawRowCount);
		floorColumnCount = Math.floor(rawColumnCount);
		
		if (floorRowCount < 1 || floorColumnCount < 1) {
			throw new Error('Please check the container and template view size. The calculated row or column count is less than 1.');
		}
		
		ceilRowCount = Math.ceil(rawRowCount);
		ceilColumnCount = Math.ceil(rawColumnCount);
		
		var sharedFunctions = {
			getMaxItemViewCount: function() {
				return this.getItemViewCountPerPage() * (2 * pageBufferSize + 1);
			},
			getMaxPageIndex: function(itemCount) {
				return Math.floor((itemCount - 1) / this.getItemViewCountPerPage());
			},
			getPageIndex: function(index) {
				return Math.floor(index / this.getItemViewCountPerPage());
			},
			getStartItemIndex: function(pageIndex) {
				return (pageIndex - pageBufferSize) * this.getItemViewCountPerPage();
			},
			getNextStartItemIndex: function(pageIndex) {
				return (pageIndex + pageBufferSize + 1) * this.getItemViewCountPerPage();
			},
			getPosition: function(index) {
				var rowIndex = this.getRowIndex(index);
				var columnIndex = this.getColumnIndex(index);
				
				return {
					top: rowIndex * itemHeight,
					left: columnIndex * itemWidth,
					rowIndex: rowIndex,
					columnIndex: columnIndex
				};
			},
			getNextPosition: function(index, keyCode) {
				var position = this.getPosition(index);
				
				switch (keyCode) {
				case KEY_MAP.LEFT:
					position.left -= itemWidth;
					position.columnIndex--;
					break;
				case KEY_MAP.RIGHT:
					position.left += itemWidth;
					position.columnIndex++;
					break;
				case KEY_MAP.UP:
					position.top -= itemHeight;
					position.rowIndex--;
					break;
				case KEY_MAP.DOWN:
					position.top += itemHeight;
					position.rowIndex++;
					break;
				}
				
				return position;
			}
		};
		
		return {
			horizontal: $.extend({}, sharedFunctions, {
				getItemViewCountPerPage: function() {
					return floorRowCount * (floorColumnCount + 1);
				},
				getRowIndex: function(index) {
					return index % floorRowCount;
				},
				getColumnIndex: function(index) {
					return Math.floor(index / floorRowCount);
				},
				getTranslate: function(index, scrollIndex, delta) {
					delta = $.isNumeric(delta)?delta:0;
					return 'translate3d(' + ((scrollIndex * -itemWidth) + delta) + 'px, 0px, 0px)';
				},
				getScrollIndex: function(index, scrollCount) {
					return Math.max(0, this.getColumnIndex(index) - scrollCount);
				},
				getNextScrollIndex: function(currentScrollIndex, delta, itemCount){
					var deltaIndex = Math.ceil(delta/itemWidth);
					var nextScrollIndex = currentScrollIndex - deltaIndex;
					if(delta < 0) {
						nextScrollIndex++;
					}
					if(nextScrollIndex > (itemCount - floorColumnCount)){
						nextScrollIndex = itemCount - floorColumnCount;
					} else if(nextScrollIndex < 0){
						nextScrollIndex = 0;
					}
					return nextScrollIndex;
				},
				isVisibleItem: function(rowIndex, columnIndex, scrollIndex) {
					return scrollIndex <= columnIndex && columnIndex < scrollIndex + ceilColumnCount;
				},
				getMouseScrollKeyCode: function(x, y) {
					var position = x - containerOffset.left;
					
					if (position < mouseScrollAreaSize){
						return KEY_MAP.LEFT;
					}
					
					if (position > containerWidth - mouseScrollAreaSize) {
						return KEY_MAP.RIGHT;
					}
					
					return 0;
				},
				isScrollDirection: function(keyCode) {
					switch (keyCode) {
					case KEY_MAP.LEFT:
					case KEY_MAP.RIGHT:
						return true;
					}
					
					return false;
				},
				getRotateItemIndex: function(rowIndex, columnIndex, itemCount) {
					if (columnIndex > 0) {
						return rowIndex;
					}
					
					return Math.min(itemCount - 1, this.getMaxColumnIndex(itemCount) * floorRowCount + rowIndex);
				},
				getMaxRowIndex: function() {
					return floorRowCount - 1;
				},
				getMaxColumnIndex: function(itemCount) {
					return Math.floor((itemCount - 1) / floorRowCount);
				},
				getScrollStartCount: function() {
					return floorColumnCount;
				},
				getInitialScrollCount: function(index) {
					return Math.min(this.getScrollStartCount(), this.getColumnIndex(index));
				},
				isPreviousDirection: function(keyCode) {
					return keyCode === KEY_MAP.LEFT;
				},
				isNextDirection: function(keyCode) {
					return keyCode === KEY_MAP.RIGHT;
				},
				getScrollCountVariation: function(oldIndex, newIndex) {
					return this.getColumnIndex(newIndex) - this.getColumnIndex(oldIndex);
				},
				isReachedStart: function(index) {
					return this.getColumnIndex(index) === 0;
				},
				isReachedEnd: function(index, itemCount) {
					return this.getColumnIndex(index) === this.getMaxColumnIndex(itemCount);
				}
			}),
			vertical: $.extend({}, sharedFunctions, {
				getItemViewCountPerPage: function() {
					return (floorRowCount + 1) * floorColumnCount;
				},
				getRowIndex: function(index) {
					return Math.floor(index / floorColumnCount);
				},
				getColumnIndex: function(index) {
					return index % floorColumnCount;
				},
				getTranslate: function(index, scrollIndex, delta) {
					delta = $.isNumeric(delta)?delta:0;
					return 'translate3d(0px, ' + ((scrollIndex * -itemHeight) + delta) + 'px, 0px)';
				},
				getScrollIndex: function(index, scrollCount) {
					return Math.max(0, this.getRowIndex(index) - scrollCount);
				},
				getNextScrollIndex: function(currentScrollIndex, delta, itemCount){
					var deltaIndex = Math.ceil(delta/itemHeight);
					var nextScrollIndex = currentScrollIndex - deltaIndex;
					if(delta < 0) {
						nextScrollIndex++;
					}
					if(nextScrollIndex > (itemCount - floorRowCount)){
						nextScrollIndex = itemCount - floorRowCount;
					} else if(nextScrollIndex < 0){
						nextScrollIndex = 0;
					}
					return nextScrollIndex;
				},
				isVisibleItem: function(rowIndex, columnIndex, scrollIndex) {
					return scrollIndex <= rowIndex && rowIndex < scrollIndex + ceilRowCount;
				},
				getMouseScrollKeyCode: function(x, y) {
					var position = y - containerOffset.top;
					
					if (position < mouseScrollAreaSize){
						return KEY_MAP.UP;
					}
					
					if (position > containerHeight - mouseScrollAreaSize) {
						return KEY_MAP.DOWN;
					}
					
					return 0;
				},
				isScrollDirection: function(keyCode) {
					switch (keyCode) {
					case KEY_MAP.UP:
					case KEY_MAP.DOWN:
						return true;
					}
					
					return false;
				},
				getRotateItemIndex: function(rowIndex, columnIndex, itemCount) {
					if (rowIndex > 0) {
						return columnIndex;
					}
					 
					return Math.min(itemCount - 1, this.getMaxRowIndex(itemCount) * floorColumnCount + columnIndex);
				},
				getMaxRowIndex: function(itemCount) {
					return Math.floor((itemCount - 1) / floorColumnCount);
				},
				getMaxColumnIndex: function() {
					return floorColumnCount - 1;
				},
				getScrollStartCount: function() {
					return floorRowCount;
				},
				getInitialScrollCount: function(index) {
					return Math.min(this.getScrollStartCount(), this.getRowIndex(index));
				},
				isPreviousDirection: function(keyCode) {
					return keyCode === KEY_MAP.UP;
				},
				isNextDirection: function(keyCode) {
					return keyCode === KEY_MAP.DOWN;
				},
				getScrollCountVariation: function(oldIndex, newIndex) {
					return this.getRowIndex(newIndex) - this.getRowIndex(oldIndex);
				},
				isReachedStart: function(index) {
					return this.getRowIndex(index) === 0;
				},
				isReachedEnd: function(index, itemCount) {
					return this.getRowIndex(index) === this.getMaxRowIndex(itemCount);
				}
			})
		};
	}
	
	function prepareItemViews(wrapper, maxItemViewCount, onFocused) {
		var i,
			itemView,
			itemViews = [];
		
		for (i = 0; i < maxItemViewCount; i++) {
			itemView = {
				element: $('<div style="position: absolute"></div>').addClass('jq-hide').hide(),
				scope: {},
				onFocused: onFocused
			};

			itemViews.push(itemView);
			wrapper.append(itemView.element);
		}
		
		return itemViews;
	}
	
	function CaphList(element, options) {
		var Utils;
		
		var initialized = false;
		
		var container, 
			wrapper, 
			template;
		
		var containerOffset,
			containerSize,
			itemViewSize;
		
		var mouseScrollAreaSize = options.mouseScrollAreaSize,
			pageBufferSize = options.pageBufferSize;
		
		var isScrolling = false, // prevent mouseover event handling.
			scrollLock = false,
			scrollLockHandle,
			mouseScrollHandle;
		
		var scrollIndex = 0,
			scrollStartCount = 0,
			currentScrollCount = 0,
			currentTranslate;
	
		var itemViews, 
			itemViewIndex = 0;
			
		var itemViewCountPerPage,
			maxItemViewCount;
		
		var items = options.items,
			itemLoader = options.itemLoader,
			itemCount;

		var	currentRowIndex,
			currentColumnIndex,
			currentPageIndex,
			maxPageIndex,
			currentItemIndex = options.initialItemIndex;

		function setItemViewCounts() {
			itemViewCountPerPage = Utils.getItemViewCountPerPage();
			maxItemViewCount = Utils.getMaxItemViewCount();
			scrollStartCount = Utils.getScrollStartCount();
		}
		
		function initialize(callback) {
			if(currentItemIndex >= itemCount){
				throw new Error('Item Count is too small. It\'s should be greater than or equals to "initial-item-index value (default:0)".');
			}

			maxPageIndex = Utils.getMaxPageIndex(itemCount);
			currentScrollCount = Utils.getInitialScrollCount(currentItemIndex);

			if (!currentTranslate) {
				currentTranslate = Utils.getTranslate(currentItemIndex, currentScrollCount);
				wrapper.css('transform', currentTranslate);
			}

			itemViews = prepareItemViews(wrapper, maxItemViewCount, function(event, originalEvent) {
				var type, data, itemIndex, pageIndex;

				if (originalEvent) {
					type = originalEvent.type;
					data = $(event.currentTarget).parent().data();
					itemIndex = data.listItemIndex;

					if (currentItemIndex !== itemIndex) {
						if (type === 'mouseover' || type === 'keydown') {
							pageIndex = Utils.getPageIndex(itemIndex);

							setScrollCount(itemIndex);

							updateNextPositionItemViewPage(currentPageIndex, pageIndex);
							updateIndices(itemIndex, data.listItemRowIndex, data.listItemColumnIndex, pageIndex);

							if (type === 'keydown') { // receive key focus from outside.
								scrollWrapper(itemIndex);
							}
						}
					}

					invokeCallbackHandlers(itemIndex);
				}
			});

			updateIndices(currentItemIndex);
			updateForwardItemView(Utils.getStartItemIndex(currentPageIndex), Utils.getNextStartItemIndex(currentPageIndex), callback);
			scrollWrapper(currentItemIndex);

			initialized = true;
		}
		
		function updateIndices(index, rowIndex, columnIndex, pageIndex) {
			currentItemIndex = index;
			currentRowIndex = rowIndex || Utils.getRowIndex(index);
			currentColumnIndex = columnIndex || Utils.getColumnIndex(index);
			currentPageIndex = pageIndex || Utils.getPageIndex(index);
		}
		
		function getPreviousItemViewIndex() {
			return (maxItemViewCount + (itemViewIndex - 1)) % maxItemViewCount;
		}
		
		function getNextItemViewIndex() {
			return (itemViewIndex + 1) % maxItemViewCount;
		}
		
		function updateForwardItemView(startItemIndex, nextStartItemIndex, callback) {
			var itemView;
			
			while (startItemIndex < nextStartItemIndex) {
				itemView = itemViews[itemViewIndex];
				updateItemView(itemView, itemLoader.get(startItemIndex), startItemIndex++, itemLoader.getTotalCount());
				itemViewIndex = getNextItemViewIndex();
				
				if ((callback || $.noop)(itemView) === false) {
					break;
				}
			}
		}
		
		function traverseBackwardItemView(startItemIndex, nextStartItemIndex, callback) {
			var itemView;
			
			while (startItemIndex > nextStartItemIndex) {
				itemViewIndex = getPreviousItemViewIndex();
				itemView = itemViews[itemViewIndex];
				
				if ((callback || $.noop)(itemView, startItemIndex--) === false) {
					itemViewIndex = getNextItemViewIndex();
					break;
				}
			}
		}
		
		function updateBackwardItemView(startItemIndex, nextStartItemIndex, callback) {
			traverseBackwardItemView(startItemIndex, nextStartItemIndex, function(itemView, index) {
				updateItemView(itemView, itemLoader.get(index), index, itemLoader.getTotalCount());
				return (callback || $.noop)(itemView);
			});
		}
		
		function updateItemView(itemView, value, index, length) {
			updateScope(itemView.scope, value, index, length);
			updateElement(itemView, index);
		}
		
		function updateScope(scope, value, index, length) {
			scope.item = value;
		    scope.index = index;
		    scope.first = (index === 0);
		    scope.last = (index === (length - 1));
		    scope.odd = !(scope.even = (index & 1) === 0);
		}
		
		function updateElement(itemView, index) {
			var position = Utils.getPosition(index),
				element = itemView.element,
				scope = itemView.scope,
				templateView;
			
			element.data({
				listItem: true,
				listItemIndex: index,
				listItemRowIndex: position.rowIndex,
				listItemColumnIndex: position.columnIndex,
				isVisibleListItem: function(rowIndex, columnIndex) {
					return Utils.isVisibleItem(rowIndex, columnIndex, scrollIndex);
				}
			}).css('transform', 'translate3d(' + position.left + 'px, ' + position.top + 'px, 0px)');
			
			if (scope.item) {
				templateView = $(template.link(scope)).on('focused' + NAMESPACE, itemView.onFocused);
				
				$.caph.focus.$$toAvailable(templateView);
				$.caph.focus.Util.unbindEvent($.caph.focus.nearestFocusableFinderProvider.getInstance().$$remove(element.find('> :first-child')));
				
				element.empty().append(templateView);
				invokeDecorateCallbackHandler(itemView);
				element.removeClass('jq-hide').show();
			} else {
				element.hide().addClass('jq-hide');
				$.caph.focus.Util.unbindEvent($.caph.focus.nearestFocusableFinderProvider.getInstance().$$remove(element.find('> :first-child')));
				element.empty();
			}
		}
		
		function scrollWrapper(index, forced) {
			var nextTranslate;

			if(!forced) {
				if (currentScrollCount === 0) {
					scrollIndex = Utils.getScrollIndex(index, currentScrollCount);
				} else if (currentScrollCount === scrollStartCount) {
					scrollIndex = Utils.getScrollIndex(index, currentScrollCount - 1);
				}
			} else {
				scrollIndex = Utils.getScrollIndex(index, 0);
			}
			if (!currentTranslate) {
				currentTranslate = Utils.getTranslate(index, scrollIndex);
				wrapper.css('transform', currentTranslate);
			}
			
			nextTranslate = Utils.getTranslate(index, scrollIndex);
			
			if (nextTranslate !== currentTranslate || forced) {
				wrapper.css('transform', nextTranslate);
				currentTranslate = nextTranslate;
				
				if (!isScrolling) {
					isScrolling = true;
					invokeCallbackHandler('onScrollStart');
				}
			}
		}
		
		function appendTail() {
			var startItemIndex = -1, nextStartItemIndex;

			maxPageIndex = Utils.getMaxPageIndex(itemCount);
			itemCount = items.length;

			if (currentPageIndex >= maxPageIndex - 1) {
				// update item views in visible area.
				nextStartItemIndex = Utils.getNextStartItemIndex(currentPageIndex);
				
				traverseBackwardItemView(nextStartItemIndex - 1, -1, function(itemView, index) {
					if (!itemView.element.hasClass('jq-hide')) {
						startItemIndex = index;
						return false;
					}
				});
				
				updateForwardItemView(startItemIndex + 1, nextStartItemIndex);
			}
		}
		
		function removeTail() {
			var lastItemIndex, 
				focusCandidate,
				nextStartItemIndex,
				isFocused = false;
			
			itemCount = items.length;
			
			lastItemIndex = itemCount - 1;
			maxPageIndex = Utils.getMaxPageIndex(itemCount);
			
			if (currentPageIndex > maxPageIndex) {
				// update all item views.
				updateForwardItemView(Utils.getStartItemIndex(maxPageIndex), Utils.getNextStartItemIndex(maxPageIndex), function(itemView) {
					var itemViewElement;
					
					if (!focusCandidate) {
						itemViewElement = itemView.element;
						
						if (itemViewElement.data().listItemIndex + 1 === itemCount) {
							focusCandidate = itemViewElement.find('> :first-child');
						}
					}
				});
				
				setScrollCount(lastItemIndex);
				updateIndices(lastItemIndex);
				scrollWrapper(lastItemIndex);

				if (isListItemView(focusController.getCurrentFocusItem())) {
					focusController.focus(focusCandidate);
				}
			} else if (currentPageIndex >= maxPageIndex - 1) {
				// update item views in visible area.
				nextStartItemIndex = Utils.getNextStartItemIndex(currentPageIndex);
				
				traverseBackwardItemView(nextStartItemIndex - 1, -1, function(itemView, index) {
					var itemViewElement = itemView.element.find('> :first-child');
				
					if (itemViewElement.hasClass('focused')) {
						isFocused = true;
						
						if (index !== lastItemIndex) {
							focusController.blur(itemViewElement);
						}
					}
					
					if (index === lastItemIndex) {
						focusCandidate = itemViewElement;
						return false;
					}
				});
				
				updateForwardItemView(lastItemIndex + 1, nextStartItemIndex);
				
				// change focus to the candidate.
				if (currentItemIndex > lastItemIndex) {
					setScrollCount(lastItemIndex);
					updateIndices(lastItemIndex);
					scrollWrapper(lastItemIndex);
					
					if (isFocused) {
						focusController.focus(focusCandidate);
					}
					
					invokeCallbackHandlers(lastItemIndex);
				} else if (Utils.isReachedEnd(currentItemIndex, itemCount)) {
					invokeCallbackHandler('onReachEnd');
				}
			}
		}
		
		function reload() {
			var isFocused = isListItemView(focusController.getCurrentFocusItem());
			
			if (isFocused) {
				focusController.blur();
			}
			
			destructItemViews();
			
			initialize(function(itemView) {
				var element = itemView.element;
				
				if (isFocused && currentItemIndex === element.data().listItemIndex) {
					setTimeout(function() {
						focusController.focus(element.find('> :first-child'));
					}, 0);
				}
			});
		}

		function reset(){
			var isFocused = isListItemView(focusController.getCurrentFocusItem());

			if (isFocused) {
				focusController.blur();
			}
			destructItemViews();

			currentItemIndex = options.initialItemIndex;

			var focusElement;
			if(isFocused) {
				initialize(function (itemView) {
					var element = itemView.element;
					var innerElement = element.find('> :first-child');
					var isInitialFocus = innerElement.data() ? innerElement.data().focusableInitialFocus : false;

					if (element.data().listItemIndex === 0 || isInitialFocus) {
						focusElement = innerElement;
					}
				});
			} else {
				initialize();
			}

			if(focusElement){
				setTimeout(function() {
					focusController.focus(focusElement);
				}, 0);
			}
		}

		function isListItemView(element) {
			if (element) {
				element = $(element).parent();
				return element.data().listItem && wrapper[0] === element.parent()[0];
			}
			
			return false;
		}
		
		function isScrollLocked() {
			return scrollLock;
		}
		
		function startScrollLock() {
			scrollLock = true;
			cancelMouseScroll();
		}
		
		function releaseScrollLock() {
			scrollLockHandle = setTimeout(function() {
				scrollLock = false;	
			}, options.delay);
		}
		
		function isMouseScrolling() {
			return mouseScrollHandle;
		}
		
		function startMouseScroll(keyCode) {
			if (!isMouseScrolling()) {
				mouseScrollHandle = setInterval(function() {
					var previousItemIndex = currentItemIndex;
					
					if (!isScrollLocked() && !itemLoader.isLoading()) {
						adjustScrollCount();
						scrollTo(Utils.getNextPosition(currentItemIndex, keyCode), true);
						
						if (previousItemIndex !== currentItemIndex) {
							invokeReachedCallbackHandler(currentItemIndex);
						}
					}
				}, options.delay);
			}
		}
		
		function cancelMouseScroll() {
			if (isMouseScrolling()) {
				clearInterval(mouseScrollHandle);
				mouseScrollHandle = null;
			} 
		}
		
		function scrollTo(nextPosition, isMouseScroll) {
			var nextItemView = prepareNextPositionItemView(nextPosition);

			if (nextItemView) {
				if (nextItemView.index === currentItemIndex) {
					return false;
				}
				
				// scroll to next item view.
				updateIndices(nextItemView.index, nextItemView.rowIndex, nextItemView.columnIndex, nextItemView.pageIndex);
				scrollWrapper(nextItemView.index);
				
				if (itemLoader.isNeededForPrevious(currentItemIndex)) {
					itemLoader.setOffset(itemLoader.getOffset() - (itemLoader.getLoadingCount() * 3));
					
					itemLoader.request(function(items, data) {
						itemLoader.setOffset(itemLoader.getOffset() + (itemLoader.getLoadingCount() * 2));
						itemLoader.prepend(items);
					});
				} else if (itemLoader.isNeededForNext(currentItemIndex)) {
					itemLoader.request(function(items, data) {
						itemLoader.append(items);
						itemLoader.setOffset(itemLoader.getOffset() + itemLoader.getLoadingCount());
					});
				}
				
				if ((isMouseScroll || nextItemView.force) && nextItemView.element) {
					focusController.focus(nextItemView.element.find('> :first-child'));
					return false;
				}
			} else {
				if (isScrolling) {
					return false;
				}
				
				if (options.loop && !isMouseScroll) { // circular loop
					destructItemViews();

					currentItemIndex = Utils.getRotateItemIndex(currentRowIndex, currentColumnIndex, itemCount);
					
					initialize(function(itemView) {
						var element = itemView.element;
						
						if (currentItemIndex === element.data().listItemIndex) {
							setTimeout(function() {
								focusController.focus(element.find('> :first-child'));
							}, 0);
						}
					});
				}
			}
		}
		
		function invokeCallbackHandlers(index) {
			invokeCallbackHandler('onFocusItemView');
			invokeReachedCallbackHandler(index);
		}
		
		function invokeReachedCallbackHandler(index) {
			if (Utils.isReachedStart(index)) {
				invokeCallbackHandler('onReachStart');
			} else if (Utils.isReachedEnd(index, itemCount)) {
				invokeCallbackHandler('onReachEnd');
			}
		}
		
		function invokeCallbackHandler(type) {
			var callback = options[type] || $.noop;
			
			if ($.isFunction(callback)) {
				callback({
					itemIndex: currentItemIndex,
					rowIndex: currentRowIndex,
					columnIndex: currentColumnIndex,
					pageIndex: currentPageIndex,
					maxPageIndex: maxPageIndex,
					itemCount: itemCount,
					itemViewCountPerPage: itemViewCountPerPage
				});
			}
		}
		
		function invokeDecorateCallbackHandler(itemView) {
			var callback = options['onDecorateItemView'] || $.noop;
			
			if ($.isFunction(callback)) {
				callback(itemView);
			}
		}
		
		function isNotValidRowIndex(index) {
			return index < 0 || Utils.getMaxRowIndex(itemCount) < index;
		}
		
		function isNotValidColumnIndex(index) {
			return index < 0 || Utils.getMaxColumnIndex(itemCount) < index;
		}
		
		function prepareNextPositionItemView(nextPosition) {
			var nextRowIndex, nextColumnIndex, 
				nextFocusItem, nextIndex, nextPageIndex,
				lastItem, lastIndex = itemCount - 1,
				data, result;
			
			nextRowIndex = nextPosition.rowIndex;
			nextColumnIndex = nextPosition.columnIndex;
			
			if (isNotValidRowIndex(nextRowIndex) || isNotValidColumnIndex(nextColumnIndex)) {
				return result;
			} 
				
			itemViews.forEach(function(itemView) {
				nextFocusItem = itemView.element;
				data = nextFocusItem.data();
				
				if (data.listItemIndex === lastIndex) {
					lastItem = nextFocusItem;
				}
				
				if (nextRowIndex === data.listItemRowIndex && nextColumnIndex === data.listItemColumnIndex) {
					if (nextFocusItem.hasClass('jq-hide')) {
						nextIndex = lastIndex;
						
						result = {
							rowIndex: Utils.getRowIndex(nextIndex),
							columnIndex: Utils.getColumnIndex(nextIndex),
							force: true
						};
					} else {
						nextIndex = data.listItemIndex;
						
						result = {
							rowIndex: nextRowIndex,
							columnIndex: nextColumnIndex,
							element: nextFocusItem
						};
					}

					nextPageIndex = Utils.getPageIndex(nextIndex);
					updateNextPositionItemViewPage(currentPageIndex, nextPageIndex);

					result.index = nextIndex;
					result.pageIndex = nextPageIndex;
				}
			});
			
			if (result.force) {
				result.element = lastItem;
			}
			
			return result;
		}
		
		function updateNextPositionItemViewPage(pageIndex, nextPageIndex) {
			var index;
			
			if (pageIndex < nextPageIndex) { // next page
				index = (nextPageIndex + pageBufferSize) * itemViewCountPerPage;
				updateForwardItemView(index, index + itemViewCountPerPage);
			} else if (nextPageIndex < pageIndex) { // previous page
				index = (nextPageIndex - pageBufferSize + 1) * itemViewCountPerPage - 1;
				updateBackwardItemView(index, index - itemViewCountPerPage);
			}
		}
		
		function resize() {
			var resizeContainerSize = getSize(container),
				resizeItemViewSize = getItemViewSize(wrapper, template, options['onDecorateItemView']);
			
			if (containerSize.width !== resizeContainerSize.width || containerSize.height !== resizeContainerSize.height || itemViewSize.width !== resizeItemViewSize.width || itemViewSize.height !== resizeItemViewSize.height) {
				startScrollLock();
				
				containerOffset = container.offset();
				containerSize = resizeContainerSize;
				itemViewSize = resizeItemViewSize;
				
				Utils = prepareUtils(containerOffset, containerSize, itemViewSize, mouseScrollAreaSize, pageBufferSize)[options.direction];
				
				setItemViewCounts();
				
				reload();
				
				releaseScrollLock();
			}
		}
		
		function destructItemViews() {
			itemViews.forEach(function(itemView) {
				$.caph.focus.Util.unbindEvent($.caph.focus.nearestFocusableFinderProvider.getInstance().$$remove(itemView.element.find('> :first-child')));
			});
			
			itemViews = null;
			wrapper.empty();
		}
		
		function moveByKeyCode(keyCode) {
			$(document).trigger({
				type: 'keydown',
				keyCode: keyCode
			});
		}
		
		function changeScrollCount(keyCode) {
			if (Utils.isPreviousDirection(keyCode) && currentScrollCount > 0) {
				currentScrollCount--;
			} else if (Utils.isNextDirection(keyCode) && currentScrollCount < scrollStartCount) {
				currentScrollCount++;
			}
		}
		
		function setScrollCount(index) {
			currentScrollCount = Math.max(0, Math.min(scrollStartCount, currentScrollCount + Utils.getScrollCountVariation(currentItemIndex, index)));
		}
		
		function adjustScrollCount() {
			if (currentScrollCount === 1) { 
				currentScrollCount = 0;
			} else if (currentScrollCount === scrollStartCount - 1) {
				currentScrollCount = scrollStartCount;
			}
		}
		
		function beforeHandler(context) {
			var keyCode = context.event.keyCode;
			var scrollResult;
			
			if (isScrollLocked() || itemLoader.isLoading()) {
				return false;
			}
			
			if (isListItemView(context.currentFocusItem) && Utils.isScrollDirection(keyCode)) {
				startScrollLock();
				changeScrollCount(keyCode);
				scrollResult = scrollTo(Utils.getNextPosition(currentItemIndex, keyCode));
				releaseScrollLock();
				return scrollResult;
			} 
			
			if (isScrolling) {
				if ($.caph.focus.Util.isVisible(wrapper)) {
					return false;
				}
				
				isScrolling = false;
				console.warn('The list is hidden before finishing scroll animation.');
			}
		}
		
		this.update = function() {
			var length = items && items.length;
			
			startScrollLock();
			
			if (!initialized) { // initialize
				initialize();
			} else if (itemCount < length) { // append
				appendTail();
			} else if (length < itemCount) { // remove
				removeTail();
			} 
			
			releaseScrollLock();
		};
		
		this.reload = function() {
			startScrollLock();
			reload();
			releaseScrollLock();
		};

		this.reset = function(){
			startScrollLock();
			reset();
			releaseScrollLock();
		};
		
		this.resize = function() {
			container.trigger('resize');
		};
		
		this.moveLeft = function() {
			moveByKeyCode(KEY_MAP.LEFT);
		};
		
		this.moveRight = function() {
			moveByKeyCode(KEY_MAP.RIGHT);
		};
		
		this.moveUp = function() {
			moveByKeyCode(KEY_MAP.UP);
		};
		
		this.moveDown = function() {
			moveByKeyCode(KEY_MAP.DOWN);
		};
		
		this.destroy = function() {
			isScrolling = false;
			scrollLock = false;
			
			destructItemViews();
			
			container.off(NAMESPACE).remove();
			$(window).off(NAMESPACE);
			
			$.caph.focus.controllerProvider.removeBeforeKeydownHandler(beforeHandler);
		};
		
		if (items && itemLoader) {
			throw new Error('The "items" and "itemLoader" option cannot be used together.');
		}
		
		if (itemLoader) {
			if (options.loop) {
				throw new Error('Cannot use continuous circular loop mode when using "itemLoader".');
			}
			
			itemLoader = $.caph.ui.listItemLoaderProvider.$$get(itemLoader);
			
			if (!itemLoader) {
				throw new Error('No such item loader: ' + options.itemLoader);
			}
		} else {
			itemLoader = {
				getTotalCount: function() {
					return itemCount;
				}, 
				get: function(index) {
					return items[index];
				},
				isNeededForPrevious: $.noop,
				isNeededForNext: $.noop,
				isLoading: $.noop,
				request: $.noop,
				prepend: $.noop,
				append: $.noop
			};
		}
		
		container = $(element).addClass(options.containerClass);
		
		container.on('mousemove' + NAMESPACE, function(event) {
			var keyCode = Utils.getMouseScrollKeyCode(event.clientX, event.clientY);
			
			if (keyCode !== 0) {
				startMouseScroll(keyCode);
			} else {
				cancelMouseScroll();
			}
		}).on('mouseout' + NAMESPACE, function(event) {
			if (!isListItemView(event.relatedTarget)) {
				cancelMouseScroll();
				focusController.blur();
			}
		}).on('resize' + NAMESPACE, resize);
		
		containerOffset = container.offset();
		containerSize = getSize(container);
		
		wrapper = $('<div style="position: absolute">').addClass(options.wrapperClass).appendTo(container);
		
		wrapper.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function() {
			isScrolling = false;
			invokeCallbackHandler('onScrollFinish');
		});

		if('undefined' !== typeof window.Hammer){ // Support touch & gesture events.
			var caphHammerController = new Hammer.Manager(wrapper[0], {
				recognizers: [
					[
						Hammer.Pan, {direction: Hammer.DIRECTION_ALL}
					]
				]
			});
			var oldTransition;
			caphHammerController.on('panmove', function(ev){
				var delta = (options.direction === 'horizontal') ? ev.deltaX : ev.deltaY;
				var currentTranslate = Utils.getTranslate(scrollIndex, scrollIndex, delta);
				wrapper.css('transform', currentTranslate);

				var nextScrollIndex = Utils.getNextScrollIndex(scrollIndex, delta, itemCount);

				if(currentItemIndex !== nextScrollIndex){
					var pageIndex = Utils.getPageIndex(nextScrollIndex);
					updateNextPositionItemViewPage(currentPageIndex, pageIndex);
					setScrollCount(nextScrollIndex);
					updateIndices(nextScrollIndex);
				}
			});
			caphHammerController.on('panstart', function(){
				oldTransition = wrapper.css('transition');
				wrapper.css('transition', 'transform 0s ease');
			});
			caphHammerController.on('panend', function(ev){
				var delta = (options.direction === 'horizontal') ? ev.deltaX : ev.deltaY;
				var nextScrollIndex = Utils.getNextScrollIndex(scrollIndex, delta, itemCount);

				scrollWrapper(nextScrollIndex, true);
				oldTransition && wrapper.css('transition', oldTransition);
			});
		}

		template = getTemplate(options.template);
		
		itemViewSize = getItemViewSize(wrapper, template, options['onDecorateItemView']);
		
		Utils = prepareUtils(containerOffset, containerSize, itemViewSize, mouseScrollAreaSize, pageBufferSize)[options.direction];
		
		setItemViewCounts();
		
		$.caph.focus.controllerProvider.addBeforeKeydownHandler(beforeHandler);

		$(window).on('resize' + NAMESPACE, resize);
		
		if (items) {
			itemCount = items.length;
			initialize();	
		} else {
			itemLoader.setLoadingCount(maxItemViewCount + itemViewCountPerPage);
			itemLoader.setThresholdCount((itemViewCountPerPage * pageBufferSize) + itemViewCountPerPage);
			
			itemLoader.initialize(function(items, totalCount, data, status) {
				startScrollLock();
				
				itemCount = totalCount;
				initialize();
				
				releaseScrollLock();
			});
		}
		
		setTimeout(function() {
			wrapper.css('transition', [$.caph.ui.VendorUtil.getVendorStyle('transform'), options.duration, options.ease].join(' '));
		}, 0);
	}
	
	$.fn.caphList = function(options) {
		options = $.extend({}, defaultOptions, options || {});
		
		return this.each(function() {
			this.caphList = new CaphList(this, options);
		});
	};
})(this, document, jQuery);

(function(window, document, $) {
	'use strict';

	var itemLoaders = {};
	
	var defaultParameterNames = {
		page: 'page',
		offset: 'offset',
		count: 'count',
		callback: 'callback'
	};
	
	function cloneArray(array, begin, end) { // due to Array.prototype.slice performance issue. 
		var i = 0;
		var newArray = [];
		
		begin = begin || 0;
		end = end || array.length;
		
		while (begin < end) {
			newArray[i++] = array[begin++];
		}
		
		return newArray;
	}
	
	function identity(data) {
		return data;
	}
	
	function ItemLoader(config) {
		this.url = config.url;
		this.headers = config.headers;
		this.parameterNames = $.extend({}, defaultParameterNames, config.parameterNames || {});
		this.dataType = config.dataType;
		
		this.loadingCount = config.loadingCount;
		this.thresholdCount = config.thresholdCount;
		
		this.onGetTotalCount = config.getTotalCount || $.noop;
		this.onGetItems = config.getItems || identity;
		this.onBeforeLoad = config.onBeforeLoad || $.noop;
		this.onAfterLoad = config.onAfterLoad || $.noop;
		
		this.items = [];
		this.totalCount;
		this.offset = 0;
		
		this.loading = false;
		this.initiailzed = false;
	}
	
	ItemLoader.prototype.isInitialized = function() {
		return this.initiailzed;
	}
	
	ItemLoader.prototype.isLoading = function() {
		return this.loading;
	}
	
	ItemLoader.prototype.getTotalCount = function() {
		return this.totalCount;
	}
	
	ItemLoader.prototype.getCurrentCount = function() {
		return this.items.length;
	}
	
	ItemLoader.prototype.getLoadingCount = function() {
		return this.loadingCount;
	}
	
	ItemLoader.prototype.setLoadingCount = function(loadingCount) {
		if (!this.loadingCount) {
			this.loadingCount = loadingCount;
		}
		
		return this;
	}
	
	ItemLoader.prototype.getThresholdCount = function() {
		return this.thresholdCount;
	}
	
	ItemLoader.prototype.setThresholdCount = function(thresholdCount) {
		if (!this.thresholdCount) {
			this.thresholdCount = thresholdCount;			
		}
		
		return this;
	}
	
	ItemLoader.prototype.getOffset = function() {
		return this.offset;
	}
	
	ItemLoader.prototype.setOffset = function(offset) {
		this.offset = offset;
		return this;
	}
	
	ItemLoader.prototype.setHttp = function(http) {
		this.http = http;
		return this;
	}
	
	ItemLoader.prototype.initialize = function(callback) {
		if (this.initiailzed || this.loading) {
			return;
		}
		
		this.request(function(items, data, status) {
			this.append(items);
			this.offset += this.loadingCount;
			this.totalCount = this.onGetTotalCount(data, status);
			
			if (this.totalCount == null) {
				throw new Error('Check the "getTotalCount" callback function. It should return total item count as a number.')
			}
			
			this.initiailzed = true;
			(callback || $.noop)(items, this.totalCount, data, status, this);
		}.bind(this));
	}
	
	ItemLoader.prototype.beforeRequest = function() {
		this.loading = true;
		this.onBeforeLoad(this);
	}
	
	ItemLoader.prototype.afterRequest = function(data, status) {
		this.onAfterLoad(data, status, this);
		this.loading = false;
		
		if (!this.initiailzed) {
			throw new Error('Fail to request. Please check the given url or connection.');
		}
	}
	
	ItemLoader.prototype.request = function(callback) {
		if (this.loading) {
			return;
		}
		
		this.beforeRequest();
		
		$.ajax({
			url: this.url,
			headers: this.headers,
			dataType: this.dataType,
			data: this.getParams(),
			jsonp: this.parameterNames.callback,
			success: function(data, status) {
				var items = this.onGetItems(data);
				
				if (items && items.length > 0) {
					(callback || $.noop)(items, data, status, this);
				}
				
				this.afterRequest(data, status);
			}.bind(this),
			error: function(data, status) {
				this.afterRequest(data, status);
			}.bind(this)
		});
	}
	
	ItemLoader.prototype.getParams = function() {
		var params = {};
		
		params[this.parameterNames['page']] = Math.floor(this.offset / this.loadingCount) + 1;
		params[this.parameterNames['offset']] = this.offset;
		params[this.parameterNames['count']] = this.loadingCount;
		
		return params;		
	}
	
	// | index | threshold | ... |
	ItemLoader.prototype.isNeededForPrevious = function(index) {
		var base = this.offset - (this.loadingCount * 2);
		return 0 < base && index < base + this.thresholdCount;
	}
	
	// | ... | threshold | index |
	ItemLoader.prototype.isNeededForNext = function(index) {
		var currentCount = this.getCurrentCount();
		return currentCount < this.getTotalCount() && currentCount - this.thresholdCount < index;
	}
	
	ItemLoader.prototype.get = function(index) {
		if (!this.initiailzed) {
			throw new Error('Do not ready to use. Please use after initializing properly. Also verify whether the given url is available or not.');
		}
		
		return this.items[index];
	}
	
	ItemLoader.prototype.prepend = function(items) {
		var temp;
		
		if (this.offset > 0) {
			temp = [];
			temp.length = this.offset - (this.loadingCount * 2);
			this.items = temp.concat(items).concat(cloneArray(this.items, this.offset - this.loadingCount, this.offset));
		}
	}

	ItemLoader.prototype.append = function(items) {
		var temp, tempLength;
		
		if (this.offset > this.loadingCount) {
			tempLength = this.offset - this.loadingCount;
			
			temp = [];
			temp.length = tempLength;
			
			this.items = temp.concat(cloneArray(this.items, tempLength)).concat(items);
		} else {
			this.items = this.items.concat(items);			
		}
	}
	
	$.caph = $.caph || {};
    $.caph.ui = $.caph.ui || {};
    
    /**
	 * @name jQuery.caph.ui.listItemLoaderProvider
	 * @memberOf jQuery.caph.ui
	 * 
	 * @description 
	 *  The list item loader requests the required data from the server before reaching both side of the visible item view of the current list. 
	 *  It calculates item loading count and server request threshold count automatically according to the designated list's item view count per page.
	 *  And then always maintains internal data cache up to twice times than the loading count.
	 *  So let you are able to use caph list component with a huge amount of data.
	 *  
	 *  Example
	 *  --
	 *  
	 *  **js**
	 *  ~~~~~~
	 *  $.caph.ui.listItemLoaderProvider.register('loader1', {
	 *  	url: '/someUrl',
	 *  	dataType: 'jsonp',
	 *  	getTotalCount: function(data, status) {
	 *  		return data.totalCount;
	 *  	},
	 *  	getItems: function(data) {
	 *  		return data.items;
	 *  	}
	 *  });
	 *  
	 *  $('#list').caphList({
	 *  	itemLoader: 'loader1',
	 *  	template: '<div class="item" focusable><%= item.text %></div>'
	 *  });
	 *  ~~~~~~
	 *  
	 *  **html**
	 *  ~~~~~~
	 *  <body>
	 *  	<div id="list"></div>
	 *  </body>
	 *  ~~~~~~
	 */
    $.caph.ui.listItemLoaderProvider = {
		/**
		 * @name jQuery.caph.ui.listItemLoaderProvider.register
		 * @memberOf jQuery.caph.ui.listItemLoaderProvider
		 * @kind function
		 * 
		 * @description Registers new item loader.
		 * 
		 * @param {string} name The item loader name.
		 * @param {Object} config 
		 *  The item loader configurations.
		 *  - `url`: A string containing the URL to which the request is sent. **This is mandatory**.
		 *  - `headers`: Map of strings representing HTTP headers to send to the server. This is optional. 
		 *  - `parameterNames`: The item loader sends a request to the given URL with several parameters. These parameters are 'page', 'offset', 'count' and 'callback'. Because the item loader maintains internal data cache to fixed size. So these parameters are required. 'page' is the required page count. 'offset' is the start index of the required page. 'count' is the loading count per page. 'callback' is used for JSONP request. You can change the request parameter names to provide an object which consists of parameter name-replacement name string pairs.
		 *  - `dataType`: The type of data that you're expecting back from the server. 'xml', 'html', 'json', 'jsonp' and text' are available. If none is specified, jQuery will try to infer it based on the MIME type of the response.
		 *  - `loadingCount`: The item loading count for each request. This value is calculated automatically according to the designated list's item view count per page. Although you can set this value to whatever you want, **it's not recommended**.
		 *  - `thresholdCount`: The server request threshold count. When the designated list reaches as far as threshold count from both side of the item loader's internal data cache, the item loader sends a request to get the required data. This value is calculated automatically according to the designated list's item view count per page. Although you can set this value to whatever you want, **it's not recommended**.
		 *  - `getTotalCount`: A function returns a total count using the response data for the request. This function receives two parameters. One is 'data' which represents a response data, another is 'status' which represents a response status code. You should return a total count as a number using these parameters. **This is mandatory**.
		 *  - `getItems`: A function returns an array of the required items using the response data for the request. This function receives a 'data' parameter which represents a response data. Default function just returns the response data directly. If you need to parse the response data to make an array of the items, you should override default function to meet your requirements.
		 *  - `onBeforeLoad`: A function which is called before sending a request. This function receives a parameter which represents item loader itself.
		 *  - `onAfterLoad`: A function which is called after sending a request. This function receives two parameters. One is 'data' which represents a response data, another is 'status' which represents a response status code. This function can receive item loader itself as a third parameter. 
		 * @returns {jQuery.caph.ui.listItemLoaderProvider}
		 * 
		 * @example
		 *  $.caph.ui.listItemLoaderProvider.register('loader1', {
		 *  	url: '/someUrl',
		 *  	dataType: 'json',
		 *  	parameterNames: {
		 *  		offset: 'start'
		 *  	},
		 *  	getTotalCount: function(data, status) {
		 *  		return data.totalCount;
		 *  	},
		 *  	getItems: function(data) {
		 *  		return data.items;
		 *  	}
		 *  });
		 */
		register: function(name, config) {
			if (itemLoaders[name]) {
				throw new Error('The given name ' + name + ' already has been registered.');
			}
			
			itemLoaders[name] = new ItemLoader(config || {});
			return this;
		},
    
		/**
		 * @name jQuery.caph.ui.listItemLoaderProvider.unregister
		 * @memberOf jQuery.caph.ui.listItemLoaderProvider
		 * @kind function
		 * 
		 * @description Unregisters an item loader of the given name.
		 * 
		 * @param {string} name The item loader name.
		 * @returns {jQuery.caph.ui.listItemLoaderProvider}
		 * 
		 * @example
		 *  $.caph.ui.listItemLoaderProvider.unregister('loader1');
		 */
	    unregister: function(name) {
			delete itemLoaders[name];
			return this;
		},
		
		/**
		 * @name jQuery.caph.ui.listItemLoaderProvider.$$get
		 * @memberOf jQuery.caph.ui.listItemLoaderProvider
		 * @kind function
		 * 
		 * @description Gets an item loader of the given name. In normal case, this method is called internally only.
		 * 
		 * @param {string} name The item loader name.
		 * @returns {ItemLoader}
		 * 
		 * @example
		 *  $.caph.ui.listItemLoaderProvider.$$get('loader1');
		 */
		$$get: function(name) {
			return itemLoaders[name];
		}
    }
    
    $.caph.focus.controllerProvider.addBeforeKeydownHandler(function() {
		// do not process focus change while one of the item loaders is loading data.
		if (Object.keys(itemLoaders).some(function(name) {
			if (itemLoaders[name].isLoading()) {
				return true;
			}
		})) {
			return false;
		}
	}, -1000);
})(this, document, jQuery);
/**
 *
 * @name jQuery.fn.caphRadioButton
 * @kind jq-plugin
 * @memberOf jQuery.fn
 * @description
 * caph-radioButton provides radiobutton supporting the caph's focus and key navigation {@link caph.focus}
 * In radioButton option, you can modify the focus option using focusOption such as depth, group, name, and style of button through css.
 * If caph button is focused or blurred, 'focused' css class attached and detached automatically.
 * You can set the focus class using 'focused'. Also you can set the event handler action through handler like example.
 * Details about the focus option or event handling, please check the {@link caph.focus}
 *
 * You can set the radiobutton group through 'group' of options. 'group' is same with 'name' of <input type=radio>.
 * Only one radiobutton can be selected in same group. If group isn't set, the group is set to 'default' group.
 * Value which radiobutton selected or not can be checked by 'selected' attribute.
 * 'selected' attribute and 'selected' class are automatically attached and detached followed by selecting radiobutton or not.
 *  
 *
 *  | type     | option                   | description                                                                                                                                                                                                                    |
 *  |----------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 *  | string   | 'selected'               | Indicates this radiobutton is selected or not. When selected added at the radiobutton, radiobutton is selected. 
 *  | string   | 'radiobutton-class'      | css class name which applied to radiobutton
 *  | string   | 'group'                  | group name of the radio button group. Group is same with the name of 'input=radio'
 *  | object   | 'focus-option'           | focus name, focus group, disabled, initialfocus....
 *  | function | 'on-focused'             | Set the event handler when button is focused. Button passes two parameters '$event' and '$originalEvent'
 *  | function | 'on-blurred'	          | Set the event handler when button is blurred. Button passes two parameters '$event' and '$originalEvent'
 *  | function | 'on-selected'            | Set the event handler when button is selected. Button passes two parameters '$event' and '$originalEvent'. In toggle button, selected  indicating selected or not is passed as third parameter additionally.
 *  
 *
 * Example
 * --
 *
 * **js**
 * ~~~~~~
 * $('#radioButton').caphRadiobutton({
 *               onFocused :function(event,originalEvent){
 *                   //console.log('originalEvent',originalEvent);
 *               },
 *               onBlurred:function(event,originalEvent){
 *                   // console.log("onBlurred");
 *               },
 *               selected : true,
 *               group : 'group1'          
 *   });
 * ~~~~~~
 *
 * **html**
 * ~~~~~~
 * 	<div id="radioButton">Radio1</div>
 * ~~~~~~
 *
 *
 */

(function ($) {
    'use strict';
    var radiobuttonManager = {
    		radioCount : 0,
    		_radios : {},
    		addRadio : function(element, group){
				 this._radios[group] = this._radios[group] || [];
				 this._radios[group].push(element);
				 console.log(this._radios[group]);
			 },
			 selectRadio : function(element, group){
				  for(var i in this._radios[group]) {
					  if(this._radios[group][i].attr('selected')!== undefined){
						  this._radios[group][i].removeClass('selected');
						  this._radios[group][i].removeAttr('selected');
					  }
				  }
				  if(element.attr('selected') === undefined){
					  element.attr('selected','');
				  }
				  element.addClass('selected');
			}      
	};

    
    
    $.fn.caphRadiobutton= function(options) {

        // apply default options
        options = options || {};
        var settings = $.extend({}, $.fn.caphRadiobutton.defaults, options);


        return this.each(function() {
            var selected = options.selected || false;
            var group = options.group || 'default';
            var self = $(this);
            
        	self.attr('focusable','');
            $.caph.focus.Util.setData(this, options.focusOption);
            $.caph.focus.$$toAvailable(this);
            
            self.addClass(settings.className);
            radiobuttonManager.addRadio(self, group);

            if(selected) {
    			radiobuttonManager.selectRadio(self, group);
                self.attr('selected');
            }
            
            self.on('focused', function(event, originalEvent){
                $.isFunction(options.onFocused) && options.onFocused(event, originalEvent)
            });
            self.on('blurred', function(event, originalEvent){
                $.isFunction(options.onBlurred) && options.onBlurred(event, originalEvent);
            });
            self.on('selected', function(event, originalEvent){
            	radiobuttonManager.selectRadio(self, group);
            	$.isFunction(options.onSelected) && options.onSelected(event,originalEvent);
            });

        });
    };
    // define default options
    $.fn.caphRadiobutton.defaults = {
        className : 'caph-radiobutton'
    };

})(jQuery);
(function(window, document, $) {
	'use strict';
	
	var prefixes = ['Webkit', 'Moz', 'O', 'ms'];
    var prefixCheckerElement = document.createElement('div');
    
    var vendorPrefix = null;
    
    function getVendorProperty(property) {
		var style,
			vendorProperty,
			capitalizedProperty = property.charAt(0).toUpperCase() + property.substr(1);
		
		if (vendorPrefix === null) {
			style = prefixCheckerElement.style;
			
			if (property in style) {
				vendorPrefix = '';
	    		return property;
	    	}
			
			prefixes.some(function(prefix) {
    			vendorProperty = prefix + capitalizedProperty;
    			
    			if (vendorProperty in style) {
    				vendorPrefix = prefix;
    				return true;
    			}
    		});
			
			prefixCheckerElement = null;
			return vendorProperty;
		} 
		
		if (vendorPrefix) {
			return vendorPrefix + capitalizedProperty;	
		}
		
		return property;
	}
    
    ['transform', 'transition'].forEach(function(property) {
    	var vendorProperty = getVendorProperty(property);
		
		if (vendorProperty !== property) {
			$.cssHooks[property] = {
				get: function(element) {
					return $.css(element, vendorProperty);
				},
				set: function(element, value) {
					element.style[vendorProperty] = value;
				}
			};
		}
    });
    
    $.caph = $.caph || {};
    
    /**
	 * @name jQuery.caph.ui
	 * @memberOf jQuery.caph
	 * @kind jq-plugin
	 */
    $.caph.ui = $.caph.ui || {};
    
    /**
	 * @name jQuery.caph.ui.VendorUtil
	 * @memberOf jQuery.caph.ui
	 * 
	 * @description Returns vendor specific CSS properties.
	 */
    $.caph.ui.VendorUtil = {
		/**
		 * @name jQuery.caph.ui.VendorUtil.getVendorProperty
		 * @kind function
		 * 
		 * @description Gets the vendor specific CSS element style property name. ex) WebkitTransform, MozTransform, OTransform, msTransform
		 * 
		 * @param {string} property A CSS element style property name.
		 * @return {string} The vendor specific CSS style element property name.
		 * 
		 * @example
		 *  document.getElementById('id').style[$.caph.ui.VendorUtil.getVendorProperty('transform')] = 'rotateX(90deg)';
		 */
    	getVendorProperty: getVendorProperty,
    	
    	/**
		 * @name jQuery.caph.ui.VendorUtil.getVendorStyle
		 * @kind function
		 * 
		 * @description Gets the vendor specific CSS style property name. ex) -webkit-transform, -moz-transform, -o-transform, -ms-transform
		 * 
		 * @param {string} property A CSS style property name.
		 * @return {string} The vendor specific CSS style property name.
		 * 
		 * @example
		 *  var element = document.getElementById('id');
		 *  element.style[$.caph.ui.VendorUtil.getVendorProperty('transform')] = 'rotateX(90deg)';
		 *  element.style[$.caph.ui.VendorUtil.getVendorProperty('transition')] = $.caph.ui.VendorUtil.getVendorStyle('transform') + ' 0.5s';
		 * 
		 * @see {@link jQuery.caph.ui.VendorUtil.getVendorProperty}
		 */
    	getVendorStyle: function(property) {
    		var vendorProperty = getVendorProperty(property);
    		
    		if (vendorProperty !== property) {
    			return '-' + vendorProperty.replace(/[A-Z]/g, function(match, offset) {
    				var lowerCase = match.toLowerCase();
    				return offset === 0 ? lowerCase : '-' + lowerCase;
    			});
    		}
    		
    		return vendorProperty;
    	}
    };
    
    // checks whether an element in the list is visible or not.
    $.caph.focus.nearestFocusableFinderProvider.addBeforeDistanceCalculationHandler(function(focusable) {
    	var listItemData = $(focusable).parent().data() || {};
		
		if (listItemData.listItem === true && !listItemData.isVisibleListItem(listItemData.listItemRowIndex, listItemData.listItemColumnIndex)) {
			return false;
		}
    });
})(this, document, jQuery);