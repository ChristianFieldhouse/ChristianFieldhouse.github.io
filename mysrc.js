
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
const squirrel_geom = new THREE.SphereGeometry(0.02);
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
	"spine_base": {
		0: 0,
	}
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
	"spine_base": {
		0: [0, 2],
	}
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
	gltf.scene.position.set(0, squirrel_elevation + 0.2, 0);
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

	squirrel_pose["spine_base"][0] = bone(squirrel_bones["spine_base"][0]).rotation.x;

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

var map_loaded = false;
loader.load( 'objects/squirrel_map_katie_lower_poly.glb', function ( gltf ) {
	const scale = 0.2;
	gltf.scene.scale.set(scale, scale, scale);
	gltf.scene.rotation.y = Math.PI * 2 * Math.random();
	gltf.scene.position.set(0, 0.0, 0);
	scene.add(gltf.scene);
	map_loaded = true;
}, undefined, function ( error ) {
	console.error( error );
});

var tree_model_0 = null;
function add_tree(xyz, scale=0.05){
	console.log(tree_model_0);
	if (tree_model_0 == null){
		console.log("tree is null, loading...");
		loader.load( 'objects/basic_bitch_tree.glb', function ( gltf ) {

			gltf.scene.scale.set( scale, scale, scale );
			gltf.scene.rotation.y = Math.PI * 2 * Math.random();
			gltf.scene.position.set(xyz.x, xyz.y, xyz.z);
			tree_model_0 = gltf.scene.clone(true);
			scene.add(tree_model_0.clone(true));
			console.log(tree_model_0);
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}else{
		console.log("tree is not null");
		var new_tree = tree_model_0.clone(true);
		new_tree.rotation.y = Math.PI * 2 * Math.random();
		new_tree.position.set(xyz.x, xyz.y, xyz.z);
		scene.add(new_tree);
	}
}

var acorn_model_0 = null;
function add_nut(xyz){
    const srcfile = 'objects/lil_acorn.glb';
	const up_shift = 0.1;
	if (acorn_model_0 == null){
		loader.load(srcfile, function ( gltf ) {
			gltf.scene.scale.set( 0.05, 0.05, 0.05 );
			gltf.scene.rotation.y = Math.PI * 2 * Math.random();
			gltf.scene.position.set(xyz.x, xyz.y + up_shift, xyz.z);
			scene.add(gltf.scene);
			acorns.push(gltf.scene);
			acorn_model_0 = gltf.scene.clone(true);
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
	else{
		console.log("acorn is not null");
		var new_nut = acorn_model_0.clone(true);
		new_nut.rotation.y = Math.PI * 2 * Math.random();
		new_nut.position.set(xyz.x, xyz.y + up_shift, xyz.z);
		scene.add(new_nut);
	}
}

var golden_acorn_model_0 = null;
function add_golden_nut(xyz){
    var srcfile = 'objects/lil_acorn.glb';
	if (golden_acorn_model_0 == null){
		loader.load(srcfile, function ( gltf ) {
			gltf.scene.scale.set( 0.05, 0.05, 0.05 );
			gltf.scene.rotation.y = Math.PI * 2 * Math.random();
			gltf.scene.position.set(xyz.x, xyz.y, xyz.z);
			scene.add(gltf.scene);
			acorns.push(gltf.scene);
			golden_acorn_model_0 = gltf.scene.clone(true);
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
	else{
		console.log("acorn is not null");
		var new_nut = acorn_model_0.clone(true);
		new_nut.rotation.y = Math.PI * 2 * Math.random();
		new_nut.position.set(xyz.x, xyz.y, xyz.z);
		scene.add(new_nut);
	}
}

function add_heart(x, y, z=0, gold=false){
    var srcfile = 'objects/katies_big_big_heart.glb';
	loader.load(srcfile, function ( gltf ) {
		gltf.scene.scale.set( 0.05, 0.05, 0.05 );
		gltf.scene.rotation.y = Math.PI * 2 * Math.random();
		gltf.scene.position.set(x, 0.15, y);
		scene.add( gltf.scene );
		//console.log("added gltf");
		//console.log(gltf.scene)

	}, undefined, function ( error ) {

		console.error( error );

	} );
	var srcfile = 'objects/torus_for_heart.glb';
	loader.load(srcfile, function ( gltf ) {
		gltf.scene.scale.set(0.5, 0.5, 0.5);
		gltf.scene.rotation.y = Math.PI * 2 * Math.random();
		gltf.scene.position.set(x, 0, y);
		scene.add( gltf.scene );
		hoops.push(gltf.scene);
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
    //add_grass(i, j, 1);
  }
}

//add_grass(0, 0, 500);

var tree_positions = [];
for (var i = 0; i < tree_positions.length; ++i){
	add_tree(tree_positions[i]);
}

var acorns = [];
for (var t = 0; t < 10; ++t){
	//add_nut(Math.random() * 10 - 5, Math.random() * 20, 0, Math.random() < 0.1);
}

var hoops = [];
for (var t = 0; t < 30; ++t){
	//add_heart(Math.random() * 10 - 5, Math.random() * 20, 0, Math.random() < 0.1);
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

var state = {
    "action": "walking",
    "time": 0,
    "velocity": new THREE.Vector3(0, 0, 0),
    "map_editing": false,
}
if (state["map_editing"]){
	camera.position.x = 0;
	camera.position.y = 15;
	camera.position.z = 0;
	camera.lookAt(0, 0, 0);
}
const mouse = new THREE.Vector2();
var item_positions = [];
const indicators = true;

if (indicators){
    var indicatorf = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["pink"] } ) );
    var indicatorb = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["ligt_salmon"] } ) );
    var indicatorl = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["grey"] } ) );
    var indicatorr = new THREE.Mesh( squirrel_geom, new THREE.MeshBasicMaterial( { color: colours["purple"] } ) );
    //indicator.scale.set(0.1);
	indicatorf.name = "Sphere";
	indicatorb.name = "Sphere";
	indicatorr.name = "Sphere";
	indicatorl.name = "Sphere";
    scene.add(indicatorf);
    scene.add(indicatorb);
    scene.add(indicatorl);
    scene.add(indicatorr);
}

const l = 0.5;
function set_bone(name, index, val, use_default=true){
	var new_val = val + squirrel_pose[name][index];
	if (!use_default){
		new_val = val;
	}
	bone(squirrel_bones[name][index]).rotation.x = (new_val) * l + (1 - l) * (bone(squirrel_bones[name][index]).rotation.x);
}

function set_tail(t0, t1, t2){
   set_bone("tail", 0, t0);
   set_bone("tail", 1, t1);
   set_bone("tail", 2, t2);
}

function set_front_left(t0, t1, t2){
   set_bone("front_left", 0, t0, false);
   set_bone("front_left", 1, t1, false);
   set_bone("front_left", 2, t2, false);
}

function set_front_right(t0, t1, t2){
   set_bone("front_right", 0, t0, false);
   set_bone("front_right", 1, t1, false);
   set_bone("front_right", 2, t2, false);
}

function set_back_right(t0, t1, t2){
   set_bone("back_right", 0, t0);
   set_bone("back_right", 1, t1);
   set_bone("back_right", 2, t2);
}

function set_back_left(t0, t1, t2){
   set_bone("back_left", 0, t0);
   set_bone("back_left", 1, t1);
   set_bone("back_left", 2, t2);
}

function set_head(t0, t1){
   set_bone("head", 0, t0);
   set_bone("head", 1, t1);
}

function set_spine_base(t0){
   set_bone("spine_base", 0, t0);
}

function set_walking_pose(param){
	squirrel.children[0].position.y = l * (-0.35) + (1 - l) * squirrel.children[0].position.y;
	set_spine_base(0);
	set_head(
		0, //Math.sin(frame_no * 0.1) * 0.4,
	    -Math.sin(param) * 0.2
	)
	set_tail(
	    Math.sin(param) * 0.5 + 0.3,
	    Math.sin(param) * 0.5 + 0.3,
	    Math.sin(param) * 0.5 - 0.3,
	
	);
	set_front_left(
	    -Math.PI/2 + Math.PI/4 * Math.sin(param),
	    0,
	    0
	);
	set_front_right(
	    -Math.PI/16 - Math.PI/4 + Math.PI/4 * Math.sin(Math.PI + param),
	    0, //Math.PI/10, // - Math.PI/4 + Math.PI/4 * Math.sin(frame_no * 0.1),
	    0
	);
	set_back_left(
	    -Math.PI/8 * Math.sin(param),
	    Math.PI/8 * Math.sin(param),
	    -Math.PI/4 - Math.PI/6 * Math.sin(param),
	);
	set_back_right(
	    -Math.PI/8 * Math.sin(Math.PI + param),
	    -Math.PI/8 + Math.PI/8 * Math.sin(Math.PI + param),
	    Math.PI/4 + Math.PI/6 * Math.sin(Math.PI + param),
	);
}

function set_jumping_pose(){
	squirrel.children[0].position.y = l * (-0.35) + (1 - l) * squirrel.children[0].position.y;
    var param = state["time"] * 0.5;
    var front_param = Math.min(param, Math.PI * 2);
    var back_param = Math.min(param, Math.PI);
	set_spine_base(0);
	set_head(
		0, //Math.sin(frame_no * 0.1) * 0.4,
	    -Math.sin(param) * 0.2
	)
	set_tail(
	    Math.sin(param) * 0.5 + 0.3,
	    Math.sin(param) * 0.5 + 0.3,
	    Math.sin(param) * 0.5 - 0.3,
	
	);
	set_front_left(
	    -Math.PI/2 + Math.PI/4 * Math.sin(Math.PI/2 + front_param),
	    0,
	    0
	);
	set_front_right(
	    -Math.PI/16 - Math.PI/4 + Math.PI/4 * Math.sin(Math.PI/2 + front_param),
	    0, //Math.PI/10, // - Math.PI/4 + Math.PI/4 * Math.sin(frame_no * 0.1),
	    0
	);
	set_back_left(
	    -Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    -Math.PI/4 - Math.PI/6 * Math.sin(-Math.PI/2+ back_param),
	);
	set_back_right(
	    -Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    -Math.PI/8 + Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    Math.PI/4 + Math.PI/6 * Math.sin(-Math.PI/2+ back_param),
	);
}

function set_holding_on_pose(){
	squirrel.children[0].position.y = l * (-0.35) + (1 - l) * squirrel.children[0].position.y;
    var param = state["time"] * 0.5;
    var front_param = Math.PI * 2;
    var back_param = Math.PI;
	set_spine_base(0);
	var head_param = param * 0.678;
	set_head(
		0, //Math.sin(frame_no * 0.1) * 0.4,
	    -Math.sin(head_param) * 0.2 - 0.3
	)
	set_tail(
	    Math.sin(param) * 0.5 + 0.3,
	    Math.sin(param) * 0.5 + 0.3,
	    Math.sin(param) * 0.5 - 0.3,
	
	);
	set_front_left(
	    -Math.PI/2 + Math.PI/4 * Math.sin(Math.PI/2 + front_param),
	    0,
	    0
	);
	set_front_right(
	    -Math.PI/16 - Math.PI/4 + Math.PI/4 * Math.sin(Math.PI/2 + front_param),
	    0, //Math.PI/10, // - Math.PI/4 + Math.PI/4 * Math.sin(frame_no * 0.1),
	    0
	);
	set_back_left(
	    -Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    -Math.PI/4 - Math.PI/6 * Math.sin(-Math.PI/2+ back_param),
	);
	set_back_right(
	    -Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    -Math.PI/8 + Math.PI/8 * Math.sin(-Math.PI/2+ back_param),
	    Math.PI/4 + Math.PI/6 * Math.sin(-Math.PI/2+ back_param),
	);
}

function set_sitting_pose(){
	squirrel.children[0].position.y = l * (-1.5) + (1 - l) * squirrel.children[0].position.y;
    var param = state["time"] * 0.1;
    var front_param = param * 0.3456;
	var head_param = param * 0.678;
	var situp = Math.PI/12 + Math.PI/100 * Math.sin(param * 0.91);
	set_head(
		0, //Math.sin(frame_no * 0.1) * 0.4,
	    -Math.sin(head_param) * 0.2 - 0.3
	)
	set_spine_base(Math.PI/6 + situp);
	set_tail(
	    Math.sin(param) * 0.2 - 0.2,
	    Math.sin(param) * 0.2 - 0.0,
	    Math.sin(param) * 0.2 + 0.3,
	
	);
	set_front_left(
	    -Math.PI/2 + Math.PI/32 * Math.sin(front_param),
	    0,
	    0
	);
	set_front_right(
	    -Math.PI/16 - Math.PI/4 + Math.PI/32 * Math.sin(front_param),
	    0, //Math.PI/10, // - Math.PI/4 + Math.PI/4 * Math.sin(frame_no * 0.1),
	    0
	);
	set_back_left(
	    -Math.PI/8 * Math.sin(-Math.PI/2 + 3 * situp),
	    Math.PI/8 * Math.sin(-Math.PI/2),
	    -Math.PI/4 - Math.PI/6 * Math.sin(-Math.PI/2),
	);
	var bl_param = Math.PI/2;
	set_back_right(
	    -Math.PI/8 * Math.sin(-Math.PI/2 + 3 * situp),
	    -Math.PI/8 + Math.PI/8 * Math.sin(Math.PI/2),
	    Math.PI/4 + Math.PI/6 * Math.sin(-Math.PI/2 + bl_param),
	);
}


function gripping(){
    return [
		"walking",
		"sitting",
		"holding_on"
	].includes(state["action"]);
}

function still(){
    return [
		"sitting",
		"holding_on"
	].includes(state["action"]);
}

function falling(){
    return [
		"freefall",
		"jumping"
	].includes(state["action"]);
}

const pace = 1;//0.6;
var frame_no = 0;
const animate = function () {
	requestAnimationFrame( animate );
	
	if (!map_loaded){
		return;
	}
	
	frame_no++;
	const gaze_f = squirrel_dir.clone().sub(squirrel_up);
	const gaze_b = squirrel_dir.clone().negate().sub(squirrel_up);
	const width = 0.3;
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
	
	for (var i = 0; i < hoops.length; ++i){
	    hoops[i].rotation.y += 0.01;
	}
	
	var target_f_point = target_f.point;
	var target_b_point = target_b.point;
	if (gripping()){
		var eps = 0.2;
	    if (target_f.distance > squirrel_elevation * 2){
            target_f_point = squirrel.position.clone().add(
                squirrel_dir.clone().sub(
                    squirrel_up.clone().multiplyScalar(1 + eps)
                ).multiplyScalar(squirrel_elevation)
            )
			console.log("trying to correct...");
	    }
	    if (target_b.distance > squirrel_elevation * 2){
            target_b_point = squirrel.position.clone().add(
                squirrel_dir.clone().negate().sub(
                    squirrel_up.clone().multiplyScalar(1 - eps)
                ).multiplyScalar(squirrel_elevation)
            )
	    }
		const to_freefall_limit = squirrel_elevation * 3;
	    if (((target_f.distance > to_freefall_limit) &&
            (target_b.distance > to_freefall_limit)) &&
            ((target_l.distance > to_freefall_limit) &&
            (target_r.distance > to_freefall_limit))
        ){
		    console.log("IN FREEFALL");
            state["action"] = "freefall";
            state["velocity"] = new THREE.Vector3(0, 0, 0);
        }
	}
	
	if (state["action"] == "jumping"){
	    state["time"] += 1;
	    set_jumping_pose();
	}
    
    if(falling()){
        if (((squirrel_up.x == 0) && (squirrel_up.y == -1)) && (squirrel_up.z == 0)){
            squirrel_up = new THREE.Vector3(0, 1, 0);
        }
        else{
    	    squirrel_up.lerp(new THREE.Vector3(0, 1, 0), 0.1).normalize();
    	}
		squirrel_dir = squirrel_up.clone().cross(squirrel_left).normalize();
		squirrel_left = squirrel_up.clone().cross(squirrel_dir).normalize().negate();
		const from_freefall_limit = squirrel_elevation * 1.5;
	    if (((target_f.distance < from_freefall_limit) ||
            (target_b.distance < from_freefall_limit)) ||
            ((target_l.distance < from_freefall_limit) ||
            (target_r.distance < from_freefall_limit))
        ){
            if(state["velocity"].dot(squirrel_up) < 0){
                start_walking();
            }
        }
        state["velocity"].add(new THREE.Vector3(0, -0.001, 0));
		const terminal_velocity = from_freefall_limit/2;
		if (state["velocity"].length() > terminal_velocity){
			state["velocity"].normalize().multiplyScalar(terminal_velocity);
		}
	    squirrel.position.add(state["velocity"]);
    }
	
	if (still()){
		state["time"] += 1;
		if (state["action"] == "sitting"){
			set_sitting_pose();
		}
		else if (state["action"] == "holding_on"){
			set_holding_on_pose();
		}
	}

	if (state["action"] == "walking"){
		state["time"] += 1;
	    set_walking_pose(frame_no * pace);
		squirrel_dir = target_f_point.clone().sub(target_b_point).normalize();
		const left_right = target_l.point.clone().sub(target_r.point).normalize();
		squirrel_up = squirrel_dir.clone().cross(left_right.clone().negate()).normalize();
		squirrel_left = squirrel_up.clone().cross(squirrel_dir.clone()).normalize().negate();
		var new_pos = target_b.point.clone().lerp(target_f_point, 0.5).add(
		    squirrel_up.clone().multiplyScalar(squirrel_elevation)
		);
		if (new_pos.distanceTo(squirrel.position) > squirrel_elevation){
		    console.log("not going to new position");
		    console.log(new_pos.distanceTo(squirrel.position));
		    new_pos = squirrel.position.clone();
		}
		squirrel.position.set(new_pos.x, new_pos.y, new_pos.z);
		squirrel.position.add(squirrel_dir.clone().multiplyScalar(pace*1.5/60));
		if (state["time"] > 15000000){
			if (squirrel_up.dot(new THREE.Vector3(0, 1, 0)) > 0.8){
				state["action"] = "sitting";
			}
			else{
				state["action"] = "holding_on";
			}
		}
	}
	console.log(state["action"]);
	//console.log(state["action"] in ["sitting"]);
	
	const m = (new THREE.Matrix4()).makeBasis(
	    squirrel_left.clone().multiplyScalar(-0.05),
	    squirrel_up.clone().multiplyScalar(0.05), //
        squirrel_dir.clone().multiplyScalar(-0.05) 
    ).transpose(); // ugh
    squirrel.matrix.set(...m.elements);
	
	if (state["action"] != "frozen"){
		squirrel.matrix.setPosition( squirrel.position );
	}
	squirrel.matrixAutoUpdate = false;
	
	if (!state["map_editing"]){
		raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
		const intersects = raycaster.intersectObjects(scene.children, true);
	    var cam_direction = squirrel.position.clone().sub(camera.position);
		if (intersects[0].distance < cam_height){
			console.log(intersects);
			cam_direction.y -= (cam_height - intersects[0].distance);
		}else{
			//cam_direction.y += 0.005;
		}
		//if (cam_direction.y > 0){
		//	cam_direction.y = 0;
		//}
		console.log(intersects);
		cam_direction.normalize();
	    camera.position.lerp(squirrel.position.clone().sub(cam_direction.clone().multiplyScalar(cam_distance)), 0.2);
	    camera.lookAt(squirrel.position.x, squirrel.position.y, squirrel.position.z);
	}
	renderer.render( scene, camera );
};

var music_playing = false;
function play_music(){
    var audio = new Audio('sounds/squirrel song.mp3');
    var playPromise = audio.play();
}

function start_walking(){
	state["action"] = "walking";
	state["time"] = 0;
}

document.onkeydown = function(e) {
    if (!music_playing){
        play_music();
        music_playing=true;
    }
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
	const cameps_vertical = 0.1;
	const roteps = 0.01;
    switch (e.keyCode) {
		case 37: // right
			if (still()){
				start_walking();
			}
			if (state["action"] == "walking"){
				squirrel_dir.sub(squirrel_left.clone().multiplyScalar(eps)).normalize();
				state["time"] = 0;
			}
		break;
		case 38:
			if (still()){
				start_walking();
			}
			if (state["action"] == "walking"){
				state["time"] = 0;
			}
		break;
		case 39: // left
			if (still()){
				start_walking();
			}
			if (state["action"] == "walking"){
				squirrel_dir.add(squirrel_left.clone().multiplyScalar(eps)).normalize();
				state["time"] = 0;
			}
		break;
		case 40:
			if (state["action"] == "walking"){
				squirrel_dir.sub(cam_direction.clone().multiplyScalar(eps)).normalize();
				state["time"] = 0;
			}
		break;
		case 32: //  space initiates jump
		  if (gripping()){
			  state["action"] = "jumping";
			  state["time"] = 0;
			  state["velocity"] = squirrel_dir.clone().add(
				  squirrel_up.multiplyScalar(0.5)
			  ).multiplyScalar(0.02);
		  }
		break;
		case "U".charCodeAt(0): //  u makes squirrel go up
		squirrel.position.y = squirrel.position.y + 1;
		break;
		case "D".charCodeAt(0): // a key, camera left
			if (!state["map_editing"]){
				camera.position.sub(cam_orthogonal.clone().multiplyScalar(cameps));
			}
			else {
				camera.rotation.y -= roteps;
			}
		break;
		case "A".charCodeAt(0):
			if (!state["map_editing"]){
				camera.position.add(cam_orthogonal.clone().multiplyScalar(cameps));
			}
			else {
				camera.rotation.y += roteps;
			}
		break;
		case "C".charCodeAt(0):
		  camera.position.add(new THREE.Vector3(cameps, 0, 0));
		break;
		case "Z".charCodeAt(0):
		  camera.position.add(new THREE.Vector3(-cameps, 0, 0));
		break;
		case "S".charCodeAt(0): // s key, camera back
			if (!state["map_editing"]){
				console.log("down");
				camera.position.sub(new THREE.Vector3(0, cameps_vertical, 0));
			}
			else {
				camera.position.sub(new THREE.Vector3(0, 0, cameps));
			}
		  camera.position.add(new THREE.Vector3(0, 0, cameps));
		break;
		case "W".charCodeAt(0): // w key, camera forward
			if (!state["map_editing"]){
				console.log("up");
				camera.position.add(new THREE.Vector3(0, cameps_vertical, 0));
			}
			else {
				camera.position.sub(new THREE.Vector3(0, 0, cameps));
			}
		break;
		case "E".charCodeAt(0): // e key, up
		  camera.position.add(new THREE.Vector3(0, cameps, 0));
		break;
		case "Q".charCodeAt(0): // q key, camera down
		  camera.position.sub(new THREE.Vector3(0, cameps, 0));
		break;
		case "R".charCodeAt(0): // e key, up
		  camera.rotation.x += roteps;
		break;
		case "F".charCodeAt(0): // q key, camera down
		  camera.rotation.x -= roteps;
		break;
		case "L".charCodeAt(0): // q key, camera down
			if (state["action"] == "walking"){
				state["action"] = "sitting";
			}
			else if (state["action"] == "sitting"){
				state["action"] = "walking";
			}
		break;
    }
    var cam_direction = new THREE.Vector3(
		squirrel.position.x - camera.position.x,
		squirrel.position.y - camera.position.y,
		squirrel.position.z - camera.position.z
	);
	cam_direction.y = 0;
	cam_direction.normalize();
	
	var angle = squirrel_dir.angleTo(new THREE.Vector3(0, 0, -1));
	if (squirrel_dir.x > 0){
		angle = -angle;
	}
};

function onDocumentMouseWheel( event ) {

}

function onDocumentClick( event ) {
    console.log("click");
    console.log(event);
    
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	raycaster.setFromCamera( mouse, camera );
	const intersects = raycaster.intersectObjects(scene.children, true);
	add_nut(intersects[0].point);
	item_positions.push(intersects[0].point);
	console.log(item_positions);
}

document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
document.addEventListener( 'click', onDocumentClick, false );

animate();

