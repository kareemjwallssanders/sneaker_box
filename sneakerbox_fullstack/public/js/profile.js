const fetch = require('node-fetch');


//https://stockx.com/api/products/air-jordan-1-low-black-toe?includes=market
//method //header //body

const query = "jordan"
fetch('https://stockx.com/api/products',
{
  method: "POST", 
  headers: {
    'x-algolia-agent': 'Algolia for vanilla JavaScript 3.22.1',
    'x-algolia-application-id': 'XW7SBCT9V6',
    'x-algolia-api-key': '6bfb5abee4dcd8cea8f0ca1ca085c2b3', 
      // "Content-Type": "application/json",
  },
  body: JSON.stringify({"params":"query=" + query + "&hitsPerPage=20&facets=*"})
  //air-jordan-1-low-black-toe?
})
.then(response => response.json())
.then(json => {
  for (let i = 0; i < json.hits.length; i++) {
    console.log("HIT #", i);
    console.log(json.hits[i]);
  }
});

$( window ).resize(function() {
  $('.item-container.active').click();
});

