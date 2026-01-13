export const formatMs = (ms) => {
  // 1. Convert to total seconds
  const totalSeconds = Math.floor(ms / 1000);

  // 2. Calculate minutes and remaining seconds
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  // 3. Format with leading zeros
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  return `${mm}:${ss}`;
};