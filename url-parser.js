
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
  const params = [];

  const results = model.map((x, index) => {
    if (x.includes(':')) { 
      const newX = x.replace(':','');
      const realEl = real[index];
      if (realEl.includes('?')) {
        return getQueryParams(realEl);
        //params.push(realEl.slice(realEl.indexOf('?') + 1).split('&'));
      }
      return {
        [newX]: real[index]
      }
    }
  }).filter(n=>n);

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