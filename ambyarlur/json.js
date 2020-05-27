$.getJSON('https://api.ipify.org?format=json', function(data){
    console.log(data.ip);
});
