import regeneratorRuntime from "regenerator-runtime";
import { startLoading, errorLoading, successLoading } from '../slices/app.js';
import offlineSamples from '../offlineSamples.js';

// async
const combineAsync = async (fetches) => 
  await Promise.all(fetches);

const getJsonAsync = async (responses) => 
  await combineAsync(responses.map((response) => response.json()));

// all-in-one function
export const processCsvAsync = async (csv, dispatch, useServer = false) => {
  if (useServer === true || window.useServer === true) {
    dispatch(startLoading());
    
    let protocol = (location.protocol === 'https:') ? 'https' : 'http';
    let link = `${protocol}://tmgwebtest.azurewebsites.net/api/textstrings/`;

    const responses = await combineAsync(csv.map((number) => fetch(`${link}${number}`,
      { headers: { 'TMG-Api-Key': '0J/RgNC40LLQtdGC0LjQutC4IQ==' } })));

    const filteredResponses = filterErrors(dispatch)(responses);
    const JSONs = await getJsonAsync(filteredResponses);
    // console.log(JSONs);
    const textsWithStats = JSONs.map((JSON) => textStats(JSON.text));
    // console.log(textsWithStats);
    dispatch(successLoading(textsWithStats));
  } else {
    dispatch(startLoading());
    const JSONs = offlineSamples.filter((_, i) => csv.includes(i));
    // console.log(JSONs);
    const textsWithStats = JSONs.map((text) => textStats(text));
    // console.log(textsWithStats);
    dispatch(successLoading(textsWithStats));
  }
}
// sync
const filterErrors = (dispatch) => (responses) => responses.reduce((acc, response) => {
  switch (response.status) {
    case 200:
      acc.push(response);
      break;
    case 401:
      dispatch(errorLoading('Ошибка при авторизации'));
      break;
    case 404:
      dispatch(errorLoading('Сервер не найден'));
      break;
    default:
      dispatch(errorLoading(`Ошибка :#${response.status}`));
      break;
  }
  return acc;
}, []);
const textStats = (text) => ({
  text,
  wordCount: (text.match(/[a-zа-я']+-*[a-zа-я']*/gi) ?? []).length,
  vowelCount: (text.match(/[AEIOUаиеёоуыэюяáéýíóúæøåÆÅäöü]/gi) ?? []).length,
});
const fetchCatcher = (dispatch) => (error) => {
  if (error.message.toLowerCase().includes('network')) { 
    dispatch(errorLoading('Ошибка сети при попытке связи с сервером')); 
  } else { 
    dispatch(errorLoading(`Ошибка ${error.message}`)); 
  }
};