import { startLoading, successLoading, errorLoading } from '../slices/app.js';
import offlineSamples from '../offlineSamples.js';

// sync
const filterErrors = (dispatch, setError, responses) => responses.reduce((acc, response) => {
  switch (response.status) {
    case 200:
      acc.push(response);
      break;
    case 401:
      setError('Ошибка при авторизации');
      dispatch(errorLoading());
      break;
    case 404:
      setError('Сервер не найден');
      dispatch(errorLoading());
      break;
    default:
      setError(`Ошибка: ${response.status}`);
      dispatch(errorLoading());
      break;
  }
  return acc;
}, []);

const textStats = (text) => ({
  text,
  wordCount: (text.match(/[a-zа-я']+-*[a-zа-я']*/gi) ?? []).length,
  vowelCount: (text.match(/[AEIOUаиеёоуыэюяáéýíóúæøåÆÅäöü]/gi) ?? []).length,
});
// async
const combineAsync = async (fetches) => Promise.all(fetches);

const getJSONsAsync = async (responses) => (
  combineAsync(responses.map((response) => response.json())));

// all-in-one function
export const processCsvAsync = async (csv, dispatch, setError, useServer = false) => {
  if (useServer === true || window.useServer === true) {
    setError(undefined);
    dispatch(startLoading());

    const protocol = (location.protocol === 'https:') ? 'https' : 'http';
    const link = `${protocol}://tmgwebtest.azurewebsites.net/api/textstrings/`;
    try {
      const responses = await combineAsync(csv.map((number) => fetch(`${link}${number}`,
        { headers: { 'TMG-Api-Key': '0J/RgNC40LLQtdGC0LjQutC4IQ==' } })));

      const filteredResponses = filterErrors(dispatch, setError, responses);
      const JSONs = await getJSONsAsync(filteredResponses);
      // console.log(JSONs);
      const textsWithStats = JSONs.map((JSON) => textStats(JSON.text));
      // console.log(textsWithStats);
      dispatch(successLoading(textsWithStats));
    } catch (error) {
      if (error.message.toLowerCase().includes('network')) {
        setError('Ошибка сети при попытке связи с сервером');
        dispatch(errorLoading());
      } else {
        setError(`Ошибка ${error.message}`);
        dispatch(errorLoading());
      }
    }
  } else {
    setError(undefined);
    dispatch(startLoading());
    const JSONs = offlineSamples.filter((_, i) => csv.includes(i));
    // console.log(JSONs);
    const textsWithStats = JSONs.map((text) => textStats(text));
    // console.log(textsWithStats);
    dispatch(successLoading(textsWithStats));
  }
};
