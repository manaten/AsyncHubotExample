module.exports = robot => {
  robot.respond(/dm:send\s+([^\s]+)\s+(.+)/, async res => {
    robot.logger.info(`Start \`${res.match[0]}\``);
    try {
      const username = res.match[1];
      const text = res.match[2];

      const user = robot.adapter.client.rtm.dataStore.getUserByName(username);
      if (!user) {
        return;
      }

      const im = await robot.adapter.client.web.im.open(user.id);
      await robot.adapter.client.web.chat.postMessage(im.channel.id, text, {
        as_user: true
      });
      res.send('ok!');
    } catch(e) {
      robot.logger.error(e);
      res.send(`DM送信に失敗しました: ${e.message}`);
    }
    robot.logger.info(`Finish \`${res.match[0]}\``);
  });
};
