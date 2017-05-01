"use strict";

var canvas;
var gl;

var numTimesToSubdivide = 3;

var index = 0;

var pointsArray = [];
var normalsArray = [];

//initial tetrahedron locations
var va = vec4(0.0, 0.0, -1, 1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

//point light source components
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

//sphere material properties
var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 20.0;

var ambientColor, diffuseColor, specularColor;

var viewMatrix;
var modelViewMatrix, normalMatrix, projectionMatrix;
var modelViewMatrixLoc, normalMatrixLoc, projectionMatrixLoc;

//reference for jquery mouse movement
//http://stackoverflow.com/questions/7298507/move-element-with-keypress-multiple
var keys = {};

function triangle(a, b, c){

     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

    // normals are vectors
     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);

     index += 3;
}


function divideTriangle(a, b, c, count){
    if(count > 0){

        var ab = mix(a, b, 0.5);
        var ac = mix(a, c, 0.5);
        var bc = mix(b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
    }
    else{
        triangle(a, b, c);
    }
}

function tetrahedron(a, b, c, d, n){
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
}

function Projector(){
    var top = 10;       //to be used for left/right/top/bottom
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

function Camera(){
    //lookAt() Parameters
    var eye = vec3(0, 0, 10);         //camera location as a vec4, for mouse rotation
    var at = vec3(0.0, 0.0, 0.0);     //camera faces this location
    var up = vec3(0.0, 1.0, 0.0);     //orientation of camera, where up is above the camera

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

var p1Controls = {
    left: 65,   //a
    right: 68,  //d
    up: 87,     //w
    down: 83,   //s
    cw: 81,     //q
    ccw: 69,    //e
    shoot: 32   //space
}
var p1 = new Player(-1, -1, -1, .1, p1Controls);

var p2Controls = {
    left: 37,   //arrow keys (on numpad)
    right: 39,  
    up: 38,
    down: 12,   //clear (5 on numpad)
    cw: 36,     //home
    ccw: 33,    //pgup
    shoot: 40   //down arrow 
}
var p2 = new Player(1, 1, -2, .1, p2Controls);

var players = [];
players.push(p1);
players.push(p2);

var projector = new Projector();
var camera = new Camera();

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);


    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    //keys setup
    $(document).keydown(function(e) {
        keys[e.keyCode] = true;
    });

    $(document).keyup(function(e) {
        delete keys[e.keyCode];
    });

    //objects setup
    projector.init(canvas);
    camera.init(canvas);

    render();
}

function drawModel(modelMatrix){
    var modelViewMatrix = mult(viewMatrix, modelMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    // normal matrix only needed if there is nonuniform scaling   
    // it's here for generality but since there is
    // no scaling we could just use modelView matrix in shaders

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix));

    for(var i=0; i<index; i+=3){
        gl.drawArrays(gl.TRIANGLES, i, 3);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    projector.setCenter((players[0].base.x + players[1].base.x)/2, (players[0].base.y + players[1].base.y)/2);
    projectionMatrix = projector.getProjectionMatrix();
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    viewMatrix = camera.getViewMatrix();

    //draw models for players
    players.forEach(function(player){
        player.input(keys);
        player.move();

        var modelMatrices = player.getModelMatrices();
        modelMatrices.forEach(function(model){
            drawModel(model.modelMatrix);
        });
    });
    

    window.requestAnimFrame(render);
}
