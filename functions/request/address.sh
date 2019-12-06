
API="http://localhost:5000/nem2-wallet-d3f63/asia-northeast1/v1-router-catapult-api"
ENDPOIT="https://fushicho2-fee.opening-line.jp:3001"
TO_ADDRESS="SADMO4S3Q7MN44YZFVQBU75ILFMRE2PDBE3WUXAE"

echo "-- Address balance ---"
curl -w '\n' -X GET $ENDPOIT/account/$TO_ADDRESS