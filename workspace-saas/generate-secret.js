const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('base64');
console.log('\n=================================');
console.log('Your NEXTAUTH_SECRET:');
console.log('=================================');
console.log(secret);
console.log('=================================\n');
console.log('Copy the value above and add it to your .env.local file');
console.log('');
