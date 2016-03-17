merge-tree
===
Returns a new tree with a mutation applied, without destroying the original tree.

Why?
---
There are several choices available today when it comes to using immutable data in JS.
That includes Immutable-JS, mori and plain ol' Object.assign().

If you're sticking to plain ol' JS, Object.assign() works quite well.
Until you get to recursive data structures or trees.

In the following example, let's say we want a new object with the "enabled" value of target node "x1/x1.1/x1.1.1/x1.1.1.2" set to false.
Object.assign() will not work here because of the nesting.
```
data = {
  name: "x1",
  contents: [
    {
      name: "x1.1",
      contents: [
        {
          name: "x1.1.1",
          contents: [
            {
              name: "x1.1.1.1"
              enabled: true
            },
            {
              name: "x1.1.1.2",
              enabled: true
            }
          ]
        },
        {
          name: "x1.1.2"
        }
      ]
    }
  ]
}
```

Here's how you do it with merge tree
```
npm install merge-tree;

import mergeTree from "merge-tree";
const result = mergeTree(
  //data structure
  data,

  //array containing children
  "contents",

  //nodes to change. You can change any node, not just the edges.
  [
    { parents: ["x1", "x1.1", "x1.1.1"], target: { name: "x1.1.1.1", enabled: false } },
    { parents: ["x1", "x1.1", "x1.1.1"], target: { name: "x1.1.1.2", enabled: false } }
  ],

  //predicate which checks the name of the parents.
  (dir, b) => dir.name === b,

  //mutator function which changes the target node.
  (item, target) => item.name === target.name ?
    Object.assign({}, item, { enabled: target.enabled }) :
    item
);
```

To see a working example. check src/test/test.js
