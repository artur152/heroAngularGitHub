/** Toggle Class  **/
function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  var classString = element.className, nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  }
  else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/** Find Parent with specific Class **/
function findParent(el, cls) {
  while (el) {
    if ( el.matches(cls) ) {
      return el;
    }
    el = el.parentNode;
  }
}


document.addEventListener("DOMContentLoaded", function() {

  /** Create_Button */
  function createButton() {
    var text;
    var bot = document.createElement('button');
    bot.classList.add('bacon', 'nav-item');
    bot.textContent = 'Like me Dude';

    bot.onclick = function (e) {
      e.preventDefault();

      if (this.textContent === "Like Me") {
        text = "Liked";
      }
      else {
        text = "Like Me";
      }
      this.textContent = text;

      toggleClass(this, ' bobby-js');
      console.log(" You've Clicked: " + this.className);
    };

    let appNav = document.getElementsByClassName('nav-main')[0];
    appNav.insertBefore(bot, appNav.childNodes[0]);

  }
  createButton();


  /** Scroll Events */
  function scrolling() {
    let page = document.getElementsByClassName('page')[0];
    let header = document.getElementsByTagName('header')[0];
    let toTop = document.getElementsByClassName('scroll-top-js')[0];

    /* scroll_Page */
    function scrollPage() {
      if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        page.classList.add('scrolled_js');
        header.classList.add('fixed_js');
        toTop.classList.add('show_js');
      }
      else if (document.body.scrollTop < 150 || document.documentElement.scrollTop < 150) {
        page.classList.remove('scrolled_js');
        header.classList.remove('fixed_js');
        toTop.classList.remove('show_js');
      }
    }
    window.onscroll = function() { scrollPage() };

    /* Scroll_Top */
    function scrollTo() {
      let scrollToTop = window.setInterval(function() {
        let pos = window.pageYOffset;
        if ( pos > 0 ) {
          window.scrollTo( 0, pos - 20 );
        } else {
          window.clearInterval( scrollToTop );
        }
      }, 10);
    }

    toTop.onclick = function (e) {
      e.preventDefault();
      scrollTo(document.documentElement, 0, 100); // FireFox
      scrollTo(document.body, 0, 100); // Chrome
      console.log(window.pageYOffset);
    };

  }
  scrolling();


  /** Video Mutation Event, Methods */
  /*
    DOMAttrModified
    DOMAttributeNameChanged
    DOMCharacterDataModified
    DOMElementNameChanged
    DOMNodeInserted
    DOMNodeInsertedIntoDocument
    DOMNodeRemoved
    DOMNodeRemovedFromDocument
    DOMSubtreeModified
  */
  function DOMNodeInserted() {
    var target = document.getElementsByClassName("content")[0];
    target.addEventListener('DOMCharacterDataModified',  function () {
      video();
      videoSets();
    }, false);
  }
  DOMNodeInserted();


  /** Video Settings */
  function video() {
    let videos = document.getElementsByClassName("video");
    let playButton = document.getElementsByClassName("btn--play-pause");
    let muteButton = document.getElementsByClassName("btn--mute");
    let fullScreenButton = document.getElementsByClassName("btn--full-screen");
    let seekBar = document.getElementsByClassName("btn--seek-bar");
    let volumeBar = document.getElementsByClassName("btn--volume-bar");

    /** Video: Video trigger **/
    for (var v = 0; v < videos.length; v++) {
      videos[v].onclick = function (e) {
        playCustom(e.target);
      };
      playNative( videos[v] );

      /* Time events */
      videos[v].addEventListener('loadeddata', function (e) {
        var hrs = e.target.parentNode.querySelector('.hours');
        var min = e.target.parentNode.querySelector('.minutes');
        var sec = e.target.parentNode.querySelector('.seconds');

        var currentTimer = e.target.parentNode.querySelector('.current-time');
        var durationTimer = e.target.parentNode.querySelector('.duration-time');

        var videoDuration = parseFloat(e.target.duration).toFixed(2);

        // currentTimer.textContent = parseFloat(e.target.currentTime).toFixed(2);
        // durationTimer.textContent = (videoDuration / 60).toFixed(2);

        HHmmss(hrs, min, sec, videoDuration);
      });

      videos[v].addEventListener('timeupdate', function (e) {
        var hrs_curr = e.target.parentNode.querySelector('.hours-curr');
        var min_curr = e.target.parentNode.querySelector('.minutes-curr');
        var sec_curr = e.target.parentNode.querySelector('.seconds-curr');

        var seekBarCurrent = e.target.parentNode.querySelector('.btn--seek-bar');
        seekBarCurrent.value = (100 / e.target.duration) * e.target.currentTime;

        var currentTimer = e.target.parentNode.querySelector('.current-time');
        var time = (e.target.currentTime).toFixed(2);

        if (time > 60) {
          time = (e.target.currentTime / 60).toFixed(2);
        }

        ckeckTimeLine(currentTimer, time);

        // var videoDuration = parseFloat(e.target.duration).toFixed(2);
        // HHmmss_backwards(hrs_curr, min_curr, sec_curr, videoDuration);
      });
    }

    /** Video: Play trigger **/
    for (var play_custom = 0; play_custom < playButton.length; play_custom++) {
      playButton[play_custom].onclick = function (e) {

        var targetParent = findParent(e.target, '.playlist-video');
        var targetVideo = targetParent.querySelector('.video');
        playVideo(targetVideo);

      };
    }

    /** Video: Mute trigger **/
    for (var mute_custom = 0; mute_custom < muteButton.length; mute_custom++) {
      muteButton[mute_custom].onclick = function (e) {

        var targetParent = findParent(e.target, '.playlist-video');
        var targetVideo = targetParent.querySelector('.video');
        var targetMute = targetParent.querySelector('.btn--volume-bar');
        var muteParent = e.target.parentNode;

        muteVideo(targetVideo, muteParent, targetMute);
      };
    }

    /** Video: Full Screen **/
    for(var fullscr_custom = 0; fullscr_custom < fullScreenButton.length; fullscr_custom++) {
      fullScreenButton[fullscr_custom].onclick = function (e) {

        var targetParent = findParent(e.target, '.playlist-video');
        var targetVideo = targetParent.querySelector('.video');

        fullscreenToggle(targetVideo);
        fullscreenChange(targetParent);
      }
    }

    /** Video: Seekbar **/
    for(var seekTime = 0; seekTime < seekBar.length; seekTime++) {
      seekBar[seekTime].addEventListener('change', function (e) {

        var targetParent = findParent(e.target, '.playlist-video');
        var targetVideo = targetParent.querySelector('.video');
        var time;

        time = (e.target.value / 100) * targetVideo.duration;
        targetVideo.currentTime = time;

        // console.log(time + '/' + targetVideo.duration);
      });
    }

    /** Video: Volumebar **/
    for(var vol = 0; vol < volumeBar.length; vol++) {
      volumeBar[vol].addEventListener("change", function(e) {

        var targetParent = findParent(e.target, '.playlist-video');
        var targetVideo = targetParent.querySelector('.video');
        var targetMute = e.target.parentNode;

        if (e.target.value >= 0.01) {
          targetMute.classList.remove('muted_js');
          targetVideo.muted = false;
        } else {
          targetMute.classList.add('muted_js');
          targetVideo.muted = true;
          targetVideo.volume = e.target.value;
        }

        targetVideo.volume = e.target.value;
      });
    }


    /** Video: HHmmss **/
    function HHmmss(hours, minutes, seconds, videoTime) {
      var sec_n = videoTime;
      var h = Math.floor(sec_n / 3600);
      var m = Math.floor( (sec_n - (h * 3600)) / 60);
      var s = ( sec_n - (h * 3600) - (m * 60) ).toFixed(2);

      if(h < 10) {
        hours.textContent = '0' + h;
      }
      else {
        hours.textContent = h;
      }

      if(m < 10) {
        minutes.textContent = '0' + m;
      }
      else {
        minutes.textContent = m;
      }

      if(s < 10) {
        seconds.textContent = '0' + s;
      }
      else {
        seconds.textContent = s;
      }
    }

    function HHmmss_backwards(hours, minutes, seconds, videoTime) {
      var sec_n = parseInt(videoTime, 10);
      var h = Math.floor(sec_n / 3600);
      var m = Math.floor( (sec_n - (h * 3600)) / 60);
      var s = sec_n - (h * 3600) - (m * 60);

      setInterval( function() {
        // hours.textContent = '0' + h;
        // minutes.textContent = m;
        // seconds.textContent = s--;
      }, 1000);
    }

    /** Video: Check timeline **/
    function ckeckTimeLine(el, t) {
      if(el.textContent < 10) {
        el.textContent = '0' + t;
      } else if (el.textContent < 1) {
        el.textContent = '00';
      }
      else {
        el.textContent = t;
      }
    }

    /** Video: Fullscreen Toggle **/
    function fullscreenToggle(elem) {
      elem = elem || document.documentElement;
      if ( !document.fullscreenElement && !document.mozFullScreenElement
        && !document.webkitFullscreenElement && !document.msFullscreenElement ) {

        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        }
        else if (elem.parentNode.mozRequestFullScreen) {
          elem.parentNode.mozRequestFullScreen();
        }
        else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
        else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        }
      }
      else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

    function listenerToggle(el) {
      if (document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement) {
        el.classList.add('fullscreen_js');
        console.log('Enter Full Screen');
      } else {
        el.classList.remove('fullscreen_js');
        console.log('Exit Full Screen');
      }
    }

    /** Video: Fullscreen Change  **/
    function fullscreenChange(elParent) {
      document.addEventListener('fullscreenchange', function () {
        listenerToggle(elParent);
      }, false);

      document.addEventListener("mozfullscreenchange", function () {
        listenerToggle(elParent);
      }, false);

      document.addEventListener('webkitfullscreenchange', function () {
        listenerToggle(elParent);
      }, false);

      document.addEventListener('MSFullscreenChange', function () {
        listenerToggle(elParent);
      }, false);
    }

    /*** Video: Native Controls ***/
    function playNative(el) {
      el.addEventListener("pause", function (e) {
        e.target.parentNode.classList.remove('play_js');
        e.target.pause();
      }, true);

      el.addEventListener("play", function (e) {
        e.target.parentNode.classList.add('play_js');
        e.target.play();
      }, true);
    }

    /*** Video: Custom Controls ***/
    /** Video: Play / Pause **/
    function playCustom(video_playCustom) {
      if ( video_playCustom.paused ) {
        video_playCustom.parentNode.classList.add('play_js');
        video_playCustom.play();
      }
      else if ( video_playCustom.play ) {
        video_playCustom.parentNode.classList.remove('play_js');
        video_playCustom.pause();
      }
    }

    function playVideo(el) {
      if (el.paused) {
        el.play();
      } else {
        el.pause();
      }
    }

    /** Video: Mute **/
    function muteVideo(el, el2, el3) {
      if (el.muted === true || el3.value === 0) {
        el2.classList.remove('muted_js');
        el.muted = false;
        el3.value = el.volume = 1;
      } else {
        el2.classList.add('muted_js');
        el.muted = true;
        el3.value = el.volume = 0;
      }
    }

  }
  video();


  /** Video: Settings when page loaded */
  function videoSets() {
    var videos = document.getElementsByClassName("video");
    var muteButton = document.getElementsByClassName("volume-block");

    for (var muted = 0; muted < muteButton.length; muted++) {
      muteButton[muted].classList.add('muted_js');
    }
    for (var vid = 0; vid < videos.length; vid++) {
      videos[vid].muted = true;
    }
  }
  videoSets();


  /** Detect Keydown event */
  document.onkeydown = function(event) {
    var keys = event.which || event.keyCode;
    console.log( 'keyCode: ' + keys );
  };

});
