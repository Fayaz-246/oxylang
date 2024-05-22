import { Env } from "../backend/Environment.js";
import { keywords, typesOfLoggingText } from "../enums.js";
import process from "node:process";

/**
 *
 * @param {*} ast
 * @param {Env} runtime
 */
export function interpret(ast, runtime) {
  ast.forEach((node) => {
    switch (node.type) {
      case "ReturnStatement":
        process.exit(node.val);
        break;
      case "WriteStatement":
        // console.log(JSON.stringify(node, null, " "));
        if (node.text.type === typesOfLoggingText.str) {
          console.log(node.text.value);
        } else if (node.text.type === typesOfLoggingText.var) {
          const logAbil = runtime.getVar(node.text.value);
          console.log(logAbil);
        }
        break;
      case "DeclarationStatement":
        if (keywords[node.value.identifier])
          throw new Error(
            `Identifier cannot be keyword | ${node.value.identifier} |`
          );
        runtime.declareVar(node.value.identifier, node.value.val);
        break;
      case "AssignmentStatement":
        runtime.assignVar(node.value.identifier.value, node.value.val);
        break;
    }
    // console.log(runtime.variables);
  });
}
