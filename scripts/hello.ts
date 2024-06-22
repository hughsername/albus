import type AppCustomContext from '@slack/bolt/dist/App.d.ts';

/**
 * This function controls the enabled
 * scripts for Albus, regardless of where
 * he is running (locally or in a lambda)
 */
const hello = async (app: AppCustomContext) => {
  // Listens to incoming messages that contain "hello"
  app.message('hello', async ({ message, say }) => {
    console.log(message);
    // say() sends a message to the channel where the event was triggered
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say(`Hey there <@${message.user}>!`);
    }
  });
};

export default hello;
