// imports
const fs = require("fs");
const acorn = require("acorn");
const walk = require("acorn-walk");
const utils = require("./utils");

// read source code from code.js
const sourceCode = fs.readFileSync("sample.js", "utf8");

// parse the source code
const ast = acorn.parse(sourceCode, { ecmaVersion: "2020", locations: true });

// main walk of the AST
walk.simple(ast, {
  MemberExpression(node) {
    // detect console messages
    utils.detectConsoleLogs(node);
    // detect direct input field access
    utils.detectInputFieldAccess(node, walk, ast);
  },

  CallExpression(node) {
    // detect eval() calls
    utils.detectEvalCalls(node);
  },

  BinaryExpression(node) {
    utils.detectUnsafeTypeConversions(node);
    utils.detectPotentialTruncation(node);
  },

  Literal(node) {
    // detect secret keys
    if (typeof node.value === "string") utils.detectHardcodedSecrets(node);
  },
});
