(function() {
  var train = document.getElementById('train');
  var trainWidth = 3123;
  var ratio = 1;
  var soundBuffers;
  var isPlaying = false;

  function resizeTrain() {
    ratio = window.innerWidth / trainWidth;
    train.style.zoom = ratio;
  }

  resizeTrain();

  window.addEventListener('resize', function(event){
    resizeTrain();
  });

  var audioCtx = new AudioContext();
  var gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;
  gainNode.connect(audioCtx.destination);

  // playback object, will contain all sequenced sounds
  var playback = [];

  var voiceSet = {
    'drum01'   : '../sounds/drum03.mp3',
    'drum02'  : '../sounds/drum01.mp3',
    'g'       : '../sounds/Gstrum.mp3',
    'a'       : '../sounds/Astrum.mp3',
    'd'       : '../sounds/Dstrum.mp3',
    'm'      : '../sounds/click.mp3'
  };

  var notes = {
    'C0': 16.35,
    'C#0': 17.32,
    'Db0': 17.32,
    'D0': 18.35,
    'D#0': 19.45,
    'Eb0': 19.45,
    'E0': 20.60,
    'F0': 21.83,
    'F#0': 23.12,
    'Gb0': 23.12,
    'G0': 24.50,
    'G#0': 25.96,
    'Ab0': 25.96,
    'A0': 27.50,
    'A#0': 29.14,
    'Bb0': 29.14,
    'B0': 30.87,
    'C1': 32.70,
    'C#1': 34.65,
    'Db1': 34.65,
    'D1': 36.71,
    'D#1': 38.89,
    'Eb1': 38.89,
    'E1': 41.20,
    'F1': 43.65,
    'F#1': 46.25,
    'Gb1': 46.25,
    'G1': 49.00,
    'G#1': 51.91,
    'Ab1': 51.91,
    'A1': 55.00,
    'A#1': 58.27,
    'Bb1': 58.27,
    'B1': 61.74,
    'C2': 65.41,
    'C#2': 69.30,
    'Db2': 69.30,
    'D2': 73.42,
    'D#2': 77.78,
    'Eb2': 77.78,
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'Gb2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'Ab2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'Bb2': 116.54,
    'B2': 123.47,
    'C3': 130.81,
    'C#3': 138.59,
    'Db3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'Eb3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'Gb3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'Ab3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'Bb3': 233.08,
    'B3': 246.94,
    'C4': 261.63,
    'C#4': 277.18,
    'Db4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'Eb4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'Gb4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'Ab4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'Bb4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C#5': 554.37,
    'Db5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'Eb5': 622.25,
    'E5': 659.26,
    'F5': 698.46,
    'F#5': 739.99,
    'Gb5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'Ab5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'Bb5': 932.33,
    'B5': 987.77,
    'C6': 1046.50,
    'C#6': 1108.73,
    'Db6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'Eb6': 1244.51,
    'E6': 1318.51,
    'F6': 1396.91,
    'F#6': 1479.98,
    'Gb6': 1479.98,
    'G6': 1567.98,
    'G#6': 1661.22,
    'Ab6': 1661.22,
    'A6': 1760.00,
    'A#6': 1864.66,
    'Bb6': 1864.66,
    'B6': 1975.53,
    'C7': 2093.00,
    'C#7': 2217.46,
    'Db7': 2217.46,
    'D7': 2349.32,
    'D#7': 2489.02,
    'Eb7': 2489.02,
    'E7': 2637.02,
    'F7': 2793.83,
    'F#7': 2959.96,
    'Gb7': 2959.96,
    'G7': 3135.96,
    'G#7': 3322.44,
    'Ab7': 3322.44,
    'A7': 3520.00,
    'A#7': 3729.31,
    'Bb7': 3729.31,
    'B7': 3951.07,
    'C8': 4186.01
  };

  // set up the defaults
  var freestyle = false,
      context = new webkitAudioContext(),
      source, sequencer;

  var o = context.createOscillator();
  o.frequency.value = 10;
  g = context.createGain();
  g.gain.value = 0.5;
  o.start(0);
  o.connect(context.destination);

  var bar = 16;                 //  beats in the bar
  var tempo = 120;              // bpm
  var beat = 60 / tempo * 1000; // beat duration
  var curBeat = 0;

  var stopButton = document.getElementById('stop');
  var startButton = document.getElementById('start');
  var marker = document.getElementById('marker');

  stopButton.addEventListener('click', function() {
    if (isPlaying) {
      clearInterval(sequencer);
      o.disconnect();
      isPlaying = false;
    }
  });

  startButton.addEventListener('click', function() {
    if (!isPlaying) {
      o.connect(context.destination);
      setupSounds(soundBuffers);
      isPlaying = true;
    }
  });

  // load all of the sounds and then when ready kick off the sounds setup and bindings
  var assets = new AbbeyLoad([voiceSet], function (buffers) {
    soundBuffers = buffers;
    setupSounds(buffers);
  });

  
  function getData() {

    //  load the sound file in question
    var request = new XMLHttpRequest();
    request.open('GET', '/sounds/closing-doors.WAV', true);
    request.responseType = 'arraybuffer';

    // when it loads sound file
    request.onload = function() {
      var audioData = request.response;
      // decode audio!
      audioCtx.decodeAudioData(audioData, function(buffer) {
        var data = buffer.getChannelData(0);
        var l = data.length;
        console.log('data length:', l);
        var seatContainer = document.getElementById('seats');
        var catContainer = document.getElementById('cats');

        var average = 0;

        // how many samples should we average together in chunks to create enough seats?
        var modulo = Math.ceil(l / bar);

        for (var i = 0; i < l; i += 1) {

          // calculate rolling average
          average = (average + data[i]) / 2;

          // if we're at a 'beat', create a seat!
          if (i % modulo === 0) {
            var r, g, b;
            var classes = [];
            var seatColour = '';
            var cat = undefined;
     
            var sound = undefined;
            var strum = undefined;
            var freq = undefined;

            // console.log('average', average);

            // start oscillator
            if (average > -1 && average < 0) {
              // play an A
              freq = 220.00;
            }

            if (average > 0 && average < 0.1) {
              // play a G
              freq = 196.00;
            }

            if (average > 0.1 && average < 1) {
              // play a B
              freq = 246.94;
            }
            // end oscillator

            // start drum + colour
            if (average < 0) {
              // yellow
              // classes.push('yellow');
              seatColour = 'yellow';
              sound = 'drum01';
            } else {
              // orange
              // classes.push('orange');
              seatColour = 'orange';
              sound = 'drum02';
            }
            // end drum + colour

             // start guitar strum
            if (average > 0.2) {
              seatColour = 'red';
              strum = 'g';
            }

            if (average < -0.2) {
              seatColour = 'red';
              strum = 'a';
            }

            if (average > 0.3) {
              seatColour = 'red';
              strum = 'd';
            }
            // end guitar strum

            var block = (i / modulo);
            var size = 40;
            var posX = 1 + block * size * 1.15;
            var posY = 10;


            if (strum) { classes.push('strum red'); }
            var seat = document.createElement('div');
            var seatImg = document.createElement('img');


            seatImg.src = 'img/seat_' + seatColour + '.svg';

            // seat.className = 'seat ' + classes.join(' ');
            seat.className = 'svg_seat ' + classes.join(' ');
            seat.id = 'seat_'+ block;

            seat.appendChild(seatImg);
            seatContainer.appendChild(seat);

            if (seatColour === 'red') {
              var seatWidth = parseInt(window.getComputedStyle(seat).width.replace(/px/, ''), 10);
              cat = document.createElement('img');
              cat.src = 'img/cat.svg';
              cat.className = 'cat';
              cat.id = 'cat_'+ block;
              cat.style.left = seat.offsetLeft - (seatWidth / 1.4)  + 'px';
              cat.style.top = '-82px';
              catContainer.appendChild(cat);
            }

            if (sound) { playback.push({position: block, sound: sound, freq: freq}) }
            if (strum) { playback.push({position: block, sound: strum}) }

            average = 0;
          }
        }

        // #FF7302 - orange r255 g115 b2
        // #FFC51B - yellow r255 g192 b27

        console.log('done gud:', l, playback);
      },

      function(e) {
        console.log("Error with decoding audio data" + e.err);
      });
    }

    request.send();
  }


  // this will push a short sound for each beat to the playback object
  function createMetronome() {
    for (i = 0; i < bar; i++) {
      playback.push({position: i, sound: 'm'});
    }
  }

  // play that sound
  function playSound(buffer, time) {
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
  }

  function highlightSeat(n) {
    var seat = document.getElementById('seat_' + n);
    var seatContainer = document.getElementById('seats');
    var seatWidth = parseInt(window.getComputedStyle(seat).width.replace(/px/, ''), 10);
    var seatHeight = parseInt(window.getComputedStyle(seat).height.replace(/px/, ''), 10);
    var catHeight;

    marker.style.top = seatContainer.offsetTop + seatHeight + 15 + 'px';
    marker.style.left = seat.offsetLeft + (seatWidth / 2) - (35 / 2) + 'px';
    marker.style.display = 'block';

    if (seat.className.indexOf('strum') !== -1) {
      var cat = document.getElementById('cat_' + n);
      catHeight = parseInt(window.getComputedStyle(cat).height.replace(/px/, ''), 10);
      cat.style.height = catHeight + 8 + 'px';
      cat.style.transform = ('rotate(2deg)');
      setTimeout(function() {
        cat.style.height = catHeight + 'px';
        cat.style.transform = ('rotate(0deg)');
      }, beat);
    }
  }


  // set up the shoes
  function setupSounds(buffers) {
    // Loop every n milliseconds, executing a task each time
    // the most primitive form of a loop sequencer as a simple example
    sequencer = setInterval(function() {
      isPlaying = true;
      // replace this with a new highlighter function
      highlightSeat(curBeat);

      playback.forEach(function(note){

        if (note.position === curBeat) {
          // play the sound
          playSound(buffers[note.sound], 0);
          if (note.freq) {
            o.frequency.value = note.freq;            
          }
        }

      });
      // reset beat back to 0
      curBeat = (curBeat === bar - 1) ? 0 : curBeat += 1;

    }, beat);

  }; // end setupSounds



  getData();
})();
