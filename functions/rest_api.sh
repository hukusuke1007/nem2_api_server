# Documents
# https://nemtech.github.io/ja/guides/
# https://nemtech.github.io/nem2-openapi/#tag/Account-routes

# Get transactions
ENDPOIT="https://fushicho2-fee.opening-line.jp:3001"
USER_A_ADDRESS="SBCBN652VF34XOVQR2OSDFB7BLTHS33HFHH6ZQPC"
USER_B_ADDRESS="SCGNCYA2FSBSYI36KC2ZCE6ILPDFOUU6XCUFJMA4"

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

TARGET_TRANSACTION_ID="EB7D99247A732056A5AA8E54E307DA6EEB881EAB12B2B84897AF3BA4BB9D4BBD"
echo "😆  --- Target transaction of id status --- 😆"
curl -X GET $ENDPOIT/transaction/$TARGET_TRANSACTION_ID/status
echo -n -e "\n"

# echo "👍  --- All transactions --- 👍"
# curl -X GET $ENDPOIT/account/$ADDRESS/transactions

# echo "😆  --- Target transaction of id --- 😆"
# curl -X GET $ENDPOIT/transaction/$TARGET_TRANSACTION_ID
# echo -n -e "\n"

