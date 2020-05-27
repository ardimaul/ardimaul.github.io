$.getJSON("https://api.ipify.org?format=json&callback=?", function(data) {
$(".ip").html(data.ip);
})
