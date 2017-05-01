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
var lightAmbient = color.drkgry;
var lightDiffuse = color.white;
var lightSpecular = color.white;

var ambientColor, diffuseColor, specularColor;

var viewMatrix;
var modelViewMatrix, normalMatrix, projectionMatrix;

var glLocation = {};

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

//collision detection between players and bullets (not walls tho)
function playerBallCollisionDetection(){
    for(var i = 0; i < players.length; i++){        //for each player
        var player = players[i];
        for(var j = 0; j < players.length; j++){    //check each other player/team's bullets
            if(i != j){
                var otherBullets = players[j].bullets.bullets;
                for(var k = 0; k < otherBullets.length; k++){
                    var dx = player.base.x - otherBullets[k].x;
                    var dy = player.base.y - otherBullets[k].y;
                    var dr2 = dx * dx + dy * dy;
                    var r1 = player.base.radius;
                    var r2 = otherBullets[k].radius;
                    var rsq = (r1 + r2) * (r1 + r2);
                    if(rsq >= dr2){
                        players[i].lives--;
                        players[j].bullets.removeBulletById(k);
                        if(players[i].lives <= 0){
                            players.splice(i, 1);       //player hit!!! 
                        }
                    }
                }
            }
        }
    }
}


//players
var p1Controls = {
    left: 65,   //a
    right: 68,  //d
    up: 87,     //w
    down: 83,   //s
    cw: 81,     //q
    ccw: 69,    //e
    shoot: 32   //space
}
var p1 = new Player(-1, -1, -1, .2, color.blue, p1Controls);

var p2Controls = {
    left: 37,   //arrow keys (on numpad)
    right: 39,  
    up: 38,
    down: 12,   //clear (5 on numpad)
    cw: 36,     //home
    ccw: 33,    //pgup
    shoot: 40   //down arrow 
}
var p2 = new Player(1, 1, -2, .2, color.red, p2Controls);

var players = [];
players.push(p1);
// players.push(p2);
players.push(new NPC2(-40,  0,1,color.yellow));
players.push(new NPC1( 40,  0,2,color.brown));
players.push(new NPC3(  0,-40,3,color.black));
players.push(new NPC4(  0, 40,4,color.white));

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

    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    glLocation.ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    glLocation.diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    glLocation.specularProduct = gl.getUniformLocation(program, "specularProduct");
    glLocation.lightPosition = gl.getUniformLocation(program, "lightPosition");
    glLocation.shininess = gl.getUniformLocation(program, "shininess");

    glLocation.modelViewMatrix = gl.getUniformLocation( program, "modelViewMatrix" );
    glLocation.projectionMatrix = gl.getUniformLocation( program, "projectionMatrix" );
    glLocation.normalMatrix = gl.getUniformLocation( program, "normalMatrix" );

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

function setMaterialProperties(model){
    //lighting
    var ambientProduct = mult(lightAmbient, model.material.ambient);
    var diffuseProduct = mult(lightDiffuse, model.material.diffuse);
    var specularProduct = mult(lightSpecular, model.material.specular);
    var materialShininess = model.material.shininess;

    gl.uniform4fv(glLocation.ambientProduct, flatten(ambientProduct));
    gl.uniform4fv(glLocation.diffuseProduct, flatten(diffuseProduct));
    gl.uniform4fv(glLocation.specularProduct, flatten(specularProduct));
    gl.uniform4fv(glLocation.lightPosition, flatten(lightPosition));
    gl.uniform1f(glLocation.shininess, materialShininess);
}

function drawModel(model){
    var modelViewMatrix = mult(viewMatrix, model.modelMatrix);
    gl.uniformMatrix4fv(glLocation.modelViewMatrix, false, flatten(modelViewMatrix));

    // normal matrix only needed if there is nonuniform scaling   
    // it's here for generality but since there is
    // no scaling we could just use modelView matrix in shaders

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(glLocation.normalMatrix, false, flatten(normalMatrix));

    for(var i=0; i<index; i+=3){
        gl.drawArrays(gl.TRIANGLES, i, 3);
    }
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    playerBallCollisionDetection();
    
    projector.setCenter(players[0].base.x, players[0].base.y);
    //projector.setCenter((players[0].base.x + players[1].base.x)/2, (players[0].base.y + players[1].base.y)/2);
    projectionMatrix = projector.getProjectionMatrix();
    gl.uniformMatrix4fv(glLocation.projectionMatrix, false, flatten(projectionMatrix));

    viewMatrix = camera.getViewMatrix();

    //draw models for players
    players.forEach(function(player){
        player.input({keys: keys, x: players[0].base.x, y: players[0].base.y});
        player.move();

        var models = player.getModels();
        setMaterialProperties(models[0]);   //material properties assumed same for all objects for a player
        models.forEach(function(model){
            drawModel(model);
        });
    });
    

    window.requestAnimFrame(render);
}
