import { loadEnvFile } from 'node:process';
import jsonwebtoken from 'jsonwebtoken';
try {
    loadEnvFile();
}
catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
        throw error;
}
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET is missing from .env');
}
const userId = Number(process.argv[2] ?? 1);
if (!Number.isInteger(userId)) {
    throw new Error('Usage: npm run token -- <userId>');
}
console.log(jsonwebtoken.sign({ userId }, secret, { expiresIn: '7d' }));
