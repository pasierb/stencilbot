const express = require('express');
const anonymous = require('../lib/delivery/anonymous');
const template = require('../lib/delivery/template');

const app = express();

const PORT = 3001;

app.get('/project', async (req, res) => {
  try {
    const result = await anonymous.handler({
      queryStringParameters: req.query
    });
    const img = Buffer.from(result.body, 'base64');

    for (let header of Object.entries(result.headers)) {
      res.setHeader(...header)
    }
    res.statusCode = result.statusCode;
    res.send(img);
  } catch(e) {
    res.statusCode = 500;
    res.send(e);
  }
});

app.get('/project/:templateId', async (req, res) => {
  try {
    const result = await template.handler({
      queryStringParameters: req.query,
      pathParameters: req.params
    });
    const img = Buffer.from(result.body, 'base64');

    for (let header of Object.entries(result.headers)) {
      res.setHeader(...header)
    }
    res.statusCode = result.statusCode;
    res.send(img);
  } catch(e) {
    res.statusCode = 500;
    res.send(e);
  }
});

app.listen(PORT, () => {
  console.log(`dev server listening on ${PORT}`);
});
