import randomstring from 'randomstring';


class StringUtils {
  getRandomString(stringLength, isAllLowerCase) {
    return randomstring.generate({
      length: stringLength,
      charset: 'alphabetic',
      capitalization: isAllLowerCase ? 'lowercase' : null
    });
  }
}

export default new StringUtils();
