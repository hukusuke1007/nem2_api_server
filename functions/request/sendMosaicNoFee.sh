
API="http://localhost:5000/nem2-wallet-d3f63/asia-northeast1/v1-router-catapult-api"
ENDPOIT="https://fushicho2-fee.opening-line.jp:3001"

echo "--- Request ---"
curl -w '\n' -X POST $API/sendMosaicNoFee \
  -H "Content-Type: application/json" \
  -d '
{
  "fromPrivateKey": "C8F8CAF55CA1796AAC31D552BFAF26948B3EE731237695B97DD5D34AC57BCFB3",
  "toAddress": "SADMO4S3Q7MN44YZFVQBU75ILFMRE2PDBE3WUXAE",
  "amount": 10
}
'