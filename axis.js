var gl;
var shaderBaseImage	= null;
var shaderAxis		= null;
var axis 			= null;
var baseTexture		= null;

var video, 
	videoImage, 
	videoImageContext, 
	videoTexture;

var imageData, 
	detector, 
	posit;

var modelShader = null;
var model 		= new Array;
var modelSize 	= 90.0; //millimeters
var scale 		= 1.0;
var rotate		= 0;
var perspective	= new Matrix4();
var transX		= 1.0;
var transY 		= 1.0;
var transZ		= 1.0;

var g_objDoc 		= null;	// The information of OBJ file
var g_drawingInfo 	= null;	// The information for drawing 3D model

var rotMat 		= new Matrix4();
var transMat 	= new Matrix4();
var scaleMat 	= new Matrix4();


var z 		= 0.0,
	y 		= 0.0,
	x		= 0.0;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;


// ********************************************************
// ********************************************************

// Chama gotStream()
// Depois Chama noStream()
// Depois Chama initGL()
// Depois Chama initBaseImage()
// Depois Chama initTexture()
// Depois Chama initAxisVertexBuffer()
// Depois Chama animate()
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
			
	shaderAxis 					= initShaders("Axis", gl);	
	shaderAxis.vPositionAttr 	= gl.getAttribLocation(shaderAxis, "aVertexPosition");		
	shaderAxis.vColorAttr		= gl.getAttribLocation(shaderAxis, "aVertexColor");
	shaderAxis.uMVPMat 			= gl.getUniformLocation(shaderAxis, "uMVPMat");
	
	if (	shaderAxis.vPositionAttr < 0 	|| 
			shaderAxis.vColorAttr < 0 		|| 
			!shaderAxis.uMVPMat	) {
		console.log("Error getAttribLocation shaderAxis"); 
		return;
		}

	//Manipulação do novo shader
	//
	modelShader 	= initShaders("modelShader", gl);	
	
	modelShader.vPositionAttr 	= gl.getAttribLocation(modelShader, "aVertexPosition");		
	modelShader.vColorAttr 	= gl.getAttribLocation(modelShader, "aVertexColor");
	modelShader.mvMatrix = new Matrix4();
	modelShader.mvMatrix.setIdentity();
	
	if (modelShader.vPositionAttr < 0 || modelShader.vColorAttr < 0) {
		console.log("Error getAttribLocation"); 
		return;
	}
		
	// axis = initAxisVertexBuffer();
	// if (!axis) {
	// 	console.log('Failed to set the AXIS vertex information');
	// 	return;
	// 	}
	
	readOBJFile("modelos/simpleCube.obj", gl, 1, true);
	
	var tick = function() {   // Start drawing
		if (g_objDoc != null && g_objDoc.isMTLComplete()) { // OBJ and all MTLs are available
			
			onReadComplete(gl);
			
			g_objDoc = null;
			
			console.log("BBox = (" 	+ g_drawingInfo.BBox.Min.x + " , " 
									+ g_drawingInfo.BBox.Min.y + " , " 
									+ g_drawingInfo.BBox.Min.z + ")");
			console.log("		(" 	+ g_drawingInfo.BBox.Max.x + " , " 
									+ g_drawingInfo.BBox.Max.y + " , " 
									+ g_drawingInfo.BBox.Max.z + ")");
			console.log("		(" 	+ g_drawingInfo.BBox.Center.x + " , " 
									+ g_drawingInfo.BBox.Center.y + " , " 
									+ g_drawingInfo.BBox.Center.z + ")");
			
			scale = 1.0 / Math.max( 	Math.max( 	Math.abs(g_drawingInfo.BBox.Max.x - g_drawingInfo.BBox.Min.x), 
													Math.abs(g_drawingInfo.BBox.Max.y - g_drawingInfo.BBox.Min.y)),
										Math.abs(g_drawingInfo.BBox.Max.z - g_drawingInfo.BBox.Min.z));
				
			axis = initAxisVertexBuffer(1);
			if (!axis) {
				console.log('Failed to set the AXIS vertex information');
				return;
				}
			}
		requestAnimationFrame(tick, canvas);
		if (model.length > 0) 
			{
				detector 	= new AR.Detector();
				posit 		= new POS.Posit(modelSize, canvas.width);

				rotMat.setIdentity();
				transMat.setIdentity();
				animate();
			}
		else
			requestAnimationFrame(tick, canvas);
		};	
	tick();

	// detector 	= new AR.Detector();
	// posit 		= new POS.Posit(modelSize, canvas.width);

	// rotMat.setIdentity();
	// transMat.setIdentity();
	// animate();
}

// ********************************************************
// ********************************************************

// Chama noStream()
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

function initTexture() {

	videoTexture = gl.createTexture();		
	gl.bindTexture(gl.TEXTURE_2D, videoTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	videoTexture.needsUpdate = false;
}

// ********************************************************
// ********************************************************

function initAxisVertexBuffer() {

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

// Chama render()
function animate() {
    requestAnimationFrame( animate );
	render();		
}

// ********************************************************
// ********************************************************

// Chama drawCorners()
// Depois Chama drawScene()
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

// Chama drawTextQuad()
// Depois Chama updateScenes()
// Depois Chama drawAxis()
function drawScene(markers) {
	
	var modelMat = new Matrix4();
	var ViewMat = new Matrix4();
	var ProjMat = new Matrix4();
	var MVPMat 	= new Matrix4();


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
	
	//	
	drawTextQuad(baseTexture, shaderBaseImage, MVPMat);
	// Busca as coodenadas
	updateScenes(markers);
   		
    ViewMat.setLookAt(	1.0, 0.0, 0.0,
    					1.0, 0.0, -1.0,
    					1.0, 1.0, 0.0 );

	ProjMat.setPerspective(40.0, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	
	modelMat.setIdentity();
	modelMat.multiply(transMat);
	modelMat.multiply(rotMat);
	modelMat.multiply(scaleMat);
	
	MVPMat.setIdentity();
    MVPMat.multiply(ProjMat);
    MVPMat.multiply(ViewMat);
    MVPMat.multiply(modelMat);
	
	drawAxis(axis, shaderAxis, MVPMat);

	//we can start here
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

function updateScenes(markers){
  var corners, corner, pose, i;
  
	if (markers.length > 0) {
		
		corners = markers[0].corners;
		
		for (i = 0; i < corners.length; ++ i) {
			corner = corners[i];
			
			corner.x = corner.x - (canvas.width / 2);
			corner.y = (canvas.height / 2) - corner.y;
			}
		
		pose = posit.pose(corners);
		
		z 	= Math.atan2(pose.bestRotation[0][2], pose.bestRotation[2][2]) * 180.0/Math.PI;
		y 	= -Math.asin(-pose.bestRotation[1][2]) * 180.0/Math.PI;
		x 	= Math.atan2(pose.bestRotation[1][0], pose.bestRotation[1][1]) * 180.0/Math.PI;
		
		rotMat.setIdentity();
		rotMat.rotate(z, 0.0, 1.0, 0.0);
		rotMat.rotate(y, 1.0, 0.0, 0.0);
		rotMat.rotate(x, 0.0, 0.0, 1.0);
		
		transMat.setIdentity();
		transMat.translate(pose.bestTranslation[0], pose.bestTranslation[1], -pose.bestTranslation[2]);
		
		scaleMat.setIdentity();
		scaleMat.scale(modelSize, modelSize, modelSize);
		
		console.log("pose.bestError = " + pose.bestError);
		console.log("pose.alternativeError = " + pose.alternativeError);
		}
	else {
		transMat.setIdentity();
		rotMat.setIdentity();
		scaleMat.setIdentity();
		z 	= 0.0;
		y 	= 0.0;
		x 	= 0.0;
		}
};

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
  		return;
		}
	// Desenha as coordenadas.	
	gl.drawArrays(gl.LINES, 0, o.numItems);
}

////To get the object

// ********************************************************
// ********************************************************
// Read a file
function readOBJFile(fileName, gl, scale, reverse) {
	var request = new XMLHttpRequest();
	
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status !== 404) 
			onReadOBJFile(request.responseText, fileName, gl, scale, reverse);
		}
	request.open('GET', fileName, true); // Create a request to acquire the file
	request.send();                      // Send the request
}

// ********************************************************
// ********************************************************
// OBJ File has been read
function onReadOBJFile(fileString, fileName, gl, scale, reverse) {
	var objDoc = new OBJDoc(fileName);	// Create a OBJDoc object
	var result = objDoc.parse(fileString, scale, reverse);	// Parse the file
	
	if (!result) {
		g_objDoc 		= null; 
		g_drawingInfo 	= null;
		console.log("OBJ file parsing error.");
		return;
		}
		
	g_objDoc = objDoc;
}

// ********************************************************
// ********************************************************
// OBJ File has been read compleatly
function onReadComplete(gl) {
	
	var groupModel = null;

	g_drawingInfo 	= g_objDoc.getDrawingInfo();
	
	for(var o = 0; o < g_drawingInfo.numObjects; o++) {
		
		groupModel = new Object();

		groupModel.vertexBuffer = gl.createBuffer();
		if (groupModel.vertexBuffer) {		
			gl.bindBuffer(gl.ARRAY_BUFFER, groupModel.vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo.vertices[o], gl.STATIC_DRAW);
			}
		else
			alert("ERROR: can not create vertexBuffer");
	
		groupModel.colorBuffer = gl.createBuffer();
		if (groupModel.colorBuffer) {		
			gl.bindBuffer(gl.ARRAY_BUFFER, groupModel.colorBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo.colors[o], gl.STATIC_DRAW);
			}
		else
			alert("ERROR: can not create colorBuffer");

		groupModel.indexBuffer = gl.createBuffer();
		if (groupModel.indexBuffer) {		
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, groupModel.indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g_drawingInfo.indices[o], gl.STATIC_DRAW);
			}
		else
			alert("ERROR: can not create indexBuffer");
		
		groupModel.numObjects = g_drawingInfo.indices[o].length;
		model.push(groupModel);
		}
}

// ********************************************************
// ********************************************************
