ENDPOINT="https://fushicho2-fee.opening-line.jp:3001"
TO_ADDRESS="SCGNCYA2FSBSYI36KC2ZCE6ILPDFOUU6XCUFJMA4"

echo "-- Address balance ---"
curl -w '\n' -X GET $ENDPOINT/account/$TO_ADDRESS