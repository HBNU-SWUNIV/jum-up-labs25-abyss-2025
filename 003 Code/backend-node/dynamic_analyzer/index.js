const express = require('express');
const { VM } = require('vm2');
const { instrumentLoops } = require('./instrumenter');
const fs = require('fs');

const app = express();
app.use(express.json());

const prelude = fs.readFileSync('./loop_check.js', 'utf8');

app.post('/analyze', (req, res) => {
  const rawCode = req.body.code;
  const instrumented = instrumentLoops(rawCode);

  // Renderer 실행 후 loopStats 값을 return 하게끔 수정
  const finalCode = `
${prelude}
${instrumented}
Renderer();
loopStats; // 실행 결과로 반복 통계 리턴
  `;

  try {
    const vm = new VM({ timeout: 3000, sandbox: {} });
    const result = vm.run(finalCode);
    res.json({ success: true, message: "실행 성공", stats: result }); // stats에 loop 정보 담기
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(3000, () => console.log("Docker Analyzer Running on port 3000"));
