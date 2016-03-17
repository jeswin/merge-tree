import __polyfill from "babel-polyfill";
import should from 'should';
import mergeTree from "../merge-tree";

const getData = function() {
  return {
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
              },
              {
                name: "x1.1.1.2"
              },
              {
                name: "x1.1.1.3"
              }
            ]
          },
          {
            name: "x1.1.2"
          },
          {
            name: "x1.1.3"
          },
          {
            name: "x1.1.4"
          }
        ]
      }
    ]
  }
}

describe("mergeTree", () => {

  it("change multiple objects at the same nesting level", () => {
    const data = getData();
    const result = mergeTree(
      data,
      "contents",
      [
        { parents: ["x1", "x1.1"], target: { name: "x1.1.1", trixie: 10001 } },
        { parents: ["x1", "x1.1"], target: { name: "x1.1.2", trixie: 10002 } }
      ],
      (dir, b) => dir.name === b,
      (item, target) => item.name === target.name ?
        Object.assign({}, item, { mixie: item.mixie || target.mixie, dixie: item.dixie || target.dixie, trixie: item.trixie || target.trixie }) :
        item
    );
    result.contents[0].contents[0].trixie.should.equal(10001);
    result.contents[0].contents[1].trixie.should.equal(10002);
  });


  it("Change multiple objects at different nesting levels", () => {
    const data = getData();
    const result = mergeTree(
      data,
      "contents",
      [
        { parents: ["x1", "x1.1", "x1.1.1"], target: { name: "x1.1.1.1", mixie: 101 } },
        { parents: ["x1", "x1.1", "x1.1.1"], target: { name: "x1.1.1.1", dixie: 1001 } },
        { parents: ["x1", "x1.1"], target: { name: "x1.1.1", trixie: 10001 } }
      ],
      (dir, b) => dir.name === b,
      (item, target) => item.name === target.name ?
        Object.assign({}, item, { mixie: item.mixie || target.mixie, dixie: item.dixie || target.dixie, trixie: item.trixie || target.trixie }) :
        item
    );
    result.contents[0].contents[0].contents[0].mixie.should.equal(101);
    result.contents[0].contents[0].contents[0].dixie.should.equal(1001);
    result.contents[0].contents[0].trixie.should.equal(10001);
  });


  it("return original value when parents mismatch", () => {
    const data = getData();
    const result = mergeTree(
      data,
      "contents",
      [
        { parents: ["invalid"], target: { name: "x1.1.1", trixie: 10001 } }
      ],
      (dir, b) => dir.name === b,
      (item, target) => item.name === target.name ?
        Object.assign({}, item, { trixie: item.trixie || target.trixie }) :
        item
    );
    result.should.equal(data);
  });


  it("change tree even when some parents are mismatched", () => {
    const data = getData();
    const result = mergeTree(
      data,
      "contents",
      [
        { parents: ["x1", "x1.1"], target: { name: "x1.1.1", trixie: 10001 } },
        { parents: ["x1", "x1.1"], target: { name: "x1.1.2", trixie: 10002 } },
        { parents: ["invalid1", "x1.1"], target: { name: "x1.1.2", trixie: 10002 } },
        { parents: ["invalid2", "x1.1"], target: { name: "x1.1.2", trixie: 10002 } }
      ],
      (dir, b) => dir.name === b,
      (item, target) => item.name === target.name ?
        Object.assign({}, item, { mixie: item.mixie || target.mixie, dixie: item.dixie || target.dixie, trixie: item.trixie || target.trixie }) :
        item
    );
    result.contents[0].contents[0].trixie.should.equal(10001);
    result.contents[0].contents[1].trixie.should.equal(10002);
  });


  it("if we don't change anything, it must return the same structure.", () => {
    const data = getData();
    const result = mergeTree(
      data,
      "contents",
      [
        { parents: ["x1", "x1.1"], target: { name: "x1.1.1", trixie: 10001 } },
        { parents: ["x1", "x1.1"], target: { name: "x1.1.2", trixie: 10002 } }
      ],
      (dir, b) => dir.name === b,
      (item, target) => item
    );
    result.should.not.equal(data);
    JSON.stringify(result).should.equal(JSON.stringify(data));
  });
});
