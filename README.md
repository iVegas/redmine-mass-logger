# redmine-mass-logger

Inject the script by using the following script
```javascript
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)){ return; }
    js = d.createElement(s); js.id = id;
    js.onload = function(){
        // remote script has loaded
    };
    js.src = "//cdn.jsdelivr.net/gh/iVegas/redmine-mass-logger@main/log.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'redmine-mass-logger'));
```