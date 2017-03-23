module.exports = robot => {
  robot.respond(/senddm\s+(.+)/, async res => {
    res.send(res.match[1]);
  });
};
