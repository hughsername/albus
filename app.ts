import { App } from "@slack/bolt";
import hello from "./scripts/hello";
import house from "./scripts/house";
import karma from "./scripts/karma";
import contrition from "./scripts/contrition";
import migrations from "./migrations";

migrations();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

hello(app);
karma(app);
//house(app);
contrition(app);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
