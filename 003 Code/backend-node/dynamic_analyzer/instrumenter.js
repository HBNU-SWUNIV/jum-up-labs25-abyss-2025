const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

let loopCounter = 0;

function instrumentLoops(code) {
  const ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });

  traverse(ast, {
    enter(path) {
      if (path.isWhileStatement() || path.isForStatement() || path.isDoWhileStatement()) {
        loopCounter++;
        const loopId = "loop" + loopCounter;

        const loopCheckCall = t.expressionStatement(
          t.callExpression(t.identifier("__loopCheck"), [t.stringLiteral(loopId)])
        );

        const originalBody = path.node.body;
        if (t.isBlockStatement(originalBody)) {
          originalBody.body.unshift(loopCheckCall);
        } else {
          path.node.body = t.blockStatement([loopCheckCall, originalBody]);
        }
      }
    }
  });

  const output = generate(ast, {}, code);
  return output.code;
}

module.exports = { instrumentLoops };
