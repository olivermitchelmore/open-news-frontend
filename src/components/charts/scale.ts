export interface ValueFormat {
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function formatValue(value: number, { prefix = '', suffix = '', decimals = 0 }: ValueFormat = {}) {
  const number = value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${number}${suffix}`;
}

function niceStep(range: number, targetTicks: number) {
  const rough = range / targetTicks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const residual = rough / magnitude;
  const nice = residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1;
  return nice * magnitude;
}

export function niceMax(value: number, targetTicks = 4) {
  if (value <= 0) return 1;
  const step = niceStep(value, targetTicks);
  return Math.ceil(value / step) * step;
}

export function ticks(max: number, targetTicks = 4) {
  const step = niceStep(max, targetTicks);
  const values: number[] = [];
  for (let v = 0; v <= max + step / 1e6; v += step) values.push(Number(v.toFixed(10)));
  return values;
}
