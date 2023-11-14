
export function cleanSpacesFromParameters(afk_text) {
  return afk_text
    .replace(/(\S+)\s*(=)\s*(\S+)/gi, '$1$2$3') //remove any space from parameters example id = '34' has space between id and = or = and '34'
    .trim() //remove white space from the front and end, could have done that in the replace
    .replace(/\s+/g, ' ') //transform any consecutive spaces into just one space
    .split(' '); //split on that space and get an array
  //when this is returned replace will turn the array into a string with the toString method essentially turning our array into a commaseparated string

}


