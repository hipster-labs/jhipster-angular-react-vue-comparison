apps=("localhost:8080" "localhost:8081" "localhost:8082")

# Build docker images
for app in "${apps[@]}";
do
  for run in {1..100};
  do
    curl -X POST \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    -d '{"addressLine1": "string", "addressLine2": "string", "city": "string","country": "string","email": "string@string.fr", "firstName": "string","gender": "MALE","lastName": "string","phone": "string"}' \
    "http://${app}/api/customers" > /dev/null
  done
done

