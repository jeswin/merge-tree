export function mergeTree(obj, field, crumbs, predicate, mutation) {

  let currentItem; //We don't change obj

  //find the crumbs which predicate() true on this sub-tree
  const matchedBranchCrumbs = crumbs.filter(crumb => crumb.branches.length > 0 && predicate(obj, crumb.branches[0]));
  if (matchedBranchCrumbs.length) {
    const subCrumbs = matchedBranchCrumbs.map(c => { return { branches: c.branches.slice(1), leaf: c.leaf }; });
    currentItem = currentItem || { ...obj };
    currentItem[field] = !currentItem[field] ?
      currentItem[field] :
      currentItem[field].map(item => mergeTree(item, field, subCrumbs, predicate, mutation));
  }

  //find the crumbs which are only leaf. (ie branches = [])
  const leafCrumbs = crumbs.filter(crumb => crumb.branches.length === 0);
  if (leafCrumbs.length) {
    for (let crumb of leafCrumbs) {
      currentItem = currentItem || { ...obj };
      currentItem = mutation(currentItem, crumb.leaf);
    }
  }

  return currentItem || obj;
}
