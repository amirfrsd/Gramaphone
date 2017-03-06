    var charMap = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=';
    var decode = function(e){
        if (!e || e.length % 4 == 1) return !1;
        for (var t, i, a = 0, o = 0, r = ''; i = e.charAt(o++);null )
            i = charMap.indexOf(i),
            ~i && (t = a % 4 ? 64 * t + i : i, a++ % 4) && ( r += String.fromCharCode(255 & t >> ( - 2 * a & 6)) );
        return r
    };
    var decode2 = {
        v: function(e) {
            return e.split('').reverse().join('')
        },
        r: function(e, t) {
            e = e.split('');
            for (var i, a = charMap + charMap, o = e.length; o--;null) i = a.indexOf(e[o]), ~i && (e[o] = a.substr(i - t, 1));
            return e.join('')
        },
        x: function(e, t) {
            var n = [];
            return t = t.charCodeAt(0),
                $.each(e.split(''), function(e, i) {
                    n.push(String.fromCharCode(i.charCodeAt(0) ^ t))
                }),
                n.join('')
        }
    };

    var decodeSecret = function(secret){

        var t = secret.split('#'),
            n = decode(t[1]),
            t = decode(t[0]);

        n = n.split(String.fromCharCode(9));
        for (var a, r, s = n.length; s--; null ) {
            r = n[s].split(String.fromCharCode(11))
            a = r.splice(0, 1, t) [0]
            t = decode2[a].apply(null, r)
        }

        return getProxy(t);
    }

    var getProxy = function(url){
        url = url.split(/\/\/([^\.]+?)\.(vk.me|vk-cdn.net)\/(.*?)\.mp3/);

        return {
            'stream' : '/stream/'+url[1]+'/'+url[3]+'.mp3',
            'download' : '/download/'+url[1]+'/'+url[3]+'.mp3'
        }
    };

    var currentPlay ;

    function trim(myString){
        return myString.replace(/^\s+/g,'').replace(/\s+$/g,'')
    }

    function clickQuery(obj){
        $('#searchMusique').val(trim($(obj).text()));
        $("#searchMusiqueForm").submit();
        return false;
    }

    function vkAddPlaylist(where, obj){

        hasClass = obj.attr('class');
        idPlay = hasClass.replace(/p_(.*?) (.*)/, "p_$1");
        urlFlux = obj.find('.nameFlux a').attr('href');

        infoURL = urlFlux.replace(/\.mp3/, '.json');
        infoURL = infoURL.replace(STREAMDOMAINE, MAINDOMAINE);
        $.post(infoURL, function(data){

            playlist.add(where, {
                'title' : obj.find('.nameFlux a').html(),
                'artist' : obj.find('.artistFlux').html(),
                'cover' : data.cover.big,
                'cover_big' : data.cover.original,
                'url' : urlFlux,
                'download' : obj.find('.downSong a').attr('href'),
                'duration' : obj.find('.timeFlux').html(),
                'screen_1' : obj.find('.nameFlux a').html(),
                'screen_2' : obj.find('.artistFlux').html(),
                'idPlay' : idPlay
            });

        }, 'json');

	   return false;

    }

    $(function(){

        $('#searchMusique').removeClass('opensuggest');
        $('#suggestSection').fadeOut(200);

        $('#searchMusiqueForm').submit(function(){

            if( $("#suggestSection li a.active").length != 0 ){
                $('#searchMusique').val( $("#suggestSection li a.active").text() );
                $('#suggestSection').fadeOut(200);
            }

            valQuery = $('#searchMusique').val();
            $('#musiqueMenu').addClass('loading');

	        $('li[data-drop-page=musiques] a').attr('href', DIR+'musique/'+encodeURIComponent(valQuery));
            window.history.pushState('', $('head title').html(), DIR+'musique/'+encodeURIComponent(valQuery));
	        _gaq.push(['_trackPageview', DIR+'musique/'+encodeURIComponent(valQuery)]);

            $.post(DIR+'vk.php?', {'query' : valQuery}, function(data){
                $('#musiqueMenu').removeClass('loading');
                $("#resultatVK").html(data);
                console.log(data);
                $("[data-key]").each(function(){
                    var decode = decodeSecret($(this).attr('data-key'));
                    $(this).find('[data-download]').attr('href', decode.download);
                    $(this).find('[data-stream]').attr('href', decode.stream);
                });

            });

            return false;
        });

        $('#searchMusique').blur(function(){
            $('#suggestSection').fadeOut(200);
            $(this).removeClass('opensuggest');
        });

        $('#searchMusique').keyup(debounce(function(e){
            if(e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 27 ){
                varSearch = $(this).val();

                $.post(DIR+'suggest.php?q='+varSearch, function(data){
                    $('#suggestSection').html(data);
                    $("#suggestSection li a").hover(function(){
                        $("#suggestSection li a").removeClass('active');
                        $(this).addClass('active');
                    });
                });

                if($('#suggestSection').html() != ""){
                    $('#suggestSection').fadeIn(200);
                    $(this).addClass('opensuggest');
                }
            }
            // ESC
            if(e.keyCode == 27 || e.keyCode == 13){
                $("#suggestSection").fadeOut(200);
            }
            // Enter
            if(e.keyCode == 13){
                //window.location.href = $("#instantFocus ul a.active").attr('href');
            }
            // Haut
            if(e.keyCode == 38){

                if( $("#suggestSection li a.active").length == 0 ){
                    $("#suggestSection a.active").removeClass('active');
                    $('#suggestSection li:last-child a').addClass('active');
                }
                else{
                    if(!$('#suggestSection li:nth-child(2) a').hasClass('active')){
                        obj = $('#suggestSection a.active').parent().prev();

                        if(obj.hasClass('title')){
                            obj = obj.prev();
                        }

                        obj = obj.find('a');
                        $("#suggestSection a.active").removeClass('active');
                        obj.addClass('active');
                    }
                    else{
                        $("#suggestSection a.active").removeClass('active');
                    }
                }
            }
            // Bas
            if(e.keyCode == 40){

                if($("#suggestSection li a.active").length == 0){
                    $('#suggestSection li:nth-child(2) a').addClass('active');
                }
                else{
                    if(!$('#suggestSection li:last-child a').hasClass('active')){

                        obj = $('#suggestSection a.active').parent().next();

                        if(obj.hasClass('title')){
                            obj = obj.next();
                        }

                        console.log(obj.text());
                        obj = obj.find('a');
                        $("#suggestSection a.active").removeClass('active');
                        obj.addClass('active');
                    }
                    else{
                        $("#suggestSection a.active").removeClass('active');
                    }
                }
            }

        }, 200));

        $('#menuPrincipal').click(function(){
            $('#suggestSection').fadeOut(0);
        });

    });