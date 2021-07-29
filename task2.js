// task function:
export function compare(ruText, enTextWithComments) {
  const equalPairs = [];
  const nonLetters = [' ', ',', '.', ':', '-', ';', '\''];
  for (let i = 0; i < ruText.length; i++) {
    let ruStringIndex = 0;
    let ruLetterIndex = 0.5;
    for (let j = 0; j < ruText[i].length; j++) {
      if (!nonLetters.includes(ruText[i][j])) {
        ruStringIndex += ruLetterIndex;
        ruLetterIndex += 1;
      }
    }
    for (let k = 0; k < enTextWithComments.length; k++) {
      let enStringIndex = 0;
      let enLetterIndex = 0.5;
      let enCommentIndex = 0;
      let commentLetterIndex = 0.5;
      const enText = enTextWithComments[k].split('|')[0];
      const comment = enTextWithComments[k].split('|')[1];
      for (let n = 0; n < enText.length; n++) {
        if (!nonLetters.includes(enText[n])) {
          enStringIndex += enLetterIndex;
          enLetterIndex += 1;
        }
      }
      for (let m = 0; m < comment.length; m++) {
        if (!nonLetters.includes(comment[m])) {
          enCommentIndex += commentLetterIndex;
          commentLetterIndex += 1;
        }
      }
      if (enCommentIndex > 0.5) {
        if (ruStringIndex === enStringIndex + enCommentIndex) {
          equalPairs.push({
            ruText: ruText[i],
            enText: enTextWithComments[k],
          });
        }
      }
    }
  }
  return equalPairs;
}
// my function:
// declared once + easier to test
const nonLetters = [' ', ',', '.', ':', '-', ';', '\''];
// DRY + pure function + easier to test
const countIndexes = (string) => string.reduce((acc, letter) => {
  if (nonLetters.includes(letter) === false) {
    acc[0] += acc[1];
    acc[1] += 1;
  }
  return acc;
// returning only acc[0], because letterIndex is not used
}, [0, 0.5])[0];
// logic
export const compare2 = (ruText, enTextWithComments) => ruText.reduce((acc, ruString) => {
  const ruStringIndex = countIndexes(ruString);
  enTextWithComments.forEeach((enStringWithComments) => {
    // enString first
    const enString = enStringWithComments.split('|')[0];
    const enStringIndex = countIndexes(enString);
    // commentString second
    const enComment = enStringWithComments.split('|')[1];
    const enCommentIndex = countIndexes(enComment);
    if (enCommentIndex > 0.5 && (ruStringIndex === enStringIndex + enCommentIndex)) {
      acc.push({ ruText: ruString, enText: enStringWithComments });
    }
  });
  return acc;
}, []);
