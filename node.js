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
                e.split(''), function(e, i) {
                    n.push(String.fromCharCode(i.charCodeAt(0) ^ t))
                },
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
    console.log(decodeSecret('qtC5sOzlEvPvnhffBw5nww0WB2ziAOTAtxeXwgf1mvnzEK1irZDhsgXyutDHx2XJrdzpne94EMDVvxHkBwCWuJfutgmOtZnHotDfufzQCdrpnxb0sNH2BhHbtffUvO5ut2LPowjMmM5dvJnmA28ZDLaTlwe4r1fiyw1dnu9Ayu52AOH3AdnJrK1ymO4TB3bKq289yxjOEgu/m3bTlJbLntGZndmYngzKztbKlZLWl3rLBI5UzgmTA3yUnhyWncOXC2mVlZPZChrOAa#DG'));
/* */