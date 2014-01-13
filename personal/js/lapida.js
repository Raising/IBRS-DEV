THREE.LapidaGeometry = function (weigth,height,deep,radiusTopCornerProportion) {

        THREE.Geometry.call( this );

        this.radiusTopCornerProportion = radiusTopCornerProportion = radiusTopCornerProportion !== undefined ? radiusTopCornerProportion : 0.2;
        this.weigth = weigth = weigth !== undefined ? weigth : 2.4;
        this.height = height = height !== undefined ? height : 3;
        this.deep = deep = deep !== undefined ? deep : 0.3;
        var cornerSegments = 8;
        
        var z,x, y, uvs = [];


        var cornerAngle = Math.PI/(2*cornerSegments); 
        var radius=       this.radiusTopCornerProportion*this.weigth;
        var heightUpToCorner = this.height - radius;
        var weigthUpToCorner = this.weigth/2 - radius;
        for (z =-1;z<2;z=z+2){ 
                //center point
                var vertex = new THREE.Vector3();
                vertex.x = 0;
                vertex.y = weigthUpToCorner;
                vertex.z = z*this.deep/2;
                this.vertices.push( vertex );
                uvs.push( new THREE.Vector2(  (vertex.x+(this.weigth/2))/this.weigth, vertex.y/this.height ) );
                               
                for (x = -1; x<2;x=x+2){
                //base point
                var vertex = new THREE.Vector3();
                vertex.x = x*this.weigth/2;
                vertex.y = 0;
                vertex.z = z*this.deep/2;
                this.vertices.push( vertex );
                uvs.push( new THREE.Vector2(  (vertex.x+(this.weigth/2))/this.weigth, vertex.y/this.height ) );
                        //corners
                        for (y = 0;y<= cornerSegments;y++){
                                var vertex = new THREE.Vector3();
                                vertex.x =x*(weigthUpToCorner + radius*Math.cos(y*cornerAngle));
                                vertex.y =heightUpToCorner + radius*Math.sin(y*cornerAngle);
                                vertex.z =z*this.deep/2;
                                this.vertices.push(vertex);
                                uvs.push( new THREE.Vector2((vertex.x+(this.weigth/2))/this.weigth, vertex.y/this.height));
                        }
                }
        }
        //faces
        var halfVertex = 2*(2+cornerSegments)+1;
        var quarterVertex = 2+cornerSegments;
        // central areas
                this.faces.push( new THREE.Face3( 0,1+quarterVertex, 1));
                this.faceVertexUvs[0].push([uvs[0],uvs[1+quarterVertex], uvs[1]]);

                this.faces.push( new THREE.Face3( 0,quarterVertex, quarterVertex*2));
                this.faceVertexUvs[0].push([uvs[0],uvs[quarterVertex], uvs[quarterVertex*2]]);
                
                this.faces.push( new THREE.Face3( halfVertex, halfVertex+1,halfVertex+1+quarterVertex));
                this.faceVertexUvs[0].push([uvs[halfVertex], uvs[halfVertex+1],uvs[halfVertex+1+quarterVertex]]);

                this.faces.push( new THREE.Face3( halfVertex, halfVertex+quarterVertex*2,halfVertex+quarterVertex));
                this.faceVertexUvs[0].push([uvs[halfVertex], uvs[halfVertex+quarterVertex*2],uvs[halfVertex+quarterVertex]]);

                this.faces.push( new THREE.Face3( quarterVertex*2,halfVertex+quarterVertex, halfVertex+quarterVertex*2));
                this.faces.push( new THREE.Face3( quarterVertex*2, quarterVertex,halfVertex+quarterVertex));
                this.faceVertexUvs[0].push([uvs[quarterVertex*2], uvs[halfVertex+quarterVertex],uvs[halfVertex+quarterVertex*2]]);
                this.faceVertexUvs[0].push([uvs[quarterVertex*2], uvs[quarterVertex],uvs[halfVertex+quarterVertex]]);


         //simetric areas
           for (y = 1;y<= cornerSegments+1;y++){
                this.faces.push( new THREE.Face3( 0, y,y+1));
                this.faces.push( new THREE.Face3( 0, quarterVertex+y+1,quarterVertex+y));                 
                this.faces.push( new THREE.Face3( halfVertex, halfVertex+y+1,halfVertex+y));
                this.faces.push( new THREE.Face3( halfVertex, halfVertex+quarterVertex+y,halfVertex+quarterVertex+y+1));
                
                this.faceVertexUvs[0].push( [uvs[0],            uvs[y],                           uvs[y+1]]);
                this.faceVertexUvs[0].push( [uvs[0],            uvs[quarterVertex+y+1],           uvs[quarterVertex+y]]);                 
                this.faceVertexUvs[0].push( [uvs[halfVertex],   uvs[halfVertex+y+1],              uvs[halfVertex+y]]);
                this.faceVertexUvs[0].push( [uvs[halfVertex],   uvs[halfVertex+quarterVertex+y],  uvs[halfVertex+quarterVertex+y+1]]);
        }
        //side areas
          for (y = 1;y<= cornerSegments+1;y++){
                this.faces.push( new THREE.Face3( y,halfVertex+y, y+1));
                this.faces.push( new THREE.Face3( y+1, halfVertex+y,halfVertex+y+1));                 
                this.faces.push( new THREE.Face3( quarterVertex+y, quarterVertex+y+1,quarterVertex+halfVertex+y));
                this.faces.push( new THREE.Face3( quarterVertex+y+1,quarterVertex+ halfVertex+y+1,quarterVertex+halfVertex+y));                 
                
                this.faceVertexUvs[0].push( [uvs[y],            uvs[halfVertex+y],                           uvs[y+1]]);
                this.faceVertexUvs[0].push( [uvs[y+1],            uvs[halfVertex+y+1],           uvs[halfVertex+y+1]]);                 
                this.faceVertexUvs[0].push( [uvs[quarterVertex+y],   uvs[quarterVertex+y+1],              uvs[halfVertex+quarterVertex+y]]);
                this.faceVertexUvs[0].push( [uvs[quarterVertex+y+1],   uvs[halfVertex+quarterVertex+y+1],  uvs[halfVertex+quarterVertex+y]]);
        }
        this.computeCentroids();
        this.computeFaceNormals();
        this.computeVertexNormals();
}

THREE.LapidaGeometry.prototype = Object.create( THREE.Geometry.prototype );