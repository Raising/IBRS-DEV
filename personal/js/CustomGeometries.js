THREE.LapidaGeometry = function (weigth,height,deep,radiusTopCornerProportion) {

        THREE.Geometry.call( this );

        this.radiusTopCornerProportion = radiusTopCornerProportion = radiusTopCornerProportion !== undefined ? radiusTopCornerProportion : 0.2;
        this.weigth = weigth = weigth !== undefined ? weigth : 2;
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
                uvs.push( new THREE.Vector2((vertex.x+(this.weigth/2))/this.weigth, vertex.y/this.height));
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




THREE.BaseGeometry = function ( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded ) {

        THREE.Geometry.call( this );

        this.radiusTop = radiusTop = radiusTop !== undefined ? radiusTop : 20;
        this.radiusBottom = radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
        this.height = height = height !== undefined ? height : 100;

        this.radialSegments = radialSegments = radialSegments || 8;
        this.heightSegments = heightSegments = heightSegments || 1;

        this.openEnded = openEnded = openEnded !== undefined ? openEnded : false;

        var heightHalf = height / 2;

        var x, y, vertices = [], uvs = [];

        for ( y = 0; y <= heightSegments; y ++ ) {

                var verticesRow = [];
                var uvsRow = [];

                var v = y / heightSegments;
                var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

                for ( x = 0; x <= radialSegments; x ++ ) {

                        var u = x / radialSegments;

                        var vertex = new THREE.Vector3();
                        vertex.x = radius * Math.sin( u * Math.PI * 2 );
                        vertex.y = - Math.sin(v * Math.PI/2*v* Math.PI/2)* height + heightHalf;
                        vertex.z = radius * Math.cos( u * Math.PI * 2 );

                        this.vertices.push( vertex );

                        verticesRow.push( this.vertices.length - 1 );
                        uvsRow.push( new THREE.Vector2( u, 1 - v ) );

                }

                vertices.push( verticesRow );
                uvs.push( uvsRow );

        }

        var tanTheta = ( radiusBottom - radiusTop ) / height;
        var na, nb;

        for ( x = 0; x < radialSegments; x ++ ) {

                if ( radiusTop !== 0 ) {

                        na = this.vertices[ vertices[ 0 ][ x ] ].clone();
                        nb = this.vertices[ vertices[ 0 ][ x + 1 ] ].clone();

                } else {

                        na = this.vertices[ vertices[ 1 ][ x ] ].clone();
                        nb = this.vertices[ vertices[ 1 ][ x + 1 ] ].clone();

                }

                na.setY( Math.sqrt( na.x * na.x + na.z * na.z ) * tanTheta ).normalize();
                nb.setY( Math.sqrt( nb.x * nb.x + nb.z * nb.z ) * tanTheta ).normalize();

                for ( y = 0; y < heightSegments; y ++ ) {

                        var v1 = vertices[ y ][ x ];
                        var v2 = vertices[ y + 1 ][ x ];
                        var v3 = vertices[ y + 1 ][ x + 1 ];
                        var v4 = vertices[ y ][ x + 1 ];

                        var n1 = na.clone();
                        var n2 = na.clone();
                        var n3 = nb.clone();
                        var n4 = nb.clone();

                        var uv1 = uvs[ y ][ x ].clone();
                        var uv2 = uvs[ y + 1 ][ x ].clone();
                        var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
                        var uv4 = uvs[ y ][ x + 1 ].clone();

                        this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
                        this.faces[this.faces.length-1].materialIndex = 1;
                        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

                        this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
                        this.faces[this.faces.length-1].materialIndex = 1;
                        this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

                }

        }

        // top cap

        if ( openEnded === false && radiusTop > 0 ) {

                this.vertices.push( new THREE.Vector3( 0, heightHalf, 0 ) );
                var sideAngle = 2*Math.PI/radialSegments;
                for ( x = 0; x < radialSegments; x ++ ) {

                        var v1 = vertices[ 0 ][ x ];
                        var v2 = vertices[ 0 ][ x + 1 ];
                        var v3 = this.vertices.length - 1;

                        var n1 = new THREE.Vector3( 0, 1, 0 );
                        var n2 = new THREE.Vector3( 0, 1, 0 );
                        var n3 = new THREE.Vector3( 0, 1, 0 );

                        var uv1 = new THREE.Vector2( 0.5+Math.cos(x*sideAngle)/2, 0.5+Math.sin(x*sideAngle)/2 );
                        var uv2 = new THREE.Vector2( 0.5+Math.cos((x+1)*sideAngle)/2, 0.5+Math.sin((x+1)*sideAngle)/2 );
                        var uv3 = new THREE.Vector2( 0.5, 0.5 );

                        this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
                        this.faces[this.faces.length-1].materialIndex = 0;
                        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

                }

        }

        // bottom cap

        if ( openEnded === false && radiusBottom > 0 ) {

                this.vertices.push( new THREE.Vector3( 0, - heightHalf, 0 ) );

                for ( x = 0; x < radialSegments; x ++ ) {

                        var v1 = vertices[ y ][ x + 1 ];
                        var v2 = vertices[ y ][ x ];
                        var v3 = this.vertices.length - 1;

                        var n1 = new THREE.Vector3( 0, - 1, 0 );
                        var n2 = new THREE.Vector3( 0, - 1, 0 );
                        var n3 = new THREE.Vector3( 0, - 1, 0 );

                        var uv1 = uvs[ y ][ x + 1 ].clone();
                        var uv2 = uvs[ y ][ x ].clone();
                        var uv3 = new THREE.Vector2( uv2.x, 1 );

                        this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
                        this.faces[this.faces.length-1].materialIndex = 0;
                        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

                }

        }

        this.computeCentroids();
        this.computeFaceNormals();

}

THREE.BaseGeometry.prototype = Object.create( THREE.Geometry.prototype );
//Elementos compuestos
var BasicElement = function(){
    THREE.Object3D.call(this);
}

BasicElement.prototype = Object.create(THREE.Object3D.prototype);

var Miniature = function(height,baseDiameter,miniatureTexture,baseTexture){
       BasicElement.call(this);
       var baseHeight = 0.5
       var MiniatureTextureMap = new THREE.ImageUtils.loadTexture(miniatureTexture);
       var BaseTextureMap = new THREE.ImageUtils.loadTexture(baseTexture);
       var GeoBase = new THREE.BaseGeometry(baseDiameter*0.45,baseDiameter/2,baseHeight,20,1);
       var GeoLapida = new THREE.LapidaGeometry(baseDiameter*0.8,height,0.3);
       this.TopPiece= new THREE.Mesh(GeoLapida,new THREE.MeshLambertMaterial( { map: MiniatureTextureMap} ));
       this.BasePiece = new THREE.Mesh(GeoBase,
        new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial( { map: BaseTextureMap}),
            new THREE.MeshBasicMaterial( { color:0x000000})]));
        this.BasePiece.position.set(0,baseHeight/2,0);
        this.TopPiece.position.set(0,baseHeight,0);
        this.add(this.TopPiece);
        this.add(this.BasePiece);
       
}
Miniature.prototype = Object.create(BasicElement.prototype);

var TableBoard = function(dimensions,coverTexture){
    BasicElement.call(this);
    var CoverTextureMap =  new THREE.ImageUtils.loadTexture(coverTexture);
    var WoodTextureMap =  new THREE.ImageUtils.loadTexture("img/woodtexture.jpg");
    var GeoTop = new THREE.CubeGeometry(dimensions.x,dimensions.y,dimensions.z);
    for (var i = 0; i<GeoTop.faces.length;i++){ GeoTop.faces[i].materialIndex = 0;}
    GeoTop.faces[4].materialIndex = GeoTop.faces[5].materialIndex = 1;
    var GeoLeg = new THREE.CubeGeometry(dimensions.x*0.1,dimensions.y*4,dimensions.z*0.1);
    
    this.TableTop = new THREE.Mesh(GeoTop,
        new THREE.MeshFaceMaterial([
            new THREE.MeshLambertMaterial({ map: WoodTextureMap}),
            new THREE.MeshLambertMaterial({ map: CoverTextureMap} )]));
    
    this.TableTop.position.set(0,-dimensions.y/2,0);
    this.add(this.TableTop);
    this.TableLegs=[];
     for (var i = 0;i<4;i++){
        var leg =new THREE.Mesh(GeoLeg,new THREE.MeshLambertMaterial( { map: WoodTextureMap}));
        leg.position.set((1-(i%2)*2)*dimensions.x*0.4,-dimensions.y*3,(1-parseInt(i/2)*2)*dimensions.z*0.4); 
        
        this.TableLegs.push(leg);
        this.add(this.TableLegs[i]);
        }
    }
TableBoard.prototype = Object.create(BasicElement.prototype);
