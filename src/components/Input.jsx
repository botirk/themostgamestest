import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentEditable from 'react-contenteditable';
import { saveUserStr, saveCsv } from '../slices/app.js';
// helper functions
const parseCsv = (str, includeDelimitersAndEmpty = true) => (includeDelimitersAndEmpty === true
  ? str.match(/[,;]+|[^,^;]+/g)
  : str.split(/[,;]+/).filter((str) => str.length !== 0)) ?? [];
// detect numbers
const isNumberFits = (numberStr, min = 1, max = 20) => {
  if (/\s*[0-9]+\s*/.test(numberStr) === false) return false;
  const number = Number.parseInt(numberStr);
  return number >= min && number <= max;
};

const filterParsedCsv = (strArray, removeDuplicates = true) => strArray.reduce((acc, str) => {
  if (isNumberFits(str) === true
        && (removeDuplicates === false || acc.includes(parseInt(str)) === false)) { acc.push(parseInt(str)); }
  return acc;
}, []);

// this code is stackoverflow one
const saveCaretPosition = (el) => {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.setStart(el, 0);
  const len = range.toString().length;

  return () => {
    const getTextNodeAtPosition = (rootEl, index) => {
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
    const range = new Range();
    range.setStart(pos.node, pos.position);
    selection.addRange(range);
  };
};
// React Components
const Description = ({ mistakes = false }) => {
  // console.log(mistakes);
  const customStyle = { visibility: (mistakes === false ? 'hidden' : 'visible') };
  return (
    <div>
      <p className="mb-0 fs-5">идентификаторы строк</p>
      <p style={customStyle} className="mb-0 fs-6 text-center">
        <mark>только числа от 1 до 20</mark>
      </p>
    </div>
  );
};

const CsvInput = React.memo(({ dispatch }) => {
  // when user enters something
  const onChange = (event) => {
    // console.log(event);
    // remove all HTML tags
    const str = event.currentTarget.textContent;
    dispatch(saveUserStr(str));
    // parse csv (but with delimiters)
    const csv = parseCsv(str, true);
    // find failed csv
    const markedCSV = csv.map((candidate) => {
      // delimiter || fittingNumber
      if (candidate === ',' || candidate === ';' || isNumberFits(candidate) === true) { return candidate; }
      return `<mark>${candidate}</mark>`;
    });
    // console.log(str, markedCSV);
    // set HTML inside DIV
    const restoreCaret = saveCaretPosition(event.currentTarget);
    event.currentTarget.innerHTML = markedCSV.join('').replaceAll(' ', '&nbsp;');
    restoreCaret();
  };

  return (
    <ContentEditable
      html=""
      className="form-control form-control-lg single-line"
      style={{ minWidth: '150px', flex: '1' }}
      onChange={onChange}
    />
  );
});

export default () => {
  const userStr = useSelector((state) => state.app.userStr);
  const state = useSelector((state) => state.app.state);
  const dispatch = useDispatch();

  const parsedCsv = parseCsv(userStr, false);
  const filteredParsedCsvWithDuplicates = filterParsedCsv(parsedCsv, false);
  const filteredParsedCsv = filterParsedCsv(parsedCsv, true);

  const onCount = () => dispatch(saveCsv(filteredParsedCsv));

  // console.log(parsedCsv.length, filteredParsedCsvWithDuplicates.length)
  return (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <Description mistakes={parsedCsv.length !== filteredParsedCsvWithDuplicates.length} />
      <CsvInput dispatch={dispatch} />
      <button disabled={state === 'loading'} onClick={onCount} type="button" className="btn btn-primary btn-lg">подсчитать</button>
    </div>
  );
};
