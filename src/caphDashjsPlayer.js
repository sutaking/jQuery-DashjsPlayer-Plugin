(function ($) {
    'use strict';

    var KEY_CODE = {
        RETURN: 10009,
        ESC: 27,
        MEDIA_REWIND: 412,
        MEDIA_FORWARD: 417,
        MEDIA_PALY: 415,
        MEDIA_PAUSE: 19,
        MEDIA_STOP: 413,
        MEDIA_TRACK_PREVIOUS: 10232,
        MEDIA_TRACK_NEXT: 10233
    }

    var PROCESS_BAR_MAX_WIDTH = 1400;
    var SEEK_INTERVAL = 15;
    
    var caphPlayer = caphPlayer || {};

    /*
    *   create ShakaPlayer Object and bind media element
    */
    function createShakePlayer(asset) {

        caphPlayer.isLive = false;
        if('features' in asset) {
            asset.features.forEach(function(feature){
                if(feature === 'live') 
                    caphPlayer.isLive = true;
            });
        }

        // Create a Player instance.
        caphPlayer.video = document.getElementById('video');

        var player = new shaka.Player(caphPlayer.video);

        // Attach player to the window to make it easy to access in the JS console.
        caphPlayer.player = player;

        // Listen for error events.
        player.addEventListener('error', onErrorEvent);

        // Add config from this asset.
        var config = ({ abr: {}, drm: {}, manifest: { dash: {} } });
        config.manifest.dash.clockSyncUri = 'https://shaka-player-demo.appspot.com/time.txt';

        if (asset.licenseServers)
          config.drm.servers = asset.licenseServers;
        if (asset.drmCallback)
          config.manifest.dash.customScheme = asset.drmCallback;
        if (asset.clearKeys)
          config.drm.clearKeys = asset.clearKeys;

        player.resetConfiguration();
        player.configure(config);

        // Configure network filters.
        var networkingEngine = player.getNetworkingEngine();
        networkingEngine.clearAllRequestFilters();
        networkingEngine.clearAllResponseFilters();

        if (asset.licenseRequestHeaders) {
          var filter = shakaDemo.addLicenseRequestHeaders_.bind(
              null, asset.licenseRequestHeaders);
          networkingEngine.registerRequestFilter(filter);
        }

        if (asset.licenseProcessor) {
          networkingEngine.registerResponseFilter(asset.licenseProcessor);
        }

        // Try to load a manifest.
        // This is an asynchronous process.
        player.load(asset.uri).then(function() {
            // This runs if the asynchronous load is successful.
            console.log('The video has now been loaded!');
        }).catch(onError);  // onError is executed if the asynchronous load fails.
    }

    /*
    *   init ShakaPlayer Object
    */
    function initApp(asset) {
        // Install built-in polyfills to patch browser incompatibilities.
        console.log('Application Start!');
        shaka.polyfill.installAll();

        // Check to see if the browser supports the basic APIs Shaka needs.
        // This is an asynchronous check.
        shaka.Player.support().then(function(support) {
            // This executes when the asynchronous check is complete.
            if (support.supported) {
            // Everything looks good!
            createShakePlayer(asset);
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
        //alert('Error code: '+ error.code);
        $('#error-dialog-content').text('Error code: '+ error.code);
        caphPlayer.errorDialog.caphDialog('open');
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
        if(type === 'forward') { seekValue += SEEK_INTERVAL;}
        else{ seekValue -= SEEK_INTERVAL;}

        if(seekValue>caphPlayer.video.duration){seekValue=caphPlayer.video.duration;}
        else if(seekValue<0){seekValue=0;}

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
            case 'Subtitles':
                t_ = caphPlayer.textTracks[key];
                break;
            case 'Quality':
                t_ = caphPlayer.videoTracks[key];
                break;
            case 'Audio':
                t_ = caphPlayer.audioTracks[key];
                break;
            default:
                return;
        }
        updateSelectedItem(type, key);
        t_ ? caphPlayer.player.selectTrack(t_, true): null;
        
    }

    /*
    *   update selected item UI
    */
    function updateSelectedItem(type, id) {
        $('.check').each(function(index) {
            if(!$(this).attr('id').indexOf(type)) {
                $(this).css({opacity:0})
            }
        })
        $('#'+type+'-'+id+'-'+'check').css({opacity:1});
    };

    /*
    *   create player's UI template
    */
    var createUI = function(rootNode) {
        var root_ = rootNode;

        var loaderElement = $('<div/>', {
            class: 'player-loader',
        }).appendTo(root_);
        var loadIcon = loaderElement;
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
                    //$.caph.focus.controllerProvider.getInstance().focus($('#test-btn')[0]);
                },
                //Fires when the audio/video is playing after having been paused or stopped for buffering
                playing: function () {
                    caphPlayer.startTime = $(self)[0].currentTime;
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
                    durationTime.text(caphPlayer.isLive ? 'Live':formatTime($(self)[0].duration));
                    saveMediaTracks(caphPlayer.player.getTracks());

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
                    currentTime.text(formatTime(caphPlayer.isLive?($(self)[0].currentTime-caphPlayer.startTime):$(self)[0].currentTime));
                    infoElement.text($(self)[0].videoWidth + ' x ' + $(self)[0].videoHeight);
                    processTransform(playProcess, $(self)[0].currentTime/$(self)[0].duration);
                    if($(self)[0].buffered.length>0) {
                        processTransform(loadProcess, ($(self)[0].buffered.end(0))/$(self)[0].duration);
                    }
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
                    caphPlayer.menuBar.slideUp();
                    $('#'+text).slideDown();
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

            $.isEmptyObject(caphPlayer.textTracks) ? null:createMenuItem('Subtitles')&createList('Subtitles',caphPlayer.textTracks);
            $.isEmptyObject(caphPlayer.videoTracks) ? null:createMenuItem('Quality')&createList('Quality',caphPlayer.videoTracks);
            $.isEmptyObject(caphPlayer.audioTracks) ? null:createMenuItem('Audio')&createList('Audio',caphPlayer.audioTracks);
        };
        

        /*
        *   tracks selected list caphPlayer.videoTracks
        */
        function createList(type, data) {
            caphPlayer.tracksList = $('<div/>', {
                id:type,
                class: 'track-list',
            }).appendTo(root_).hide()

            for(var i in data) {
                createListItem(i, type);
            }

            function createListItem(text, type) {
                var item = $('<div/>', {
                    class:'list-item',
                    focusable: '',
                    'data-focusable-depth':2
                }).on('selected', function() {
                    setTracks(type, $(this).children('#itemText').text());
                    $('#'+type).slideUp();
                    $.caph.focus.controllerProvider.getInstance().setDepth(0);
                });
                $('<div/>', {
                    id:'itemText',
                    text: text,
                    style:'position: absolute;left: 2px;'
                }).appendTo(item);
                $('<div/>', {
                    id:type+'-'+text+'-'+'check',
                    class:'fa fa-check check'
                }).appendTo(item);
                return item.appendTo(caphPlayer.tracksList);
            };
        };

        caphPlayer.hideSelectedList = function() {
            $('.menu-bar').hide();
            $('.track-list').hide();
            $.caph.focus.controllerProvider.getInstance().setDepth(0);
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
        var preButton = $('<div/>', {
            class : 'button fa fa-step-backward',
            focusable: ''
        }).appendTo(buttonsArea);
        var backwardButton = $('<div/>', {
            class : 'button fa fa-backward',
            focusable: ''
        }).on('selected', function() {
            seekPlayTime('backward',currentTime, playProcess);
        }).appendTo(buttonsArea);        
        var playButton = $('<div/>', {
            class : 'button fa fa-play',
            focusable: ''
            //'data-focusable-initial-focus': true
        }).on('selected', function() {
            if(!caphPlayer.video) return;
            playButton.hasClass('fa-play') ? caphPlayer.video.play() : caphPlayer.video.pause();
            playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
        }).appendTo(buttonsArea);
        var forwardButton = $('<div/>', {
            class : 'button fa fa-forward',
            focusable: ''
        }).on('selected', function() {
            seekPlayTime('forward',currentTime, playProcess);
        }).appendTo(buttonsArea);
        var nextButton = $('<div/>', {
            class : 'button fa fa-step-forward',
            focusable: ''
        }).on('selected', function() {
            playByIndex(caphPlayer.currentIndex+1);
        }).appendTo(buttonsArea);

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
        var subtitleButton = $('<div/>', {
            'data-focusable-depth':"0",
            class : 'button fa fa-cc',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).on('selected', function(){
            if($.isEmptyObject(caphPlayer.textTracks)) return;

            setTracks('text', 'en');
            caphPlayer.player.isTextTrackVisible()?releaseButton(this):disableButton(this);

        }).appendTo(settingbuttonsArea);

        function disableButton(btn) {
            $(btn).addClass('disable');
            !$.isEmptyObject(caphPlayer.textTracks) ? caphPlayer.player.setTextTrackVisibility(true): null;
        }
        function releaseButton(btn) {
            $(btn).removeClass('disable');
            caphPlayer.player.setTextTrackVisibility(false);
        }

        /*
        *   show caph-list of playlist 
        */
        var listTitle = $('<div>', {
            class: 'list-title'
        }).appendTo(root_);
        $('<div>', {
            class:'title-index fa fa-list-ul',
            text : ' null'
        }).appendTo(listTitle);
        $('<div>', {
            class:'title-name'
        }).appendTo(listTitle);

        var listArea = $('<div>', {
            class: 'list-area'
        }).appendTo(root_);
        $('<div>', {
            id:'list1',
            style:''
        }).appendTo(listArea);

        var itemTemplate = '<div id="<%=index%>" class="item" style="background:url(<%= item.post %>) center center no-repeat; background-size:cover;" focusable>'
        +'<div hide id="playlist-item-<%=index%>" class="statu-icon fa fa-play-circle-o" aria-hidden="true"></div>'
        +'</div>'
        $('#list1').caphList({
            items: caphPlayer.playlist,
            template: itemTemplate,
            containerClass: 'list',
            loop:true,
            onFocusItemView: function(context) {
                $('.title-index').text(' '+(context.itemIndex+1)+'/'+context.itemCount);
                $('.title-name').text(caphPlayer.playlist[context.itemIndex].name);
            }
        });

        caphPlayer.updatePlaylistStatus = function() {
            $('.statu-icon').hide();
            $('#playlist-item-'+caphPlayer.currentIndex).show();
        };

        $.caph.focus.controllerProvider.onSelected(function(event) {
            if(event.target.className.indexOf('item')) {
                return;
            }
            playByIndex(parseInt(event.target.id));
        });
        /*$.caph.focus.controllerProvider.onFocused(function(event) {
            if(event.target.className.indexOf('item')) {
                $('#list1').animate({bottom: '-70px'});
                return;
            }
            console.log('onFocused');
            $('#list1').animate({bottom: '90px'});
        });*/

        /*
        *   error dialog
        */
        caphPlayer.errorDialog = $('<div/>', {
            class: 'caph-dialog'
        }).appendTo(root_);
        $('<div/>', {
            class: 'caph-dialog-title',
            text: 'CAPH Player Error:'
        }).appendTo(caphPlayer.errorDialog);
        $('<div/>', {
            id:'error-dialog-content',
            class: 'caph-dialog-content'
        }).appendTo(caphPlayer.errorDialog);
        $('<div/>', {
            class: 'caph-dialog-buttons',
            'button-type': 'alert'
        }).appendTo(caphPlayer.errorDialog);

        caphPlayer.errorDialog.caphDialog({
            center: true,
            onOpen: function() {
                $.caph.focus.controllerProvider.getInstance().setDepth(4);
            },
            onClose: function() {
                $.caph.focus.controllerProvider.getInstance().setDepth(0);
            },
            onSelectButton: function() {
                caphPlayer.errorDialog.caphDialog('close');
            }
        });

        caphPlayer.showMenu = function() {
            clearInterval(caphPlayer.menuHideID);
            listArea.show();
            listTitle.show();
            barElement.show();
            caphPlayer.menuHideID = setInterval(function() {
                caphPlayer.hideMenu();
            }, 5000);
        };

        caphPlayer.hideMenu = function() {
            $('.menu-bar').hide();
            $('.track-list').hide();
            $.caph.focus.controllerProvider.getInstance().setDepth(0);
            listArea.hide();
            listTitle.hide();
            barElement.hide();
        }
        caphPlayer.hideMenu();

        //show video resolution in real time
        var infoElement = $('<div/>', {
            class: 'infobars'
        }).appendTo(root_);

        caphPlayer.initPlayerMenu = function() {
            caphPlayer.updatePlaylistStatus();
            loadIcon.show();
            releaseButton(subtitleButton);
            currentTime.text('00:00');
            infoElement.text('');
            processTransform(playProcess, 0);
            processTransform(loadProcess, 0);            
        }
        
    };

    $(document).on('keydown mouseover', function(event) {
        caphPlayer.showMenu();

        switch(event.keyCode) {
            case KEY_CODE.ESC:
            case KEY_CODE.RETURN:
                caphPlayer.hideSelectedList();
                break;
            default:
                break;
        }
    });

    function playByIndex(index) {
        if(index === caphPlayer.currentIndex ||index<0 || index+1>caphPlayer.playlistLength) return;

        caphPlayer.player.destroy();
        createShakePlayer(caphPlayer.playlist[index]);

        caphPlayer.currentIndex = index;
        caphPlayer.initPlayerMenu();        
    };

    /*
    *   create player
    */
    function createPlayer(data) {
        caphPlayer.videoTracks = [];
        caphPlayer.textTracks = [];
        caphPlayer.audioTracks = [];

        initApp(data);
    };

    $.fn.caphDashjsPlayer = function(options) {

        //define default options
        var defaults = {
            defaultIndex: 0
        };
        var opt = $.extend(defaults, options);

        caphPlayer.playlist = opt.datas;
        caphPlayer.currentIndex = opt.defaultIndex;
        caphPlayer.playlistLength = opt.datas.length;
        createUI(this, opt.datas);
        caphPlayer.updatePlaylistStatus();

        /*if(tizen) {
            var reqAppData = tizen.application.getCurrentApplication().getRequestedAppControl();
            var reqAppControl = reqAppData.appControl;
            console.log(' fzhao start reqAppControl ==> ' + JSON.stringify(reqAppControl));
            console.log('fzhao data uri:' +reqAppControl.data[0].value[0]);
        }*/

        return createPlayer(opt.datas[opt.defaultIndex]);
    };

    /*$(document).ready(function() {
        $.caph.focus.activate();
    });*/

})(jQuery);
