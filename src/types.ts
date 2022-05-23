export interface OvenSettings {
  name: string;
  secret: string;
  maxAge: number;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax';
  domain?: string;
  secure?: boolean;
  overwrite?: boolean;
  isRolling?: boolean;
}

export interface EncryptedCookie {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export interface DecryptedCookie {
  data: Record<string, unknown>;
  timestamp?: number;
}
