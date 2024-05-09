// imports
const fs = require("fs");
const acorn = require("acorn");

// read source code from code.js
const sourceCode = fs
  .readFileSync("sample.js", "utf8")
  .catch((err) => console.error(err));

// parse the source code
const ast = acorn.parse(sourceCode, { ecmaVersion: "latest" });
