//for lookAt
function Camera(cvs){
    const eyeDistance = 75;

    var eye = vec3(0, 0, eyeDistance); //camera location as a vec4, for mouse rotation
    var at  = vec3(0.0, 0.0, 0.0);     //camera faces this location
    const up  = vec3(0.0, 1.0, 0.0);     //orientation of camera, where up is above the camera

    this.setCenter = function(x,y){
        eye = vec3(x,y,eyeDistance);
        at  = vec3(x,y,0);
    }

    this.getViewMatrix = function(){
        return lookAt(eye,at,up);
    }   
}