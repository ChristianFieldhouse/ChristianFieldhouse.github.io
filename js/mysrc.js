
//'use strict';
//import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {
    acorn_positions,
    oasis_acorns,
    squirrel_pose,
    squirrel_bones,
    og_tree_positions,
	snowy_pine_positions,
    palm_tree_positions,
	big_tree_positions,
	variation_tree_positions,
    little_palm_positions,
	golden_acorn_positions
} from './data_dump.js';
console.log("imported??");
const loader = new THREE.GLTFLoader();


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(2*18.4349488, window.innerWidth / window.innerHeight, 0.01, 1000 );
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
squirrel.position.set(3, squirrel_elevation + 0.2, -3);
squirrel.name = "squirrel";

function bone(arr){
    var r = squirrel;
    for (var i = 0; i < arr.length; ++i){
        r = r.children[arr[i]];
    }
    return r;
}

loader.load( 'objects/bitchin_squirrel_boy.glb', function ( gltf ) {

	gltf.scene.scale.set( 0.05, 0.05, 0.05 );
	gltf.scene.position.set(3, squirrel_elevation + 0.2, -3);
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

var loaded = {
    "map": false,
    "trees": [false, false, false, false, false],
    "acorns": false,
    "golden_acorns": false,
};
function everything_loaded(){
    //console.log(loaded);
    if (state["game_stage"] != "loading"){
        return true;
    }
    var r = (
        loaded["map"] &
        loaded["trees"][0] &
        loaded["trees"][1] &
        loaded["trees"][2] &
        loaded["trees"][3] &
        loaded["trees"][4] &
        loaded["acorns"] &
        loaded["golden_acorns"]
    );
    if (r){
        console.log("finished loading...")
        document.getElementById("loading_screen").hidden = true;
        document.getElementById("title_screen").hidden = false;
        document.getElementById("sound_button").hidden = false;
        document.getElementById("acorn_count").hidden = false;
        //document.getElementById("hint_button").hidden = false;
        document.getElementById("health_bar").hidden = false;
        document.getElementById("golden_acorn_count").hidden = false;
        state["game_stage"] = "title_screen";
        return true;
    }
    return false;
}
const map_scale = 0.3;
const map_width = 150 - 1;
var map_mesh = null;
loader.load( 'objects/squirrel_map_katie_lower_poly.glb', function ( gltf ) {
	gltf.scene.scale.set(map_scale, map_scale, map_scale);
	gltf.scene.position.set(0, 0.0, 0);
	map_mesh = gltf.scene.clone();
	scene.add(map_mesh);
	loaded["map"] = true;
}, undefined, function ( error ) {
	console.error( error );
});

var tree_models = [null, null, null, null, null];
var tree_model_paths = [
    'objects/basic_bitch_tree.glb',
    'objects/palm_tree_1.glb',
    'objects/palm_little.glb',
	'objects/pine_tree.glb',
	'objects/big_big_tree.glb',
	'objects/variation_tree_1.glb',
];
var tree_loading = [false, false, false, false, false];
function add_tree(xyz, rotation=0, scale=0.05, model_number=0){
	while (tree_loading[model_number]){
    }
	if (tree_models[model_number] == null){
		console.log("tree is null, loading...");
		loader.load(tree_model_paths[model_number], function ( gltf ) {
            tree_loading[model_number] = true;
			gltf.scene.scale.set( scale, scale, scale );
			gltf.scene.rotation.y = rotation;
			gltf.scene.position.set(xyz.x, xyz.y, xyz.z);
			tree_models[model_number] = gltf.scene.clone(true);
			scene.add(tree_models[model_number].clone(true));
			tree_loading[model_number] = false;
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}else{
		console.log("tree is not null");
		var new_tree = tree_models[model_number].clone(true);
		new_tree.rotation.y = rotation;
		new_tree.position.set(xyz.x, xyz.y, xyz.z);
		scene.add(new_tree);
	}
}

function add_trees(xyzrs, scale=0.05, model_number=0){
	loader.load(tree_model_paths[model_number], function ( gltf ) {
		gltf.scene.scale.set( scale, scale, scale );
		for (var i = 0; i < xyzrs.length; ++i){
			var tree_model = gltf.scene.clone(true);
			tree_model.rotation.y = xyzrs[i].r;
			tree_model.position.set(xyzrs[i].x, xyzrs[i].y, xyzrs[i].z);
			scene.add(tree_model);
			small_trees.push(tree_model);
		}
		loaded["trees"][model_number] = true;
	}, undefined, function ( error ) {
		console.error( error );
	} );
}

var big_tree_mesh = null;
function add_big_tree(xyz, rotation=0, scale=0.05){
	loader.load(
		tree_model_paths[4], function ( gltf ) {
			tree_loading[4] = true;
			gltf.scene.scale.set( scale, scale, scale );
			gltf.scene.rotation.y = rotation;
			gltf.scene.position.set(xyz.x, xyz.y, xyz.z);
			big_tree_mesh = gltf.scene.clone(true);
			scene.add(big_tree_mesh);
			tree_loading[4] = false;
			loaded["trees"][4] = true;
		}, undefined, function ( error ) {
			console.error( error );
		} 
	);
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
			//acorns.push(gltf.scene);
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
		//acorns.push(new_nut);
	}
}

function add_nuts(xyzs){
    const srcfile = 'objects/lil_acorn.glb';
	const up_shift = 0.1;
	loader.load(srcfile, function ( gltf ) {
		gltf.scene.scale.set( 0.05, 0.05, 0.05 );
		for (var i = 0; i < xyzs.length; ++i){
			var acorn_model = gltf.scene.clone(true);
			acorn_model.rotation.y = Math.PI * 2 * Math.random();
			acorn_model.position.set(xyzs[i].x, xyzs[i].y + up_shift, xyzs[i].z);
			scene.add(acorn_model);
			acorns.push(acorn_model);
		}
		loaded["acorns"] = true;
	}, undefined, function ( error ) {
		console.error( error );
	} );
}

var golden_acorn_model_0 = null;
var loading_golden_acorn_model = false;
function add_golden_nut(xyz){
    var srcfile = 'objects/gold_acorn.glb';
	const up_shift = 0.1;
	if (golden_acorn_model_0 == null){
	    loading_golden_acorn_model = true;
		loader.load(srcfile, function ( gltf ) {
			gltf.scene.scale.set( 0.05, 0.05, 0.05 );
			gltf.scene.rotation.y = Math.PI * 2 * Math.random();
			gltf.scene.position.set(xyz.x, xyz.y + up_shift, xyz.z);
			scene.add(gltf.scene);
			golden_acorns.push(gltf.scene);
			golden_acorn_model_0 = gltf.scene.clone(true);
			loading_golden_acorn_model = false;
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
	else{
		console.log("golden acorn is not null");
		var new_nut = acorn_model_0.clone(true);
		new_nut.rotation.y = Math.PI * 2 * Math.random();
		new_nut.position.set(xyz.x, xyz.y + up_shift, xyz.z);
		scene.add(new_nut);
		golden_acorns.push(new_nut);
	}
}

function add_golden_nuts(xyzs){
    const srcfile = 'objects/gold_acorn.glb';
	const up_shift = 0.1;
	loader.load(srcfile, function ( gltf ) {
		gltf.scene.scale.set( 0.05, 0.05, 0.05 );
		for (var i = 0; i < xyzs.length; ++i){
			var acorn_model = gltf.scene.clone(true);
			acorn_model.rotation.y = Math.PI * 2 * Math.random();
			acorn_model.position.set(xyzs[i].x, xyzs[i].y + up_shift, xyzs[i].z);
			scene.add(acorn_model);
			golden_acorns.push(acorn_model);
		}
		loaded["golden_acorns"] = true;
	}, undefined, function ( error ) {
		console.error( error );
	} );
}

function add_heart(x, y, z=0, gold=false){
    var srcfile = 'objects/katies_big_big_heart.glb';
	loader.load(srcfile, function ( gltf ) {
		gltf.scene.scale.set( 0.05, 0.05, 0.05 );
		gltf.scene.rotation.y = Math.PI * 2 * Math.random();
		gltf.scene.position.set(x, 0.15, y);
		scene.add( gltf.scene );

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

	}, undefined, function ( error ) {

		console.error( error );

	} );
}

var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );

var small_trees = [];
add_trees(og_tree_positions, 0.05, 0);
add_trees(palm_tree_positions, 0.1, 1);
add_trees(little_palm_positions, 0.1, 2);
add_trees(snowy_pine_positions, 0.1, 3);
add_trees(variation_tree_positions, 0.4, 5);
// todo: don't double add to small trees
add_big_tree(big_tree_positions[0], 0, 0.4);

var acorns = [];
var random_acorn_positions = [];
for (var i = 0; i < oasis_acorns.length; ++i){
    random_acorn_positions.push(oasis_acorns[i]);
}
const target_acorn_total = acorn_positions.length / 3;
while (random_acorn_positions.length < target_acorn_total){
    var new_pos = acorn_positions[Math.floor(Math.random() * acorn_positions.length)];
    if (!random_acorn_positions.includes(new_pos)){
        random_acorn_positions.push(new_pos);
    }
}
add_nuts(random_acorn_positions);

var golden_acorns = [];
add_golden_nuts(golden_acorn_positions);

var hoops = [];
for (var t = 0; t < 30; ++t){
	//add_heart(Math.random() * 10 - 5, Math.random() * 20, 0, Math.random() < 0.1);
}

const cam_height = 0.4;
const cam_distance = 2;
const cam_angle = 2 * Math.PI * Math.random();
console.log(cam_angle);
camera.position.x = squirrel.position.x + cam_distance * Math.sin(cam_angle);
camera.position.y = squirrel.position.y + cam_height;
camera.position.z = squirrel.position.z + cam_distance * Math.cos(cam_angle);
var cam_direction = new THREE.Vector3(0, cam_height, cam_distance);
console.log(cam_direction);

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
	//return null;
	raycaster.set(squirrel.position, gaze);
	raycaster.far = squirrel_elevation * 5;
	var close_small_trees = [];
	const tree_radius = 4;
	for (var i = 0; i < small_trees.length; ++i){
		if (small_trees[i].position.distanceTo(squirrel.position) < tree_radius){
			close_small_trees.push(small_trees[i]);
		}
	}
	//console.log(close_small_trees);
	const intersects = raycaster.intersectObjects(
		map_mesh.children.concat(close_small_trees).concat(big_tree_mesh.children),
		true
	);
	raycaster.far = Infinity;
	if (intersects.length == 0){
		return;
	}
	for (var i = 0; i < intersects.length; ++i){
	    if (intersects[i].object.name != "Sphere"){
		    return intersects[i];
	    }
	}
}
const start_angle = Math.PI * 2 * Math.random();
var squirrel_dir = new THREE.Vector3(Math.sin(start_angle), 0, Math.cos(start_angle));
var squirrel_up = new THREE.Vector3(0, 1, 0);
var squirrel_left = squirrel_up.clone().cross(squirrel_dir);
var squirrel_target = new THREE.Vector3(0, 0, 0);

var state = {
    "action": "freefall",
    "pace": 0,
    "pose_time": 0,
    "time": 0,
    "velocity": new THREE.Vector3(0, 0, 0),
    "map_editing": false,
    "game_stage": "loading",
    "start_time": 0,
    "score": 0,
    "frames_left": 1000 * 1,
	"last_frame_time": (new Date()).getTime(),
	"smart_cam": 0
}
if (state["map_editing"]){
	camera.position.x = 0;
	camera.position.y = 15;
	camera.position.z = 0;
	camera.lookAt(0, 0, 0);
}
const mouse = new THREE.Vector2();
var item_positions = [];
const indicators = false;

if (indicators){
    console.log("indicators on");
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
    var param = state["time"] * 0.75;
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
		"holding_on",
		"sitting_or_holding_on"
	].includes(state["action"]);
}

function falling(){
    return [
		"freefall",
		"jumping"
	].includes(state["action"]);
}

function stay_still(){
	if (squirrel_up.dot(new THREE.Vector3(0, 1, 0)) > 0.8){
		state["action"] = "sitting";
	}
	else{
		state["action"] = "holding_on";
	}
	state["time"] = 0;
}

function show_winscreen(){
	console.log("you won!");
    state["game_stage"] = "title_screen";
    state["won"] = true;
    document.getElementById('win_screen').hidden = false;
    document.getElementById('score_div').hidden = false;
    document.getElementById('score_paragraph').innerHTML = "You scored " + state["score"] + "!";
    stay_still();
	aw_nuts.play();
}

var frame_no = 0;
const to_freefall_limit = squirrel_elevation * 3;
const from_freefall_limit = squirrel_elevation * 1;
const frame_pace_multiplier = 1.5/60;
const velocity_glitch_limit = from_freefall_limit * 1;
const pace_glitch_limit = 0.5 * velocity_glitch_limit / frame_pace_multiplier;

const animate = function () {
	if (!everything_loaded()){
		requestAnimationFrame( animate );
		return;
	}
	
	if (key_states["foreward"]){
	    foreward();
	}
	if (key_states["back"]){
	    back();
	}
	if (key_states["left"]){
	    left();
	}
	if (key_states["right"]){
	    right();
	}

	if (Math.random() < 1/1000){
		squeaks.play();
	}
	
	frame_no++;
	const gaze_ff = squirrel_dir.clone();
	const gaze_f = squirrel_dir.clone().sub(squirrel_up);
	const gaze_b = squirrel_dir.clone().negate().sub(squirrel_up);
	const width = 0.3;
	const gaze_l = squirrel_left.clone().multiplyScalar(width).sub(squirrel_up);
	const gaze_r = squirrel_left.clone().multiplyScalar(-width).sub(squirrel_up);

    const target_ff = get_intersect(gaze_ff);
	const target_f = get_intersect(gaze_f);
	const target_b = get_intersect(gaze_b);
	const target_l = get_intersect(gaze_l);
	const target_r = get_intersect(gaze_r);
	
	//console.log(target_f);
	//console.log(map_mesh);

	if (indicators){
		if (target_f){
			indicatorf.position.set(target_f.point.x, target_f.point.y, target_f.point.z);
		}
	    if (target_b){
			indicatorb.position.set(target_b.point.x, target_b.point.y, target_b.point.z);
		}
		if (target_l){
			indicatorl.position.set(target_l.point.x, target_l.point.y, target_l.point.z);
		}
		if (target_r){
			indicatorr.position.set(target_r.point.x, target_r.point.y, target_r.point.z);
		}
	}
	
	for (var i = 0; i < hoops.length; ++i){
	    hoops[i].rotation.y += 0.01;
	}

	if(falling()){
		console.log("falling");
        if (((squirrel_up.x == 0) && (squirrel_up.y == -1)) && (squirrel_up.z == 0)){
            squirrel_up = new THREE.Vector3(0, 1, 0);
        }
        else{
    	    squirrel_up.lerp(new THREE.Vector3(0, 1, 0), 0.1).normalize();
    	}
		squirrel_dir = squirrel_up.clone().cross(squirrel_left).normalize();
		squirrel_left = squirrel_up.clone().cross(squirrel_dir).normalize().negate();
	    if (((target_f && target_f.distance < from_freefall_limit) ||
            (target_b && target_b.distance < from_freefall_limit)) ||
            (((target_l && target_l.distance < from_freefall_limit) ||
            (target_r && target_r.distance < from_freefall_limit)) ||
            (target_ff && target_ff.distance < from_freefall_limit))
        ){
            var closest_intersect = target_f;
			var ps = [target_ff, target_b, target_l, target_r];
			for (var i = 0; i < ps.length; ++i){
				if (!closest_intersect || (ps[i] && ps[i].distance < closest_intersect.distance)){
					closest_intersect = ps[i];
				}
			}
            if(state["velocity"].dot(squirrel.position.clone().sub(closest_intersect.point)) < 0){
                state["action"] = "walking";
                state["time"] = 0;
            }
        }
        state["velocity"].add(new THREE.Vector3(0, -0.001, 0));
		const terminal_velocity = velocity_glitch_limit;
		if (state["velocity"].length() > terminal_velocity){
			state["velocity"].normalize().multiplyScalar(terminal_velocity);
		}
		if (falling()){
	        squirrel.position.add(state["velocity"]);
	    }
    }
	
	var target_f_point = null; //target_f.point;
	var target_b_point = null; //target_b.point;
	if (gripping()){
		console.log("not falling");
		var eps = 0.2;
	    if (
	        (target_f == null) ||
	        (target_f.distance > squirrel_elevation * 2)
	    ){
            target_f_point = squirrel.position.clone().add(
                squirrel_dir.clone().sub(
                    squirrel_up.clone().multiplyScalar(1 + eps)
                ).multiplyScalar(squirrel_elevation)
            )
			console.log("trying to correct...");
	    }
	    else{
	        target_f_point = target_f.point;
	    }
	    if (
	        (target_b == null) ||
	        (target_b.distance > squirrel_elevation * 2)
	    ){
            target_b_point = squirrel.position.clone().add(
                squirrel_dir.clone().negate().sub(
                    squirrel_up.clone().multiplyScalar(1 + eps)
                ).multiplyScalar(squirrel_elevation)
            )
			console.log("trying to backwards correct...");
	    }
	    else{
	        target_b_point = target_b.point;
	    }
	    if (target_ff && target_ff.distance < to_freefall_limit){
			if (target_f){
				target_f_point = target_f.point.clone().lerp(target_ff.point, 0.5);
			}
			else{
				target_f_point = target_ff.point;
			}
	    }
	    if (((!target_f || target_f.distance > to_freefall_limit) &&
            (!target_b || target_b.distance > to_freefall_limit)) &&
            ((!target_l || target_l.distance > to_freefall_limit) &&
            (!target_r || target_r.distance > to_freefall_limit))
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
	
	//cosole.log(acorns);
    const acorn_time = 30;
    var acorn_count = 0;
    for (var i = 0; i < acorns.length; ++i){
        if (acorns[i].visible){
            acorn_count += 1;
            if (squirrel.position.distanceTo(acorns[i].position) < 4 * squirrel_elevation){
                acorns[i].visible = false;
                play_munch();
                state["score"] += 1;
                state["frames_left"] += acorn_time;
                //document.getElementById("hint_button").innerHTML = "Hint";
            }
        }
    }

    var golden_count = 0;
    for (var i = 0; i < golden_acorns.length; ++i){
        if (golden_acorns[i].visible){
            golden_count += 1;
            if (squirrel.position.distanceTo(golden_acorns[i].position) < 4 * squirrel_elevation){
                golden_acorns[i].visible = false;
                state["score"] += 10;
                state["frames_left"] += acorn_time * 10;
                wahoo.play();
            }
        }

    }
    
    if (state["game_stage"] == "playing"){
	    document.getElementById('acorn_count').innerHTML= acorns.length - acorn_count;
	    document.getElementById('golden_acorn_count').innerHTML= golden_acorns.length - golden_count;
	}
	
	if (!state["won"] && state["game_stage"] == "playing"){
	    state["frames_left"] -= 1;
	    const date = new Date();
	    document.getElementById('health_bar').style.backgroundColor = (
	        "rgb(" + Math.min(Math.max(255 - state["frames_left"] * 255 / 1000, 0), 255) + ", " +
	        Math.min(state["frames_left"] * 255 / 1000, 255) + ", 0)"
	    );
	    document.getElementById('health_bar').style.width = (state["frames_left"] * 50 / 1000) + "%";
	    if (state["frames_left"] == 0){
	        show_winscreen();
	    }
	}
	
	if (!state["won"] && (acorn_count + golden_count == 0)){
	    // hopefully this condition isn't easily met...
        show_winscreen();
	}
	
	if (still()){
		state["time"] += 1;
		if (state["action"] == "sitting"){
			set_sitting_pose();
		}
		else if (state["action"] == "holding_on"){
			set_holding_on_pose();
		}
		if (state["time"] > 200){
		    state["action"] =  "repositioning";
		    state["time"] = 0;
		}
	}
	
	if (state["action"] == "repositioning"){
	    state["time"] += 1;
		var target_direction = new THREE.Vector3(0, 0, 0);
		var closest_distance = 1000000;
		var all_acorns = acorns.concat(golden_acorns);
	    for (var i = 0; i < all_acorns.length; ++i){
	    	if (all_acorns[i].visible){
	            const distance = squirrel.position.distanceTo(all_acorns[i].position);
	            if (distance < closest_distance){
                    target_direction = all_acorns[i].position.clone().sub(squirrel.position).normalize();
                    closest_distance = distance;
	            }
	        }
	    }
	    target_direction.sub(squirrel_up.clone().multiplyScalar(target_direction.dot(squirrel_up))).normalize();
	    console.log(target_direction);
	    set_walking_pose(frame_no * 0.2);
	    squirrel_dir.lerp(target_direction, 0.1).normalize();
		squirrel_left = squirrel_up.clone().cross(squirrel_dir.clone()).normalize().negate();
		if (state["time"] > 5){
		    stay_still();
		}
		
	}

	if (state["action"] == "walking"){
		state["time"] += 1;
		state["pose_time"] += state["pace"];
	    set_walking_pose(state["pose_time"]);
		squirrel_dir = target_f_point.clone().sub(target_b_point).normalize();
		var left_right = squirrel_left;
		if (target_l && target_r){
			left_right = target_l.point.clone().sub(target_r.point).normalize();
		}
		squirrel_up = squirrel_dir.clone().cross(left_right.clone().negate()).normalize();
		squirrel_left = squirrel_up.clone().cross(squirrel_dir.clone()).normalize().negate();
		var new_pos = target_b_point.clone().lerp(target_f_point, 0.5).add(
		    squirrel_up.clone().multiplyScalar(squirrel_elevation)
		);
		if (new_pos.distanceTo(squirrel.position) > squirrel_elevation){
		    console.log("not going to new position", new_pos.distanceTo(squirrel.position));
		    new_pos = squirrel.position.clone();
		}
		squirrel.position.set(new_pos.x, new_pos.y, new_pos.z);
		squirrel.position.add(squirrel_dir.clone().multiplyScalar(state["pace"]*frame_pace_multiplier));
		if (state["time"] > 15000000){
            stay_still();
		}
	}
	
	if (muted && !audio.paused){
	    pause_music();
	}
	else if (!muted && audio.paused){
	    play_music();
	}
	
	for (var i = 0; i < local_sounds.length; ++i){
	    if (
	        squirrel.position.distanceTo(local_sounds[i][0].clone().multiplyScalar(map_scale)) < 
	        local_sounds[i][1] * map_scale
	    ){
	        if (local_sounds[i][2].paused){
	            local_sounds[i][2].play();
	        }
	    }
	}
	
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
	
	if (squirrel.position.y < -5 * map_scale){
	    squirrel.position.y = 20 * map_scale;
    }
    
    const out_of_bounds = map_scale * map_width/2;
    squirrel.position.x = Math.min(
        out_of_bounds, Math.max(
            squirrel.position.x,
            -out_of_bounds,
        )
    );
    
    squirrel.position.z = Math.min(
        out_of_bounds, Math.max(
            squirrel.position.z,
            -out_of_bounds,
        )
    )
    
    if (state["game_stage"] == "title_screen"){
        var title_cam_direction = squirrel.position.clone().sub(camera.position);
        title_cam_direction.normalize();
		camera.position.sub(title_cam_direction.cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(0.01));
	    camera.lookAt(squirrel.position.x, squirrel.position.y, squirrel.position.z);
	    cam_direction = camera.position.clone().sub(squirrel.position).normalize();
	}else if (!state["map_editing"]){
		var actual_cam_direction = new THREE.Vector3(
		    squirrel.position.x - camera.position.x,
		    squirrel.position.y - camera.position.y,
		    squirrel.position.z - camera.position.z
	    );
		var actual_cam_distance = cam_distance;
        //console.log(intersects);
	    //console.log(cam_direction);
	    actual_cam_direction.normalize();
	    var cam_orthogonal = new THREE.Vector3(0, 1, 0);
	    cam_orthogonal.cross(cam_direction);
	    const cam_eps = 0.05;
		if (key_states["cam_left"]){
		    cam_direction.add(cam_orthogonal.clone().multiplyScalar(cam_eps));
		}
		if (key_states["cam_right"]){
		    cam_direction.sub(cam_orthogonal.clone().multiplyScalar(cam_eps));
		}
		if (key_states["cam_up"]){
		    cam_direction.y += cam_eps;
		}
		if (key_states["cam_down"]){
		    cam_direction.y -= cam_eps;
		}

		if (state["smart_cam"]){
			raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
			const intersects_down = raycaster.intersectObjects(map_mesh.children, true);
			// if under the ground, find the surface and go up to it
			if (!intersects_down[0]){
				raycaster.set(camera.position, new THREE.Vector3(0, 1, 0));
				const intersects_up = raycaster.intersectObjects(map_mesh.children, true);
				if (intersects_up[0]){
					cam_direction.y += 0.1;
				}
			}
			// if close to the groud, float up
			else if (intersects_down[0].distance < 0.1){
				cam_direction.y += 0.1 - intersects_down[0].distance;
			}
			cam_direction.normalize();
			//raycaster.setFromCamera( new THREE.Vector2(0, 0), camera );
			raycaster.set(squirrel.position, camera.position.clone().sub(squirrel.position).normalize() );
			const intersect_squirrel = raycaster.intersectObjects(scene.children, true);
			if (intersect_squirrel.length > 0){
				var idx = 0;
				while ((idx < intersect_squirrel.length - 1) && intersect_squirrel[idx].object.name == "Sphere"){
					idx += 1;
				}
				var ipos = intersect_squirrel[idx].point;
				//indicatorb.position.set(ipos.x, ipos.y, ipos.z);
				var d = intersect_squirrel[idx].distance;
				if (
					(d < cam_distance) &&
					(d > squirrel_elevation * 4)
				){
					//console.log("shortening distance!!!", d);
					actual_cam_distance = d * 0.8;
				}
			}
		}
	    camera.position.lerp(squirrel.position.clone().add(cam_direction.clone().multiplyScalar(actual_cam_distance)), 0.3);
	    camera.lookAt(squirrel.position.x, squirrel.position.y, squirrel.position.z);
	}

	var now = (new Date()).getTime();
	const target_frame_time = 1000/27;
	var spare_time = target_frame_time - (now - state["last_frame_time"]);
	if (spare_time > 5){
		state["smart_cam"] = 1;
	}
	else if (spare_time < -20){
		state["smart_cam"] = 0;
	}
	
	setTimeout(() => {
		renderer.render( scene, camera );
		state["last_frame_time"] = (new Date()).getTime();
		animate();
	}, Math.max(0, spare_time));
};

var music_playing = false;
const audio = new Audio('sounds/squirrel song.mp3');
const munch_audio_katie = new Audio('sounds/munch_katie.mp3');
const munch_audio_christian = new Audio('sounds/munch_christian.mp3');
const wahoo = new Audio('sounds/wahoo.mp3');
const aw_nuts = new Audio('sounds/aw_nuts.mp3');
const squeaks = new Audio('sounds/squeaks.mp3');
const jump_katie = new Audio('sounds/jump_katie.mp3');
const jump_christian = new Audio('sounds/jump_christian.mp3');
var local_sounds = [
    [new THREE.Vector3(-64, 0, 65), 15, new Audio('sounds/ufo_sound.mp3')],
    [new THREE.Vector3(15, 0, -59), 5, new Audio('sounds/fire_sound.mp3')],
    [new THREE.Vector3(-58, 0, 28), 3, new Audio('sounds/alien.mp3')],
];
function play_music(){
    var playPromise = audio.play();
}
function pause_music(){
    audio.pause();
}
function play_munch(){
    if (Math.random() < 0.5){
        munch_audio_christian.cloneNode().play();
    }else{
        munch_audio_katie.cloneNode().play();
    }
}

function play_jump(){
    if (Math.random() < 0.5){
        jump_christian.play();
    }else{
        jump_katie.play();
    }
}

function start_walking(){
	state["action"] = "walking";
	state["time"] = 0;
	state["pace"] = 0.2;
}

const eps = 0.2;
const cameps = 0.1;
const cameps_vertical = 0.1;
const roteps = 0.01;

function right(){
	if (still()){
		start_walking();
	}
	if (state["action"] == "walking"){
		squirrel_dir.sub(squirrel_left.clone().multiplyScalar(eps)).normalize();
		state["time"] = 0;
	}
}

function left(){
	if (still()){
		start_walking();
	}
	if (state["action"] == "walking"){
		squirrel_dir.add(squirrel_left.clone().multiplyScalar(eps)).normalize();
		state["time"] = 0;
	}
}

function foreward(){
	if (still()){
		start_walking();
	}
	if (state["action"] == "walking"){
		state["time"] = 0;
		state["pace"] += 0.1;
        state["pace"] = Math.min(state["pace"], max_pace);
	}
}

function back(){
	if (state["action"] == "walking"){
		state["pace"] -= 0.1;
	}
	if (state["pace"] < 0.2){
	    stay_still();
	}
}

function maybe_jump(){
	if (gripping()){
		play_jump();
		state["action"] = "jumping";
		state["time"] = 0;
		state["velocity"] = squirrel_dir.clone().add(
			squirrel_up.multiplyScalar(0.5)
		).multiplyScalar(0.02);
	}
}

var key_states = {
    "foreward": false,
    "back": false,
    "left":false,
    "right": false,
    "cam_left": false,
    "cam_right": false,
    "cam_up": false,
    "cam_down": false,
}

function reset_move_keys(){
	key_states["foreward"] = false;
	key_states["left"] = false;
	key_states["right"] = false;
	key_states["back"] = false;
}

function reset_cam_keys(){
	key_states["cam_up"] = false;
	key_states["cam_left"] = false;
	key_states["cam_right"] = false;
	key_states["cam_down"] = false;
}

function input_react(){
    if (!music_playing){
        play_music();
        music_playing=true;
    }
    if (state["game_stage"] == "title_screen" && !(state["won"] && !score_submitted)){
        document.getElementById("title_screen").hidden = true;
        state["game_stage"] = "playing";
        const date = new Date();
        state["start_time"] = date.getTime();
    }
}

const max_pace = Math.min(10, pace_glitch_limit);
document.onkeydown = function(e) {
    input_react();
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
    switch (e.keyCode) {
		case 37: // right
            key_states["right"] = true;
		break;
		case 38: // foreward
            key_states["foreward"] = true;
		break;
		case 39: // left
            key_states["left"] = true;
		break;
		case 40: // back
		    key_states["back"] = true;
		break;
		case 32: //  space initiates jump
			maybe_jump();
		break;
		//case "U".charCodeAt(0): //  u makes squirrel go up
		//	squirrel.position.y = squirrel.position.y + 1;
		//break;
		case "D".charCodeAt(0): // a key, camera left
		    key_states["cam_left"] = true;
		break;
		case "A".charCodeAt(0):
			key_states["cam_right"] = true;
		break;
		case "S".charCodeAt(0): // s key, camera down
			key_states["cam_down"] = true;
		break;
		case "W".charCodeAt(0): // w key, camera up
			key_states["cam_up"] = true;
		break;
		//case "C".charCodeAt(0):
		//  camera.position.add(new THREE.Vector3(cameps, 0, 0));
		//break;
		//case "Z".charCodeAt(0):
		//  camera.position.add(new THREE.Vector3(-cameps, 0, 0));
		//break;
		//case "E".charCodeAt(0): // e key, up
		//  camera.position.add(new THREE.Vector3(0, cameps, 0));
		//break;
		//case "Q".charCodeAt(0): // q key, camera down
		//  camera.position.sub(new THREE.Vector3(0, cameps, 0));
		//break;
		//case "R".charCodeAt(0): // e key, up
		//  camera.rotation.x += roteps;
		//break;
		//case "F".charCodeAt(0): // q key, camera down
		//  camera.rotation.x -= roteps;
		//break;
		//case "L".charCodeAt(0): // q key, camera down
		//	if (state["action"] == "walking"){
		//		state["action"] = "sitting";
		//	}
		//	else if (state["action"] == "sitting"){
		//		state["action"] = "walking";
		//	}
		//break;
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

window.onkeyup = function(e) {
    switch (e.keyCode) {
		case 37: // right
            key_states["right"] = false;
		break;
		case 38: // foreward
            key_states["foreward"] = false;
		break;
		case 39: // left
            key_states["left"] = false;
		break;
		case 40: // back
		    key_states["back"] = false;
		break;
		case "S".charCodeAt(0): // s key, camera down
			key_states["cam_down"] = false;
		break;
		case "W".charCodeAt(0): // w key, camera up
			key_states["cam_up"] = false;
		break;
		case "D".charCodeAt(0): // a key, camera left
		    key_states["cam_left"] = false;
		break;
		case "A".charCodeAt(0):
			key_states["cam_right"] = false;
		break;
    }
}

function feel(touch, direction=true){
	//document.getElementById("debug_p").innerHTML = JSON.stringify(key_states);
	//document.getElementById("debug_p").innerHTML = direction;
    if (touch.clientY > window.innerHeight/2){
		if (touch.clientX > window.innerWidth/2){
			var x = touch.clientX - window.innerWidth * 3/4;
			var y = touch.clientY - window.innerHeight * 3/4;
			reset_move_keys();
			if (Math.abs(x) > Math.abs(y)){
				if (x > 0){
					key_states["left"] = direction;
					document.getElementById("move_arrows").style.borderRight = window.innerWidth/4 + "px solid black";
				}else{
					key_states["right"] = direction;
					document.getElementById("move_arrows").style.borderLeft = window.innerWidth/4 + "px solid black";
				}
			}else{
				if (y > 0){
					key_states["back"] = direction;
					document.getElementById("move_arrows").style.borderBottom = window.innerHeight/4 + "px solid black";
				}else{
					key_states["foreward"] = direction;
					document.getElementById("move_arrows").style.borderTop = window.innerHeight/4 + "px solid black";
				}
			}
		}
		else{
			reset_cam_keys();
			var x = touch.clientX - window.innerWidth/4;
			var y = touch.clientY - window.innerHeight * 3/4;
			if (Math.abs(x) > Math.abs(y)){
				if (x > 0){
					key_states["cam_left"] = direction;
					document.getElementById("cam_arrows").style.borderRight = window.innerWidth/4 + "px solid black";
				}else{
					key_states["cam_right"] = direction;
					document.getElementById("cam_arrows").style.borderLeft = window.innerWidth/4 + "px solid black";
				}
			}else{
				if (y > 0){
					key_states["cam_down"] = direction;
					document.getElementById("cam_arrows").style.borderBottom = window.innerHeight/4 + "px solid black";
				}else{
					key_states["cam_up"] = direction;
					document.getElementById("cam_arrows").style.borderTop = window.innerHeight/4 + "px solid black";
				}
			}
		}
    }else{
		maybe_jump();
	}
}

document.ontouchstart = function(e) {
    input_react();
	for (var i = 0; i < e.touches.length; ++i){
		feel(e.touches[i], true);
	}
	document.body.requestFullscreen();
}
document.ontouchend = function(e) {
	//document.getElementById("debug_p").innerHTML = e.touches.length;
	key_states = {
		"foreward": false,
		"back": false,
		"left":false,
		"right": false,
		"cam_left": false,
		"cam_right": false,
		"cam_up": false,
		"cam_down": false,
	}
	reset_touch_feedback();
}
document.ontouchmove = function(e) {
    input_react();
	for (var i = 0; i < e.touches.length; ++i){
		feel(e.touches[i], true);
	}
	document.body.requestFullscreen();
}


function onDocumentMouseWheel( event ) {

}

// todo : sort out this vs. map_editing
const click_to_add = false;
function onDocumentClick( event ) {
    if (click_to_add){
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
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    console.log("resizing");

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
document.addEventListener( 'click', onDocumentClick, false );

animate();

