merge-tree
===
Returns a new tree with a mutation applied, without destroying the original tree.

Why?
---
There are several choices available today when it comes to using immutable data in JS.
That includes Immutable-JS, mori and plain ol' Object.assign().

If you're sticking to plain ol' JS, Object.assign() works quite well.
Until you get to recursive data structures or trees.

In the following example, let's say we want a new object with the "enabled" value of leaf node "x1/x1.1/x1.1.1/x1.1.1.2" set to false.
Object.assign() is not useful here.
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

import { mergeTree } from "merge-tree";
const result = mergeTree(
  //data structure
  data,

  //array containing children
  "contents",

  //leaf nodes to change
  [
    { branches: ["x1", "x1.1", "x1.1.1"], leaf: { name: "x1.1.1.1", enabled: false } },
    { branches: ["x1", "x1.1", "x1.1.1"], leaf: { name: "x1.1.1.2", enabled: false } }
  ],

  //predicate which checks the name of the branches.
  (dir, b) => dir.name === b,

  //mutator function which changes the leaf node.
  (item, leaf) => item.name === leaf.name ?
    Object.assign({}, item, { enabled: leaf.enabled }) :
    item
);
```

To see a working example. check src/test/test.js
