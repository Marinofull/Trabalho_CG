var canavasZZ		= null;
var shaderNoMaterial		= null;
var model		= new Array;
var aximodified		= null;
var gl			= null;
var xSpeed		= 0.0;
var ySpeed		= 0.0;
var cameraPos 	= new Vector3();
var cameraLook 	= new Vector3();
var cameraUp 	= new Vector3();
var lightPos 	= new Vector3();
var modelRotMat	= new Matrix4();
var mouseDown 	= false;
var lastMouseX;
var	lastMouseY;

var g_objDoc 		= null;	// The information of OBJ file
var g_drawingInfo 	= null;	// The information for drawing 3D model

// ********************************************************
// ********************************************************
/*function initSecondaryGL(canavasZZ) {

	gl = canavasZZ.getContext("webgl");
	if (!gl) { 
		alert("Could not initialise WebGL, sorry :-(");
		return gl;
		}
	gl.viewportWidth = canavasZZ.width;
	gl.viewportHeight = canavasZZ.height;
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	
	return gl;
}*/

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
	
		groupModel.normalBuffer = gl.createBuffer();
		if (groupModel.normalBuffer) {		
			gl.bindBuffer(gl.ARRAY_BUFFER, groupModel.normalBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, g_drawingInfo.normals[o], gl.STATIC_DRAW);
			}
		else
			alert("ERROR: can not create normalBuffer");

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

function initAxisVertexBufferDemonio(gl) {
	var aximodified	= new Object(); // Utilize Object object to return multiple buffer objects
	var vPos 	= new Array;
	var vColor 	= new Array;
	var vNormal	= new Array;
	var lInd 	= new Array;

	// X Axis
	// V0
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	// V1
	vPos.push(1.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);

	// Y Axis
	// V2
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	// V3
	vPos.push(0.0);
	vPos.push(1.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);

	// Z Axis
	// V4
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(0.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	// V5
	vPos.push(0.0);
	vPos.push(0.0);
	vPos.push(1.0);
	vColor.push(0.0);
	vColor.push(0.0);
	vColor.push(1.0);
	vColor.push(1.0);
	vNormal.push(1.0);
	vNormal.push(0.0);
	vNormal.push(0.0);
	
	lInd.push(0);	
	lInd.push(1);	
	lInd.push(2);	
	lInd.push(3);	
	lInd.push(4);	
	lInd.push(5);	
	
	aximodified.vertexBuffer = gl.createBuffer();
	if (aximodified.vertexBuffer) {		
		gl.bindBuffer(gl.ARRAY_BUFFER, aximodified.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vPos), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create vertexBuffer");
	
	aximodified.normalBuffer = gl.createBuffer();
	if (aximodified.normalBuffer) {		
		gl.bindBuffer(gl.ARRAY_BUFFER, aximodified.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vNormal), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create colorBuffer");

	aximodified.indexBuffer = gl.createBuffer();
	if (aximodified.indexBuffer) {		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, aximodified.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lInd), gl.STATIC_DRAW);
		}
	else
		alert("ERROR: can not create indexBuffer");
	
	aximodified.numObjects = lInd.length;
	
	return aximodified;
}

// ********************************************************
// ********************************************************
function draw(gl, o, shaderProgram, primitive) {

	if (o.vertexBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, o.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vPositionAttr, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vPositionAttr);  
		}
	else
		alert("o.vertexBuffer == null");

	if (o.normalBuffer != null) {
		gl.bindBuffer(gl.ARRAY_BUFFER, o.normalBuffer);
		gl.vertexAttribPointer(shaderProgram.vNormalAttr, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(shaderProgram.vNormalAttr);
		}
	else
		alert("o.normalBuffer == null");

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

	gl.drawElements(primitive, o.numObjects, gl.UNSIGNED_SHORT, 0);
}

// ********************************************************
// ********************************************************
function drawScena() {

var modelMat 	= new Matrix4();
var ViewMat 	= new Matrix4();
var ProjMat 	= new Matrix4();
var NormMat 	= new Matrix4();
var lightColor	= new Vector4();
var matAmb		= new Vector4();
var matDif		= new Vector4();
var matSpec		= new Vector4();

	lightColor.elements[0] = 1.0;
	lightColor.elements[1] = 1.0;
	lightColor.elements[2] = 1.0;
	lightColor.elements[3] = 1.0;

	matAmb.elements[0] = 0.2;
	matAmb.elements[1] = 0.2;
	matAmb.elements[2] = 0.2;
	matAmb.elements[3] = 1.0;

	matDif.elements[0] = 0.5;
	matDif.elements[1] = 0.0;
	matDif.elements[2] = 0.0;
	matDif.elements[3] = 1.0;

	matSpec.elements[0] = 1.0;
	matSpec.elements[1] = 1.0;
	matSpec.elements[2] = 1.0;
	matSpec.elements[3] = 1.0;

	modelMat.setIdentity();
	ViewMat.setIdentity();
	ProjMat.setIdentity();
	NormMat.setIdentity();

	gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	
    try {
    	gl.useProgram(shaderNoMaterial);
		}
	catch(err){
        alert(err);
        console.error(err.description);
    	}
    		
    ViewMat.setLookAt(	cameraPos.elements[0], 
    					cameraPos.elements[1], 
    					cameraPos.elements[2], 
    					cameraLook.elements[0], 
    					cameraLook.elements[1], 
    					cameraLook.elements[2], 
    					cameraUp.elements[0], 
    					cameraUp.elements[1], 
    					cameraUp.elements[2] 
    				);
    
    ProjMat.setPerspective( 75.0, gl.viewportWidth / gl.viewportHeight, 0.1, 1200.0);
    		
	gl.uniformMatrix4fv(shaderNoMaterial.MMatUniform, false, modelMat.elements);
	gl.uniformMatrix4fv(shaderNoMaterial.VMatUniform, false, ViewMat.elements);
	gl.uniformMatrix4fv(shaderNoMaterial.PMatUniform, false, ProjMat.elements);
	gl.uniformMatrix4fv(shaderNoMaterial.NMatUniform, false, NormMat.elements);
	gl.uniform3fv(shaderNoMaterial.uCamPos, cameraPos.elements);
	gl.uniform4fv(shaderNoMaterial.uLightColor, lightColor.elements);
	gl.uniform3fv(shaderNoMaterial.uLightPos, lightPos.elements);
	gl.uniform3fv(shaderNoMaterial.uCamPos, cameraPos.elements);

	draw(gl, aximodified, shaderNoMaterial, gl.LINES);	
	
	modelMat.multiply(modelRotMat);
	NormMat.setInverseOf(modelMat);
	NormMat.transpose();
			
	gl.uniformMatrix4fv(shaderNoMaterial.MMatUniform, false, modelMat.elements);
	gl.uniformMatrix4fv(shaderNoMaterial.NMatUniform, false, NormMat.elements);
	gl.uniform4fv(shaderNoMaterial.uMatAmb, matAmb.elements);
	gl.uniform4fv(shaderNoMaterial.uMatDif, matDif.elements);
	gl.uniform4fv(shaderNoMaterial.uMatSpec, matSpec.elements);
	
	for(var o = 0; o < model.length; o++) 
		draw(gl, model[o], shaderNoMaterial, gl.TRIANGLES);
}
        
// ********************************************************
// ********************************************************
var testee = function () {

	//console.log("PASSOU AKI");
	document.onmouseup 		= handleMouseUp;
	document.onmousemove 	= handleMouseMove;
	
	/*canavasZZ					= document.getElementById("noMaterial");
	canavasZZ.onmousedown 		= handleMouseDown;
	gl 						= initSecondaryGL(canavasZZ);*/
	
	shaderNoMaterial 					= initShaders("noMaterial", gl);	
	shaderNoMaterial.vPositionAttr 	= gl.getAttribLocation(shaderNoMaterial, "aVPosition");		
	shaderNoMaterial.vNormalAttr 		= gl.getAttribLocation(shaderNoMaterial, "aVNorm");
	shaderNoMaterial.MMatUniform 		= gl.getUniformLocation(shaderNoMaterial, "uModelMat");
	shaderNoMaterial.VMatUniform 		= gl.getUniformLocation(shaderNoMaterial, "uViewMat");
	shaderNoMaterial.PMatUniform 		= gl.getUniformLocation(shaderNoMaterial, "uProjMat");
	shaderNoMaterial.NMatUniform 		= gl.getUniformLocation(shaderNoMaterial, "uNormMat");
	
	if (shaderNoMaterial.vPositionAttr < 0 || shaderNoMaterial.vColorAttr < 0 || 
		!shaderNoMaterial.MMatUniform || !shaderNoMaterial.VMatUniform || !shaderNoMaterial.PMatUniform || !shaderNoMaterial.NMatUniform ) {
		console.log("Error getAttribLocation"); 
		return;
		}
		
	shaderNoMaterial.uCamPos 			= gl.getUniformLocation(shaderNoMaterial, "uCamPos");
	shaderNoMaterial.uLightPos 		= gl.getUniformLocation(shaderNoMaterial, "uLPos");
	shaderNoMaterial.uLightColor 		= gl.getUniformLocation(shaderNoMaterial, "uLColor");
	shaderNoMaterial.uMatAmb 			= gl.getUniformLocation(shaderNoMaterial, "uMatAmb");
	shaderNoMaterial.uMatDif 			= gl.getUniformLocation(shaderNoMaterial, "uMatDif");
	shaderNoMaterial.uMatSpec			= gl.getUniformLocation(shaderNoMaterial, "uMatSpec");
	
	if (shaderNoMaterial.uCamPos < 0	 		|| shaderNoMaterial.uLightPos < 0 	|| 
		shaderNoMaterial.uLightColor < 0		|| shaderNoMaterial.uMatAmb < 0 		|| 
		shaderNoMaterial.uMatDif < 0			|| shaderNoMaterial.uMatSpec < 0 ) {
		console.log("Error getAttribLocation"); 
		return;
		}
	
	aximodified = initAxisVertexBufferDemonio(gl);
	if (!aximodified) {
		console.log('Failed to set the AXIS vertex information');
		return;
		}
	readOBJFile("../trabalho_CG/modelos/al.obj", gl, 1, true);
	
	var tick = function() {   // Start drawing
		if (g_objDoc != null && g_objDoc.isMTLComplete()) { // OBJ and all MTLs are available
			
			onReadComplete(gl);
			
			g_objDoc = null;
			
			cameraPos.elements[0] 	= 1.30 * g_drawingInfo.BBox.Max.x;
			cameraPos.elements[1] 	= 1.30 * g_drawingInfo.BBox.Max.y;
			cameraPos.elements[2] 	= 1.30 * g_drawingInfo.BBox.Max.z;
			cameraLook.elements[0] 	= g_drawingInfo.BBox.Center.x;
			cameraLook.elements[1] 	= g_drawingInfo.BBox.Center.y;
			cameraLook.elements[2] 	= g_drawingInfo.BBox.Center.z;
			cameraUp.elements[0] 	= 0.0;
			cameraUp.elements[1] 	= 1.0;
			cameraUp.elements[2] 	= 0.0;
			
			lightPos.elements[0]	= 0.0;
			lightPos.elements[1]	= cameraPos.elements[1];
			lightPos.elements[2]	= cameraPos.elements[2];
			}
		if (model.length > 0) 
			drawScena();
		else
			requestAnimationFrame(tick, canavasZZ);
		};	
	tick();
}

    
// ********************************************************
// ********************************************************
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}
    
// ********************************************************
// ********************************************************
function handleMouseDown(event) {
	mouseDown 	= true;
	lastMouseX 	= event.clientX;
	lastMouseY 	= event.clientY;
}
    
// ********************************************************
// ********************************************************
function handleMouseUp(event) {
	mouseDown = false;
}
    
// ********************************************************
// ********************************************************
function handleMouseMove(event) {
	if (!mouseDown)
		return;
	
	var newX 		= event.clientX;
	var newY 		= event.clientY;

	var deltaX 		= newX - lastMouseX
	var newModelRot = new Matrix4();
	
	newModelRot.setIdentity();
	newModelRot.rotate(deltaX / 5, 0.0, 1.0, 0.0);

	var deltaY = newY - lastMouseY;
	newModelRot.rotate(deltaY / 5, 1.0, 0.0, 0.0);

	modelRotMat.multiply(newModelRot);

	lastMouseX = newX
	lastMouseY = newY;
	
	drawScena();
}

