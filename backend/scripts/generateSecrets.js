const crypto = require('crypto');

// Generate 64 random bytes → 128-character hex string
function generateSecret() {
  return crypto.randomBytes(64).toString('hex');
}

// Generate secrets
const JWT_ACCESS_SECRET = generateSecret();
const JWT_REFRESH_SECRET = generateSecret();

// Print them out
console.log('JWT_ACCESS_SECRET=' + JWT_ACCESS_SECRET);
console.log('JWT_REFRESH_SECRET=' + JWT_REFRESH_SECRET);
