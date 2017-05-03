//for lookAt
function Camera(){
    var eye = vec3(0, 0, 10);         //camera location as a vec4, for mouse rotation
    var at  = vec3(0.0, 0.0, 0.0);     //camera faces this location
    var up  = vec3(0.0, 1.0, 0.0);     //orientation of camera, where up is above the camera

    var trackingMouse = false;
    var oldX, oldY;
    var theta = [0,0,0];

    this.init = function(cvs){
        cvs.addEventListener("mousedown", beginTrackingMouse, false);
        cvs.addEventListener("mouseup", stopTrackingMouse, false);
        cvs.addEventListener("mouseout", stopTrackingMouse, false);
        cvs.addEventListener("mousemove", mouseMove, false);
    }

    function beginTrackingMouse(e){
        trackingMouse = true;
        oldX = e.pageX;
        oldY = e.pageY;
        e.preventDefault(); //Prevents being highlighted when double-clicked on desktop, scrolling on mobile
    }

    function stopTrackingMouse(e){
        trackingMouse = false;
    }

    function mouseMove(e){
        if(!trackingMouse){return;}

        var dx = e.pageX - oldX;
        var dy = e.pageY - oldY;

        setCameraAngle(180 * dx/canvas.width, 180 * dy/canvas.height);
        oldX = e.pageX;
        oldY = e.pageY;
    }

    function setCameraAngle(dx, dy){
        var dir = [-1, -1];
        if(theta[0] > 90 && theta[0] < 270){
            dir[1] = 1;
        }

        theta[0] = (theta[0] - (dir[0] * dy)) % 360;    //rotate about x axis to have y move
        theta[1] = (theta[1] - (dir[1] * dx)) % 360;    //rotate about y axis to have x move
    }

    this.getViewMatrix = function(){
        var rotationMatrix = mult(rotateX(theta[0]), rotateY(theta[1]));    //to move camera to view of camera
        return mult(lookAt(eye, at, up), rotationMatrix);
    }   
}