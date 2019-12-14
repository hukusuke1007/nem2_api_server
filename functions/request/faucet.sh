API="http://localhost:5000/nem2-wallet-d3f63/asia-northeast1/v1-router-catapult-api"

echo "--- Request ---"
curl -w '\n' -X POST $API/faucet \
  -H "Content-Type: application/json" \
  -d '
{
  "address": "SCGNCYA2FSBSYI36KC2ZCE6ILPDFOUU6XCUFJMA4",
  "amount": 20
}
'