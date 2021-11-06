
/**
 *
 */
export default class KHashTable {

  /**
   *
   */  
  constructor (obj) {
    this.length = 0;
    this.items = {};

    if (obj) {
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          this.items[p] = obj[p];
          this.length++;
	    }
	  }
    }
  }

  /**
   *
   */
  getItems () {
    return (this.items);
  }

  /**
   *
   */
  getLength () {
    return (this.length);
  }

  /**
   *
   */
  setItems (aValue, aLength) {
    this.items=aValue;
    this.length=aLength;
  }
  
  /**
   *
   */
  setItem (key, value) {
    let previous = undefined;

    if (this.hasItem(key)) {
      previous = this.items[key];
    } else {
      this.length++;
    }

    this.items[key] = value;
    
    return previous;
  }

  /**
   *
   */
  getItem (key) {
    return this.hasItem(key) ? this.items[key] : undefined;
  }

  /**
   *
   */
  hasItem (key) {
    return this.items.hasOwnProperty(key);
  }
   
  /**
   *
   */   
  removeItem (key) {
    if (this.hasItem(key)) {
      let previous = this.items[key];
      this.length--;
      delete this.items[key];
      return previous;
    } else {
      return undefined;
    }
  }
 
  /**
   *
   */
  keys () {
    var keys = [];
    for (var k in this.items) {
      if (this.hasItem(k)) {
        keys.push(k);
      }
    }
    return keys;
  }

  /**
   *
   */
  values () {
    var values = [];
    for (var k in this.items) {
      if (this.hasItem(k)) {
        values.push(this.items[k]);
      }
    }
    return values;
  }

  /**
   *
   */
  each (fn) {
    for (var k in this.items) {
      if (this.hasItem(k)) {
        fn(k, this.items[k]);
      }
    }
  }

  /**
   *
   */
  clear () {
    this.items = {}
    this.length = 0;
  }
}
