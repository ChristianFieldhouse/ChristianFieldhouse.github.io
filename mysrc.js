
//'use strict';
//import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const loader = new THREE.GLTFLoader();


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(2*18.4349488, window.innerWidth / window.innerHeight, 0.5, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.gammaOutput = true
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var squirrel;
const squirrel_geom = new THREE.SphereGeometry(0.1);
const smaterial = new THREE.MeshBasicMaterial( { color: 0xffa8a9 } );
squirrel = new THREE.Mesh( squirrel_geom, smaterial );
//scene.add( squirrel );
const squirrel_elevation = 0.07;
squirrel.position.set(0, squirrel_elevation, 0);
squirrel.name = "squirrel";

var squirrel_pose = {
    "tail": {
        0 : 0,
        1 : 0,
        2 : 0,
    },
    "head": {
        0: 0,
        1: 0,
    },
    "front_left": {
        0: 0,
        1: 0,
        2: 0,
    },
    "front_right": {
        0: 0,
        1: 0,
        2: 0,
    },
    "back_left": {
        0: 0,
        1: 0,
    },
    "back_right": {
        0: 0,
        1: 0,
    },
}

var squirrel_bones = {
    "tail": {
        0 : [0, 3],
        1 : [0, 3, 0],
        2 : [0, 3, 0, 0],
    },
    "head": {
        0: [0, 2, 0, 0, 0, 0],
        1: [0, 2, 0, 0, 0, 0, 0],
    },
    "front_left": {
        0: [0, 2, 0, 0, 0, 1],
        1: [0, 2, 0, 0, 0, 1, 0],
        2: [0, 2, 0, 0, 0, 1, 0, 0],
    },
    "front_right": {
        0: [0, 2, 0, 0, 0, 2],
        1: [0, 2, 0, 0, 0, 2, 0],
        2: [0, 2, 0, 0, 0, 2, 0, 0],
    },
    "back_left": {
        0: [0, 2, 0, 1],
        1: [0, 2, 0, 1, 0],
        2: [0, 2, 0, 1, 0, 0],
    },
    "back_right": {
        0: [0, 2, 0, 2],
        1: [0, 2, 0, 2, 0],
        2: [0, 2, 0, 2, 0, 0],
    },
}

function bone(arr){
    var r = squirrel;
    for (var i = 0; i < arr.length; ++i){
        r = r.children[arr[i]];
    }
    return r;
}

loader.load( 'objects/bitchin_squirrel_boy.glb', function ( gltf ) {

	gltf.scene.scale.set( 0.05, 0.05, 0.05 );
	gltf.scene.position.set(0, squirrel_elevation, 0);
	gltf.scene.name = "squirrel";
	squirrel =  gltf.scene;
	
	squirrel_pose["tail"][0] = bone(squirrel_bones["tail"][0]).rotation.x;
    squirrel_pose["tail"][1] = bone(squirrel_bones["tail"][1]).rotation.x;
    squirrel_pose["tail"][2] = bone(squirrel_bones["tail"][2]).rotation.x;
    
    squirrel_pose["front_left"][0] = bone(squirrel_bones["front_left"][0]).rotation.x;
    squirrel_pose["front_left"][1] = bone(squirrel_bones["front_left"][1]).rotation.x;
    squirrel_pose["front_left"][2] = bone(squirrel_bones["front_left"][2]).rotation.x;
    
    squirrel_pose["front_right"][0] = bone(squirrel_bones["front_right"][0]).rotation.x;
    squirrel_pose["front_right"][1] = bone(squirrel_bones["front_right"][1]).rotation.x;
    squirrel_pose["front_right"][2] = bone(squirrel_bones["front_right"][2]).rotation.x;
    
    squirrel_pose["back_left"][0] = bone(squirrel_bones["back_left"][0]).rotation.x;
    squirrel_pose["back_left"][1] = bone(squirrel_bones["back_left"][1]).rotation.x;
    squirrel_pose["back_left"][2] = bone(squirrel_bones["back_left"][2]).rotation.x;
    
    squirrel_pose["back_right"][0] = bone(squirrel_bones["back_right"][0]).rotation.x;
    squirrel_pose["back_right"][1] = bone(squirrel_bones["back_right"][1]).rotation.x;
    squirrel_pose["back_right"][2] = bone(squirrel_bones["back_right"][2]).rotation.x;
    
    squirrel_pose["head"][0] = bone(squirrel_bones["head"][0]).rotation.x;
    squirrel_pose["head"][1] = bone(squirrel_bones["head"][1]).rotation.x;

	scene.add(squirrel);
	console.log("added gltf");
	console.log(gltf);

}, undefined, function ( error ) {

	console.error( error );

} );
//
//scene.add(squirrel)

const box_size = 0.8;
//const image_path = 'https://media.istockphoto.com/photos/artificial-grass-picture-id506692747?b=1&k=20&m=506692747&s=170667a&w=0&h=x4QDWFznTnLQCEmsvCO4w0sZTDYmTvYvPwYD5DW9Ntg=';
//const image_path = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9v26GSqQeESWVRH4iSgq33ZdbQVfofq0p-A&usqp=CAU';
const image_path = "grass.jpg"
const grass_texture = new THREE.TextureLoader().load( image_path );
// immediately use the texture for material creation
const grass_material = new THREE.MeshBasicMaterial( { map: grass_texture } );

function add_cube(x, y, colour, box_size=0.8){
    const geometry = new THREE.BoxGeometry(box_size, box_size, box_size);
    const material = new THREE.MeshBasicMaterial( { color: colour } );
    const cube = new THREE.Mesh( geometry, material );
    cube.name = `tile_${x}_${y}`
    cube.position.set(x, 0, y);
    scene.add( cube );
}

function add_grass(x, y, box_size=0.8){
	const geometry = new THREE.BoxGeometry(box_size, 0.1, box_size); //THREE.PlaneGeometry( 1, 1 );
	const material = new THREE.MeshBasicMaterial( { color: 0x61ab68 } );
	const plane = new THREE.Mesh( geometry, grass_material );
    plane.name = `grass_${x}_${y}`
    plane.position.set(x, 0, y);
	scene.add( plane );
}

function col_cube(x, y, colour){
    var cube = scene.getObjectByName(`tile_${x}_${y}`);
    cube.material = new THREE.MeshBasicMaterial( { color: colour } );
}

const colours = {
    "ligt_salmon": 0xfbc2b5,
    "salmon": 0xffa8a9,
    "pink": 0xf786aa,
    "purple": 0xa14a76,
    "grey": 0xcdb2ab,
    "green": 0x61ab68
}

function createMaterialArray() {
  const skyboxImagepaths = [
	'skybox/left.bmp',
	'skybox/right.bmp',
	'skybox/top.bmp',
	'skybox/bottom.bmp',
	'skybox/front.bmp',
	'skybox/back.bmp',
  ];
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

const skyboxGeo = new THREE.BoxGeometry(100, 100, 100);
const skybox = new THREE.Mesh(skyboxGeo, createMaterialArray());
scene.add(skybox);

function add_tree(x, y, scale=0.05){
	loader.load( 'objects/basic_bitch_tree.glb', function ( gltf ) {

		gltf.scene.scale.set( scale, scale, scale );
		gltf.scene.rotation.y = Math.PI * 2 * Math.random();
		gltf.scene.position.set(x, 0.4, y);
		scene.add( gltf.scene );
		//console.log("added gltf");
		//console.log(gltf.scene)

	}, undefined, function ( error ) {

		console.error( error );

	} );
}

function add_nut(x, y){
	loader.load( 'objects/lil_acorn.glb', function ( gltf ) {

		gltf.scene.scale.set( 0.05, 0.05, 0.05 );
		gltf.scene.rotation.y = Math.PI * 2 * Math.random();
		gltf.scene.position.set(x, 0.15, y);
		scene.add( gltf.scene );
		//console.log("added gltf");
		//console.log(gltf.scene)

	}, undefined, function ( error ) {

		console.error( error );

	} );
}

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

//add_tree(0, 2, 0.05 * 5);
//add_cube(0, 2, colours["green"], 2);
for(var i = -5; i < 5; ++i){
  for(var j = 0; j < 20; ++j){
    add_grass(i, j, 1);
  }
}

//add_grass(0, 0, 500);

for (var t = 0; t < 40; ++t){
	add_tree(Math.random() * 10 - 5, Math.random() * 20);
}

for (var t = 0; t < 30; ++t){
	add_nut(Math.random() * 10 - 5, Math.random() * 20);
}

console.log(scene.children);

const cam_height = 0.4;
const cam_distance = 2;
camera.position.x = 0;
camera.position.y = cam_height;
camera.position.z = -cam_distance;
camera.lookAt(squirrel.position.x, squirrel.position.y, squirrel.position.z);

const line_material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const line_geometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( line_geometry, line_material );
//scene.add( line );

var raycaster = new THREE.Raycaster();
var intersects;
function get_intersect(gaze){
	raycaster.set(squirrel.position, gaze);
	const intersects = raycaster.intersectObjects(scene.children, true);
	if (intersects.length == 0){
		return;
	}
	for (var i = 0; i < intersects.length; ++i){
	    if (intersects[i].object.name != "Sphere"){
		    return intersects[i];
	    }
	}
}
var squirrel_dir = new THREE.Vector3(0, 0, 1);
var squirrel_left = new THREE.Vector3(-1, 0, 0);
var squirrel_up = new THREE.Vector3(0, 1, 0);
var squirrel_target = new THREE.Vector3(0, 0, 0);

function calculate_down(){
	const gaze_angles = 10;

	var points = [];
	var point_weights = 0;
	
	function weight(distance){
		return 1/distance;
	}
	
	for (var i = 0; i < gaze_angles; ++i){
		for (var j = 0; j < gaze_angles; ++j){
			const theta = 2 * Math.PI * i / gaze_angles;
			const phi = Math.PI * j / gaze_angles;
			//console.log(theta);
			const gaze =  new THREE.Vector3(Math.cos(phi), Math.sin(phi)*Math.cos(theta), Math.sin(phi) * Math.sin(theta));
			const intersect = get_intersect(gaze);
			if (intersect && (intersect.distance < 1)){
				points.push(intersect);
				point_weights += weight(intersect.distance);
			}
		}
	}
	
	var mean_point = new THREE.Vector3();
	for (var i = 0; i < points.length; ++i){
		mean_point.add(points[i].point.multiplyScalar(weight(points[i].distance) / point_weights));
	}
	return mean_point;
}

var freefall = false;

const indicators = false;

if (indicators){
    var indicatorf = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["pink"] } ) );
    var indicatorb = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["ligt_salmon"] } ) );
    var indicatorl = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["grey"] } ) );
    var indicatorr = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["purple"] } ) );
    //indicator.scale.set(0.1);
    scene.add(indicatorf);
    scene.add(indicatorb);
    scene.add(indicatorl);
    scene.add(indicatorr);
}

function set_tail(t0, t1, t2){
    //console.log(squirrel.children[0].children[3].rotation.x);
    squirrel.children[0].children[3].rotation.x = t0 + squirrel_pose["tail"][0];
    squirrel.children[0].children[3].children[0].rotation.x = t1 + squirrel_pose["tail"][1];	
    squirrel.children[0].children[3].children[0].children[0].rotation.x = t2 + squirrel_pose["tail"][2];
}

function set_front_left(t0, t1, t2){
   //console.log(bone(squirrel_bones["front_left"][0]));
   bone(squirrel_bones["front_left"][0]).rotation.x = t0; // + squirrel_pose["front_left"][0];
   bone(squirrel_bones["front_left"][1]).rotation.x = t1; // + squirrel_pose["front_left"][1];
   bone(squirrel_bones["front_left"][2]).rotation.x = t2; // + squirrel_pose["front_left"][2];
}

function set_front_right(t0, t1, t2){
   //console.log(bone(squirrel_bones["front_left"][0]));
   bone(squirrel_bones["front_right"][0]).rotation.x = t0; // + squirrel_pose["front_left"][0];
   bone(squirrel_bones["front_right"][1]).rotation.x = t1; // + squirrel_pose["front_left"][1];
   bone(squirrel_bones["front_right"][2]).rotation.x = t2; // + squirrel_pose["front_left"][2];
}

function set_back_right(t0, t1, t2){
   //console.log(bone(squirrel_bones["front_left"][0]));
   bone(squirrel_bones["back_right"][0]).rotation.x = t0 + squirrel_pose["back_right"][0];
   bone(squirrel_bones["back_right"][1]).rotation.x = t1 + squirrel_pose["back_right"][1];
   bone(squirrel_bones["back_right"][2]).rotation.x = t2 + squirrel_pose["back_right"][2];
}

function set_back_left(t0, t1, t2){
   //console.log(bone(squirrel_bones["front_left"][0]));
   bone(squirrel_bones["back_left"][0]).rotation.x = t0 + squirrel_pose["back_left"][0];
   bone(squirrel_bones["back_left"][1]).rotation.x = t1 + squirrel_pose["back_left"][1];
   bone(squirrel_bones["back_left"][2]).rotation.x = t2 + squirrel_pose["back_left"][2];
}

function set_head(t0, t1){
   //console.log(bone(squirrel_bones["front_left"][0]));
   bone(squirrel_bones["head"][0]).rotation.x = t0 + squirrel_pose["head"][0];
   bone(squirrel_bones["head"][1]).rotation.x = t1 + squirrel_pose["head"][1];
}

const pace = 0.15;
var frame_no = 0;
const animate = function () {
	requestAnimationFrame( animate );
	
	frame_no++;
	if(frame_no % 100000000 == 0){
		var mean_point = calculate_down();
		squirrel_up = squirrel.position.clone().sub(mean_point).normalize();
		squirrel_left = squirrel_up.clone().cross(squirrel_dir).normalize();
		// resolve the direction to be perpendicular to the up vector
		squirrel_dir = squirrel_left.clone().cross(squirrel_up);
	}
	else{
		const gaze_f = squirrel_dir.clone().sub(squirrel_up);
		const gaze_b = squirrel_dir.clone().negate().sub(squirrel_up);
		const width = 0.5;
		const gaze_l = squirrel_left.clone().multiplyScalar(width).sub(squirrel_up);
		const gaze_r = squirrel_left.clone().multiplyScalar(-width).sub(squirrel_up);

		const target_f = get_intersect(gaze_f);
		const target_b = get_intersect(gaze_b);
		const target_l = get_intersect(gaze_l);
		const target_r = get_intersect(gaze_r);
		
		if (indicators){
		    indicatorf.position.x = target_f.point.x;
		    indicatorf.position.y = target_f.point.y;
		    indicatorf.position.z = target_f.point.z;
		    
		    indicatorb.position.x = target_b.point.x;
		    indicatorb.position.y = target_b.point.y;
		    indicatorb.position.z = target_b.point.z;
		    
		    indicatorl.position.x = target_l.point.x;
		    indicatorl.position.y = target_l.point.y;
		    indicatorl.position.z = target_l.point.z;
		    
		    indicatorr.position.x = target_r.point.x;
		    indicatorr.position.y = target_r.point.y;
		    indicatorr.position.z = target_r.point.z;
		}
		
		var target_f_point = target_f.point;
		var target_b_point = target_b.point;
		if (target_f.distance > squirrel_elevation * 2){
            target_f_point = squirrel.position.clone().add(
                squirrel_dir.clone().sub(
                    squirrel_up.clone().multiplyScalar(1.05)
                ).multiplyScalar(squirrel_elevation)
            )
		}
		if (target_b.distance > squirrel_elevation * 2){
            target_b_point = squirrel.position.clone().add(
                squirrel_dir.clone().negate().sub(
                    squirrel_up.clone().multiplyScalar(0.95)
                ).multiplyScalar(squirrel_elevation)
            )
		}
		
		const freefall_limit = squirrel_elevation * 3;
		if (((target_f.distance > freefall_limit) &&
	        (target_b.distance > freefall_limit)) &&
	        ((target_l.distance > freefall_limit) &&
	        (target_r.distance > freefall_limit))
	    ){
	        squirrel_up = new THREE.Vector3(0, 1, 0);
			squirrel_dir = new THREE.Vector3(0, 0, 1);
			squirrel_left = new THREE.Vector3(-1, 0, 0);
			console.log("IN FREEFALL");
	        freefall = true;
	    }else{
	        freefall = false;
	    }
		//console.log(target_r);
		
		set_head(
			0, //Math.sin(frame_no * 0.1) * 0.4,
		    -Math.sin(frame_no * pace) * 0.2
		)
		
		set_tail(
		    Math.sin(frame_no * pace) * 0.5 + 0.3,
		    Math.sin(frame_no * pace) * 0.5 + 0.3,
		    Math.sin(frame_no * pace) * 0.5 - 0.3,
		
		);
		
		set_front_left(
		    -Math.PI/2 + Math.PI/4 * Math.sin(frame_no * pace),
		    0,
		    0
		);
		
		set_front_right(
		    -Math.PI/16 - Math.PI/4 + Math.PI/4 * Math.sin(Math.PI + frame_no * pace),
		    0, //Math.PI/10, // - Math.PI/4 + Math.PI/4 * Math.sin(frame_no * 0.1),
		    0
		);
		
		set_back_left(
		    -Math.PI/8 * Math.sin(frame_no * pace),
		    Math.PI/8 * Math.sin(frame_no * pace),
		    -Math.PI/4 - Math.PI/6 * Math.sin(frame_no * pace),
		);
		
		set_back_right(
		    -Math.PI/8 * Math.sin(Math.PI + frame_no * pace),
		    -Math.PI/8 + Math.PI/8 * Math.sin(Math.PI + frame_no * pace),
		    Math.PI/4 + Math.PI/6 * Math.sin(Math.PI + frame_no * pace),
		);
		
		
		if (!freefall){
			squirrel_dir = target_f_point.clone().sub(target_b_point).normalize();
			const left_right = target_l.point.clone().sub(target_r.point).normalize();
			squirrel_up = squirrel_dir.clone().cross(left_right.clone().negate()).normalize();
			squirrel_left = squirrel_up.clone().cross(squirrel_dir.clone()).normalize().negate();
			var new_pos = target_b.point.clone().lerp(target_f_point, 0.5).add(squirrel_up.clone().multiplyScalar(squirrel_elevation));
			if (new_pos.distanceTo(squirrel.position) > squirrel_elevation){
			    new_pos = squirrel.position.clone();
			    console.log("not going to new position");
			}
			squirrel.position.set(new_pos.x, new_pos.y, new_pos.z);
		}
	}

	if (freefall){
		squirrel.position.add(squirrel_up.clone().multiplyScalar(-1/60));
	}
	else{
		squirrel.position.add(squirrel_dir.clone().multiplyScalar(pace*3/60));
	}
	const m = (new THREE.Matrix4()).makeBasis(
		squirrel_left.clone().multiplyScalar(-0.05),
		squirrel_up.clone().multiplyScalar(0.05), //
	    squirrel_dir.clone().multiplyScalar(-0.05) 
	).transpose(); // ugh
	squirrel.matrix.set(...m.elements);
	squirrel.matrix.setPosition( squirrel.position );
	squirrel.matrixAutoUpdate = false;
	
	var cam_direction = squirrel.position.clone().sub(camera.position).normalize();
	camera.position.x = squirrel.position.x - cam_direction.x * cam_distance;
	camera.position.z = squirrel.position.z - cam_direction.z * cam_distance;
	camera.position.y = squirrel.position.y + cam_height;
	camera.lookAt(squirrel.position.x, squirrel.position.y, squirrel.position.z);
	renderer.render( scene, camera );
};

document.onkeydown = function(e) {
    console.log("KEYDOWN");
	var cam_direction = new THREE.Vector3(
		squirrel.position.x - camera.position.x,
		squirrel.position.y - camera.position.y,
		squirrel.position.z - camera.position.z
	);
	cam_direction.y = 0;
	//console.log(cam_direction);
	cam_direction.normalize();
	const cam_orthogonal = new THREE.Vector3(0, 1, 0);
	cam_orthogonal.cross(cam_direction);
	const eps = 0.1;
	const cameps = 0.1;
	console.log(e.keyCode);
    switch (e.keyCode) {
      case 37: // right
	      squirrel_dir = new THREE.Vector3(
		    squirrel_dir.x + eps * cam_orthogonal.x,
		    squirrel_dir.y + eps * cam_orthogonal.y,
		    squirrel_dir.z + eps * cam_orthogonal.z
	      ).normalize();
      break;
      case 38:
	      squirrel_dir = new THREE.Vector3(
		    squirrel_dir.x + eps * cam_direction.x,
		    squirrel_dir.y + eps * cam_direction.y,
		    squirrel_dir.z + eps * cam_direction.z
	      ).normalize();
      break;
	  case 39: // left
	      squirrel_dir = new THREE.Vector3(
		    squirrel_dir.x - eps * cam_orthogonal.x,
		    squirrel_dir.y - eps * cam_orthogonal.y,
		    squirrel_dir.z - eps * cam_orthogonal.z
	      ).normalize();
      break;
	  case 40:
	      squirrel_dir = new THREE.Vector3(
		    squirrel_dir.x - eps * cam_direction.x,
		    squirrel_dir.y - eps * cam_direction.y,
		    squirrel_dir.z - eps * cam_direction.z
	      ).normalize();
      break;
	  case 32: //  space
	  squirrel.position.y = squirrel.position.y + 1;
      break;
      case 65: // a key, camera left
          console.log("camera left");
	      camera.position.x += cameps * cam_orthogonal.x;
	      camera.position.y += cameps * cam_orthogonal.y;
	      camera.position.z += cameps * cam_orthogonal.z;
      break;
      case 68: // d key, camera right
	      camera.position.x -= cameps * cam_orthogonal.x;
	      camera.position.y -= cameps * cam_orthogonal.y;
	      camera.position.z -= cameps * cam_orthogonal.z;
      break;
    }
    var cam_direction = new THREE.Vector3(
		squirrel.position.x - camera.position.x,
		squirrel.position.y - camera.position.y,
		squirrel.position.z - camera.position.z
	);
	cam_direction.y = 0;
	cam_direction.normalize();
	
	console.log(squirrel_dir);
	
	var angle = squirrel_dir.angleTo(new THREE.Vector3(0, 0, -1));
	if (squirrel_dir.x > 0){
		angle = -angle;
	}
	//squirrel.rotation.y = angle;
	console.log(squirrel.rotation.y);
};

function onDocumentMouseWheel( event ) {

}

document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

animate();

