
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

const rawModel = '/:version/api/:collection/:id';
const rawInstance = '/6/api/listings/3?sort=desc&limit=10';

app.get('/parse', async (req, res) => {
  const model = rawModel.split('/');
  const instance = rawInstance.split('/');
  let results = {};

  model.forEach((x, index) => {
    if (x.includes(':')) {
      const key = x.replace(':','');
      const instanceElement = instance[index];
      if (instanceElement.includes('?')) {
        Object.assign(results, getQueryParams(instanceElement));
        results[key] = castToNumber(instanceElement.split('?')[0]);
      } else {
        results[key] = castToNumber(instanceElement);
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
      params[key] = castToNumber(val);
  })
  return params;
}

castToNumber = (val) => isNaN(Number(val)) ? val : Number(val);