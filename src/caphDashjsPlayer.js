(function ($) {
    'use strict';

    var shaka_ = window.shaka;
    var PROCESS_BAR_MAX_WIDTH = 1400;
    var SEEK_INTERVAL = 15;
    
    var caphPlayer = caphPlayer || {};

    /*
    *   Log the error.
    */
    function onError(error) {
        console.error('Error code', error.code, 'object', error);

        //$('#error-dialog-content').text('Error code: '+ error.code);
        //caphPlayer.errorDialog.caphDialog('open');

        //for loop video
        console.log('Error code: '+ error.code);
        playByIndex(caphPlayer.currentIndex+1);
    }

    /*
    *   Extract the shaka.util.Error object from the event.
    */
    function onErrorEvent(event) {
        onError(event.detail);
    }

    /*
    *   create ShakaPlayer Object and bind media element
    */
    function createShakaPlayer(asset) {

        caphPlayer.isLive = false;
        if('features' in asset) {
            asset.features.forEach(function(feature){
                if(feature === 'live') {
                    caphPlayer.isLive = true;
                }
            });
        }

        // Create a Player instance.
        caphPlayer.video = document.getElementById('video');

        var player = new shaka_.Player(caphPlayer.video);

        // Attach player to the window to make it easy to access in the JS console.
        caphPlayer.player = player;

        // Listen for error events.
        player.addEventListener('error', onErrorEvent);

        // Add config from this asset.
        var config = ({ abr: {}, drm: {}, manifest: { dash: {} } });
        config.manifest.dash.clockSyncUri = 'https://shaka-player-demo.appspot.com/time.txt';

        if (asset.licenseServers) {
          config.drm.servers = asset.licenseServers;
        }
        if (asset.drmCallback) {
          config.manifest.dash.customScheme = asset.drmCallback;
        }
        if (asset.clearKeys) {
          config.drm.clearKeys = asset.clearKeys;
        }

        player.resetConfiguration();
        player.configure(config);

        // Configure network filters.
        var networkingEngine = player.getNetworkingEngine();
        networkingEngine.clearAllRequestFilters();
        networkingEngine.clearAllResponseFilters();

        if (asset.licenseRequestHeaders) {
          var filter = shaka_.addLicenseRequestHeaders_.bind(
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
        shaka_.polyfill.installAll();

        // Check to see if the browser supports the basic APIs Shaka needs.
        // This is an asynchronous check.
        shaka_.Player.support().then(function(support) {
            // This executes when the asynchronous check is complete.
            if (support.supported) {
            // Everything looks good!
            createShakaPlayer(asset);
            console.log('TV is supported!');
            } else {
            // This browser does not have the minimum set of APIs we need.
            console.error('Browser not supported!');
            }
        });
    }

    /*
    *   seek media source current time.
    */
    function onSeekTime_(val) {
        console.log('seektime: '+val);
        caphPlayer.timeId_ = null;
        caphPlayer.video.currentTime = val;
        caphPlayer.video.play();
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
    }

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
    }

    /*
    *   translate progress bar
    */
    function processTransform(line, value) {
        $(line).css({
            transform: 'translate3d(' + (value * PROCESS_BAR_MAX_WIDTH - PROCESS_BAR_MAX_WIDTH) + 'px, 0, 0)'
        });
    }

    /*
    *   prepare seek media source by timeout
    */
    function seekPlayTime(type, currentTime, playProcess) {

        caphPlayer.video.waiting;
        //1st update UI right way
        var seekValue = caphPlayer.video.currentTime;
        if(type === 'forward') { seekValue += SEEK_INTERVAL;}
        else{ seekValue -= SEEK_INTERVAL;}

        if(seekValue>caphPlayer.video.duration){seekValue=caphPlayer.video.duration;}
        else if(seekValue<0){seekValue=0;}

        currentTime.text(formatTime(seekValue));
        processTransform(playProcess, seekValue/caphPlayer.video.duration);

        // collect input evnets and seek.
        if(caphPlayer.timeId_ !== null) {clearTimeout(caphPlayer.timeId_);}
        caphPlayer.timeId_ = setTimeout(onSeekTime_(seekValue), 100);
    }

    /*
    *   save media source tracks
    */
    function saveMediaTracks(tarcks) {
        tarcks.forEach(function(item) {
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
                    console.log('unknow tracks type');
                    break;
            }
        });
    }

    /*
    *   update selected item UI
    */
    function updateSelectedItem(type, id) {
        $('.check').each(function() {
            if(!$(this).attr('id').indexOf(type)) {
                $(this).css({opacity:0});
            }
        });
        $('#'+type+'-'+id+'-'+'check').css({opacity:1});
    }

    /*
    *   get tracks from local save data.
    */
    function setTracks(type, key) {
        var trackVal;
        switch(type){
            case 'Subtitles':
                trackVal = caphPlayer.textTracks[key];
                break;
            case 'Quality':
                trackVal = caphPlayer.videoTracks[key];
                break;
            case 'Audio':
                trackVal = caphPlayer.audioTracks[key];
                break;
            default:
                return;
        }
        updateSelectedItem(type, key);
        trackVal ? caphPlayer.player.selectTrack(trackVal, true): null;
    }
    
    function playByIndex(index) {
        var timeStamp = Date.now();
        if((timeStamp-caphPlayer.playNextID) <= 1000) {
            caphPlayer.playNextID = Date.now();
            return;
        }
        caphPlayer.playNextID = Date.now();

        caphPlayer.preventKeyDown = true;
        $('.player-loader').show();
        caphPlayer.hideMenu();
        $('#initial-btn').addClass('fa-play').removeClass('fa-pause');

        //if(index === caphPlayer.currentIndex ||index<0 || index+1>caphPlayer.playlistLength) {return;}
        if(index === caphPlayer.currentIndex) {return;}

        else if(index<0) {
            index = caphPlayer.playlistLength-1;
        }
        else if(index+1>caphPlayer.playlistLength) {
            index = 0;
        }

        caphPlayer.player.destroy();
        caphPlayer.videoTracks = [];
        caphPlayer.textTracks = [];
        caphPlayer.audioTracks = [];

        createShakaPlayer(caphPlayer.playlist[index]);
        caphPlayer.initPlayerMenu();
        caphPlayer.currentIndex = index;
        
    }

    /*
    *   create player's UI template
    */
    var createUI = function(rootNode) {
        var root_ = rootNode;
        var playButton, subtitleButton;

        var loaderElement = $('<div/>', {
            class: 'player-loader',
        }).appendTo(root_);
        var loadIcon = loaderElement;
        $('<i/>', {
            class: 'fa fa-spinner fa-pulse fa-5x fa-fw'
        }).appendTo(loaderElement);

        /*
        *   tracks selected list caphPlayer.videoTracks
        */
        function createList(type, data) {
            caphPlayer.tracksList = $('<div/>', {
                id:type,
                class: 'track-list',
            }).appendTo(root_).hide();

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
            }

            for(var i in data) {
                createListItem(i, type);
            }
        }

        /*
        * selected menu
        */
        function createMenu() {
            $('.menu-bar').remove();
            $('#Subtitles').remove();
            $('#Quality').remove();
            $('#Audio').remove();

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
        }

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

        //show video resolution in real time
        /*var infoElement = $('<div/>', {
            class: 'infobars'
        }).appendTo(root_);*/

        function disableButton(btn) {
            $(btn).addClass('disable');
            !$.isEmptyObject(caphPlayer.textTracks) ? caphPlayer.player.setTextTrackVisibility(true): null;
        }
        function releaseButton(btn) {
            $(btn).removeClass('disable');
            caphPlayer.player.setTextTrackVisibility(false);
        }

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
                    playButton.addClass('fa-pause').removeClass('fa-play');
                },
                //Fires when the audio/video is playing after having been paused or stopped for buffering
                playing: function () {
                    caphPlayer.startTime = $(self)[0].currentTime;
                    console.log('video event [playing]');
                    //loaderElement.hide();
                },
                //Fires when the audio/video has been paused
                pause: function () {
                    playButton.addClass('fa-play').removeClass('fa-pause');
                    console.log('video event [pause]');
                },
                //Fires when the video stops because it needs to buffer the next frame
                waiting: function () {
                    loaderElement.show();
                    console.log('video event [waiting]');
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

                    if($.isEmptyObject(caphPlayer.textTracks)) {
                        disableButton(subtitleButton);
                    }

                },
                //Fires when the browser has loaded the current frame of the audio/video
                loadeddata: function () {
                    console.log('video event [loadeddata]');
                    loaderElement.hide();
                    caphPlayer.video.play();
                },
                //Fires when the current playback position has changed
                timeupdate : function (){
                    loaderElement.hide();
                    currentTime.text(formatTime(caphPlayer.isLive?($(self)[0].currentTime-caphPlayer.startTime):$(self)[0].currentTime));
                    //infoElement.text($(self)[0].videoWidth + ' x ' + $(self)[0].videoHeight);
                    processTransform(playProcess, $(self)[0].currentTime/$(self)[0].duration);
                    if($(self)[0].buffered.length>0) {
                        processTransform(loadProcess, ($(self)[0].buffered.end(0))/$(self)[0].duration);
                    }
                },
                //Fires when an error occurred during the loading of an audio/video
                error: function () {
                    console.log('video event [error]');
                    playButton.addClass('fa-play').removeClass('fa-pause');
                },
                //Fires when the current playlist is ended
                ended: function () {
                    console.log('******video event [ended]');
                    //playButton.toggleClass('fa-play' + ' ' + 'fa-pause');
                    playButton.addClass('fa-play').removeClass('fa-pause');
                    playByIndex(caphPlayer.currentIndex+1);
                }
            };
            events[event.type]();
        }).appendTo(root_);

        caphPlayer.hideSelectedList = function() {
            $('.menu-bar').hide();
            $('.track-list').hide();
            $.caph.focus.controllerProvider.getInstance().setDepth(0);
        };

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
        $('<div/>', {
            class : 'button fa fa-step-backward',
            focusable: ''
        }).on('selected', function() {
            playByIndex(caphPlayer.currentIndex-1);
        }).appendTo(buttonsArea);
        $('<div/>', {
            class : 'button fa fa-backward',
            focusable: ''
        }).on('selected', function() {
            loaderElement.show();
            seekPlayTime('backward',currentTime, playProcess);
        }).appendTo(buttonsArea);        
        playButton = $('<div/>', {
            id : 'initial-btn',
            class : 'button fa fa-play',
            focusable: ''
            //'data-focusable-initial-focus': true
        }).on('selected', function() {
            if(!caphPlayer.video) {return;}
            playButton.hasClass('fa-play')?caphPlayer.video.play():caphPlayer.video.pause();

            /*if(playButton.hasClass('fa-play')) {
                caphPlayer.video.play();
                playButton.addClass('fa-pause').removeClass('fa-play');
            }
            else {
                caphPlayer.video.pause();
                playButton.addClass('fa-play').removeClass('fa-pause');
            }*/
        }).appendTo(buttonsArea);
        $('<div/>', {
            class : 'button fa fa-forward',
            focusable: ''
        }).on('selected', function() {
            loaderElement.show();
            seekPlayTime('forward',currentTime, playProcess);
        }).appendTo(buttonsArea);
        $('<div/>', {
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
        $('<div/>', {
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
        subtitleButton = $('<div/>', {
            'data-focusable-depth':'0',
            class : 'button fa fa-cc',
            id: 'subtitle-btn',
            style: 'margin:0px 10px;float: right;',
            focusable: ''
        }).on('selected', function(){
            if($.isEmptyObject(caphPlayer.textTracks)) {return;}

            setTracks('text', 'en');
            caphPlayer.player.isTextTrackVisible()?releaseButton(this):disableButton(this);

        }).appendTo(settingbuttonsArea);

        /*
        *   show caph-list of playlist
        */
        var listTitle = $('<div>', {
            class: 'list-title'
        });//.appendTo(root_);
        $('<div>', {
            class:'title-index fa fa-list-ul',
            text : ' 1/'+caphPlayer.playlist.length
        }).appendTo(listTitle);
        $('<div>', {
            class:'title-name',
            text: caphPlayer.playlist[caphPlayer.currentIndex].name
        }).appendTo(listTitle);

        var listArea = $('<div>', {
            class: 'list-area'
        });//.appendTo(root_);
        $('<div>', {
            id:'list1',
            style:''
        }).appendTo(listArea);

        var itemTemplate = '<div id="<%=index%>" class="item" style="background:url(<%= item.post %>) center center no-repeat; background-size:cover;" focusable>'+
        '<div hide id="playlist-item-<%=index%>" class="statu-icon fa fa-play-circle-o" aria-hidden="true"></div>'+
        '</div>';
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

        /*
        *   error dialog
        */
        caphPlayer.errorDialog = $('<div/>', {
            class: 'caph-dialog'
        });//.appendTo(root_);
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
            clearTimeout(caphPlayer.menuHideID);
            barElement.show();
            listArea.show();
            listTitle.show();
            caphPlayer.menuHideID = setTimeout(function() {//setInterval
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
        };
        caphPlayer.hideMenu();

        caphPlayer.initPlayerMenu = function() {
            //caphPlayer.updatePlaylistStatus();
            loadIcon.show();
            releaseButton(subtitleButton);
            currentTime.text('00:00');
            durationTime.text('00:00');
            //infoElement.text('');
            processTransform(playProcess, 0);
            processTransform(loadProcess, 0);
            $.caph.focus.controllerProvider.getInstance().focus($('#initial-btn')[0]);
        };
    };

    $(document).on('keydown mouseover', function(event) {
        if(caphPlayer.preventKeyDown) {
            caphPlayer.preventKeyDown = false;
            return;
        }
        caphPlayer.showMenu();
        switch(event.keyCode) {
            case $.caph.focus.Constant.DEFAULT.KEY_MAP.RETURN:
            case $.caph.focus.Constant.DEFAULT.KEY_MAP.ESC:
                caphPlayer.hideSelectedList();
                break;
            default:
                break;
        }
    });

    /*
    *   create player
    */
    function createPlayer(data) {
        caphPlayer.videoTracks = [];
        caphPlayer.textTracks = [];
        caphPlayer.audioTracks = [];

        initApp(data);
    }

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

    $(document).ready(function() {
        $.caph.focus.controllerProvider.getInstance().focus($('#initial-btn')[0]);
        $.caph.focus.controllerProvider.setKeyMap({
            RETURN: 10009,
            ESC: 27,
            MEDIA_REWIND: 412,
            MEDIA_FORWARD: 417,
            MEDIA_PALY: 415,
            MEDIA_PAUSE: 19,
            MEDIA_STOP: 413,
            MEDIA_TRACK_PREVIOUS: 10232,
            MEDIA_TRACK_NEXT: 10233
        });
    });

})(jQuery);
