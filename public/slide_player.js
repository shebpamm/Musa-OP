function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

uuid = guid();

samples = [
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/2.mp3']}),
  new Howl({src: ['samples/3.mp3']}),
  new Howl({src: ['samples/4.mp3']}),
  new Howl({src: ['samples/5.mp3']}),
  new Howl({src: ['samples/6.mp3']}),
  new Howl({src: ['samples/7.mp3']}),
  new Howl({src: ['samples/8.mp3']}),
  new Howl({src: ['samples/9.mp3']}),
  new Howl({src: ['samples/10.mp3']}),
  new Howl({src: ['samples/11.mp3']}),
  new Howl({src: ['samples/12.mp3']})
]

function killAll() {
for (var x in samples) {
  samples[x].stop();
}
}

$(function() {

// Connect to the socket

var socket = io();

var ignore = false;

// Variable initialization

var form = $('form.login');
var secretTextBox = form.find('input[type=text]');
var presentation = $('.reveal');

var key = "", animationTimeout;

// When the page is loaded it asks you for a key and sends it to the server

form.submit(function(e){

  e.preventDefault();

  key = secretTextBox.val().trim();

  // If there is a key, send it to the server-side
  // through the socket.io channel with a 'load' event.

  if(key.length) {
    socket.emit('load', {
      key: key
    });
  }

});

// The server will either grant or deny access, depending on the secret key

socket.on('access', function(data){

  // Check if we have "granted" access.
  // If we do, we can continue with the presentation.

  if(data.access === "granted") {

    // Unblur everything
    presentation.removeClass('blurred');

    form.hide();

    var ignore = false;

    $(window).on('hashchange', function(){

      // Notify other clients that we have navigated to a new slide
      // by sending the "slide-changed" message to socket.io

      if(ignore){
        // You will learn more about "ignore" in a bit
        return;
      }

      var hash = window.location.hash;

      socket.emit('slide-changed', {
        hash: hash,
        key: key
      });
    });

    socket.on('navigate', function(data){

      // Another device has changed its slide. Change it in this browser, too:

      window.location.hash = data.hash;

      // The "ignore" variable stops the hash change from
      // triggering our hashchange handler above and sending
      // us into a never-ending cycle.

      ignore = true;

      setInterval(function () {
        ignore = false;
      },100);

    });

    socket.on('frag-move', function(data){

      // Another device has changed its slide. Change it in this browser, too:

      if(data.sender == uuid) {
        return;
      }

      Reveal.nextFragment();

      console.log("asd")

      // The "ignore" variable stops the hash change from
      // triggering our hashchange handler above and sending
      // us into a never-ending cycle.

    });

  }
  else {

    // Wrong secret key

    clearTimeout(animationTimeout);

    // Addding the "animation" class triggers the CSS keyframe
    // animation that shakes the text input.

    secretTextBox.addClass('denied animation');

    animationTimeout = setTimeout(function(){
      secretTextBox.removeClass('animation');
    }, 1000);

    form.show();
  }

});


Reveal.addEventListener( 'fragmentshown', function( event ) {

  socket.emit('frag-changed', {
      key: key,
      sender: uuid
    });
  if(event.fragment.dataset.sampleId != -1) {
    var id = event.fragment.dataset.sampleId - 1;
    try {
      killAll();
      samples[id].play();
    }catch(err) {console.log(err)}
}
});
Reveal.addEventListener( 'fragmenthidden', function( event ) {
  if(event.fragment.dataset.sampleId != -1) {
    var id = event.fragment.dataset.sampleId - 1;
    samples[id].stop();
  }
} );

Reveal.addEventListener( 'slidechanged', function( event ) {
  var id = event.indexh - 4;
  killAll();
} );
});
