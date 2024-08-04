import type AppCustomContext from "@slack/bolt/dist/App.d.ts";
import { addBehaveChannel } from "./mutations/add-behave";
import { getBehaveChannels, listBehaveChannels } from "./queries/get-behave";
import { deleteBehaveChannel } from "./mutations/delete-behave";

// In-memory store for channels
const behaveChannels: Set<string> = getBehaveChannels();

const behave = async (app: AppCustomContext) => {
  app.message(/^albus behave$/i, async ({ message, say }) => {
    if (message.channel) {
      if (behaveChannels.has(message.channel)) {
        await say("I'm already on my best behavior!");
      } else {
        try {
          await addBehaveChannel(message.channel);
          behaveChannels.add(message.channel);
          await say("Locked in and ready to focus.");
        } catch (error) {
          console.error("Failed to add channel to behave list:", error);
          await say(
            "Sorry, something went wrong. I had a little trouble with the prime directive."
          );
        }
      }
    }
  });

  app.message(/^albus relax$/i, async ({ message, say }) => {
    if (message.channel) {
      if (!behaveChannels.has(message.channel)) {
        await say("I'm already wide open in this channel!");
      } else {
        try {
          await deleteBehaveChannel(message.channel);
          behaveChannels.delete(message.channel);
          await say("I've opened up my full bag of tricks now!");
        } catch (error) {
          console.error("Failed to remove channel from behave list:", error);
          await say(
            "Sorry, something went wrong. I wasn't able to open up the throttle."
          );
        }
      }
    }
  });

  app.message(/^albus behave list$/i, async ({ say }) => {
    await listBehaveChannels(say);
  });

  app.message(
    /^albus behave\s+<#(C[A-Z0-9]+)\|/i,
    async ({ message, context, say }) => {
      const match = context.matches[0];
      const channelId = context.matches[1];

      if (channelId) {
        if (behaveChannels.has(channelId)) {
          await say(`I'm already on my best behavior in <#${channelId}>!`);
        } else {
          addBehaveChannel(channelId);
          await say(
            `I've added <#${channelId}> to the behave list. I won't say anything embarrassing over there now!`
          );
        }
      } else {
        await say("That channel doesn't exist? Try again.");
      }
    }
  );
};

export default behave;
