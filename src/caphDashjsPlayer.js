(function ($) {
    'use strict';

    var PROCESS_BAR_MAX_WIDTH = 1400;
    
    var caphPlayer = caphPlayer || {};

    /*
    *   create ShakaPlayer Object and bind media element
    */
    function initPlayer(manifestUri) {
        // Create a Player instance.
        caphPlayer.video = document.getElementById('video');

        var player = new shaka.Player(caphPlayer.video);

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

    /*
    *   init ShakaPlayer Object
    */
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

    /*
    *   Extract the shaka.util.Error object from the event.
    */
    function onErrorEvent(event) {
        onError(event.detail);
    }

    /*
    *   Log the error.
    */
    function onError(error) {
        console.error('Error code', error.code, 'object', error);
    }

    /*
    *   seek media source current time.
    */
    function onSeekTime_(val) {
        //console.log('seektime: '+val);
        caphPlayer.timeId_ = null;
        caphPlayer.video.currentTime = val;
    }

    /*
    *   prepare seek media source by timeout
    */
    function seekPlayTime(type, currentTime, playProcess) {

        //1st update UI right way
        var seekValue = caphPlayer.video.currentTime;
        if(type === 'forward') { seekValue += 15;}
        else{ seekValue -= 15;}
        currentTime.text(formatTime(seekValue));
        processTransform(playProcess, seekValue/caphPlayer.video.duration);

        // collect input evnets and seek.
        if(caphPlayer.timeId_ != null) {clearInterval(caphPlayer.timeId_);}
        caphPlayer.timeId_ = setInterval(onSeekTime_(seekValue), 100);
    }

    /*
    *   format time object to hours, minutes, seconds
    */
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

    /*
    *   format time object to string
    */
    function formatTime (sec) {
        //console.log(sec);
        var array = stringToHHMMSS(sec);
        if(sec >= 3600) {
            return array[0] + ':' + array[1] + ':' + array[2];
        }
        return sec ? array[1] + ':' + array[2] : '00:00';
    };

    /*
    *   translate progress bar
    */
    function processTransform(line, value) {
        $(line).css({
            transform: 'translate3d(' + (value * PROCESS_BAR_MAX_WIDTH - PROCESS_BAR_MAX_WIDTH) + 'px, 0, 0)'
        });
    };

    /*
    *   save media source tracks
    */
    function saveMediaTracks(tarcks) {

        tarcks.forEach(function(item, index) {
            switch(item.type){
                case 'text':
                    caphPlayer.textTracks[item.language] = item;
                    break;
                case 'video':
                    caphPlayer.videoTracks[item.width] = item;
                    break;
                case 'audio':
                    caphPlayer.audioTracks[item.language] = item;
                    break;
                default:
                    console.log('unknow tracks type')
                    break;
            }
        });
    };

    /*
    *   get tracks from local save data.
    */
    function setTracks(type, key) {
        var t_;
        switch(type){
            case 'text':
                t_ = caphPlayer.textTracks[key];
                break;
            case 'video':
                t_ = caphPlayer.videoTracks[key];
                break;
            case 'audio':
                t_ = caphPlayer.audioTracks[key];
                break;
            default:
                return;
        }
        t_ ? window.player.selectTrack(t_, true): null;
    }

    /*
    *   create player's UI template
    */
    function createUI (rootNode) {
        var root_ = rootNode;

        var loaderElement = $('<div/>', {
            class: 'player-loader',
        }).appendTo(root_);
        $('<i/>', {
            class: 'fa fa-spinner fa-pulse fa-5x fa-fw'
        }).appendTo(loaderElement);

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
                    saveMediaTracks(window.player.getTracks());
                    createMenu();

                    if($.isEmptyObject(caphPlayer.textTracks)) disableButton(subtitleButton);
                },
                //Fires when the browser has loaded the current frame of the audio/video
                loadeddata: function () {
                    console.log('video event [loadeddata]');
                    loaderElement.hide();
                    caphPlayer.video.play();
                    playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
                },
                //Fires when the current playback position has changed
                timeupdate : function (){
                    currentTime.text(formatTime($(self)[0].currentTime));
                    infoElement.text($(self)[0].videoWidth + ' x ' + $(self)[0].videoHeight);
                    processTransform(playProcess, $(self)[0].currentTime/$(self)[0].duration);
                    processTransform(loadProcess, ($(self)[0].buffered.end(0))/$(self)[0].duration);
                    //console.log($(self)[0].buffered.end(0));
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


        /*
        * selected menu
        */
        function createMenu() {
            caphPlayer.menuBar = $('<div/>',{
                class: 'menu-bar'
            }).appendTo(root_).hide();

            function createMenuItem(text) {
                var item = $('<div/>', {
                    class:'menu-item',
                    focusable: '',
                    'data-focusable-depth':1
                }).on('selected', function() {
                    //console.log($(this).children('#itemText').text());
                    caphPlayer.menuBar.slideUp();
                    caphPlayer.tracksList.slideDown();
                    $.caph.focus.controllerProvider.getInstance().setDepth(2);
                });
                $('<div/>', {
                    id:'itemText',
                    text: text,
                    style:'position: absolute;left: 2px;'
                }).appendTo(item);
                $('<div/>', {
                    class:'fa fa-chevron-right fa-1x',
                    style:'position: absolute;right: 2px;line-height:50px;'
                }).appendTo(item);
                return item.appendTo(caphPlayer.menuBar);
            }

            $.isEmptyObject(caphPlayer.textTracks) ? null:createMenuItem('Subtitles');//&createList(caphPlayer.textTracks);
            $.isEmptyObject(caphPlayer.videoTracks) ? null:createMenuItem('Quality')&createList(caphPlayer.videoTracks);
            $.isEmptyObject(caphPlayer.audioTracks) ? null:createMenuItem('Audio');//&createList(caphPlayer.audioTracks);
        };
        

        /*
        *   tracks selected list caphPlayer.videoTracks
        */
        function createList(data) {
            caphPlayer.tracksList = $('<div/>', {
                class: 'track-list',
            }).appendTo(root_).hide()

            for(var i in data) {
                createListItem(i);
            }
            /*$('#list1').caphList({
                items: data,
                template: '<div class="list-item" focusable>list</div>',
                loop: true,
                containerClass:'track-list'
            });*/

            function createListItem(text) {
                var item = $('<div/>', {
                    class:'list-item',
                    focusable: '',
                    'data-focusable-depth':2
                }).on('selected', function() {
                    console.log($(this).children('#itemText').text());
                    setTracks('video', $(this).children('#itemText').text());
                    caphPlayer.tracksList.slideUp();
                    $.caph.focus.controllerProvider.getInstance().setDepth(0);
                });
                $('<div/>', {
                    id:'itemText',
                    text: text,
                    style:'position: absolute;left: 2px;'
                }).appendTo(item);
                $('<div/>', {
                    class:'fa fa-check',
                    style:'position: absolute;right: 2px;line-height:50px; color:green;'
                }).appendTo(item);
                return item.appendTo(caphPlayer.tracksList);
            };
            
        };
        
        /* 
        *   create process bar
        */
        var barElement = $('<div/>', {
            class: 'bars'
        }).appendTo(root_);

        var processBar = $('<div/>', {
            class : 'process-bar-area'
        }).appendTo(barElement);
        
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
            //console.log('fa-backward selected');
            seekPlayTime('backward',currentTime, playProcess);
        }).appendTo(buttonsArea);        
        var playButton = $('<div/>', {
            class : 'button fa fa-play',
            focusable: '',
            'data-focusable-initial-focus': true
        }).on('selected', function() {
            if(!caphPlayer.video) return;
            playButton.hasClass('fa-play') ? caphPlayer.video.play() : caphPlayer.video.pause();
            playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
        }).appendTo(buttonsArea);
        var forwardButton = $('<div/>', {
            class : 'button fa fa-forward',
            focusable: ''
        }).on('selected', function() {
            console.log('fa-forward selected');
            seekPlayTime('forward',currentTime, playProcess);
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
            class : 'button fa fa-cog',//fa-cog  fa-ellipsis-h
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).on('selected', function() {
             caphPlayer.menuBar.slideDown();
             $.caph.focus.controllerProvider.getInstance().setDepth(1);
        }).appendTo(settingbuttonsArea);

        /*
        * subtitle button
        */
        /*var contextMenuArea = $('<div/>',{
            id: 'contextMenuArea'
        }).appendTo(settingbuttonsArea);*/

        var subtitleButton = $('<div/>', {
            //id:'btnContextMenu1',
            'data-focusable-depth':"0",
            class : 'button fa fa-cc',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
            //'data-focusable-depth' : '0'
        }).on('selected', function(){
            if($.isEmptyObject(caphPlayer.textTracks)) return;

            setTracks('text', 'en');
            window.player.isTextTrackVisible()?releaseButton(this):disableButton(this);

        }).appendTo(settingbuttonsArea);

        function disableButton(btn) {
            $(btn).css({color: 'rgba(255, 255, 255, 0.3)'});
            !$.isEmptyObject(caphPlayer.textTracks) ? window.player.setTextTrackVisibility(true): null;
        }
        function releaseButton(btn) {
            $(btn).css({color: 'rgba(255, 255, 255, 1)'});
            window.player.setTextTrackVisibility(false);
        }

        /*
        *   subtitle selected option.
        */
        /*var menu = $('<div/>', {
            id:'contextMenu1'
        }).appendTo(subtitleButton);
        $('<div/>', {
            class: 'caph-context-menu-arrow-up-template',
            text: '▲'
        }).appendTo(menu);
        $('<div/>', {
            class: 'caph-context-menu-item-template',
            text: '${content}'
        }).appendTo(menu);
        $('<div/>', {
            class: 'caph-context-menu-arrow-down-template',
            text: '▼'
        }).appendTo(menu);*/
    
        //show video resolution in real time
        var infoElement = $('<div/>', {
            class: 'infobars'
        }).appendTo(root_);
        
    };

    /*
    *   start player
    */
    function player(dom, options) {

        createUI($(dom), options.datas);

        caphPlayer.videoTracks = [];
        caphPlayer.textTracks = [];
        caphPlayer.audioTracks = [];
        initApp(options.datas[0].uri);
    };

    $.fn.caphDashjsPlayer = function(options) {

        //define default options
        var defaults = {};

        var options = $.extend(defaults, options);
        console.log(options);

        return new player(this, options);
    };
    
    $(document).ready(function() {
        $.caph.focus.activate();
    });

})(jQuery);
