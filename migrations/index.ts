import karmaV1 from "./karma/20240623_v1";
import oocV1 from "./ooc/20240723_v1";

async function runAllUpdates() {
  try {
    karmaV1();
    oocV1();
  } catch (error) {
    console.error(
      `migrations: error creating or updating DynamoDB tables: ${error}`
    );
  }
}

export default runAllUpdates;
