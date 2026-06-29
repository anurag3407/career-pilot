/**
 * Computes line-by-line differences between two strings using the LCS algorithm.
 * Returns an array of objects: { value: string, type: 'unchanged' | 'added' | 'removed' }
 */
export function diffLines(one, two) {
  const lineArray1 = one ? one.split('\n') : [];
  const lineArray2 = two ? two.split('\n') : [];

  const n = lineArray1.length;
  const m = lineArray2.length;

  // Initialize DP table
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (lineArray1[i - 1] === lineArray2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result = [];
  let i = n, j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lineArray1[i - 1] === lineArray2[j - 1]) {
      result.push({ value: lineArray1[i - 1], type: 'unchanged' });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ value: lineArray2[j - 1], type: 'added' });
      j--;
    } else {
      result.push({ value: lineArray1[i - 1], type: 'removed' });
      i--;
    }
  }

  return result.reverse();
}
