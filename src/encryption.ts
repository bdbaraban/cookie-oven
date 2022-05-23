import crypto from 'crypto';
import type { EncryptedCookie } from './types';

/**
 * Encrypts a cookie value (inverse of decrypt 👇).
 *
 * @param secret - Unique secret associated with cookie.
 * @param value - Cookie value to encrypt.
 *
 * @returns - Encrypted cookie object.
 */
export const encrypt = (secret: string, value: string): EncryptedCookie => {
  const key = crypto
    .createHash('sha256')
    .update(secret)
    .digest('base64')
    .slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');

  return {
    ciphertext,
    iv: iv.toString('hex'),
    authTag: cipher.getAuthTag().toString('hex'),
  };
};

/**
 * Decrypts an encrypted cookie (inverse of encrypt 👆).
 *
 * @param secret - Unique secret associated with cookie.
 * @param encryptedCookie - Encrypted cookie.
 *
 * @returns - Decrypted cookie value.
 */
export const decrypt = (
  secret: string,
  { iv, ciphertext, authTag }: EncryptedCookie
): string => {
  const key = crypto
    .createHash('sha256')
    .update(secret)
    .digest('base64')
    .slice(0, 32);
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  return decipher.update(ciphertext, 'hex', 'utf8') + decipher.final('utf8');
};
