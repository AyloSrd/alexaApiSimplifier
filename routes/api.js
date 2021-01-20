const express = require('express');
const router = express.Router();
const axios = require('axios')
const convert = require('xml-js')


const getRank = async (token, site) => {
  try {
   return await axios.get(`https://awis.api.alexa.com/api?Action=UrlInfo&Count=10&ResponseGroup=Rank,LinksInCount&Start=1&Url=${site}`, {
      headers: {
        'x-api-key': token
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/* GET users listing. */
router.get('/:token/:site', async function(req, res, next) {
  const { token, site } = req.params
  const response = await getRank(token, site)
  const response2json = JSON.parse(convert.xml2json(response.data, {compact: true, spaces: 4}))
  const rank = response2json
    ?.Awis
    ?.Results
    ?.Result
    ?.Alexa
    ?.TrafficData
    ?.Rank
    ?._text
  res.json(rank ? rank : 'no ranking available, try with another url');
});

module.exports = router;

// curl -H "x-api-key: jN77pHX9GJ3Jsg03EElFm7Za1J6OBhOa61nqhyYQ" "https://awis.api.alexa.com/api?Action=UrlInfo&Count=10&ResponseGroup=Rank,LinksInCount&Start=1&Url=cnn.com"
// 'cVQDS3eauzCfurmsrvH49DUVOxpQ3rb4VEggZ8Ob'