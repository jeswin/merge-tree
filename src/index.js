function mergeTree(obj, field, crumbs, predicate, mutation) {
  //We don't change obj
  let currentItem;

  //find the crumbs which predicate() true on this sub-tree
  const matchedParentCrumbs = crumbs.filter(crumb => crumb.parents.length > 0 && predicate(obj, crumb.parents[0]));
  if (matchedParentCrumbs.length) {
    const subCrumbs = matchedParentCrumbs.map(c => { return { parents: c.parents.slice(1), target: c.target }; });
    currentItem = currentItem || { ...obj };
    currentItem[field] = !currentItem[field] ?
      currentItem[field] :
      currentItem[field].map(item => mergeTree(item, field, subCrumbs, predicate, mutation));
  }

  //find the crumbs which are only target. (ie parents = [])
  const targetCrumbs = crumbs.filter(crumb => crumb.parents.length === 0);
  if (targetCrumbs.length) {
    for (let crumb of targetCrumbs) {
      currentItem = currentItem || { ...obj };
      currentItem = mutation(currentItem, crumb.target);
    }
  }
  return currentItem || obj;
}

export default mergeTree;
