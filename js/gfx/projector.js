function Projector(cvs){
    const near = .1;     //plane where near = -z, to denote closest plane from objects
    const far = 100;   //plane where far = -z, to denote furthest plane from objects

    var aspectRatio = cvs.width/cvs.height;
    var fovy = 40.0;
    var fovMax = 100.0;
    var fovMin = 2;

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

    this.getProjectionMatrix = function(){
        return perspective(fovy, aspectRatio, near, far);
    }
}