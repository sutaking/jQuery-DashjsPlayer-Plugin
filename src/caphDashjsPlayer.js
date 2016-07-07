(function ($) {
    'use strict';

    var PROCESS_BAR_MAX_WIDTH = 1400;

    var video_;

    function initApp(uri) {
      // Install built-in polyfills to patch browser incompatibilities.
      console.log('Application Start!');
      shaka.polyfill.installAll();

      // Check to see if the browser supports the basic APIs Shaka needs.
      // This is an asynchronous check.
      shaka.Player.support().then(function(support) {
        // This executes when the asynchronous check is complete.
        if (support.supported) {
          // Everything looks good!
          initPlayer(uri);
          console.log('TV is supported!');
        } else {
          // This browser does not have the minimum set of APIs we need.
          console.error('Browser not supported!');
        }
      });
    }

    function initPlayer(manifestUri) {
      // Create a Player instance.
      video_ = document.getElementById('video');

      var player = new shaka.Player(video_);

      // Attach player to the window to make it easy to access in the JS console.
      window.player = player;

      // Listen for error events.
      player.addEventListener('error', onErrorEvent);

      // Try to load a manifest.
      // This is an asynchronous process.
      player.load(manifestUri).then(function() {
        // This runs if the asynchronous load is successful.
        console.log('The video has now been loaded!');

      }).catch(onError);  // onError is executed if the asynchronous load fails.
    }

    function onErrorEvent(event) {
      // Extract the shaka.util.Error object from the event.
      onError(event.detail);
    }

    function onError(error) {
      // Log the error.
      console.error('Error code', error.code, 'object', error);
    }

    function stringToHHMMSS(data) {
        var sec_num = parseInt(data + '', 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return [hours, minutes, seconds];
    };

    function formatTime (sec) {
        //console.log(sec);
        var array = stringToHHMMSS(sec);
        if(sec >= 3600) {
            return array[0] + ':' + array[1] + ':' + array[2];
        }
        return sec ? array[1] + ':' + array[2] : '00:00';
    };

    function processTransform(line, value) {
        $(line).css({
            transform: 'translate3d(' + (value * PROCESS_BAR_MAX_WIDTH - PROCESS_BAR_MAX_WIDTH) + 'px, 0, 0)'
        });
    };

    function createUI (rootNode) {
        var root_ = rootNode;
        
        var barElement = $('<div/>', {
            class: 'bars'
        });

        var processBar = $('<div/>', {
            class : 'process-bar-area'
        });
        var processLine= $('<div/>', {
            class : 'process'
        });
        var loadProcess = $('<div/>', {
            class : 'load'
        });
        var playProcess = $('<div/>', {
            class : 'play'
        });
        processLine.append(loadProcess);
        processLine.append(playProcess);

        var currentTime = $('<div/>', {
            text : '00:00',
            id : 'current-time',
            class : 'time current'
        });
        var durationTime = $('<div/>', {
            text : '00:00',
            id : 'duration-time',
            class : 'time duration'
        });
        processBar.append(processLine);
        processBar.append(currentTime);
        processBar.append(durationTime);

        var contorlBar = $('<div/>', {
            class : 'controls-bar'
        });
        var buttonsArea = $('<div/>', {
            class : 'buttons-area'
        });
        var preButton = $('<div/>', {
            class : 'button icon-previous',
            'focusable': ''
        });

        var playButton = $('<div/>', {
            class : 'button icon-play',
            focusable: ''

        });
        playButton.on('selected', function() {
            playButton.hasClass('icon-play') ? video_.play() : video_.pause();
            playButton.toggleClass('icon-play' + ' ' + 'icon-pause');
        });

        var nextButton = $('<div/>', {
            class : 'button icon-next',
            focusable: ''
        });
        buttonsArea.append(preButton);
        buttonsArea.append(playButton);
        buttonsArea.append(nextButton);

        contorlBar.append(buttonsArea);

        barElement.append(processBar);
        barElement.append(contorlBar);
        
        var qVideo_ = $('<video/>', {
            id : 'video',
            width : '1920px',
            height : '1080px',
            autoplay: 'true'
        }).appendTo(root_);

        var events = {
            loadedmetadata: function loadedmetadata() {
                durationTime.text(formatTime(qVideo_[0].duration));
                playButton.toggleClass('icon-play' + ' ' + 'icon-pause');
            },
            timeupdate : function timeupdate(){
                currentTime.text(formatTime(qVideo_[0].currentTime));
                processTransform(playProcess, qVideo_[0].currentTime/qVideo_[0].duration);
                processTransform(loadProcess, qVideo_[0].buffered.end(0)/qVideo_[0].duration);
            }
        }
        
        qVideo_.on('loadedmetadata timeupdate', function (event) {
            //console.log(event.type);
            events[event.type]();
        });

        root_.append(barElement);
    };

    $.fn.caphDashjsPlayer = function(options) {

        //define default options
        var defaults = {

        };

        var options = $.extend(defaults, options);
        console.log(options);

        createUI($(this));
        initApp(options.uri);

    };

    $(document).ready(function() {
        $.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider){

            controllerProvider.onSelected(function (event, originalEvent) {
                
                var target = $(event.currentTarget);
                if(target.hasClass('icon-play')) {
                    //console.log(event.currentTarget);
                    $('icon-play').trigger('select');
                }

            });

        });
    });


})(jQuery);
