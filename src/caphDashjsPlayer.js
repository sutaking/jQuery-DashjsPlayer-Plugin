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
    function processThumbTransform(value) {
        $('.process-thumb').css({
            transform: 'translate3d(' + (value * PROCESS_BAR_MAX_WIDTH) + 'px, 0, 0)'
        });
    }

    function createUI (rootNode) {
        var root_ = rootNode;
        
        var barElement = $('<div/>', {
            class: 'bars'
        });

        var processBar = $('<div/>', {
            class : 'process-bar-area'
        });

        /*var processThumb = $('<div/>', {
            class: 'process-thumb',
            focusable: ''
        });
        processBar.append(processThumb);*/

        // create process bar
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
            class : 'button fa fa-step-backward',
            focusable: ''
        });
        var backwardButton = $('<div/>', {
            class : 'button fa fa-backward',
            focusable: ''
        });
        var forwardButton = $('<div/>', {
            class : 'button fa fa-forward',
            focusable: ''
        });
        var playButton = $('<div/>', {
            class : 'button fa fa-play',
            focusable: '',
            'data-focusable-initial-focus': true

        });
        playButton.on('selected', function() {
            if(!video_) return;
            playButton.hasClass('fa-play') ? video_.play() : video_.pause();
            playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
        });
        var nextButton = $('<div/>', {
            class : 'button fa fa-step-forward',
            focusable: ''
        });
        
        buttonsArea.append(preButton);
        buttonsArea.append(backwardButton);
        buttonsArea.append(playButton);
        buttonsArea.append(forwardButton);
        buttonsArea.append(nextButton);

        var settingbuttonsArea = $('<div/>', {
            class : 'set-buttons-area'
        }).appendTo(contorlBar);        
        var settingButton = $('<div/>', {
            class : 'button fa fa-cog',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).appendTo(settingbuttonsArea);
        var subtitleButton = $('<div/>', {
            class : 'button fa fa-cc',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).appendTo(settingbuttonsArea);


        contorlBar.append(buttonsArea);
        barElement.append(processBar);
        barElement.append(contorlBar);
        
        var qVideo_ = $('<video/>', {
            id : 'video',
            width : '1920px',
            height : '1080px',
            //autoplay: 'true'
        }).appendTo(root_);

        var infoElement = $('<div/>', {
            class: 'infobars'
        }).appendTo(root_);

        var events = {
            //Fires when the loading of an audio/video is aborted
            abort: function abort() {

            },
            //Fires when the audio/video has been started or is no longer paused
            play: function play() {
                console.log('video event [play]');
                //playButton.toggleClass('icon-play' + ' ' + 'icon-pause');
            },
            //Fires when the audio/video is playing after having been paused or stopped for buffering
            playing: function playing() {
                console.log('video event [playing]');

            },
            //Fires when the audio/video has been paused
            pause: function pause() {
                console.log('video event [pause]');
            },
            //Fires when the video stops because it needs to buffer the next frame
            waiting: function waiting() {
                console.log('video event [waiting]');
            },
            //Fires when the browser is downloading the audio/video
            process: function process() {
                console.log('video event [process]');
            },
            //Fires when the browser has loaded meta data for the audio/video
            loadedmetadata: function loadedmetadata() {
                durationTime.text(formatTime(qVideo_[0].duration));
            },
            //Fires when the browser has loaded the current frame of the audio/video
            loadeddata: function loadeddata() {
                video_.play();
                playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
            },
            //Fires when the current playback position has changed
            timeupdate : function timeupdate(){
                currentTime.text(formatTime(qVideo_[0].currentTime));
                infoElement.text(qVideo_[0].videoWidth + ' x ' + qVideo_[0].videoHeight);
                processTransform(playProcess, qVideo_[0].currentTime/qVideo_[0].duration);
                processTransform(loadProcess, qVideo_[0].buffered.end(0)/qVideo_[0].duration);
                processThumbTransform(qVideo_[0].currentTime/qVideo_[0].duration);
            },
            //Fires when an error occurred during the loading of an audio/video
            error: function error() {
                console.log('video event [error]');
            },
            //Fires when the current playlist is ended
            ended: function ended() {
                console.log('video event [ended]');
                playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
            }
        }
        
        qVideo_.on('play playing pause waiting process loadedmetadata loadeddata timeupdate error ended', function (event) {
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
                if(target.hasClass('fa-play')) {
                    //console.log(event.currentTarget);
                    $('fa-play').trigger('select');
                }

            });

        });
    });


})(jQuery);
