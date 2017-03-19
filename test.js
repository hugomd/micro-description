const test = require('ava');
const micro = require('micro');
const nock = require('nock');
const fetch = require('node-fetch');
const listen = require('test-listen');

const api = require('./index');

const service = micro(api);

test('should fail if repository not found', async t => {
  nock('https://api.github.com/repos')
    .get('/hugomd/not-a-repo')
    .reply(404);

  const url = await listen(service);
  const response = await fetch(`${url}/hugomd/not-a-repo`);
  const body = await response.text();
  t.is(response.status, 404);
  t.is(body, 'Repository not found.');
});

test('should succeed', async t => {
  nock('https://api.github.com/repos')
    .get('/hugomd/a-repo')
    .reply(200, {
      description: 'A description'
    });

  const url = await listen(service);
  const response = await fetch(`${url}/hugomd/a-repo`);
  const body = await response.text();
  t.is(response.status, 200);
  t.is(body, 'A description');
});
