const loopStats = {};
function __loopCheck(id) {
  if (!loopStats[id]) {
    loopStats[id] = {
      count: 0,
      time: 0
    };
  }

  loopStats[id].count++;
  const now = Date.now();
  loopStats[id].time = now - loopStats[id].start;

  if (loopStats[id].count > 1000 || loopStats[id].time > 2000) {
    throw new Error(`무한 루프 감지됨: ${id} - count=${loopStats[id].count}, time=${loopStats[id].time}ms`);
  }
}
