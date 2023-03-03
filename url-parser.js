
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

const rawModel = '/:version/api/:collection/:id';
const rawReal = '/6/api/listings/3?sort=desc&limit=10';

app.get('/parse', async (req, res) => {
  const model = rawModel.split('/');
  const real = rawReal.split('/');
  const results = {};

  model.forEach((x, index) => {
    if (x.includes(':')) {
      const key = x.replace(':','');
      const realEl = real[index];
      if (realEl.includes('?')) {
        Object.assign(results, getQueryParams(realEl));
        results[key] = realEl.split('?')[0];
      } else {
        results[key] = realEl;
      }
    }
  });

  return res.send(results);
})

function getQueryParams(url) {
  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  const params = {};
  paramArr.map(param => {
      const [key, val] = param.split('=');
      params[key] = val;
  })
  return params;
}