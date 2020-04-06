/*==========Imports Start==========*/
import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader';

//var selectedCountry=JSON.parse(localStorage.getItem("selectedCountry"))
var selectedCountry = {
    "name": "Morocco",
    "colors": ["#c1272d", "#006233"],
    "geo": {
        "latitude": 31.791702,
        "longitude": -7.09262
    },
    "data": {
        "cases": 275586,
        "deaths": 20
    }
}
console.log('selectedCountry: ', selectedCountry)
///////////////

// GAME VARIABLES
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var enemiesPool = [];
var seaEnemiesPool = []
var particlesPool = [];
var countryColors = JSON.parse(localStorage.getItem("countryCodes"))

function resetGame() {
    game = {
        speed: 0,
        initSpeed: .00035,
        baseSpeed: .00035,
        targetBaseSpeed: .00035,
        incrementSpeedByTime: .0000025,
        incrementSpeedByLevel: .000005,
        distanceForSpeedUpdate: 1000,
        speedLastUpdate: 0,

        distance: 0,
        ratioSpeedDistance: 50,
        energy: 100,
        ratioSpeedEnergy: 3,

        level: 1,
        levelLastUpdate: 0,
        distanceForLevelUpdate: 0,

        planeDefaultHeight: 100,
        planeAmpHeight: 80,
        planeAmpWidth: 75,
        planeMoveSensivity: 0.005,
        planeRotXSensivity: 0.0008,
        planeRotZSensivity: 0.0004,
        planeFallSpeed: .001,
        planeMinSpeed: 1.2,
        planeMaxSpeed: 1.6,
        planeSpeed: 0,
        planeCollisionDisplacementX: 0,
        planeCollisionSpeedX: 0,

        planeCollisionDisplacementY: 0,
        planeCollisionSpeedY: 0,

        seaRadius: 600,
        seaLength: window.innerWidth,
        //seaRotationSpeed:0.006,
        wavesMinAmp: 10,
        wavesMaxAmp: 25,
        wavesMinSpeed: 0.003,
        wavesMaxSpeed: 0.009,

        cameraFarPos: 500,
        cameraNearPos: 150,
        cameraSensivity: 0.002,

        coinDistanceTolerance: 15,
        coinValue: 3,
        coinsSpeed: .5,
        coinLastSpawn: 0,
        distanceForCoinsSpawn: 100,

        enemyDistanceTolerance: 10,
        enemyValue: 10,
        enemiesSpeed: .6,
        enemyLastSpawn: 0,
        distanceForEnemiesSpawn: 50,
        status: "playing",
        levelVaccine: 0,
    };
    fieldLevel.innerHTML = Math.floor(game.level);
}

//THREEJS RELATED VARIABLES

let scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer,
    container, collector,
    controls;
const loader = new GLTFLoader();

// Smart Contracts functions

function determineLevel() {
    var deaths = selectedCountry.data.deaths
    console.log('deaths >0 && deaths <100', deaths > 0 && deaths < 100)
    console.log('deaths >=100 && deaths <=5000', deaths >= 100 && deaths <= 5000)
    console.log('deaths >=5000', deaths >= 5000)
    if (deaths > 0 && deaths < 100) {
        game.levelVaccine = 3
        game.distanceForSpeedUpdate = 8000
        game.distanceForLevelUpdate = 8000
    }
    if (deaths >= 100 && deaths <= 5000) {
        game.levelVaccine = 3
        game.distanceForSpeedUpdate = 8000
        game.distanceForLevelUpdate = 8000
    } else if (deaths >= 5000) {
        game.levelVaccine = 9
        game.distanceForSpeedUpdate = 3000
        game.distanceForLevelUpdate = 3000
    }
    fieldVaccine.innerHTML = game.levelVaccine
}
//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = {
        x: 0,
        y: 0
    };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = .1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    scene.fog = new THREE.Fog(selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)].replace('#', '0x'), 100, 950);
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = game.planeDefaultHeight;
    //camera.lookAt(new THREE.Vector3(0, 400, 0));

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);

    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);

    /*
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minPolarAngle = -Math.PI / 2;
    controls.maxPolarAngle = Math.PI ;

    //controls.noZoom = true;
    //controls.noPan = true;
    //*/
}

// MOUSE AND SCREEN EVENTS

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = {
        x: tx,
        y: ty
    };
}

function handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH) * 2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT) * 2;
    mousePos = {
        x: tx,
        y: ty
    };
}

function handleMouseUp(event) {
    if (game.status == "waitingReplay") {
        resetGame();
        hideReplay();
    }
}


function handleTouchEnd(event) {
    if (game.status == "waitingReplay") {
        resetGame();
        hideReplay();
    }
}

// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)

    ambientLight = new THREE.AmbientLight(0xdc8874, .5);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 4096;
    shadowLight.shadow.mapSize.height = 4096;

    var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

    //scene.add(ch);
    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);

}



var AirPlane = async function () {
    Promise.resolve(loadModel()).then((bucket, error) => {
        console.log('error: ', error, ' bucket: ', bucket)
        this.mesh = bucket
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    });
};

var Sky = function () {
    this.mesh = new THREE.Object3D();
    var nClouds = 40;
    this.clouds = [];
    var stepAngle = Math.PI * 2 / nClouds;
    for (var i = 0; i < nClouds; i++) {
        var c = new Cloud();
        var a = stepAngle * i;
        var h = game.seaRadius + 150 + Math.random() * 200;
        c.mesh.position.y = Math.sin(a) * h;
        c.mesh.position.x = Math.cos(a) * h;
        c.mesh.position.z = -300 - Math.random() * 500;
        c.mesh.rotation.y = a + Math.PI / 2;
        var s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);
        c.mesh.color = new THREE.Color(selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)])
        this.mesh.add(c.mesh);
        this.clouds.push(c);
    }
    // return mesh
}

Sky.prototype.moveClouds = function () {
    for (var i = 0; i < this.nClouds; i++) {
        var c = this.clouds[i];
        c.rotate();
    }
    this.mesh.rotation.y += game.speed * deltaTime;

}
var Sea = function () {
    var geom = new THREE.CylinderGeometry(game.seaRadius, game.seaRadius, game.seaLength, 40, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    geom.mergeVertices();
    var l = geom.vertices.length;

    this.waves = [];

    for (var i = 0; i < l; i++) {
        var v = geom.vertices[i];
        //v.y = Math.random()*30;
        this.waves.push({
            y: v.y,
            x: v.x,
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: game.wavesMinAmp + Math.random() * (game.wavesMaxAmp - game.wavesMinAmp),
            speed: game.wavesMinSpeed + Math.random() * (game.wavesMaxSpeed - game.wavesMinSpeed)
        });
    };
    var mat = new THREE.MeshPhongMaterial({
        color: "#48bf91",
        transparent: true,
        opacity: 1,
        shading: THREE.FlatShading,

    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.name = "waves";
    this.mesh.receiveShadow = true;

}

Sea.prototype.moveWaves = function () {
    var verts = this.mesh.geometry.vertices;
    var l = verts.length;
    for (var i = 0; i < l; i++) {
        var v = verts[i];
        var vprops = this.waves[i];
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
        vprops.ang += vprops.speed * deltaTime;
        this.mesh.geometry.verticesNeedUpdate = true;
    }
}

var Cloud = function () {
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";
    var geom = new THREE.CubeGeometry(20, 20, 20);
    var mat = new THREE.MeshPhongMaterial({
        color: selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)],

    });

    //*
    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++) {
        var m = new THREE.Mesh(geom.clone(), mat);
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);
        this.mesh.add(m);
        m.castShadow = true;
        m.receiveShadow = true;

    }
    //*/
}

Cloud.prototype.rotate = function () {
    var l = this.mesh.children.length;
    for (var i = 0; i < l; i++) {
        var m = this.mesh.children[i];
        m.rotation.z += Math.random() * .005 * (i + 1);
        m.rotation.y += Math.random() * .002 * (i + 1);
    }
}

async function loadModel() {
    return new Promise((resolve) => {
        loader.load('/3d-Models/Cubeta.glb', (gltf) => {
            console.log('loaded model..: ', gltf);
            resolve(gltf.scene.children[3])
        }, (xhr) => {
            // called while loading is progressing
            console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
        }, (error) => {
            // called when loading has errors
            console.error('An error happened', error);
        });
    })
}

function Enemy() {
    var mesh = new THREE.Object3D()
    var geom = new THREE.TetrahedronGeometry(8, 2);
    var mat = new THREE.MeshPhongMaterial({
        color: selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)],
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
    });
    mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.angle = 0
    mesh.dist = 0
    return mesh
}

function SeaEnemy() {
    var mesh = new THREE.Object3D()
    var geom = new THREE.TetrahedronGeometry(8, 2);
    var mat = new THREE.MeshPhongMaterial({
        color: selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)],
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
    });
    mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.scale.set(1.8, 1.8, 1.3)

    mesh.angle = 0
    mesh.dist = 0
    return mesh
}
var EnemiesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.enemiesInUse = [];
}
var SeaObjectsHolder = function () {
    this.mesh = new THREE.Object3D();
    this.seaEnemiesInUse = [];
}
SeaObjectsHolder.prototype.spawnSeaEnemies = function () {
    var nSeaEnemies = game.level;

    for (var i = 0; i < nSeaEnemies; i++) {
        var enemy;
        if (seaEnemiesPool.length) {
            enemy = seaEnemiesPool.pop();
        } else {
            enemy = new SeaEnemy();
        }

        enemy.angle = -(i * 0.1);
        enemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
        enemy.position.y = 10;
        enemy.position.x = collector.position.x + Math.random() * 70;
        this.mesh.add(enemy);
        this.seaEnemiesInUse.push(enemy);
    }
}
SeaObjectsHolder.prototype.increaseSeaEnemies = function () {
    console.log('adding enemy..')
    enemy = new SeaEnemy();
    enemy.angle = -(3 * 0.1);
    enemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    enemy.position.y = 10;
    enemy.position.x = collector.position.x + Math.random() * 50;
    this.mesh.add(enemy);
    this.seaEnemiesInUse.push(enemy);

}

EnemiesHolder.prototype.spawnEnemies = function () {
    var nEnemies = game.level;

    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    var amplitude = 10 + Math.round(Math.random() * 10);
    for (var i = 0; i < nEnemies; i++) {
        var enemy;
        if (enemiesPool.length) {
            enemy = enemiesPool.pop();
        } else {
            enemy = new Enemy();
        }
        this.mesh.add(enemy);
        this.enemiesInUse.push(enemy);
        enemy.angle = -(i * 0.01);
        enemy.distance = d + Math.cos(i * .5) * amplitude;
        enemy.position.y = -game.seaRadius + Math.sin(enemy.angle) * enemy.distance;
        enemy.position.x = Math.cos(enemy.angle) * enemy.distance;
        console.log('spawned enemy: ', enemy.position)

    }
}

SeaObjectsHolder.prototype.rotateEnemies = function () {
    for (var i = 0; i < this.seaEnemiesInUse.length; i++) {
        var enemy = this.seaEnemiesInUse[i];
        enemy.angle += game.speed * deltaTime * game.enemiesSpeed;

        if (enemy.angle > Math.PI * 2) enemy.angle -= Math.PI * 2;

        enemy.translateY(game.enemiesSpeed * deltaTime)
        //enemy.position.x = Math.cos(enemy.angle)*enemy.distance;
        //enemy.rotation.y += Math.random()*.1;
        //enemy.rotation.x += Math.random()*.1;

        //var globalenemyPosition =  enemy.localToWorld(new THREE.Vector3());
        var diffPos = collector.position.clone().sub(enemy.position.clone());
        var d = diffPos.length();
        if (d < game.enemyDistanceTolerance) {
            particlesHolder.spawnParticles(enemy.position.clone(), 15, selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)], 3);

            seaEnemiesPool.unshift(this.seaEnemiesInUse.splice(i, 1)[0]);
            this.mesh.remove(enemy);
            game.planeCollisionSpeedX = 100 * diffPos.x / d;
            game.planeCollisionSpeedY = 100 * diffPos.y / d;
            ambientLight.intensity = 0.5;

            removeEnergy();
            i--;
        } else
        if (enemy.angle > Math.PI) {
            enemiesPool.unshift(this.seaEnemiesInUse.splice(i, 1)[0]);
            this.mesh.remove(enemy);
            i--;
        }
    }
}

EnemiesHolder.prototype.rotateEnemies = function () {
    for (var i = 0; i < this.enemiesInUse.length; i++) {
        var enemy = this.enemiesInUse[i];
        if (enemy.exploding) continue;
        enemy.angle += game.speed * deltaTime * game.enemiesSpeed;
        if (enemy.angle > Math.PI * 2) enemy.angle -= Math.PI * 2;
        enemy.position.y = -game.seaRadius + Math.sin(enemy.angle) * enemy.distance;
        enemy.position.x = Math.cos(enemy.angle) * enemy.distance;
        enemy.rotation.z += Math.random() * .1;
        enemy.rotation.y += Math.random() * .1;

        //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
        var diffPos = collector.position.clone().sub(enemy.position.clone());
        var d = diffPos.length();
        if (d < game.enemyDistanceTolerance) {
            enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
            this.mesh.remove(enemy);
            particlesHolder.spawnParticles(enemy.position.clone(), 5, 0x009999, .8);
            game.planeCollisionSpeedX = 100 * diffPos.x / d;
            game.planeCollisionSpeedY = 100 * diffPos.y / d;
            ambientLight.intensity = 2;

            removeEnergy();
            i--;
        } else
        if (enemy.angle > Math.PI) {
            enemiesPool.unshift(this.enemiesInUse.splice(i, 1)[0]);
            this.mesh.remove(enemy);
            i--;
        }
    }
}

var Particle = function () {
    var geom = new THREE.TetrahedronGeometry(3, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: "#00ff00",
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom, mat);
}

Particle.prototype.explode = function (pos, color, scale) {
    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(color);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random() * 2) * 50;
    var targetY = pos.y + (-1 + Math.random() * 2) * 50;
    var speed = .6 + Math.random() * .2;
    TweenMax.to(this.mesh.rotation, speed, {
        x: Math.random() * 12,
        y: Math.random() * 12
    });
    TweenMax.to(this.mesh.scale, speed, {
        x: .1,
        y: .1,
        z: .1
    });
    TweenMax.to(this.mesh.position, speed, {
        x: targetX,
        y: targetY,
        delay: Math.random() * .1,
        ease: Power2.easeOut,
        onComplete: function () {
            if (_p) _p.remove(_this.mesh);
            _this.mesh.scale.set(1, 1, 1);
            particlesPool.unshift(_this);
        }
    });
}

var ParticlesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function (pos, density, color, scale) {

    var nPArticles = density;
    for (var i = 0; i < nPArticles; i++) {
        var particle;
        if (particlesPool.length) {
            particle = particlesPool.pop();
        } else {
            particle = new Particle();
        }
        this.mesh.add(particle.mesh);
        particle.mesh.visible = true;
        var _this = this;
        particle.mesh.position.y = pos.y;
        particle.mesh.position.x = pos.x;
        particle.explode(pos, color, scale);
    }
}

var Coin = function () {
    var geom = new THREE.TetrahedronGeometry(5, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)],
        shininess: 0,
        specular: 0xffffff,
        shading: THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
    this.angle = 0;
    this.dist = 0;
}

var CoinsHolder = function (nCoins) {
    this.mesh = new THREE.Object3D();
    this.coinsInUse = [];
    this.coinsPool = [];
    for (var i = 0; i < nCoins; i++) {
        var coin = new Coin();
        this.coinsPool.push(coin);
    }
}

CoinsHolder.prototype.spawnCoins = function () {

    var nCoins = 1 + Math.floor(Math.random() * 10);
    var d = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight - 20);
    var amplitude = 10 + Math.round(Math.random() * 10);
    for (var i = 0; i < nCoins; i++) {
        var coin;
        if (this.coinsPool.length) {
            coin = this.coinsPool.pop();
        } else {
            coin = new Coin();
        }
        this.mesh.add(coin.mesh);
        this.coinsInUse.push(coin);
        coin.angle = -(i * 0.02);
        coin.distance = d + Math.cos(i * .5) * amplitude;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
    }
}

CoinsHolder.prototype.rotateCoins = function () {
    for (var i = 0; i < this.coinsInUse.length; i++) {
        var coin = this.coinsInUse[i];
        if (coin.exploding) continue;
        coin.angle += game.speed * deltaTime * game.coinsSpeed;
        if (coin.angle > Math.PI * 2) coin.angle -= Math.PI * 2;
        coin.mesh.position.y = -game.seaRadius + Math.sin(coin.angle) * coin.distance;
        coin.mesh.position.x = Math.cos(coin.angle) * coin.distance;
        coin.mesh.rotation.z += Math.random() * .1;
        coin.mesh.rotation.y += Math.random() * .1;

        //var globalCoinPosition =  coin.mesh.localToWorld(new THREE.Vector3());
        var diffPos = collector.position.clone().sub(coin.mesh.position.clone());
        var d = diffPos.length();
        if (d < game.coinDistanceTolerance) {
            this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
            this.mesh.remove(coin.mesh);
            particlesHolder.spawnParticles(coin.mesh.position.clone(), 5, 0x009999, .8);
            addEnergy();
            i--;
        } else
        if (coin.angle > Math.PI) {
            this.coinsPool.unshift(this.coinsInUse.splice(i, 1)[0]);
            this.mesh.remove(coin.mesh);
            i--;
        }
    }
}


// 3D Models
let sea, sky, coinsHolder, enemiesHolder, seaObjectsHolder, particlesHolder;

function createPlane() {
    return new Promise(async (resolve) => {
        // var tempBucket = await Promise.resolve(loadModel())
        var geom = new THREE.TetrahedronGeometry(8, 2);
        var mat = new THREE.MeshPhongMaterial({
            color: selectedCountry.colors[Math.round(Math.random() * selectedCountry.colors.length - 1)],
            shininess: 0,
            specular: 0xffffff,
            shading: THREE.FlatShading
        });
        collector = new THREE.Mesh(geom, mat);
        collector.castShadow = true;
        collector.receiveShadow = true;
        collector.angle = 0
        collector.dist = 0
        collector.position.y = game.planeDefaultHeight;
        scene.add(collector);
        resolve(collector)
    })


}

function createSea() {
    sea = new Sea();
    sea.mesh.position.y = -game.seaRadius;
    scene.add(sea.mesh);
}

function createSky() {
    sky = new Sky();
    sky.mesh.position.y = -game.seaRadius;
    //sky.mesh.color = new THREE.Color("#d1b790")
    scene.add(sky.mesh);
}

function createCoins() {
    coinsHolder = new CoinsHolder(20);
    scene.add(coinsHolder.mesh)
}

function createEnemies() {
    for (var i = 0; i < 10; i++) {
        var enemy = new Enemy();
        enemiesPool.push(enemy);
        seaEnemiesPool.push(enemy)
    }
    enemiesHolder = new EnemiesHolder();
    seaObjectsHolder = new SeaObjectsHolder()
    //enemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(enemiesHolder.mesh)
    scene.add(seaObjectsHolder.mesh)

}

function createSeaEnemies() {
    for (var i = 0; i < 10; i++) {
        var enemy = new Enemy();
        seaEnemiesPool.push(enemy)
    }
    seaObjectsHolder = new SeaObjectsHolder()
    //enemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(seaObjectsHolder.mesh)

}

function createParticles() {
    for (var i = 0; i < 10; i++) {
        var particle = new Particle();
        particlesPool.push(particle);
    }
    particlesHolder = new ParticlesHolder();
    //enemiesHolder.mesh.position.y = -game.seaRadius;
    scene.add(particlesHolder.mesh)
}

function loop() {

    newTime = new Date().getTime();
    deltaTime = newTime - oldTime;
    oldTime = newTime;

    if (game.status == "playing") {

        // Add energy coins every 100m;
        if (Math.floor(game.distance) % game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn) {
            game.coinLastSpawn = Math.floor(game.distance);
            coinsHolder.spawnCoins();
        }

        if (Math.floor(game.distance) % game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate) {
            game.speedLastUpdate = Math.floor(game.distance);
            game.targetBaseSpeed += game.incrementSpeedByTime * deltaTime;
        }


        if (Math.floor(game.distance) % game.distanceForEnemiesSpawn == 0 && Math.floor(game.distance) > game.enemyLastSpawn) {
            game.enemyLastSpawn = Math.floor(game.distance);
            enemiesHolder.spawnEnemies();
            seaObjectsHolder.spawnSeaEnemies();
        }

        if (Math.floor(game.distance) % game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate) {
            game.levelLastUpdate = Math.floor(game.distance);
            game.level++;
            game.levelVaccine--
            fieldLevel.innerHTML = Math.floor(game.level);
            fieldVaccine.innerHTML = Math.floor(game.levelVaccine);
            game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel * game.level
            seaObjectsHolder.increaseSeaEnemies()
        }


        updatePlane();
        updateDistance();
        updateEnergy();
        game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
        game.speed = game.baseSpeed * game.planeSpeed;

    } else if (game.status == "gameover") {
        game.speed *= .99;
        collector.rotation.z += (-Math.PI / 2 - collector.rotation.z) * .0002 * deltaTime;
        collector.rotation.x += 0.0003 * deltaTime;
        game.planeFallSpeed *= 1.05;
        collector.position.y -= game.planeFallSpeed * deltaTime;

        if (collector.position.y < -200) {
            showReplay();
            game.status = "waitingReplay";

        }
    } else
    if (game.status == "waitingReplay") {

    }


    sea.mesh.rotation.y += game.speed * deltaTime; //*game.seaRotationSpeed;

    if (sea.mesh.rotation.y > 2 * Math.PI) sea.mesh.rotation.x -= 2 * Math.PI;

    ambientLight.intensity += (.5 - ambientLight.intensity) * deltaTime * 0.005;

    coinsHolder.rotateCoins();
    enemiesHolder.rotateEnemies();
    seaObjectsHolder.rotateEnemies();
    sky.moveClouds();
    sea.moveWaves();

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}

function updateDistance() {
    game.distance += game.speed * deltaTime * game.ratioSpeedDistance;
    fieldDistance.innerHTML = Math.floor(game.distance);
    var d = 502 * (1 - (game.distance % game.distanceForLevelUpdate) / game.distanceForLevelUpdate);
    levelCircle.setAttribute("stroke-dashoffset", d);
    vaccineCircle.setAttribute("stroke-dashoffset", d);

}

var blinkEnergy = false;

function updateEnergy() {
    game.energy -= game.speed * deltaTime * game.ratioSpeedEnergy;
    game.energy = Math.max(0, game.energy);
    energyBar.style.right = (100 - game.energy) + "%";
    energyBar.style.backgroundColor = (game.energy < 50) ? "#f25346" : "#68c3c0";

    if (game.energy < 30) {
        energyBar.style.animationName = "blinking";
    } else {
        energyBar.style.animationName = "none";
    }

    if (game.energy < 1) {
        game.status = "gameover";
    }
}

function addEnergy() {
    game.energy += game.coinValue;
    game.energy = Math.min(game.energy, 100);
}

function removeEnergy() {
    game.energy -= game.enemyValue;
    game.energy = Math.max(0, game.energy);
}

function updatePlane() {

    game.planeSpeed = normalize(mousePos.x, -.5, .5, game.planeMinSpeed, game.planeMaxSpeed);
    var targetY = normalize(mousePos.y, -.75, .75, game.planeDefaultHeight - game.planeAmpHeight, game.planeDefaultHeight + game.planeAmpHeight);
    var targetX = normalize(mousePos.x, -1, 1, -game.planeAmpWidth * .7, -game.planeAmpWidth);

    game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
    targetX += game.planeCollisionDisplacementX;


    game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
    targetY += game.planeCollisionDisplacementY;

    collector.position.y += (targetY - collector.position.y) * deltaTime * game.planeMoveSensivity;
    collector.position.x += (targetX - collector.position.x) * deltaTime * game.planeMoveSensivity;

    collector.rotation.z = (targetY - collector.position.y) * deltaTime * game.planeRotXSensivity;
    collector.rotation.x = (collector.position.y - targetY) * deltaTime * game.planeRotZSensivity;
    var targetCameraZ = normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);
    //camera.fov = normalize(mousePos.x, -1, 1, 40, 80);
    //camera.updateProjectionMatrix()
    //camera.position.y += (collector.position.y - camera.position.y) * deltaTime * game.cameraSensivity;

    game.planeCollisionSpeedX += (0 - game.planeCollisionSpeedX) * deltaTime * 0.03;
    game.planeCollisionDisplacementX += (0 - game.planeCollisionDisplacementX) * deltaTime * 0.01;
    game.planeCollisionSpeedY += (0 - game.planeCollisionSpeedY) * deltaTime * 0.03;
    game.planeCollisionDisplacementY += (0 - game.planeCollisionDisplacementY) * deltaTime * 0.01;

}

function showReplay() {
    replayMessage.style.display = "block";
}

function hideReplay() {
    replayMessage.style.display = "none";
}

function normalize(v, vmin, vmax, tmin, tmax) {
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}

var fieldDistance, energyBar, replayMessage, fieldLevel, levelCircle, vaccineCircle, fieldVaccine;

function init(event) {

    // UI

    fieldDistance = document.getElementById("distValue");
    energyBar = document.getElementById("energyBar");
    replayMessage = document.getElementById("replayMessage");
    fieldLevel = document.getElementById("levelValue");
    fieldVaccine = document.getElementById("vaccineValue")
    levelCircle = document.getElementById("levelCircleStroke");
    vaccineCircle = document.getElementById("vaccineCircleStroke");

    resetGame();
    createScene();
    determineLevel()
    createLights();
    createPlane().then((results, error) => {
        createSea();
        createSky();
        createCoins();
        createEnemies();
        createSeaEnemies();
        createParticles();
        document.addEventListener('mousemove', handleMouseMove, false);
        document.addEventListener('touchmove', handleTouchMove, false);
        document.addEventListener('mouseup', handleMouseUp, false);
        document.addEventListener('touchend', handleTouchEnd, false);

        loop();
    })

}

window.addEventListener('load', init, false);