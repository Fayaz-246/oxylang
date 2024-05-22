import { types } from "../enums.js";

export function lex(input) {
  const itokens = input.split("").filter((item) => item !== "");
  let buffer = "";
  let isInString = false;
  let commented = false;
  const tokens = [];
  //   console.log(itokens);
  for (let i = 0; i < itokens.length; i++) {
    let token = itokens[i];

    // console.log(
    //   `Token = ${token} - Buffer = ${buffer} - IsString = ${isInString} - IsComment = ${commented}`
    // );

    if (isInString) {
      if (token === '"') {
        tokens.push({ type: types.str, value: buffer });
        tokens.push({ type: types.str_dec });
        buffer = "";
        isInString = false;
      } else {
        buffer += token;
      }
    } else if (commented) {
      if (token == "\n") {
        commented = false;
        tokens.push({ type: types.comment, value: buffer });
        buffer = "";
      } else {
        buffer += token;
      }
    } else if (isAlphaNumeric(token)) {
      while (isAlphaNumeric(token)) {
        buffer += token;
        i++;
        if (i >= itokens.length) break;
        token = itokens[i];
      }
      if (buffer === "exit") {
        tokens.push({ type: types.ret });
      } else if (buffer === "write") {
        tokens.push({ type: types.write });
      } else if (buffer === "def") {
        tokens.push({ type: types.def });
      } else {
        tokens.push({ type: types.alphanum, value: buffer });
      }
      buffer = "";
      i--;
    } else if (token === ";") {
      tokens.push({ type: types.semi });
    } else if (/\s/.test(token)) {
      continue;
    } else if (token === "(") {
      tokens.push({ type: types.left_paren });
    } else if (token === ")") {
      tokens.push({ type: types.right_paren });
    } else if (token === '"') {
      isInString = true;
      tokens.push({ type: types.str_dec });
    } else if (token === "@") {
      commented = true;
    } else if (token === "=") {
      tokens.push({ type: types.declaration });
    } else if (["+", "-", "/", "*"].some((tkx) => token == tkx)) {
      tokens.push({ type: types.binary_ops, value: token });
    } else if (/\s/.test(token) || token == "" || token == "\n") {
      continue; // Skip whitespace characters
    } else {
      throw Error(`Unexpected token: ${token}`);
    }
  }
  return tokens;
}

function isAlphaNumeric(character) {
  return /^[a-zA-Z0-9]$/.test(character);
}

function isSymbol(character) {
  // Define a regular expression pattern to match symbols
  const symbolPattern = /[!@#$%^&*()\[\]{}\-_=+<>,.?/:;]/;
  return symbolPattern.test(character);
}
