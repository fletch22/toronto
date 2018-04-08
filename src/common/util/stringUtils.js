import randomstring from 'randomstring';


class StringUtils {
  getRandomString(stringLength, isAllLowerCase) {
    return randomstring.generate({
      length: stringLength,
      charset: 'alphabetic',
      capitalization: isAllLowerCase ? 'lowercase' : null
    });
  }

  replaceAll(searchString, toFind, replacement) {
    const replacementCorrected = replacement || '';
    return searchString.replace(new RegExp(toFind, 'g'), replacementCorrected);
  }
}

export default new StringUtils();
