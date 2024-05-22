import fs from "node:fs";
import { lex } from "./funcs/lexer.js";
import { parse } from "./funcs/parse.js";
import { interpret } from "./funcs/interpret.js";
import readline from "readline";
import { Env } from "./backend/Environment.js";

const runtime = new Env();
console.log(
  `
  ________                  .____                           
\_____  \ ___  ______.__. |    |   _____    ____    ____  
 /   |   \\  \/  <   |  | |    |   \__  \  /    \  / ___\ 
/    |    \>    < \___  | |    |___ / __ \|   |  \/ /_/  >
\_______  /__/\_ \/ ____| |_______ (____  /___|  /\___  / 
        \/      \/\/              \/    \/     \//_____/  
  `
);
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function askForInput() {
//   rl.question("\x1b[36m❯ Enter File Path\n❯ \x1b[0m", (input) => {
//     if (input == "exit") {
//       console.log("   Exiting Process");
//       process.exit(0);
//     }

//     input = fs.readFileSync(input, "utf8");
//     const tokens = lex(input);
//     const ast = parse(tokens, runtime);
//     console.log("");
//     console.log(`AST: \n ${JSON.stringify(ast, null, " ")}`);
//     console.log("");
//     const res = interpret(ast, runtime);

//     askForInput();
//   });
// }

// askForInput();

// BREAK WILL BE BONk

const input = fs.readFileSync("./test.oxy", "utf8");

const tokens = lex(input);
console.log(tokens);

const ast = parse(tokens, runtime);

// console.log("");
// console.log(`AST: \n ${JSON.stringify(ast, null, " ")}`);
// console.log("");
const res = interpret(ast, runtime);
