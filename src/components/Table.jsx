import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processCsvAsync } from './TableLogic.js';

// react components
const Error = () => {
  const error = useSelector((state) => state.app.error);

  if (error === undefined) return null;
  return <div className="alert alert-warning" role="alert">{error}</div>;
};

const Table = () => {
  const tableData = useSelector((state) => state.app.tableData);

  if (tableData === undefined) return null;
  return (
    <div className="border">
      <div className="row flex-nowrap align-items-center">
        <div className="col-8 ms-3 flex-shrink-1"><b>Текст</b></div>
        <div className="col text-center"><b>Количество слов</b></div>
        <div className="col text-center"><b>Количество гласных</b></div>
      </div>
      {tableData.map((textData, i) => (
        <div key={i} className="row flex-nowrap align-items-center mt-3">
          <div className="col-8 ms-3 flex-shrink-1">{textData.text}</div>
          <div className="col text-center">{textData.wordCount}</div>
          <div className="col text-center">{textData.vowelCount}</div>
        </div>
      ))}
    </div>
  );
};

export default () => {
  const csv = useSelector((state) => state.app.csv);

  const dispatch = useDispatch();
  // ask server for texts in exchange of csv
  useEffect(() => {
    if (csv === undefined) return;
    processCsvAsync(csv, dispatch);
  });

  return (
    <>
      <Error />
      <Table />
    </>
  );
};
