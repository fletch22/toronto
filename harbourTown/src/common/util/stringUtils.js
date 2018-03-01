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
    return searchString.replace(new RegExp(toFind, 'g'), replacement);
  }
}

export default new StringUtils();
