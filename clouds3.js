// credit for all effects goes to:
// clouds - http://www.clicktorelease.com/blog/how-to-make-clouds-with-css-3d
// stars - http://www.mkrtchyan.zz.mu/#home [never got the modified twinkle working :(] 
// icons from glyphicons - http://glyphicons.com (via bootstrap)
// font - http://openfontlibrary.org/en/font/school-cursive

(function(){
        var lastTime=0;
        var vendors=['ms','moz','webkit','o'];
        for(var x=0;x<vendors.length&&!window.requestAnimationFrame;++x){
            window.requestAnimationFrame=window[vendors[x]+'RequestAnimationFrame'];
            window.cancelRequestAnimationFrame=window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if(!window.requestAnimationFrame)
            window.requestAnimationFrame=function(callback,element){
                var currTime=new Date().getTime();
                var timeToCall=Math.max(0,16-(currTime-lastTime));
                var id=window.setTimeout(function(){
                    callback(currTime+timeToCall);
                    },timeToCall);
                lastTime=currTime+timeToCall;
                return id;
            };
        if(!window.cancelAnimationFrame)
            window.cancelAnimationFrame=function(id){
                clearTimeout(id);
            };
}())

$( document ).ready(function() {
    var layers=[],
        objects=[],
        world=document.getElementById('world'),
        viewport=document.getElementById('viewport'),
        d=0,p=400,
        worldXAngle=0,worldYAngle=0;
        updateCount=0,
        updateCycle=100,
        updateSky=0,
        skies = ["dawn", "day", "pm", "sunset", "dusk", "night"];
        // skies = ["day", "dusk", "night"];

    // viewport.style.webkitPerspective=p;
    // viewport.style.MozPerspective=p;
    // viewport.style.oPerspective=p;
    nextSky();
    generate();
    update();

    var size = 1024;

    function createCloud(shouldStartOffscreen=false){
        var div=document.createElement('div');
        div.className='cloudBase';
        var x=screen.width*(3/4)*Math.random();
        var y=screen.height*(0.5)+(Math.random()*screen.height/8);
        var z=256-(Math.random()*0);
        var t='translateX( '+x+'px ) translateY( '+y+'px ) translateZ( '+z+'px )';
        jQuery.data( div, "offsets", 
            {
                x:x, 
                x_speed: Math.random()*1.2 + 0.2,
                y:y, 
                z:z
            });
        div.style.webkitTransform=t;
        div.style.MozTransform=t;
        div.style.oTransform=t;
        world.appendChild(div);
        for(var j=0;j<5+Math.round(Math.random()*10);j++){
            var cloud=document.createElement('img');
            cloud.style.opacity=0;
            var r=Math.random();
            var src='images/cloud_' +skies[updateSky] + '.png';
            // var src='images/2/cloud-' + Math.floor(Math.random()*47+1) + '.jpg';
            (function(img){
                img.addEventListener('load',function(){
                    img.style.opacity=.8;
            })})(cloud);
            cloud.setAttribute('src',src);
            cloud.className='cloudLayer';
            var x=256-(Math.random()*512);
            var y=256-(Math.random()*512);
            var z=100-(Math.random()*200);
            var a=Math.random()*360;
            var s=.25+Math.random();x*=.2;y*=.2;
            cloud.data={x:x,y:y,z:z,a:a,s:s,speed:.1*Math.random()};
            var t='translateX( '+x+'px ) translateY( '+y+'px ) translateZ( '+z+'px ) rotateZ( '+a+'deg ) scale( '+s+' )';
            cloud.style.webkitTransform=t;
            cloud.style.MozTransform=t;
            cloud.style.oTransform=t;
            div.appendChild(cloud);
            layers.push(cloud);
        }
        return div;
    }
    // window.addEventListener(,onContainerMouseWheel);
    window.addEventListener('click', nextSky);
    // window.addEventListener('mousemove', function(e){
    //     worldYAngle=-(.5-(e.clientX/window.innerWidth))*180;
    //     worldXAngle=(.5-(e.clientY/window.innerHeight))*180;
    //     updateView();
    // });

    function generate(){
        objects=[];
        if(world.hasChildNodes()){
            while(world.childNodes.length>=1){
                world.removeChild(world.firstChild);
            }
        }    
        var img=document.createElement('img');
        img.setAttribute('src', 'images/faces_night2.png');
        img.setAttribute('class', 'fg');
        world.appendChild(img);

        var tw = document.createElement('div');
        tw.id = "twinkling";
        world.appendChild(tw);

        for(var j=0;j<11;j++){
            objects.push(createCloud());
        }
    }

    function updateView(){
        // var t='translateZ( '+d+'px ) rotateX( '+worldXAngle+'deg) rotateY( '+worldYAngle+'deg)';
        var t='translateX( -20px )';
        for (var idx in world.childNodes){
            var base = world.childNodes[idx];
            // console.log(world.childNodes[idx]);
            if (base.hasOwnProperty('style')){
                world.childNodes[idx].style.webkitTransform=t;
                world.childNodes[idx].style.MozTransform=t;
                world.childNodes[idx].style.oTransform=t;
            }
        }
    }

    function updateCloudImg(cloud_layers){
        var src='images/cloud_' +skies[updateSky] + '.png';
        // console.log(cloud_layers);
        for(var j=0;j<cloud_layers.length;j++){
            var layer=cloud_layers[j];
            
            layer.setAttribute('src', src);
        }      
    }

    function nextSky(){
        var vp = $("#viewport");
        var vpo = $("#viewport-outer");
        
        var previousSky = updateSky;
        vpo.removeClass();
        updateSky += 1;
        if (updateSky>(skies.length-1))
            updateSky=0;
        vpo.addClass('viewport');
        vpo.addClass('zomg');
        vpo.addClass(skies[previousSky]);
        vpo.addClass('ontop')
        console.log(skies[updateSky]);

        setTimeout(function(){ 
            vpo.addClass('invis');
            vp.removeClass(skies[previousSky]);
            vp.addClass(skies[updateSky]);

            for (var idx in world.childNodes){
                if (idx=="0")
                    continue;
                
                var base = world.childNodes[idx];
                if (base === undefined)
                    continue;
                if ((!base.className == "cloudBase") || (base.childNodes === undefined))
                    continue;
                console.log(base.childNodes);
                updateCloudImg(base.childNodes);
            }
        }, 2500);

        

        var wrld = $("#world");
        var tw = $("#twinkling");
        wrld.removeClass("stars stars_less");
        tw.removeClass("twinkling");
        if ($.inArray(skies[updateSky], ["dawn","night","dusk"])>=0) {
            var star_class = (skies[updateSky]=="night")?"stars":"stars_less";
            if (skies[updateSky]=="night") {
                tw.addClass("twinkling")
                tw.addClass("night")
                star_class = "stars";
            }
            wrld.addClass(star_class);
        } else {
            wrld.removeClass("stars stars_less");
        }
    }

    // function onContainerMouseWheel(event){
    //     event=event?event:window.event;
    //     d=d-(event.detail?event.detail*-5:event.wheelDelta/8);
    //     updateView();
    // }
    function update(){
        //loop over cloudbases
        var removed = 0;
        for (var idx in world.childNodes){
            if (idx==0)
                continue;

            var base = world.childNodes[idx];
            var offsets = jQuery.data( base, "offsets" );

            if (base === undefined || offsets===undefined){
                continue;
            } 
            // else{
            //     console.log('base ok:' + offsets.x);
            // }
            
            if (offsets.x < -1*screen.width/2){
                base.remove();
                removed += 1;
            } else{
                offsets.x -= offsets.x_speed;
                var t='translateX( '+offsets.x+'px ) translateY( '+offsets.y+'px )';
                base.style.webkitTransform=t;
                base.style.MozTransform=t;
                base.style.oTransform=t;
                update_cloud(base.childNodes);
            }           
        }

        for(var j=0;j<removed;j++){
            objects.push(createCloud());
        }       

        // change bg
        updateCount +=1;
        // if (updateCount%updateCycle==0) {
        //     nextSky()
        // }

        setTimeout(function(){ requestAnimationFrame(update)}, 60);
    }

    function update_cloud(cloud_layers){
        for(var j=0;j<cloud_layers.length;j++){
            var layer=cloud_layers[j];
            layer.data.a+=layer.data.speed;
            // layer.data.x -= 0.8; 
            var t='translateX( '+layer.data.x+'px ) translateY( '+layer.data.y+'px ) translateZ( '+layer.data.z+'px ) rotateY( '+(-worldYAngle)+'deg ) rotateX( '+(-worldXAngle)+'deg ) rotateZ( '+layer.data.a+'deg ) scale( '+layer.data.s+')';
            layer.style.webkitTransform=t;
            layer.style.MozTransform=t;
            layer.style.oTransform=t;
        }
        // updateView();
       
    }
});