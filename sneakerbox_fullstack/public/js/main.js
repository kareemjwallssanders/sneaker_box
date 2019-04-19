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

document.getElementById('delete').addEventListener('click', ()=>{
  fetch('/api/deletesneaker', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"name": document.getElementById('delete').value + ""})
    }).then(function(res,req){
        window.location.reload()
    })
})

document.getElementById('userInput').addEventListener('click', ()=>{
    
    //value that they put in for the select 

    const brand= document.getElementById('brandselect').value
    console.log(brand);
    window.location = window.location.href.split('?')[0] + "?brand=" + brand
});

document.getElementById('userInput').addEventListener('click', ()=>{
    
    //value that they put in for the select 

    const brand= document.getElementById('*').value
    console.log(brand);
    window.location = window.location.href.split('?')[0] + "?brand=" + brand
});




//functions for sneaker searcher bar or dropdown....
var objSelect = document.getElementById("brandselect");
setSelectedValue(objSelect, "10");
function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].text== valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}

////users profile stage===============================================////

document.getElementById('close-btn').addEventListener('click', function(){
    $( window ).resize(function() {
        $('.item-container.active').click();
      });

    function collapseDropdown() {
        $('.expand-icon').removeClass('expanded');
        $('.item-container').css('margin-bottom', '');
        $('.item-container').removeClass('active');
        $('.dropdown-content').addClass('hideContent');
        $('.arrow-up').hide();
        console.log(collapseDropdown);
    }
    
    $('.close-btn').on('click keypress', function() {
      collapseDropdown();
    });
    
      $('.item-container').on('click keypress', function(e) {
        e.preventDefault();
          
        $('.item-container').attr('data-show', 'false');
        $(this).attr('data-show', 'true');
        
        setTimeout(function() {
          $('.close-btn').focus();
        });
        
        $('.expand-icon').removeClass('expanded');
        $(this).find('.expand-icon').addClass('expanded');
        
        var dropdownHeight = $(this).next().height() + 180;
        $('.item-container').css('margin-bottom', '');
        
        $(this).css('margin-bottom', dropdownHeight);
          
        var x = $(this).position();
        var offsetNumber = x.top + $(this).height() + 25;
        
        $(this).next('.dropdown-content').css('top', offsetNumber + "px");
         
        $('.arrow-up').hide();
        $(this).find('.arrow-up').show();
        
        $('.item-container').removeClass('active');
        $(this).addClass('active');
    
        $('.dropdown-content').addClass('hideContent');
        $(this).next('.dropdown-content').removeClass('hideContent');
     
    });
    
    
    
    // tabbed js
    
    
    $('.tab').each(function() {
      var clickedTab = this;
      $(clickedTab).on('click', function(e) {
        e.preventDefault();
        collapseDropdown(); 
        $('.no-results-header').hide();
        var clickedTabAttr = $(this).attr('data-category');
        $('.item-container').each(function() {
          var targetPanel = this;
          var targetPanelAttr = $(this).attr('data-category');
          if(clickedTabAttr == 'all') {
            $(targetPanel).removeClass('hide');
          } else if(clickedTabAttr == targetPanelAttr) {
              $(targetPanel).removeClass('hide');
          } else {
              $(targetPanel).addClass('hide');
          }
        });
      });
    });
});

////users profile stage===============================================////
