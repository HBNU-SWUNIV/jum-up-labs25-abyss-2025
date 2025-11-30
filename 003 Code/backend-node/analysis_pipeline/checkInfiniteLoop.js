
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function checkLoopsAndExtractConditions(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  let extractedConditions = [];

  traverse(ast, {
    WhileStatement(path) {
      const test = path.node.test;
      if (test.type === 'BooleanLiteral' && test.value === true) {
        extractedConditions.push({
          type: 'WhileStatement',
          condition: 'true',
          isDefinitelyInfinite: true
        });
      } else {
        const { code: conditionStr } = generate(test);
        extractedConditions.push({
          type: 'WhileStatement',
          condition: conditionStr,
          isDefinitelyInfinite: false
        });
      }
    },
    ForStatement(path) {
      if (path.node.test === null) {
        extractedConditions.push({
          type: 'ForStatement',
          condition: 'null',
          isDefinitelyInfinite: true
        });
      } else {
        const { code: conditionStr } = generate(path.node.test);
        extractedConditions.push({
          type: 'ForStatement',
          condition: conditionStr,
          isDefinitelyInfinite: false
        });
      }
    }
  });

  return extractedConditions;
}

module.exports = { checkLoopsAndExtractConditions };
