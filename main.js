let initScene,
    render,
    ground_material,
    border_material,
    renderer,
    scene,
    ground = {},
    light,
    camera,
    ball_material,
    ball,
    createBall,
    checkBallPosition;


initScene = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#e5e5e5');
    document.body.appendChild(renderer.domElement);

    scene = new Physijs.Scene();
    scene.setGravity(new THREE.Vector3(0, -30, 0));
    scene.addEventListener('update', function () {
        scene.simulate(undefined, 2);
        checkCarPosition();
        checkBallPosition();
    });

    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(250, 0, 280);
    camera.lookAt(scene.position);
    scene.add(camera);

    // ORBIT CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.4;
    controls.target.set(0, 40, 0);
    controls.enableZoom = false;

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
        new THREE.BoxGeometry(200, 1, 200),
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
    border_material.map.repeat.set(0.5, 0.5);

    let border_height = 10;

    // GROUND - BORDERS - EAST
    ground.east_border = new Physijs.BoxMesh(
        new THREE.BoxGeometry(2, border_height, 200),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.east_border.position.set(99, border_height / 2 + 0.5, 0);
    scene.add(ground.east_border);

    // GROUND - BORDERS - WEST
    ground.west_border = new Physijs.BoxMesh(
        new THREE.BoxGeometry(2, border_height, 200),
        ground_material,
        0, // mass
        { restitution: 0.9, friction: 0.1 }
    );
    ground.west_border.position.set(-99, border_height / 2 + 0.5, 0);
    scene.add(ground.west_border);

    // GROUND - BORDERS - NORTH
    ground.north_border_1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.north_border_1.position.set(-60, border_height / 2 + 0.5, -99);
    scene.add(ground.north_border_1);

    ground.north_border_2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.north_border_2.position.set(60, border_height / 2 + 0.5, -99);
    scene.add(ground.north_border_2);

    // GROUND - BORDERS - SOUTH
    ground.south_border_1 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.south_border_1.position.set(-60, border_height / 2 + 0.5, 99);
    scene.add(ground.south_border_1);

    ground.south_border_2 = new Physijs.BoxMesh(
        new THREE.BoxGeometry(76, border_height, 2),
        ground_material,
        0, 
        { restitution: 0.9, friction: 0.1 }
    );
    ground.south_border_2.position.set(60, border_height / 2 + 0.5, 99);
    scene.add(ground.south_border_2);

        // BALL
        createBall = () => {
            ball_material = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({ color: 0xffffff }),
                0.1,
                1
            );
            ball = new Physijs.SphereMesh(
                new THREE.SphereGeometry(5, 20, 20),
                ball_material,
                20, // mass
                { restitution: 0.9, friction: 0.9 }
            );
            ball.position.x = -10;
            ball.position.y = 25;
            scene.add(ball);
        };
        createBall();

        checkBallPosition = () => {
            if (ball.position.y < 0) {
                createBall();
            }
        };

    requestAnimationFrame(render);
    scene.simulate();
};


render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
};

window.onload = initScene;
