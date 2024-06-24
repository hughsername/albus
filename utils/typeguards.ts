// Function to determine if an error is a DynamoDB specific error
function isDynamoDBError(
  error: unknown
): error is { name: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "message" in error
  );
}

export { isDynamoDBError };
