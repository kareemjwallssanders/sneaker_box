var updateAvatar = document.querySelector('#avatarSubmit')
var trash = document.querySelectorAll('.fa-trash')

updateAvatar.addEventListener('click', () => {
    var avatar = document.querySelector('#avatar')
    var id = document.querySelector('#userId')

    var data = new FormData()
    data.append('avatar', avatar.files[0])
    data.append('_id', id.value )

    fetch('/api/profile_pic', {
    method: 'PUT',
    body: data
    }).then(function(res,req){
        window.location.reload()
    })
})

Array.from(trash).forEach((el) => {
    el.addEventListener('click', () => {
        var _id = el.parentNode.parentNode.getAttribute("id")
        console.log(_id)
        fetch('/api/reviews', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            '_id': _id
            })
        }).then(response => {
            window.location.reload()
        })
    })
})


const fetch = require('node-fetch');

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
  //air-jordan-1-low-black-toe?includes=market
})
.then(response => response.json())
.then(json => {
  for (let i = 0; i < json.hits.length; i++) {
    console.log("HIT #", i);
    console.log(json.hits[i]);
  }
});