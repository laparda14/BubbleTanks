function Projector(cvs, keyMap){
    const near = .1;     //plane where near = -z, to denote closest plane from objects
    const far = 100;   //plane where far = -z, to denote furthest plane from objects

    var aspectRatio = cvs.width/cvs.height;
    var fovy = 40.0;
    var fovMax = 100.0;
    var fovMin = 2;

    this.keyMap = keyMap;

    cvs.addEventListener("mousewheel", zoom, false);

    //zooming in and out via mouse wheel, as constrained by maxTop and minTop
    function zoom(e){
        if(e.wheelDelta < 0){
            fovy = Math.min(1.05 * fovy, fovMax);
        }
        else{
            fovy = Math.max(0.95 * fovy, fovMin);
        }
        e.preventDefault();
    }

    this.input = function(keys){
        //check Pressed keys
        for (var key in keys) {
            if (!keys.hasOwnProperty(key)) continue;
            if (key == this.keyMap.zoomOut){
                console.log("out");
                fovy = Math.min(1.02 * fovy, fovMax);
            }
            if (key == this.keyMap.zoomIn){
                console.log("in");
                fovy = Math.max(0.98 * fovy, fovMin);
            }
        }
    }

    this.getProjectionMatrix = function(){
        return perspective(fovy, aspectRatio, near, far);
    }
}