function Projector(){
    var top;       //to be used for left/right/top/bottom
    const maxTop = 100;
    const minTop = 1;
    const near = 0;     //plane where near = -z, to denote closest plane from objects
    const far = 1000;   //plane where far = -z, to denote furthest plane from objects

    var center = {
        x: 0,
        y: 0
    }

    this.init = function(cvs){
        top = 10;
        cvs.addEventListener("mousewheel", zoom, false);
    }

    //zooming in and out via mouse wheel, as constrained by maxTop and minTop
    function zoom(e){
        if(e.wheelDelta < 0){
            top = Math.min(1.05 * top, maxTop);
        }
        else{
            top = Math.max(0.95 * top, minTop);
        }
        e.preventDefault();
    }

    this.setCenter = function(x, y){
        center.x = x;
        center.y = y
    }

    this.getProjectionMatrix = function(){
        return ortho(-top + center.x, top + center.x, -top + center.y, top + center.y, near, far);
    }
}