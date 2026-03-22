const { kmeans } = require('ml-kmeans');

const vectors = [
  [1, 1], [1.5, 1.8], [5, 5], [8, 8], [1, 0.6], [9, 11]
];

try {
  const result = kmeans(vectors, 2, { initialization: 'kmeans++' });
  console.log("Vector length:", vectors.length);
  console.log("distance field value:", result.distance);
  console.log("type of distance:", typeof result.distance);
} catch (e) {
  console.error("Error:", e);
}
