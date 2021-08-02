import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, errorLoading, successLoading } from '../slices/app.js';
import offlineSamples from '../offlineSamples.js';

// data processing stages
// async
const combineAsync = (fetches) => Promise.all(fetches);
const getJsonAsync = (responses) => combineAsync(responses.map((response) => response.json()));
// sync
const filterErrors = (dispatch) => (responses) => responses.reduce((acc, response) => {
  switch (response.status) {
    case 200:
      acc.push(response);
      return acc;
    case 401:
      dispatch(errorLoading('Ошибка при авторизации'));
      return acc;
    case 404:
      dispatch(errorLoading('Сервер не найден'));
      return acc;
    default:
      dispatch(errorLoading(`Ошибка :#${response.status}`));
      return acc;
  }
}, []);
const textStats = (text) => ({
  text,
  wordCount: (text.match(/[a-zа-я']+-*[a-zа-я']*/gi) ?? []).length,
  vowelCount: (text.match(/[AEIOUаиеёоуыэюяáéýíóúæøåÆÅäöü]/gi) ?? []).length,
});
const finish = (dispatch) => (JSONs) => {
  // console.log(JSONs);
  const textsWithStats = JSONs.map((JSON) => textStats(JSON.text));
  // console.log(textsWithStats);
  dispatch(successLoading(textsWithStats));
};
const fetchCatcher = (dispatch) => (error) => {
  if (error.message.toLowerCase().includes('network')) { 
    dispatch(errorLoading('Ошибка сети при попытке связи с сервером')); 
  } else { 
    dispatch(errorLoading(`Ошибка ${error.message}`)); 
  }
};
// all-in-one function
const processCsv = (csv, dispatch, useServer = false) => {
  if (useServer === true || window.useServer === true) {
    dispatch(startLoading());
    
    let protocol = (location.protocol === 'https:') ? 'https' : 'http';
    let link = `${protocol}://tmgwebtest.azurewebsites.net/api/textstrings/`;

    const fetches = csv.map((number) => fetch(`${link}${number}`,
      { headers: { 'TMG-Api-Key': '0J/RgNC40LLQtdGC0LjQutC4IQ==' } }));

    combineAsync(fetches)
      .then(filterErrors(dispatch))
      .then(getJsonAsync)
      .then(finish(dispatch))
      .catch(fetchCatcher(dispatch));
  } else {
    dispatch(startLoading());

    finish(dispatch)(offlineSamples
      .filter((_, i) => csv.includes(i))
      .map((text) => ({ text })));
  }
}
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
    processCsv(csv, dispatch);
  });

  return (
    <>
      <Error />
      <Table />
    </>
  );
};
