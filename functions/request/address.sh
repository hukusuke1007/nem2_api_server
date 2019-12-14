
API="http://localhost:5000/nem2-wallet-d3f63/asia-northeast1/v1-router-catapult-api"
ENDPOINT="https://fushicho2-fee.opening-line.jp:3001"
TO_ADDRESS="SCGNCYA2FSBSYI36KC2ZCE6ILPDFOUU6XCUFJMA4"

echo "-- Address balance ---"
curl -w '\n' -X GET $ENDPOINT/account/$TO_ADDRESS