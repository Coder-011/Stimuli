const https = require('https');
const crypto = require('crypto');

function fetchAndHash(url, name) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hash = crypto.createHash('sha384').update(data).digest('base64');
        console.log(name + ': sha384-' + hash);
        resolve();
      });
    }).on('error', (err) => {
      console.log('Error fetching ' + name + ':', err.message);
      resolve();
    });
  });
}

(async () => {
  await fetchAndHash('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', 'hands');
  await fetchAndHash('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js', 'camera_utils');
})();