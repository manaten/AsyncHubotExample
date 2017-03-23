const GitHubApi = require('github');

const github = new GitHubApi({
  Promise,
  timeout: 5000
});
github.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_AUTH_TOKEN
});

module.exports = robot => {
  robot.respond(/github:repos\s+(.+)/, async res => {
    try {
      const username = res.match[1];
      const repos = (await github.repos.getForUser({username})).data;

      for (const repo of repos.filter(repo => repo.open_issues_count > 0)) {
        const pulls = (await github.pullRequests.getAll({
          owner: username,
          repo : repo.name,
          state: 'open'
        })).data;
        res.send(pulls.map(pull => `${username}/${repo.name} <${pull.html_url}|${pull.title}>`).join('\n'));
      }
    } catch(e) {
      robot.logger.error(e);
      res.send(`取得に失敗しました: ${e.message}`);
    }
  });
};
