  
  import { connectSdk } from "./utils/connect-sdk.js";

  // 2. Mint collection
  const createCollection = async () => {
  const {account, sdk} = await connectSdk();

  const balance = await sdk.balance.get(account);
  console.log(`${account.address} balance:`, balance.availableBalance.formatted);

  const {parsed} = await sdk.collection.create.submitWaitResult({
    name: "TEST Racing",
    description: "Racing Test",
    symbol: "CAR",
    cover_image: {url: "https://gateway.pinata.cloud/ipfs/QmeNzaLfsUUi5pGmhrASEpXF52deCDuByeKbU7SuZ9toEi"},
    // NOTICE: activate nesting for collection admin in order to assign achievements
    permissions: {nesting: {collectionAdmin: true}},
    encodeOptions: {
      overwriteTPPs: [
        {
          // tokenData is a container for attributes
          key: 'tokenData',
          permission: {
            // NOTICE: limit mutability for admins only 
            collectionAdmin: true, tokenOwner: false, mutable: true
          }
        }
      ],
    },
  });
  if(!parsed) throw Error('Cannot parse minted collection');
  
  const collectionId = parsed.collectionId;
  console.log('Collection ID:', collectionId);
  console.log(`Explore your collection: https://uniquescan.io/opal/collections/${collectionId}`);

  process.exit(0);
}
createCollection().catch(e => {
  console.log('Something wrong during collection creation');
  throw e;
});