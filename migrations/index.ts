import karmaV1 from "./karma/20240623_v1";

async function runAllUpdates() {
  try {
    karmaV1();
  } catch (error) {
    console.error(
      `migrations: error creating or updating DynamoDB tables: ${error}`
    );
  }
}

export default runAllUpdates;
