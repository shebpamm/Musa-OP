samples = [
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
]


Reveal.addEventListener( 'fragmentshown', function( event ) {
  if(event.fragment.dataset.sampleId != -1) {
  	var id = event.fragment.dataset.sampleId - 1;
    samples[id].play();
  }
} );
Reveal.addEventListener( 'fragmenthidden', function( event ) {
  if(event.fragment.dataset.sampleId != -1) {
    var id = event.fragment.dataset.sampleId - 1;
    samples[id].stop();
  }
} );

Reveal.addEventListener( 'slidechanged', function( event ) {
	var id = event.indexh - 4;
  if (0 <= id <= 6){ samples[id].stop(); }
} );
