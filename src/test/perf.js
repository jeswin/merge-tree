import __polyfill from "babel-polyfill";
import should from 'should';
import mergeTree from "../merge-tree";

const getData = function() {
  let result = { name: "hello", contents: [] };
  let current = result;
  for (let i = 0; i < 5000; i++) {
    current.contents.push({ name: "hello", contents: [] })
    if (i%100 === 0) {
      current = current.contents[0];
    }
  }
  return result;
}

function timeIt(name, fn, loops) {
  const start = Date.now();
  for (let i = 0; i < loops; i++) {
    fn();
  }
  const end = Date.now();
  console.log(`${name} took ${(end-start)/1000} seconds for ${loops} loops.`)
}

/* clone() from Stack Overflow http://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript */
function clone(item) {
  if (!item) { return item; } // null, undefined values check

  var types = [ Number, String, Boolean ],
  result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function(type) {
    if (item instanceof type) {
      result = type( item );
    }
  });

  if (typeof result == "undefined") {
    if (Object.prototype.toString.call( item ) === "[object Array]") {
      result = [];
      item.forEach(function(child, index, array) {
        result[index] = clone( child );
      });
    } else if (typeof item == "object") {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == "function") {
        var result = item.cloneNode( true );
      } else if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (var i in item) {
            result[i] = clone( item[i] );
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
}

const state = getData();

timeIt("JSON.stringify", () => {
  const cloned = JSON.parse(JSON.stringify(state));
  cloned.contents[0].contents[0].contents[0].enabled = false;
}, 1000)

timeIt("deepclone", () => {
  const cloned = clone(state);
  cloned.contents[0].contents[0].contents[0].enabled = false;
}, 1000)

timeIt("merge-tree", () => {
  const merged = mergeTree(
    state,
    "contents",
    [
      { parents: ["hello", "hello", "hello"], target: { name: "hello", enabled: false } }
    ],
    (dir, b) => dir.name === b,
    (item, target) => item.name === target.name ?
      Object.assign({}, item, { enabled: target.enabled }) :
      item
  );
}, 1000);
