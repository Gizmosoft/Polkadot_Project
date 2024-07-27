import * as dotenv from 'dotenv';
dotenv.config();

const getConfig = () => {
  const {MNEMONIC} = process.env;
  if (!MNEMONIC)
    throw Error("Create .env from .env-example and set MNEMONIC env");

  return {
    mnemonic: MNEMONIC,
  }
}

export const config = getConfig();