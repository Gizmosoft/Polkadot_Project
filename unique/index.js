import { connectSdk } from "./utils/connect-sdk.js";

//connect to sdk
const {account, sdk} = await connectSdk();

//get balance of the account
const balance = await sdk.balance.get(account);
console.log(`${account.address} balance:`, balance.availableBalance.formatted);