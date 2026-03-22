const kmeans = require('ml-kmeans');
console.log('Keys of require("ml-kmeans"):', Object.keys(kmeans));
console.log('Type of require("ml-kmeans"):', typeof kmeans);

if (typeof kmeans === 'function') {
  console.log('It is a function directly!');
} else if (kmeans.kmeans && typeof kmeans.kmeans === 'function') {
  console.log('It is a named export: kmeans.kmeans');
} else if (kmeans.default && typeof kmeans.default === 'function') {
  console.log('It is a default export: kmeans.default');
} else {
  console.log('Cannot find function anywhere');
}
