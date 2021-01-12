let initScene,
    render,
    ground_material,
    border_material,
    renderer,
    scene,
    ground = {},
    light,
    camera;


initScene = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#e5e5e5');
    document.body.appendChild(renderer.domElement);

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -30, 0));

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(80, 80, 280);
    camera.lookAt(scene.position);
    scene.add(camera);

    // LIGHTS
    var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    light.position.set(50, 100, 10);
    light.sh;
    scene.add(light);

    // GROUND
    loader = new THREE.TextureLoader();
    var ground_texture = loader.load('/images/dark-grass.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
    });
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({ map: ground_texture }),
        0.9,
        0.4
    );

    ground.plane = new Physijs.BoxMesh(
        new THREE.BoxGeometry(100, 1, 100),
        ground_material,
    );
    ground.plane.receiveShadow = true;
    scene.add(ground.plane);

    // GROUND - BORDERS
    var border_texture = loader.load('/images/wood.jpg', function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    });
    border_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            map: border_texture,
        }),
        0.1,
        0.9
    );

    border_material.map.wrapS = border_material.map.wrapT =
        THREE.RepeatWrapping;

    let border_height = 10;

    // GROUND - BORDERS - EAST
    ground.east_border = new Physijs.BoxMesh(
        new THREE.BoxGeometry(2, border_height, 100),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.east_border.position.set(49, border_height / 2 + 0.5, 0);
    scene.add(ground.east_border);

    // GROUND - BORDERS - WEST
    ground.west_border = new Physijs.BoxMesh(
        new THREE.BoxGeometry(2, border_height, 100),
        ground_material,
        0, // mass
        { restitution: 0.9, friction: 0.1 }
    );
    ground.west_border.position.set(-49, border_height / 2 + 0.5, 0);
    scene.add(ground.west_border);

    // GROUND - BORDERS - NORTH
    ground.north_border_1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(35, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.north_border_1.position.set(-30.5, border_height / 2 + 0.5, -49);
    scene.add(ground.north_border_1);

    ground.north_border_2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(35, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.north_border_2.position.set(30.5, border_height / 2 + 0.5, -49);
    scene.add(ground.north_border_2);

    // GROUND - BORDERS - SOUTH
    ground.south_border_1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(35, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.south_border_1.position.set(-30.5, border_height / 2 + 0.5, 49);
    scene.add(ground.south_border_1);

    ground.south_border_2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(35, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.south_border_2.position.set(30.5, border_height / 2 + 0.5, 49);
    scene.add(ground.south_border_2);

    requestAnimationFrame(render);
    scene.simulate();
};

render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
};

window.onload = initScene;
