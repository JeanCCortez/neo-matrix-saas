export const fidelityResults = {
  "4q": [
    { secret: "0010", ibm_native: 98.47, neo_matrix: 100, improvement: 1.56 },
    { secret: "0000", ibm_native: 97.72, neo_matrix: 99.76, improvement: 2.09 },
    { secret: "1000", ibm_native: 97.14, neo_matrix: 99.78, improvement: 2.72 },
    { secret: "0000", ibm_native: 97.06, neo_matrix: 100, improvement: 3.03 },
    { secret: "1011", ibm_native: 95.03, neo_matrix: 100, improvement: 5.23 },
    { secret: "0011", ibm_native: 100, neo_matrix: 100, improvement: 0 },
    { secret: "1001", ibm_native: 99.90, neo_matrix: 100, improvement: 0.1 },
    { secret: "0010", ibm_native: 98.79, neo_matrix: 100, improvement: 1.22 },
    { secret: "1110", ibm_native: 97.06, neo_matrix: 98.72, improvement: 1.71 },
    { secret: "1010", ibm_native: 100, neo_matrix: 100, improvement: 0 },
  ],
  "8q": [
    { secret: "11000010", ibm_native: 95.17, neo_matrix: 99.76, improvement: 4.83 },
    { secret: "00111101", ibm_native: 89.21, neo_matrix: 100, improvement: 12.10 },
    { secret: "10100001", ibm_native: 93.50, neo_matrix: 100, improvement: 6.95 },
    { secret: "11010001", ibm_native: 87.52, neo_matrix: 100, improvement: 14.26 },
    { secret: "11001011", ibm_native: 89.81, neo_matrix: 100, improvement: 11.34 },
    { secret: "10100111", ibm_native: 85.31, neo_matrix: 94.54, improvement: 10.82 },
    { secret: "10010000", ibm_native: 96.84, neo_matrix: 100, improvement: 3.27 },
    { secret: "01011110", ibm_native: 92.60, neo_matrix: 100, improvement: 7.99 },
    { secret: "01101101", ibm_native: 89.65, neo_matrix: 100, improvement: 11.55 },
    { secret: "01001001", ibm_native: 94.98, neo_matrix: 95.78, improvement: 0.84 },
  ],
  "12q": [
    { secret: "001100110000", ibm_native: 87.03, neo_matrix: 95.73, improvement: 10.00 },
    { secret: "010001011001", ibm_native: 79.76, neo_matrix: 100, improvement: 25.38 },
    { secret: "111100001000", ibm_native: 83.98, neo_matrix: 100, improvement: 19.07 },
    { secret: "000000100110", ibm_native: 90.41, neo_matrix: 95.57, improvement: 5.71 },
    { secret: "010110001111", ibm_native: 74.66, neo_matrix: 99.49, improvement: 33.24 },
    { secret: "100011000010", ibm_native: 83.00, neo_matrix: 99.81, improvement: 20.25 },
    { secret: "101100100000", ibm_native: 82.15, neo_matrix: 100, improvement: 21.73 },
    { secret: "011101001011", ibm_native: 68.26, neo_matrix: 98.91, improvement: 44.91 },
    { secret: "111100100010", ibm_native: 82.25, neo_matrix: 100, improvement: 21.58 },
    { secret: "010000000100", ibm_native: 94.49, neo_matrix: 100, improvement: 5.83 },
  ],
  "16q": [
    { secret: "0011101011011100", ibm_native: 48.53, neo_matrix: 100, improvement: 106.07 },
    { secret: "1000101001101101", ibm_native: 56.90, neo_matrix: 100, improvement: 75.75 },
    { secret: "0010001101011100", ibm_native: 62.34, neo_matrix: 100, improvement: 60.44 },
    { secret: "1100101011000001", ibm_native: 54.29, neo_matrix: 90.73, improvement: 67.11 },
    { secret: "0100110100011000", ibm_native: 68.49, neo_matrix: 100, improvement: 46.00 },
    { secret: "0100110100101001", ibm_native: 60.23, neo_matrix: 100, improvement: 66.03 },
    { secret: "1100001110111100", ibm_native: 37.59, neo_matrix: 97.82, improvement: 160.23 },
    { secret: "1010011110101010", ibm_native: 22.14, neo_matrix: 99.57, improvement: 349.82 },
    { secret: "0110110111111001", ibm_native: 23.78, neo_matrix: 82.72, improvement: 247.77 },
    { secret: "1011011011111010", ibm_native: 54.33, neo_matrix: 94.03, improvement: 73.09 },
  ]
};

export const ablationResults = [
  { secret: "0010000010000000", ibm_full: 100, neo_matrix: 100 },
  { secret: "1011001110010010", ibm_full: 81.45, neo_matrix: 100 },
  { secret: "1110101011000010", ibm_full: 84.90, neo_matrix: 100 },
  { secret: "0011110110100001", ibm_full: 97.46, neo_matrix: 100 },
  { secret: "1101000111001011", ibm_full: 54.52, neo_matrix: 100 },
  { secret: "1010011110010000", ibm_full: 100, neo_matrix: 100 },
  { secret: "0101111001101101", ibm_full: 53.88, neo_matrix: 100 },
  { secret: "0100100100110011", ibm_full: 65.60, neo_matrix: 100 },
  { secret: "0000010001011001", ibm_full: 100, neo_matrix: 100 },
  { secret: "1111000010000000", ibm_full: 100, neo_matrix: 100 },
];

export function calculateStats() {
  const allResults = [
    ...fidelityResults["4q"],
    ...fidelityResults["8q"],
    ...fidelityResults["12q"],
    ...fidelityResults["16q"],
  ];

  const avgImprovement = allResults.reduce((sum, r) => sum + r.improvement, 0) / allResults.length;
  const avgNeoMatrix = allResults.reduce((sum, r) => sum + r.neo_matrix, 0) / allResults.length;
  const avgIbmNative = allResults.reduce((sum, r) => sum + r.ibm_native, 0) / allResults.length;
  const maxImprovement = Math.max(...allResults.map(r => r.improvement));
  const perfectResults = allResults.filter(r => r.neo_matrix >= 99.9).length;

  return {
    avgImprovement: avgImprovement.toFixed(1),
    avgNeoMatrix: avgNeoMatrix.toFixed(1),
    avgIbmNative: avgIbmNative.toFixed(1),
    maxImprovement: maxImprovement.toFixed(0),
    perfectResults,
    totalTests: allResults.length,
    perfectRate: ((perfectResults / allResults.length) * 100).toFixed(0),
  };
}

export function getQubitComparisonData() {
  return Object.entries(fidelityResults).map(([qubits, results]) => {
    const avgIbm = results.reduce((sum, r) => sum + r.ibm_native, 0) / results.length;
    const avgNeo = results.reduce((sum, r) => sum + r.neo_matrix, 0) / results.length;
    return {
      qubits: qubits.replace('q', ' Qubits'),
      ibm_native: parseFloat(avgIbm.toFixed(1)),
      neo_matrix: parseFloat(avgNeo.toFixed(1)),
      improvement: parseFloat((avgNeo - avgIbm).toFixed(1)),
    };
  });
}
