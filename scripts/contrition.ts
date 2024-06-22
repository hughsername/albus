import type AppCustomContext from '@slack/bolt/dist/App.d.ts';

/**
 * This function controls the enabled
 * scripts for Albus, regardless of where
 * he is running (locally or in a lambda)
 */
const karma = async (app: AppCustomContext) => {
  // Listens to incoming messages that contain "hello"
  app.message('ALBUS', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`Yeesh, my bad. Sorry, boss.`);
    }
  });
};

export default karma;
