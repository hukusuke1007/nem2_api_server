
API="http://localhost:5000/nem2-wallet-d3f63/asia-northeast1/v1-router-catapult-api"

echo "--- Request ---"
curl -w '\n' -X POST $API/sendMosaic \
  -H "Content-Type: application/json" \
  -d '
{
  "fromPrivateKey": "C8F8CAF55CA1796AAC31D552BFAF26948B3EE731237695B97DD5D34AC57BCFB3",
  "toAddress": "SADMO4S3Q7MN44YZFVQBU75ILFMRE2PDBE3WUXAE",
  "amount": 10
}
'