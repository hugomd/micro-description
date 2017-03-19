const {parse} = require('url');
const {send} = require('micro');
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  const url = parse(req.url);
  const repo = url.pathname;

  if (repo === '/') return send(res, 400, 'You must specify a repo: https://d.now.sh/hugomd/micro-description');

  let statusCode;
  let message;
  try {
    const data = await fetch(`https://api.github.com/repos${repo}`);
    if (data.status === 404) return send(res, 404, 'Repository not found.');
    const json = await data.json();
    const description = json.description;
    statusCode = 200;
    message = description;
  } catch (err) {
    statusCode = 500;
    message = 'Something went wrong.';
  }

  send(res, statusCode, message);
};
