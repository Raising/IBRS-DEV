var projector = new THREE.Projector();
var ray = projector.pickingRay( mouseCoord, camera ); // (mouse coord are in screenspace and must be [-1, 1])
var objects = ray.intersectObjects( scene.children );

if( objects.length )
{
objects[ 0 ].object; // THREE.Particule or THREE.Mesh
objects[ 0 ].face; // THREE.Face3 or THREE.Face4 (is .object is a Mesh
objects[ 0 ].point; // THREE.Vector3
}

// found at: https://github.com/mrdoob/three.js/issues/1517#issuecomment-4520401