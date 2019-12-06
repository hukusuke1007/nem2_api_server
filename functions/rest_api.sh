# Documents
# https://nemtech.github.io/ja/guides/
# https://nemtech.github.io/nem2-openapi/#tag/Account-routes

# Get transactions
ENDPOIT="https://fushicho2-fee.opening-line.jp:3001"
USER_A_ADDRESS="SCGNCYA2FSBSYI36KC2ZCE6ILPDFOUU6XCUFJMA4"
USER_B_ADDRESS="SADMO4S3Q7MN44YZFVQBU75ILFMRE2PDBE3WUXAE"

echo "💓  --- First block --- 💓"
curl -X GET $ENDPOIT/block/1
echo -n -e "\n\n"

echo "|------------------------ USER_A ------------------------|"
echo "💓  --- Address balance --- 💓"
curl -X GET $ENDPOIT/account/$USER_A_ADDRESS
echo -n -e "\n\n"

echo "😄  --- Incoming transaction --- 😄"
curl -X GET $ENDPOIT/account/$USER_A_ADDRESS/transactions/incoming
echo -n -e "\n\n"

echo "😡  --- Unconfirmed transaction --- 😡"
curl -X GET $ENDPOIT/account/$USER_A_ADDRESS/transactions/unconfirmed
echo -n -e "\n\n"

echo "|------------------------ USER_B ------------------------|"
echo "💓  --- Address balance --- 💓"
curl -X GET $ENDPOIT/account/$USER_B_ADDRESS
echo -n -e "\n\n"

echo "😄  --- Incoming transaction --- 😄"
curl -X GET $ENDPOIT/account/$USER_B_ADDRESS/transactions/incoming
echo -n -e "\n\n"

echo "😡  --- Unconfirmed transaction --- 😡"
curl -X GET $ENDPOIT/account/$USER_B_ADDRESS/transactions/unconfirmed
echo -n -e "\n\n"

echo "|------------------------ TARGET_TRANSACTION_ID ------------------------|"

TARGET_TRANSACTION_ID="D00D81224D7DD0414A6B279D632E523B6E71DBAAA452531A02CB65DF1F93E71F"
echo "😆  --- Target transaction of id status --- 😆"
curl -X GET $ENDPOIT/transaction/$TARGET_TRANSACTION_ID/status
echo -n -e "\n"

# echo "👍  --- All transactions --- 👍"
# curl -X GET $ENDPOIT/account/$ADDRESS/transactions

# echo "😆  --- Target transaction of id --- 😆"
# curl -X GET $ENDPOIT/transaction/$TARGET_TRANSACTION_ID
# echo -n -e "\n"

