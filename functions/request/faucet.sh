
API="http://localhost:5000/nem2-wallet-d3f63/asia-northeast1/v1-router-catapult-api"
ENDPOIT="https://fushicho2-fee.opening-line.jp:3001"

echo "--- Request ---"
curl -w '\n' -X POST $API/faucet \
  -H "Content-Type: application/json" \
  -d '
{
  "address": "SCGNCYA2FSBSYI36KC2ZCE6ILPDFOUU6XCUFJMA4",
  "amount": 20
}
'