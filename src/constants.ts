import type { OvenSettings } from './types';

export const MAX_LENGTH = 4096;

export const DEFAULT_SETTINGS: Pick<
  OvenSettings,
  'httpOnly' | 'sameSite' | 'overwrite' | 'isRolling'
> = {
  httpOnly: true,
  sameSite: 'lax',
  overwrite: true,
  isRolling: false,
};
