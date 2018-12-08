export default async function getABI(address) {
  const req = await fetch(`https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`);
  const json = await req.json();
  const abi = JSON.parse(json.result);
  return abi;
}
