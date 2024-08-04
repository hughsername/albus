import { App } from "@slack/bolt";
import hello from "./scripts/hello";
import house from "./scripts/house";
import karma from "./scripts/karma";
import yourface from "./scripts/yourface";
import contrition from "./scripts/contrition";
import migrations from "./migrations";
import ooc from "./scripts/ooc";
import behave from "./scripts/behave";
import { loadBehaveChannels } from "./scripts/behave/queries/get-behave";

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
ooc(app);
behave(app);
//house(app);
contrition(app);
yourface(app);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  loadBehaveChannels();

  console.log("⚡️ Bolt app is running!");
})();
