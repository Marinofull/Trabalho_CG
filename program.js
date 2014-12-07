var gl;
var shaderBaseImage	= null;
var shaderAxisCube	= null;
var axis 			= null;
var cube 			= null;
var pyramid			= null;
var baseTexture		= null;

var idCube =  2,//Id do marker que gera o cubo
	idPyramid = 4,//Id do marker que gera a pirâmide
	idIntaraction = 3;//Id do marker que dispara a interação

var interaction = false;	//responsaveis pela interação
var interactionMax = 2.0,
	interactionMin = -2.0,
	interactionStage = true;
var interactionCoefficient = 0.0;
// var audio = new Audio('audio.mp3');
// var played= false;

var video, 
	videoImage, 
	videoImageContext, 
	videoTexture;

var imageData, 
	detector, 
	posit;

var modelSize 	= 10.0; //millimeters

var rotMat 		= new Matrix4();
var transMat 	= new Matrix4();
var scaleMat 	= new Matrix4();


var yaw 		= 0.0,
	pitch 		= 0.0,
	roll		= 0.0;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

// ********************************************************
// ********************************************************
function gotStream(stream)  {
	if (window.URL) {   
		video.src = window.URL.createObjectURL(stream);   } 
	else {   
		video.src = stream;   
		}

	video.onerror = function(e) {   
							stream.stop();   
							};
	stream.onended = noStream;
}

// ********************************************************
// ********************************************************
function noStream(e) {
	var msg = "No camera available.";
	
	if (e.code == 1) {   
		msg = "User denied access to use camera.";   
		}
	document.getElementById("output").textContent = msg;
}

// ********************************************************
// ********************************************************
function initGL(canvas) {
	
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return (null);
		}
	
	gl.viewportWidth 	= canvas.width;
	gl.viewportHeight 	= canvas.height;
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// gl.enable(gl.DEPTH_TEST);
	return gl;
}

// ********************************************************
// ********************************************************
function initBaseImage() {
	
	var baseImage = new Object(); 
	var vPos = new Array;
	var vTex = new Array;

	vPos.push(-1.0); 	// V0
	vPos.push(-1.0);
	vPos.push( 0.0);
	vPos.push( 1.0);	// V1
	vPos.push(-1.0);
	vPos.push( 0.0);
	vPos.push( 1.0);	// V2
	vPos.push( 1.0);
	vPos.push( 0.0);
	vPos.push(-1.0); 	// V0
	vPos.push(-1.0);
	vPos.push( 0.0);
	vPos.push( 1.0);	// V2
	vPos.push( 1.0);
	vPos.push( 0.0);
	vPos.push(-1.0);	// V3
	vPos.push( 1.0);
	vPos.push( 0.0);
			
	vTex.push( 0.0); 	// V0
	vTex.push( 0.0);
	vTex.push( 1.0);	// V1
	vTex.push( 0.0);
	vTex.push( 1.0);	// V2
	vTex.push( 1.0);
	vTex.push( 0.0); 	// V0
	vTex.push( 0.0);
	vTex.push( 1.0);	// V2
	vTex.push( 1.0);
	vTex.push( 0.0);	// V3
	vTex.push( 1.0);
		
	baseImage.vertexBuffer = gl.createBuffer();
	if (baseImage.vertexBuffer) {		
		gl.bindBuffer(gl.ARRAY_BUFFER, baseImage.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vPos), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create vertexBuffer");
	
	baseImage.textureBuffer = gl.createBuffer();
	if (baseImage.textureBuffer) {		
		gl.bindBuffer(gl.ARRAY_BUFFER, baseImage.textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTex), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create textureBuffer");

	baseImage.numItems = vPos.length/3.0;
	
	return baseImage;
}


// ********************************************************
// ********************************************************

function initAxisVertexBuffer(markers) {

	var axis	= new Object(); // Utilize Object object to return multiple buffer objects
	var vPos 	= new Array;
	var vColor 	= new Array;

	// X Axis
	// V0
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	// V1
	vPos.push(1.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);

	// Y Axis
	// V0
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(1.0);
	// V2
	vPos.push(0.0);
	vPos.push(1.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(1.0);

	// Z Axis
	// V0
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(1.0);
	// V3
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(1.0);
	
	axis.vertexBuffer = gl.createBuffer();
	if (axis.vertexBuffer) {		
		gl.bindBuffer(gl.ARRAY_BUFFER, axis.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vPos), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create vertexBuffer");
	
	axis.colorBuffer = gl.createBuffer();
	if (axis.colorBuffer) {		
		gl.bindBuffer(gl.ARRAY_BUFFER, axis.colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vColor), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create colorBuffer");

	axis.numItems = vPos.length/3.0;
	
	return axis;
}

// ********************************************************
// ********************************************************
function drawTextQuad(o, shaderProgram, MVPMat) {
	
    try {
    	gl.useProgram(shaderProgram);
		}
	catch(err){
        alert(err);
        console.error(err.description);
    	}
    	
 	gl.uniformMatrix4fv(shaderProgram.uMVPMat, false, MVPMat.elements);
   	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, videoImage);
	videoTexture.needsUpdate = false;	
	gl.uniform1i(shaderProgram.SamplerUniform, 0);
		
	if (o.vertexBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, o.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vPositionAttr, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vPositionAttr);  
		}
	else {
		alert("o.vertexBuffer == null");
		return;
		}

	if (o.textureBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, o.textureBuffer);
		gl.vertexAttribPointer(shaderProgram.vTexAttr, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vTexAttr);
		}
	else {
		alert("o.textureBuffer == null");
  		return;
		}
   	
	gl.drawArrays(gl.TRIANGLES, 0, o.numItems);
}


// ********************************************************
// ********************************************************
function drawAxis(o, shaderProgram, MVPMat) {

    try {
    	gl.useProgram(shaderProgram);
		}
	catch(err){
        alert(err);
        console.error(err.description);
    	}
    	
 	gl.uniformMatrix4fv(shaderProgram.uMVPMat, false, MVPMat.elements);
   	
	if (o.vertexBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, o.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vPositionAttr, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vPositionAttr);  
		}
	else {
		alert("o.vertexBuffer == null");
		return;
		}

	if (o.colorBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, o.colorBuffer);
		gl.vertexAttribPointer(shaderProgram.vColorAttr, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vColorAttr);
		}
	else {
		alert("o.colorBuffer == null");
  		// return;
		}

	gl.drawArrays(gl.LINES, 0, o.numItems);
}

// ********************************************************
// ********************************************************
function drawScene(markers) {
	
var modelMat  = new Matrix4();
var modelMatT = new Matrix4();
var ViewMat = new Matrix4();
var ViewMatT = new Matrix4();
var ProjMat = new Matrix4();
var MVPMat 	= new Matrix4();
var MVPMatT	= new Matrix4();


	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	if (!videoTexture.needsUpdate) 
		return;
	
	modelMat.setIdentity();
	ViewMat.setIdentity();
	ProjMat.setIdentity();
	ProjMat.setOrtho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
	
	MVPMat.setIdentity();
    MVPMat.multiply(ProjMat);
    MVPMat.multiply(ViewMat);
    MVPMat.multiply(modelMat);
		
	drawTextQuad(baseTexture, shaderBaseImage, MVPMat);
	
	updateScenes(markers);
   		
    ViewMat.setLookAt(	0.0, 0.0, 0.0,
    					0.0, 0.0, -1.0,
    					0.0, 1.0, 0.0 );
    
	ProjMat.setPerspective(40.0, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	
	modelMat.setIdentity();
	modelMat.multiply(transMat);
	modelMat.multiply(rotMat);
	modelMat.multiply(scaleMat);
	
	MVPMat.setIdentity();
    MVPMat.multiply(ProjMat);
    MVPMat.multiply(ViewMat);
    MVPMat.multiply(modelMat);
	
	modelMatT.setIdentity();
	modelMatT.multiply(transMat);
	modelMatT.multiply(rotMat);
	modelMatT.multiply(scaleMat);

	//Tenta fazer a interação se o marcador for encontrado
	modelMatT.set(doInteraction(modelMatT));

	MVPMatT.setIdentity();
    MVPMatT.multiply(ProjMat);
    MVPMatT.multiply(ViewMatT);
    MVPMatT.multiply(modelMatT);

    //Verifica se os marcadores estão presentes para fazer o desenho
	if( cube.found ){
		drawAxis(axis, shaderAxisCube, MVPMat);
		drawCube(cube, shaderModelCube, MVPMat);
	}
	if( pyramid.found ){
		drawAxis(axis, shaderAxisPyramid, MVPMatT);
		drawPyramid(pyramid, shaderModelPyramid, MVPMatT);
	}
}

// ********************************************************
// ********************************************************
function initTexture() {

	videoTexture = gl.createTexture();		
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	videoTexture.needsUpdate = false;
}

// ********************************************************
// ********************************************************
function webGLStart() {

	if (!navigator.getUserMedia) {
		document.getElementById("output").innerHTML = 
			"Sorry. <code>navigator.getUserMedia()</code> is not available.";
		}
	navigator.getUserMedia({video: true}, gotStream, noStream);

	// assign variables to HTML elements
	video = document.getElementById("monitor");
	videoImage = document.getElementById("videoImage");
	videoImageContext = videoImage.getContext("2d");
	
	// background color if no video present
	videoImageContext.fillStyle = "#005337";
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );
	
	
	canvas = document.getElementById("videoGL");
	gl = initGL(canvas);
	
	if (!gl) { 
		alert("Could not initialise WebGL, sorry :-(");
		return;
		}
		
	shaderBaseImage = initShaders("baseImage", gl);
	if (shaderBaseImage == null) {
		alert("Erro na inicilizacao do shaderBaseImage!!");
		return;
		}

	shaderBaseImage.vPositionAttr 	= gl.getAttribLocation(shaderBaseImage, "aVertexPosition");
	shaderBaseImage.vTexAttr 		= gl.getAttribLocation(shaderBaseImage, "aVertexTexture");
	shaderBaseImage.uMVPMat 		= gl.getUniformLocation(shaderBaseImage, "uMVPMat");
	shaderBaseImage.SamplerUniform	= gl.getUniformLocation(shaderBaseImage, "uSampler");

	if ( 	(shaderBaseImage.vertexPositionAttribute < 0) 	||
			(shaderBaseImage.vertexTextAttribute < 0) 		||
			(shaderBaseImage.SamplerUniform < 0) 			||
			!shaderBaseImage.uMVPMat ) {
		alert("shaderBaseImage attribute ou uniform nao localizado!");
		return;
		}
		
	baseTexture = initBaseImage();
	if (!baseTexture) {
		console.log('Failed to set the baseTexture vertex information');
		return;
		}
	initTexture();
	
	//starts to initialize the Cube's shaders
	shaderAxisCube 					= initShaders("AxisCube", gl);	
	shaderAxisCube.vPositionAttr 	= gl.getAttribLocation(shaderAxisCube, "aVertexPosition");		
	shaderAxisCube.vColorAttr		= gl.getAttribLocation(shaderAxisCube, "aVertexColor");
	shaderAxisCube.uMVPMat 			= gl.getUniformLocation(shaderAxisCube, "uMVPMat");
	
	if (	shaderAxisCube.vPositionAttr < 0 	|| 
			shaderAxisCube.vColorAttr < 0 		|| 
			!shaderAxisCube.uMVPMat	) {
		console.log("Error getAttribLocation shaderAxisCube"); 
		return;
		}

	shaderModelCube 					= initShaders("modelCube", gl);	
	shaderModelCube.vPositionAttr 		= gl.getAttribLocation(shaderModelCube, "aVertexPosition");	
	shaderModelCube.uMVPMat 			= gl.getUniformLocation(shaderModelCube, "uMVPMat");

	if ( shaderModelCube.vPositionAttr < 0 	|| 
			!shaderModelCube.uMVPMat	) {
		console.log("Error getAttribLocation shaderModelCube"); 
		return;
		}

	//starts to initialize the Pyramid's shaders
	shaderAxisPyramid 					= initShaders("AxisPyramid", gl);	
	shaderAxisPyramid.vPositionAttr 	= gl.getAttribLocation(shaderAxisPyramid, "aVertexPosition");		
	shaderAxisPyramid.vColorAttr		= gl.getAttribLocation(shaderAxisPyramid, "aVertexColor");
	shaderAxisPyramid.uMVPMat 			= gl.getUniformLocation(shaderAxisPyramid, "uMVPMat");
	
	if (	shaderAxisPyramid.vPositionAttr < 0 	|| 
			shaderAxisPyramid.vColorAttr < 0 		|| 
			!shaderAxisPyramid.uMVPMat	) {
		console.log("Error getAttribLocation shaderAxisPyramid"); 
		return;
		}

	shaderModelPyramid 					= initShaders("modelPyramid", gl);	
	shaderModelPyramid.vPositionAttr 		= gl.getAttribLocation(shaderModelPyramid, "aVertexPosition");	
	shaderModelPyramid.uMVPMat 			= gl.getUniformLocation(shaderModelPyramid, "uMVPMat");

	if ( shaderModelPyramid.vPositionAttr < 0 	|| 
			!shaderModelPyramid.uMVPMat	) {
		console.log("Error getAttribLocation shaderModelPyramid"); 
		return;
		}
		
	axis = initAxisVertexBuffer();
	if (!axis) {
		console.log('Failed to set the AXIS vertex information');
		return;
		}

	//Inicia o cubo
	cube = initCube(gl);
	cube.found = false;
	if (!cube) {
		console.log('Failed to set the information');
		return;
		}

	//Inicia a Piramide
	pyramid = initTriangle(gl);
	pyramid.found = false;
	if (!pyramid) {
		console.log('Failed to set the information');
		return;
		}	
		
	detector 	= new AR.Detector();
	posit 		= new POS.Posit(modelSize, canvas.width);

	rotMat.setIdentity();
	transMat.setIdentity();
	animate();
}

// ********************************************************
// ********************************************************
function animate() {
    requestAnimationFrame( animate );
	render();		
}

// ********************************************************
// ********************************************************
function render() {	
	
	if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
		videoImageContext.drawImage( video, 0, 0, videoImage.width, videoImage.height );
		videoTexture.needsUpdate = true;
		imageData = videoImageContext.getImageData(0, 0, videoImage.width, videoImage.height);
		
        var markers = detector.detect(imageData);
 	
        drawCorners(markers);
	
        drawScene(markers);
		}
}

// ********************************************************
// ********************************************************
function drawCorners(markers){
  var corners, corner, i, j;

  videoImageContext.lineWidth = 3;

  for (i = 0; i < markers.length; ++ i){
	corners = markers[i].corners;
	
	videoImageContext.strokeStyle = "red";
	videoImageContext.beginPath();
	
	for (j = 0; j < corners.length; ++ j){
	  corner = corners[j];
	  videoImageContext.moveTo(corner.x, corner.y);
	  corner = corners[(j + 1) % corners.length];
	  videoImageContext.lineTo(corner.x, corner.y);
	}

	videoImageContext.stroke();
	videoImageContext.closePath();
	
	videoImageContext.strokeStyle = "green";
	videoImageContext.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  }
};

// ********************************************************
// ********************************************************
function updateScenes(markers){
  var corners, corner, pose, i, j;
  
   	
   	cube.found = false;
   	pyramid.found = false;
   	interaction = false;
	if (markers.length > 0) {

		corners = markers[0].corners;
		
		for (i = 0; i < corners.length; ++ i) {
			corner = corners[i];
			
			corner.x = corner.x - (canvas.width / 2);
			corner.y = (canvas.height / 2) - corner.y;
			}
		//procura o marcador referente ao obj
		for(var j = 0;j < markers.length;j++){
			//console.log(" meu id eh: " + markers[j].id);
			if(markers[j].id == idCube)
				cube.found = true;		
			if(markers[j].id == idPyramid)
				pyramid.found = true;
			if(markers[j].id == idIntaraction){
				interaction = true;
			}
		}
		
		pose = posit.pose(corners);
		
		yaw 	= Math.atan2(pose.bestRotation[0][2], pose.bestRotation[2][2]) * 180.0/Math.PI;
		pitch 	= -Math.asin(-pose.bestRotation[1][2]) * 180.0/Math.PI;
		roll 	= Math.atan2(pose.bestRotation[1][0], pose.bestRotation[1][1]) * 180.0/Math.PI;
		
		rotMat.setIdentity();
		rotMat.rotate(yaw, 0.0, 1.0, 0.0);
		rotMat.rotate(pitch, 1.0, 0.0, 0.0);
		rotMat.rotate(roll, 0.0, 0.0, 1.0);
		
		transMat.setIdentity();
		transMat.translate(pose.bestTranslation[0], pose.bestTranslation[1], -pose.bestTranslation[2]);
		scaleMat.setIdentity();
		scaleMat.scale(8, 8, 8);
		
		console.log("pose.bestError = " + pose.bestError);
		console.log("pose.alternativeError = " + pose.alternativeError);}
	else {
		transMat.setIdentity();
		rotMat.setIdentity();
		scaleMat.setIdentity();
		yaw 	= 0.0;
		pitch 	= 0.0;
		roll 	= 0.0;
		}
};

// ********************************************************
// *doInteraction(o) tenta interagir os modelos************
// *obtem sucesso quando o terceiro marcador está presente*
// ********************************************************
function doInteraction(o){
	if(!interaction)
	{
		pyramid.adj = false
		if(cube.found & pyramid.found)
			pyramid.adj = true
		if(pyramid.adj === true)
			o.translate(0,-2,0);
	}

    //Interação ;P
    if(interaction & pyramid.found & cube.found){
	    if(interactionStage){
	    	interactionCoefficient+= 0.2;
	    	if(interactionCoefficient > interactionMax){
	    		interactionStage = false;
	    	}
	    }
	    else{
	    	interactionCoefficient-= 0.2;
	    	if(interactionCoefficient < interactionMin){
	    		interactionStage = true;
	    	}
	    }
	    o.translate(0,interactionCoefficient,0);
	}

	return o
}
