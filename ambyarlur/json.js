$.getJSON("http://ipinfo.io",
        function(data) {
            $(".ip").html(data.ip);
        })
