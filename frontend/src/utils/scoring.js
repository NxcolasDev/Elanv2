export function toIELTSBand(correct, total) {
  if (!total) return 0;

  const normalized = Math.round((Number(correct) / Number(total)) * 40);

  if (normalized >= 39) return 9;
  if (normalized >= 37) return 8.5;
  if (normalized >= 35) return 8;
  if (normalized >= 33) return 7.5;
  if (normalized >= 30) return 7;
  if (normalized >= 27) return 6.5;
  if (normalized >= 23) return 6;
  if (normalized >= 19) return 5.5;
  if (normalized >= 15) return 5;
  if (normalized >= 13) return 4.5;
  if (normalized >= 10) return 4;
  if (normalized >= 8) return 3.5;
  if (normalized >= 6) return 3;
  if (normalized >= 4) return 2.5;
  return normalized > 0 ? 2 : 0;
}
