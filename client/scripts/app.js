// YOUR CODE HERE:
var app = {
  init: function() {
  },
  send: function(message) {
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    })
  },
  data : "",

  fetch: function(url) {
    $.ajax({
      url: (url),
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.data = data.results
          app.filterRooms(data.results);
          app.renderMessages()
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message. Error: ', data);
      }
    });
  },
   renderMessages : function(){
       app.forEach(function(message) {
           if(!message.text) return;
           //app.escapeHTML(message.text)
           if (!message.roomname) {
               message.roomname = 'Main Room';
           }
           //app.escapeHTML(message.roomname);

           if($('#roomSelect').find('option:selected').val()){
               app.filterMessages($('#roomSelect').find('option:selected').val())
           }
       });
   },
  addRoom : function(){
    var room = $('#room').val();
    $('#roomSelect').append('<option>' + room + '</option>');
    $('#room').val("");
  },
  clearMessages: function() {
    $('#chats').empty();
  },
  count : 0,
  singles : [],
  filterRooms : function(arrayOfObjects){
  var tempArr = []
    for (var i = 0; i < arrayOfObjects.length; i++) {
        if(arrayOfObjects[i].roomname) {
          var roomname = app.escapeHTML(arrayOfObjects[i].roomname)
        }
        if(app.singles.indexOf(roomname) === -1 && roomname){
            app.singles.push(roomname)
            tempArr.push(roomname)
        }
    }
    console.log(app.count++,tempArr)
    tempArr.forEach(function(roomName) {
      $('#roomSelect').append('<option>' + roomName+ '</option>');
    });
  },

  filterMessages: function( roomName) {
    app.clearMessages();
    //console.log("array of object ", app.data);
    _.each((app.data),function(message) {
      if(message.roomname === roomName && message.roomname && message.username) {
        app.addMessage(message)
      }
    });
  },

  addMessage: function(message) {
    if (app.friends.indexOf(app.escapeHTML(message.username)) !== -1) {
      $('#chats').append( "<p class='username bold'>"  + app.escapeHTML(message.username)  + " says :  " +  app.escapeHTML(message.text) + "</p>");
    }else{
      $('#chats').append( "<p class='username'>"  + app.escapeHTML(message.username)  + " says :  " +  app.escapeHTML(message.text) + "</p>");
    }
  },
  handleSubmit : function(){

    var message = {
      username: window.location.search.match(/=(.*)/)[1],
      text: $('#message').val(),
      roomname:$('#roomSelect option:selected').text()
    }
    $('#message').val("")
    app.send(message);
  },
  escapeHTML : function(unsafe_str) {
    return unsafe_str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#39;');
  },
  friends: [],
  addFriend : function(friend) {
    app.friends.push(friend);
  }
};

$(document).ready(function () {
  //app.fetch('https://api.parse.com/1/classes/chatterbox?&limit=50&order=-createdAt');
  setInterval(function(){
    app.fetch('https://api.parse.com/1/classes/chatterbox?&limit=50&order=-createdAt');
    //app.filterMessages();
  },1000)
  $('#send').submit(function(event){
      event.preventDefault()
      app.handleSubmit()
      return false
  });

  $('#addRoom').on('click', app.addRoom);


  $('#clear').on('click', function() {
    app.clearMessages();
  });

  $('#roomSelect').change(function(){

    app.filterMessages($(this).find('option:selected').val());
    console.log($('.username'))
  });

  $('#chats').on('click','p', function() {

    var $username = $(this).text().split(" ")[0];
    $(this).css({'font-weight':'bold'})
    app.addFriend($username);

  })

})


