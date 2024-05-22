import { Env } from "../backend/Environment.js";
import { types, typesOfLoggingText } from "../enums.js";

/**
 *
 * @param {*} tokens
 * @param {Env} runtime
 * @returns
 */
export function parse(tokens, runtime) {
  let currentTokenIndex = 0;
  function getNextToken() {
    const token = tokens[currentTokenIndex++];
    return token;
  }
  // console.log(`Tokens: ${tokens.length}`);
  function expectToken(expectedType) {
    const token = getNextToken();
    if (!token || token.type !== expectedType) {
      throw new Error(
        `Unexpected token: ${JSON.stringify(
          token
        )},\n expected: ${expectedType}.`
      );
    }
    return token;
  }

  function parseExpression() {
    let token = getNextToken();
    while (token && token.type === types.comment) {
      token = getNextToken();
    }

    if (!token) {
      return null;
    }

    if (token.type === types.ret) {
      const valueToken = expectToken(types.alphanum);
      expectToken(types.semi);
      return { type: "ReturnStatement", value: parseInt(valueToken.value) };
    } else if (token.type === types.write) {
      expectToken(types.left_paren);
      const nextToken = getNextToken();
      let valueToken;
      let typeOf;

      if (nextToken.type === types.str_dec) {
        valueToken = expectToken(types.str);
        expectToken(types.str_dec);
        typeOf = typesOfLoggingText.str;
      } else {
        valueToken = nextToken;
        typeOf = typesOfLoggingText.var;
      }
      expectToken(types.right_paren);
      expectToken(types.semi);
      // console.log(valueToken);
      return {
        type: "WriteStatement",
        text: { value: valueToken?.value, type: typeOf },
      };
    } else if (token.type === types.comment) {
      const valueToken = expectToken(types.alphanum);
      return { type: "CommentStatement", value: valueToken.value };
    } else if (token.type === types.def) {
      const key = expectToken(types.alphanum);
      expectToken(types.declaration);
      let val;
      const nextToken = getNextToken();
      // console.log(`Next Token = ${JSON.stringify(nextToken)}`);
      if (nextToken.type === types.str_dec) {
        val = expectToken(types.str);
        expectToken(types.str_dec);
        // console.log("Its a string");
      } else {
        currentTokenIndex--;
        val = expectToken(types.alphanum);
        // console.log("Its a int");
      }

      expectToken(types.semi);
      return {
        type: "DeclarationStatement",
        value: {
          identifier: key.value,
          val: val.value,
        },
      };
    }
     else {
      throw new Error(`Unexpected token: ${token.type} Value: ${token.value}`);
    }
  }

  const ast = [];

  let statement = parseExpression();
  while (statement !== null) {
    ast.push(statement);
    statement = parseExpression();
  }

  return ast;
}
