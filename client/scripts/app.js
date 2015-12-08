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
  fetch: function(url) {
    $.ajax({
      url: (url),
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
          app.filterRooms(data.results);

          data.results.forEach(function(message) {
            if( message.text === undefined) return;
            if (!message.roomname) {
              message.roomname = 'Main Room';
            }
          });
          app.filterMessages(data.results, $('#roomSelect option:selected').text());
      },
      error: function (data) {
        console.error('chatterbox: Failed to get message. Error: ', data);
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
  filterRooms : function(arrayOfObjects){

    var singles = [];

    for (var i = 0; i < arrayOfObjects.length; i++) {
        var roomname = arrayOfObjects[i].roomname
        if(singles.indexOf(roomname) === -1 && roomname){
            singles.push(roomname)
        }
    }
    singles.forEach(function(roomName) {
      $('#roomSelect').append('<option>' + roomName+ '</option>');
    });
  },
  filterMessages: function(arrayOfObjects, roomName) {
    app.clearMessages();
    arrayOfObjects.forEach(function(message) {
      if (!message.roomname) {

      }
    });
  },

  addMessage: function(message) {
    $('#chats').append('<div>').append( message.username + " says :  " +   (message.text).replace(/<[^>]*>/ , "") + " in the room " + message.roomname);
  }
};

$(document).ready(function () {

  $('#message button').on('click', function(event){
      event.preventDefault();
      var message = {
          username: window.location.search.match(/=(.*)/)[1],
          text: $('#message-input').val(),
          roomname:$('#roomSelect option:selected').text()
      }
      app.send(message);
  });
  //$('option').on('click', app.filterMessages.bind(null, ));
  $('#addRoom').on('click', app.addRoom);

  $('#clear').on('click', function() {
    app.clearMessages();
  });
    app.fetch('https://api.parse.com/1/classes/chatterbox?&limit=25&order=-createdAt');

})
