// ********************************************************
// ********************************************************

function drawTriangle(o, shaderProgram, MVPMat) {

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
  // Create a triangle
  //    ---------
  //   /|      /|
  //  v1------v0|
  //  | |  vc | |
  //  | |-----|-|
  //  |/      |/
  //  v2------v3
  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,
     0.0, 0.0, -1.0
  ]);
// // não usado ainda
//   var texCoords = new Float32Array([   // Texture coordinates
//       1.0, 1.0,   0.0, 1.0,   0.0, 0.0
//   ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,  0, 2, 3,						// front
     0, 3, 4,  3, 2, 4,
     1, 2, 4,  0, 1, 4
  ]);

 

  // Write vertex information to buffer object
  triangle.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  if (!triangle.vertexBuffer) return -1; // Vertex coordinates
  // triangle.texCoords = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);	
  // if (!triangle.texCoords) return -1;
   // Create a buffer object
  triangle.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  if (!triangle.indexBuffer) {
    return -1;
  }


  triangle.numItems = indices.length;
  return triangle;
}

// function initArrayBufferForLaterUse(gl, data, num, type) {
//   var buffer = gl.createBuffer();   // Create a buffer object
//   if (!buffer) {
//     console.log('Failed to create the buffer object');
//     return null;
//   }
//   // Write date into the buffer object
//   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//   gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

//   // Keep the information necessary to assign to the attribute variable later
//   buffer.num = num;
//   buffer.type = type;

//   return buffer;
// }

// function initElementArrayBufferForLaterUse(gl, data, type) {
//   var buffer = gl.createBuffer();  // Create a buffer object
//   if (!buffer) {
//     console.log('Failed to create the buffer object');
//     return null;
//   }
//   // Write date into the buffer object
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

//   buffer.type = type;

//   return buffer;
// }
