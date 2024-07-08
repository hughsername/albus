// Define the phrases for positive and negative karma
function getRandomPositiveMesssage(
  username: string,
  thing: string,
  total: string,
  count: number
): string {
  const positivePhrases: string[] = [
    `${thing} (+*${count}* | ${total}) is on an unstoppable streak, thanks to <@${username}>! Keep the momentum going!`,
    `${thing} (+*${count}* | ${total}) is crushing it, all thanks to <@${username}>! Keep up the great work!`,
    `Thanks to <@${username}>, ${thing} (+*${count}* | ${total}) is dominating the field! Keep it going strong!`,
    `With <@${username}> at the helm, ${thing} (+*${count}* | ${total}) is on a tech rampage! Looking unstoppable right now.`,
    `${thing} (+*${count}* | ${total}) is powering through like a digital powerhouse, all thanks to <@${username}>!`,
    `${thing} (+*${count}* | ${total}) is riding the high-tech wave to victory with <@${username}>! Keep it up!`,
    `With <@${username}> leading the charge, ${thing} (+*${count}* | ${total}) is rockin' and rollin'!`,
    `Thanks to <@${username}>, ${thing} (+*${count}* | ${total}) has achieved digital supremacy!`,
    `In the tech zone, <@${username}> has propelled ${thing} (+*${count}* | ${total}) forward! Nothing can hold them back!`,
    `With <@${username}> at the helm, ${thing}'s tech game is on fire! (+*${count}* | ${total})`,
  ];

  // Generate a random index to select a phrase
  const randomIndex: number = Math.floor(
    Math.random() * positivePhrases.length
  );

  // Return the randomly selected positive streak phrase with username and thing substituted
  return positivePhrases[randomIndex];
}

// Define the phrases for positive and negative karma
function getRandomNegativeMessage(
  username: string,
  thing: string,
  total: string,
  count: number
): string {
  const negativePhrases: string[] = [
    `${thing} (*${count}* | ${total}) took a nosedive after encountering <@${username}>.`,
    `${thing} (*${count}* | ${total}) - ya burnt. <@${username}> - ya burnter.`,
    `${thing} (*${count}* | ${total}) has hit a snag in the quantum realm, courtesy of <@${username}>`,
    `Time to deploy the cybernetic lifelines - <@${username}> just schooled ${thing} (*${count}* | ${total})`,
    `<@${username}> used Sucker Punch on ${thing}! Critical hit! It's super effective! (*${count}* | ${total})`,
    `${thing} (*${count}* | ${total}) fried some internal circuitry. Somebody check on <@${username}>.`,
    `Seems like ${thing} (*${count}* | ${total}) and <@${username}> are in the midst of a digital showdown. Popcorn, anyone? 🍿`,
    `Oh dear. There goes the rug, right out from under ${thing} (*${count}* | ${total}) - <@${username}> got 'em good.`,
    `It appears ${thing} (*${count}* | ${total}) has hit a turbulence pocket in the digital airspace, courtesy of <@${username}>.`,
    `I won't say things are bad for ${thing} (*${count}* | ${total}), just that somebody needs to check in on <@${username}>`,
  ];

  // Generate a random index to select a phrase
  const randomIndex: number = Math.floor(
    Math.random() * negativePhrases.length
  );

  // Return the randomly selected positive streak phrase with username and thing substituted
  return negativePhrases[randomIndex];
}

export function randomizeKarmaResponse(
  changes: Record<string, number>,
  totals: Record<string, string>,
  username: string
): string {
  const messages: string[] = [];

  for (const thing in changes) {
    const countChange = changes[thing];
    const total = totals[thing];
    const message =
      countChange > 0
        ? getRandomPositiveMesssage(username, thing, total, countChange)
        : getRandomNegativeMessage(username, thing, total, countChange); // Select appropriate phrases based on karma change

    messages.push(message);
  }

  return messages.join("\n");
}
