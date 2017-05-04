"use strict";

var canvas;
var gl;
var program;

var numTimesToSubdivide = 3;

var index = 0;

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var texture;

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

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

var viewMatrix;
var modelViewMatrix, normalMatrix, projectionMatrix;

var glLocation = {};

var projector, camera;
var text, textContext;
var fps = new FPS();

var gameOver = false;
var floor = new Floor();
var spawner = new Spawner();

//reference for jquery mouse movement
//http://stackoverflow.com/questions/7298507/move-element-with-keypress-multiple
var keys = {};
var score = 0;

function configureTexture(image){
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function triangle(a, b, c){
     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);

    // normals are vectors
     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);

     texCoordsArray.push(texCoord[0]);
     texCoordsArray.push(texCoord[1]);
     texCoordsArray.push(texCoord[2]);

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
                            if(!gameOver){
                                score++;
                            }
                            
                            setTimeout(function(){
                                players.push(spawner.getNPC());
                            }, 1000);
                            
                            return;
                        }
                    }
                }
            }
        }
    }
}

function dbListenerSetup(player){
        player.dbRef.on('value', function(snapshot){
            var p = snapshot.val();
            player.base.x = p.x;
            player.base.y = p.y;
            player.turret.setAngle(p.turretAngle);
        });
    }

//players
var p1Controls = {
    left: 65,   //a
    right: 68,  //d
    up: 87,     //w
    down: 83,   //s
    cw: 37,     //left
    ccw: 39,    //right
    shoot: 32   //space
}
var p1 = new Player(-1, -1, 1, .2, color.blue, p1Controls);

// var p2Controls = {
//     left: 37,   //arrow keys (on numpad)
//     right: 39,  
//     up: 38,
//     down: 12,   //clear (5 on numpad)
//     cw: 36,     //home
//     ccw: 33,    //pgup
//     shoot: 40   //down arrow 
// }
// var p2 = new Player(1, 1, 2, .2, color.red, p2Controls);

var projectorControls = {
    zoomIn:  38,//up   arrow
    zoomOut: 40 //down arrow
}

var players = [];
players.push(p1);
dbListenerSetup(p1);
// players.push(p2);

players.push(spawner.getNPC());
players.push(spawner.getNPC());
players.push(spawner.getNPC());

window.onload = function init() {
    //text canvas setup
    var textCanvas = document.getElementById("text");
    textCanvas.width  = window.innerWidth;
    textCanvas.height = window.innerHeight;
    textContext = textCanvas.getContext("2d");
    text = new Text(textContext);

    //webgl canvas setup
    canvas = document.getElementById("gl-canvas");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;    

    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(color.ltblue[0], color.ltblue[1], color.ltblue[2], color.ltblue[3]);

    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
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

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    var image = document.getElementById("texImage");        //configure texture
    configureTexture( image );

    glLocation.ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    glLocation.diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    glLocation.specularProduct = gl.getUniformLocation(program, "specularProduct");
    glLocation.lightPosition = gl.getUniformLocation(program, "lightPosition");
    glLocation.shininess = gl.getUniformLocation(program, "shininess");
    glLocation.shininess2 = gl.getUniformLocation(program, "shininess2");

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
    projector = new Projector(textCanvas, projectorControls);
    camera = new Camera(textCanvas);

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
    textContext.clearRect(0, 0, textContext.canvas.width, textContext.canvas.height);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    textContext.clearRect(0, 0, textContext.canvas.width, textContext.canvas.height);
    text.drawMiddleBottom("WASD to move, LEFT and RIGHT to rotate turret, SPACE to shoot, mouse scroll or UP and DOWN to zoom");

    projector.input(keys);
    //Player only actions (center camera, print game over)
    if(players[0].id == 1){
       camera.setCenter(players[0].base.x, players[0].base.y);
       text.drawMiddleTop("lives: " + players[0].lives + "        score: " + score*100);
    }
    else{
        gameOver = true;
        text.drawMiddleMiddle("GAME OVER!");
        text.drawMiddleTop("lives: " + 0 + "        score: " + score*100);
    }
    
    text.drawLeftTop("fps: " + fps.get());

    playerBallCollisionDetection();    //collision detection

    //setup matrices which will stay the same throughout one render frame
    projectionMatrix = projector.getProjectionMatrix();
    gl.uniformMatrix4fv(glLocation.projectionMatrix, false, flatten(projectionMatrix));

    viewMatrix = camera.getViewMatrix();

    //draw floor model
    var floorModel = floor.getModel();
    gl.uniform1f(glLocation.shininess2, 2.0);
    setMaterialProperties(floorModel);
    drawModel(floorModel);

    //move and draw players
    gl.uniform1f(glLocation.shininess2, 1.0);
    players.forEach(function(player){
        player.input({keys: keys, x: players[0].base.x, y: players[0].base.y});
        player.move();

        var models = player.getModels();
        setMaterialProperties(models[0]);   //material properties assumed same for all objects for a player
        models.forEach(function(model){
            drawModel(model);
        });
    });
    //check fps
    fps.update();

    window.requestAnimFrame(render);
}
