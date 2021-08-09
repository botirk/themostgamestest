export const parseCsv = (str, includeDelimitersAndEmpty = true) => (
  (includeDelimitersAndEmpty === true
    ? str.match(/[,;]+|[^,^;]+/g)
    : str.split(/[,;]+/).filter((str2) => str2.length !== 0)) ?? []);
// detect numbers
export const isNumberFits = (numberStr, min = 1, max = 20) => {
  if (/^\s*[0-9]+\s*$/.test(numberStr) === false) return false;
  const number = Number.parseInt(numberStr, 10);
  return number >= min && number <= max;
};

export const filterParsedCsv = (strArray, removeDuplicates = true) => (
  strArray.reduce((acc, str) => {
    if (isNumberFits(str) === true
      && (removeDuplicates === false || acc.includes(parseInt(str, 10)) === false)) {
      acc.push(parseInt(str, 10));
    }
    return acc;
  }, []));

// this code is stackoverflow one
export const saveCaretPosition = (el) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.setStart(el, 0);
  const len = range.toString().length;

  return () => {
    const getTextNodeAtPosition = (rootEl, constIndex) => {
      let index = constIndex;
      const NODE_TYPE = NodeFilter.SHOW_TEXT;
      const treeWalker = document.createTreeWalker(rootEl, NODE_TYPE, (elem) => {
        if (index > elem.textContent.length) {
          index -= elem.textContent.length;
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      });
      const c = treeWalker.nextNode();
      return {
        node: c ?? rootEl,
        position: index,
      };
    };
    const pos = getTextNodeAtPosition(el, len);
    selection.removeAllRanges();
    const savedRange = new Range();
    savedRange.setStart(pos.node, pos.position);
    selection.addRange(savedRange);
  };
};
