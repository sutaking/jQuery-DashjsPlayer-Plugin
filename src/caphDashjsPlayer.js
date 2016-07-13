(function ($) {
    'use strict';

    var PROCESS_BAR_MAX_WIDTH = 1400;

    var video_, player_, timeId;

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
      player_ = player;

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

    function seekBar(type, currentTime, playProcess) {
        clearInterval(timeId);
        
        if(type === 'forward') { video_.currentTime += 15;}
        else{ video_.currentTime -= 15; }

        currentTime.text(formatTime(video_.currentTime));
        processTransform(playProcess, video_.currentTime/video_.duration);
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
    /*function processThumbTransform(value) {
        $('.process-thumb').css({
            transform: 'translate3d(' + (value * PROCESS_BAR_MAX_WIDTH) + 'px, 0, 0)'
        });
    }*/

    function createUI (rootNode) {
        var root_ = rootNode;
        
        var loaderElement = $('<div/>', {
            class: 'player-loader',//'player-loader',
        }).appendTo(root_);
        $('<i/>', {
            class: 'fa fa-spinner fa-pulse fa-5x fa-fw'
        }).appendTo(loaderElement);

        var barElement = $('<div/>', {
            class: 'bars'
        }).appendTo(root_);

        var processBar = $('<div/>', {
            class : 'process-bar-area'
        }).appendTo(barElement);

        /*var processThumb = $('<div/>', {
            class: 'process-thumb',
            focusable: ''
        });
        processBar.append(processThumb);*/

        /* 
        *   create process bar
        */
        var processLine= $('<div/>', {
            class : 'process'
        }).appendTo(processBar);
        var currentTime = $('<div/>', {
            text : '00:00',
            id : 'current-time',
            class : 'time current'
        }).appendTo(processBar);
        var durationTime = $('<div/>', {
            text : '00:00',
            id : 'duration-time',
            class : 'time duration'
        }).appendTo(processBar);

        var loadProcess = $('<div/>', {
            class : 'load'
        }).appendTo(processLine);
        var playProcess = $('<div/>', {
            class : 'play'
        }).appendTo(processLine);

        /*
        *   control bar
        */
        var contorlBar = $('<div/>', {
            class : 'controls-bar'
        }).appendTo(barElement);
        var buttonsArea = $('<div/>', {
            class : 'buttons-area'
        }).appendTo(contorlBar);

        /*
        *   video player control buttons
        */
        /*var preButton = $('<div/>', {
            class : 'button fa fa-step-backward',
            focusable: ''
        }).appendTo(buttonsArea);*/
        var backwardButton = $('<div/>', {
            class : 'button fa fa-backward',
            focusable: ''
        }).on('selected', function() {
            console.log('fa-backward selected');
            
            timeId = setInterval(seekBar('backward',currentTime, playProcess), 100);
        }).appendTo(buttonsArea);        
        var playButton = $('<div/>', {
            class : 'button fa fa-play',
            focusable: '',
            'data-focusable-initial-focus': true
        }).on('selected', function() {
            if(!video_) return;
            playButton.hasClass('fa-play') ? video_.play() : video_.pause();
            playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
        }).appendTo(buttonsArea);
        var forwardButton = $('<div/>', {
            class : 'button fa fa-forward',
            focusable: ''
        }).on('selected', function() {
            console.log('fa-forward selected');

            timeId = setInterval(seekBar('forward',currentTime, playProcess), 100);
        }).appendTo(buttonsArea);
        /*var nextButton = $('<div/>', {
            class : 'button fa fa-step-forward',
            focusable: ''
        }).appendTo(buttonsArea);*/

        /*
        * right toolbar buttons
        */
        var settingbuttonsArea = $('<div/>', {
            class : 'set-buttons-area'
        }).appendTo(contorlBar);        
        var settingButton = $('<div/>', {
            class : 'button fa fa-ellipsis-h',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).on('selected', function() {
            var tracks = window.player.getTracks();
            console.log(tracks);
        }).appendTo(settingbuttonsArea);
        var subtitleButton = $('<div/>', {
            class : 'button fa fa-cc',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).on('selected', function(){
            if (window.player.isTextTrackVisible()) {
                $(this).css({color: 'white'});
                window.player.setTextTrackVisibility(false);
            } else {
                // Make the button look darker to show that the text track is inactive.
                $(this).css({color: 'rgba(255, 255, 255, 0.3)'});
                window.player.setTextTrackVisibility(!window.player.isTextTrackVisible());
            }
        }).appendTo(settingbuttonsArea);
        
        /*
        *   video element
        */
        $('<video/>', {
            id : 'video',
            width : '1920px',
            height : '1080px',
        }).on('play playing pause waiting process loadedmetadata loadeddata timeupdate error ended', function (event) {
            //console.log(this);
            var self = this;
            var events = {
                //Fires when the loading of an audio/video is aborted
                abort: function () {
                    console.log('video event [abort]');
                    loaderElement.show();
                },
                //Fires when the audio/video has been started or is no longer paused
                play: function () {
                    console.log('video event [play]');                
                    //playButton.toggleClass('icon-play' + ' ' + 'icon-pause');
                },
                //Fires when the audio/video is playing after having been paused or stopped for buffering
                playing: function () {
                    console.log('video event [playing]');
                    loaderElement.hide();
                    
                },
                //Fires when the audio/video has been paused
                pause: function () {
                    console.log('video event [pause]');
                },
                //Fires when the video stops because it needs to buffer the next frame
                waiting: function () {
                    console.log('video event [waiting]');
                    loaderElement.show();
                },
                //Fires when the browser is downloading the audio/video
                process: function () {
                    loaderElement.show();
                    console.log('video event [process]');
                },
                //Fires when the browser has loaded meta data for the audio/video
                loadedmetadata: function () {
                    console.log('video event [loadedmetadata]');
                    durationTime.text(formatTime($(self)[0].duration));
                },
                //Fires when the browser has loaded the current frame of the audio/video
                loadeddata: function () {
                    console.log('video event [loadeddata]');
                    loaderElement.hide();
                    video_.play();
                    playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
                },
                //Fires when the current playback position has changed
                timeupdate : function (){
                    currentTime.text(formatTime($(self)[0].currentTime));
                    infoElement.text($(self)[0].videoWidth + ' x ' + $(self)[0].videoHeight);
                    processTransform(playProcess, $(self)[0].currentTime/$(self)[0].duration);
                    processTransform(loadProcess, $(self)[0].buffered.end(0)/$(self)[0].duration);
                },
                //Fires when an error occurred during the loading of an audio/video
                error: function () {
                    console.log('video event [error]');
                },
                //Fires when the current playlist is ended
                ended: function () {
                    console.log('video event [ended]');
                    playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
                }
            };
            events[event.type]();
        }).appendTo(root_);

        //show video resolution in real time
        var infoElement = $('<div/>', {
            class: 'infobars'
        }).appendTo(root_);
        
    };

    function player(dom, options) {
        var ctrl = new demoControl();
        ctrl.init();

        createUI($(dom));
        initApp(options.uri);
    };

    $.fn.caphDashjsPlayer = function(options) {

        //define default options
        var defaults = {

        };

        var options = $.extend(defaults, options);
        //console.log(options);

        return new player(this, options);
    };

    $(document).ready(function() {

        $.caph.focus.activate(function(nearestFocusableFinderProvider, controllerProvider){

            controllerProvider.onSelected(function (event, originalEvent) {
                
                var target = $(event.currentTarget);
                if(target.hasClass('fa-play')) {
                    //console.log(event.currentTarget);
                }
                else if(target.hasClass('fa-step-backward')) {
                    //console.log('fa-step-backward');
                }
                else if(target.hasClass('fa-backward')) {
                    //console.log('fa-backward');
                }
                else if(target.hasClass('fa-forward')) {
                    //seekBar();
                    //console.log('fa-forward');
                }
                else if(target.hasClass('fa-step-forward')) {
                    //console.log('fa-step-forward');
                }
                else if(target.hasClass('fa-cog')) {
                    //console.log('setting');
                }
                else if(target.hasClass('fa-cc')) {
                    //console.log('subtitle');
                }
            });    
        });
    });


})(jQuery);
