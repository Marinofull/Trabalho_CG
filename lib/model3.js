// ********************************************************
// ********************************************************

function drawPyramid(o, shaderProgram, MVPMat) {

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

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices
	gl.drawElements(gl.TRIANGLE_STRIP, o.numItems, o.indexBuffer.type, 0);   // Draw
}

// ********************************************************
// ********************************************************

function initTriangle(gl) {
	var triangle = new Object();
  //    ---------
  //   /|      /|
  //  /-------| |
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var vertices = new Float32Array([   // Vertex coordinates
     -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     0.0, 1.0, 0.0
  ]);
  
  // // não usado ainda
  //   var texCoords = new Float32Array([   // Texture coordinates
  //       1.0, 1.0,   0.0, 1.0,   0.0, 0.0
  //   ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,  0, 2, 3,						// front
     0, 3, 4,  3, 2, 4,           // 
     1, 2, 4,  0, 1, 4            //
  ]);

  // Write vertex information to buffer object
  triangle.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  if (!triangle.vertexBuffer) return -1; // Vertex coordinates
  triangle.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!triangle.indexBuffer) {
    return -1;
  }


  triangle.numItems = indices.length;
  return triangle;
}
