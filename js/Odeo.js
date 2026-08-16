// /ˈôdēˌō/

(function () {
  var AudioContext = window.AudioContext || window.webkitAudioContext;

  // Plays any audio the browser can decode: a bundled file, a remote URL that
  // sends CORS headers, or a file the visitor dropped on the page. This used to
  // go through the SoundCloud API, which now needs OAuth on every request and
  // so can't work from a static page.
  function OdeoAudioPlayer(odeo) {
    this.odeo = odeo;
    this.objectURL = null;

    this.audio = document.createElement("audio");
    this.audio.loop = true;
    this.audio.crossOrigin = "anonymous";

    this.songSource = this.odeo.context.createMediaElementSource(this.audio);
    this.songSource.connect(this.odeo.analyser);
    this.songSource.connect(this.odeo.context.destination);

    // a missing or undecodable file shouldn't leave the page silent
    this.audio.addEventListener(
      "error",
      function () {
        if (odeo.onError) odeo.onError(this.audio.src);
      }.bind(this)
    );
  }

  OdeoAudioPlayer.prototype.play = function (src) {
    this.releaseObjectURL();
    this.audio.src = src;
    return this.audio.play();
  };

  OdeoAudioPlayer.prototype.playFile = function (file) {
    this.releaseObjectURL();
    this.objectURL = URL.createObjectURL(file);
    this.audio.src = this.objectURL;
    return this.audio.play();
  };

  OdeoAudioPlayer.prototype.releaseObjectURL = function () {
    if (!this.objectURL) return;
    URL.revokeObjectURL(this.objectURL);
    this.objectURL = null;
  };

  OdeoAudioPlayer.prototype.stop = function () {
    this.audio.pause();
  };

  function OdeoMicrophone(odeo) {
    this.microphone = null;
    this.odeo = odeo;
  }

  OdeoMicrophone.prototype.play = function () {
    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        function (stream) {
          this.microphone = this.odeo.context.createMediaStreamSource(stream);
          this.microphone.connect(this.odeo.analyser);
        }.bind(this),
        function () {}
      );
    } else if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(
          function (stream) {
            this.microphone = this.odeo.context.createMediaStreamSource(stream);
            this.microphone.connect(this.odeo.analyser);
          }.bind(this)
        )
        .catch(function (err) {});
    }
  };

  OdeoMicrophone.prototype.stop = function () {
    // the stream may still be pending, or have been denied
    if (!this.microphone) return;
    this.microphone.disconnect(this.odeo.analyser);
    this.microphone = null;
  };

  function Odeo(opts) {
    this.options = opts || {};

    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = this.options.fftSize || 256;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.spectrumTexture = null;

    this.player = null;
    this.microphone = null;
  }

  Odeo.prototype.getPlayer = function () {
    if (!this.player) this.player = new OdeoAudioPlayer(this);
    return this.player;
  };

  Odeo.prototype.activate = function () {
    this.context.resume();
  };

  Odeo.prototype.useMicrophone = function () {
    this.stop();
    if (!this.microphone) this.microphone = new OdeoMicrophone(this);
    this.microphone.play();
  };

  Odeo.prototype.stopUsingMicrophone = function () {
    if (!this.microphone) return;
    this.microphone.stop();
  };

  // url can be a bundled track, or any remote file served with CORS headers
  Odeo.prototype.playURL = function (url) {
    this.stopUsingMicrophone();
    var playing = this.getPlayer().play(url);
    // autoplay is blocked until the visitor interacts with the page
    if (playing && playing.catch) playing.catch(function () {});
    return playing;
  };

  // for a file the visitor picked or dropped on the page
  Odeo.prototype.playFile = function (file) {
    this.stopUsingMicrophone();
    var playing = this.getPlayer().playFile(file);
    if (playing && playing.catch) playing.catch(function () {});
    return playing;
  };

  Odeo.prototype.stop = function () {
    if (!this.player) return;
    this.player.stop();
  };

  Odeo.prototype.getSpectrumTexture = function () {
    this.spectrumTexture = new THREE.DataTexture(
      this.frequencyData,
      1 * this.frequencyData.length,
      1,
      THREE.LuminanceFormat
    );
    this.spectrumTexture.minFilter = THREE.NearestFilter;
    this.spectrumTexture.magFilter = THREE.NearestFilter;
    this.spectrumTexture.needsUpdate = true;

    return this.spectrumTexture;
  };

  Odeo.prototype.update = function () {
    this.analyser.getByteFrequencyData(this.frequencyData);
    if (this.spectrumTexture) this.spectrumTexture.needsUpdate = true;
    //kick.onUpdate();
  };

  window.Odeo = Odeo;
})();
