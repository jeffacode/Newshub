const replaceVariables = (str, variables) => {
  let newStr = str;
  Object.keys(variables).forEach(((key) => {
    const value = variables[key];
    const regex = new RegExp(`{${key}}`, 'g');
    newStr = newStr.replace(regex, value);
  }));

  return newStr;
};

export default replaceVariables;
