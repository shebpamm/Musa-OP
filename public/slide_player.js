samples = [
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']}),
  new Howl({src: ['samples/1.mp3']})
]

function killAll() {
for (var x in samples) {
  console.log(samples[x])
  samples[x].stop();
}
}

Reveal.addEventListener( 'fragmentshown', function( event ) {
  if(event.fragment.dataset.sampleId != -1) {
    var id = event.fragment.dataset.sampleId - 1;
    try {
      killAll();
      samples[id].play();
    }catch(err) {console.log(err)}
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
  killAll();
} );
