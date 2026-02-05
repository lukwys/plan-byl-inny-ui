import crypto from "crypto";

export const createToken = (bytes = 32): string =>
  crypto.randomBytes(bytes).toString("hex");

export const sha256 = (input: string): string =>
  crypto.createHash("sha256").update(input).digest("hex");
