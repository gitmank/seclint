// imports
const richConsole = require("rich-console");

// message templates
const infoMessageTemplate = richConsole.getRichTmpl(
  "<yellow>line %s</yellow>: %s",
);
const warnMessageTemplate = richConsole.getRichTmpl("<red>line %s</red>: %s");

// detect console logs which developers forget to remove after debugging
const detectConsoleLogs = (node) => {
  // check for console.log() and console.debug() calls
  if (
    node.object.name === "console" &&
    ["log", "debug"].includes(node.property.name)
  ) {
    // print warning message
    richConsole.log(
      infoMessageTemplate,
      node.loc.start.line,
      "information being logged to console",
    );
  }
};

// detect direct input field access that may lead to XSS, SQLi, etc.
const detectInputFieldAccess = (node, walk, ast) => {
  // check if an element's value is accessed
  if (node.property.name === "value") {
    // verify if the element is a DOM element
    let parent = walk.findNodeAfter(ast, node.start).node;
    walk.simple(parent, {
      MemberExpression(node) {
        if (node.property.name === "getElementById") {
          // print warning message
          richConsole.log(
            infoMessageTemplate,
            node.loc.start.line,
            "direct input field access, sanitization required",
          );
        }
      },
    });
  }
};

// detect eval() calls that may lead to code injection
const detectEvalCalls = (node) => {
  if (node.callee.name === "eval") {
    richConsole.log(
      warnMessageTemplate,
      node.loc.start.line,
      "dangerous use of eval() method",
    );
  }
};

// detect hardcoded secret keys, passwords, etc. in the code
function detectHardcodedSecrets(node) {
  // common regex patterns
  const patterns = [
    /[a-zA-Z0-9]{32,}/, // API keys and tokens
    /[A-Za-z0-9+/]{20,}={0,3}/, // Base64 encoded strings
    /eyJ[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+/, // JWT tokens
    /(secret|password|token)\s*[:=]\s*['"][^'"]+['"]/, // common secret patterns
    /https?:\/\/[a-zA-Z0-9.-]+/, // API endpoints
    /mongodb(?:\+srv)?:\/\/[^:]+:[^@]+@[^/]+/, // mongodb connection strings
  ];

  // combine patterns
  const combinedPattern = new RegExp(
    patterns.map((p) => p.source).join("|"),
    "g",
  );

  // find matches
  const matches = node.value.match(combinedPattern) || [];

  // print warnings
  matches.forEach((match) => {
    richConsole.log(
      warnMessageTemplate,
      node.loc.start.line,
      "found hardcoded secret - " + match.slice(0, 20) + "...",
    );
  });
}

// detect unsafe type conversions
const detectUnsafeTypeConversions = (node) => {
  if (node.operator == "+" && node.left.type !== node.right.type) {
    richConsole.log(
      infoMessageTemplate,
      node.loc.start.line,
      "possible unsafe type conversion with + operator",
    );
  }
  if (node.operator == "==") {
    richConsole.log(
      infoMessageTemplate,
      node.loc.start.line,
      "possible unsafe type conversion with ==, use === instead",
    );
  }
  if (node.operator == "!=") {
    richConsole.log(
      infoMessageTemplate,
      node.loc.start.line,
      "possible unsafe type conversion with !=, use !== instead",
    );
  }
};

// detect potential truncation using bitwise OR operator
const detectPotentialTruncation = function (node) {
  if (
    node.operator === "|" &&
    (node.left.raw === "0" || node.right.raw === "0")
  ) {
    richConsole.log(
      infoMessageTemplate,
      node.loc.start.line,
      "possible truncation detected using bitwise OR",
    );
  }
  // Extend with other checks as needed
};

module.exports = {
  detectConsoleLogs,
  detectInputFieldAccess,
  detectEvalCalls,
  detectHardcodedSecrets,
  detectUnsafeTypeConversions,
  detectPotentialTruncation,
};
