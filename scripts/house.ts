import type AppCustomContext from '@slack/bolt/dist/App.d.ts';

/**
 * This function controls the enabled
 * scripts for Albus, regardless of where
 * he is running (locally or in a lambda)
 */
const karma = async (app: AppCustomContext) => {
  // Listens to incoming messages that contain "hello"
  app.message(/\w+\+\+/, async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    if (message.subtype === undefined || message.subtype === 'bot_message') {
      await say({
        blocks: [
          {
            alt_text: `A gif of Dr. Gregory House explaining that Albus doesn't like anybody, it's not personal.`,
            type: 'image',
            image_url: `https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzdtZzU4cnVkNTl5Y3hlbGVwcTR2YWgzcTA1cWQzZnI4cGV5OXJ3eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YCXbgspIg2btu/giphy.webp`,
          },
        ],
      });
    }
  });
};

export default karma;
