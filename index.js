const express = require('express');
const axios = require('axios');
const app = express();

app.get('/numbers', async (req, res) => {
  try {
    const urls = req.query.url;
    if (!urls) {
      return res.status(400).json({ error: 'No URLs provided' });
    }

    const responsePromises = urls.map(url => axios.get(url, { timeout: 5000 }));

    const responses = await Promise.allSettled(responsePromises);

    const numbers = responses
      .filter(response => response.status === 'fulfilled' && response.value.data && Array.isArray(response.value.data))
      .flatMap(response => response.value.data)
      .filter((number, index, self) => typeof number === 'number' && Number.isInteger(number) && self.indexOf(number) === index)
      .sort((a, b) => a - b);

    res.json({ numbers });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('number-management-service is listening on port 3000');
});
