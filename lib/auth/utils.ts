import type { RandomReader } from "@oslojs/crypto/random";
import { generateRandomIntegerNumber } from "@oslojs/crypto/random";
import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";

export function generateRandomOTP(): string {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes);
    },
  };

  return generateRandomIntegerNumber(random, 1_0000_0000)
    .toString()
    .padStart(8, "0");
}

export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
}
