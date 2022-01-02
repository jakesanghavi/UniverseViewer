let data;

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}

const container = document.querySelector('.scene');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, document.body.clientWidth/document.body.clientHeight, 1, 5000);
camera.position.set(0, 400, 20);
camera.lookAt(new THREE.Vector3(0,0,0));

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const card = document.getElementById("card");
const ex = document.getElementById("ex");
const info = document.getElementById("info");

ex.onclick = (() => {
    card.style.visibility = "hidden";
})

let scale = 400;
let horizontal = 0;
let vertical = 20; 

// zooms and moves left + right 
function zoom(event) {
    event.preventDefault();

   // the camera is repositioned as the user 'scrolls'
    horizontal += event.deltaX * -1;
    scale += event.deltaY * -1;

    camera.position.set(horizontal, scale, 20);

}
container.onwheel = zoom;
scene.onwheel = zoom;

async function main(){
    const loader = new THREE.GLTFLoader();

    function getObject(url) {
        const obj = loader.loadAsync(url);
        return obj;
    }

    data = await getData("./public/data/info.json");
    const ambient = new THREE.AmbientLight(0xffffff)
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0,1,1).normalize();
    scene.add(directionalLight);

    const files = ["./public/objects/sun/scene.gltf", "./public/objects/mercury/scene.gltf", "./public/objects/venus/scene.gltf",
                "./public/objects/earth/scene.gltf", "./public/objects/mars/scene.gltf", "./public/objects/jupiter/scene.gltf",
                "./public/objects/saturn/scene.gltf", "./public/objects/uranus/scene.gltf", "./public/objects/neptune/scene.gltf"]

    const objects = []

    for(let i=0;i<files.length;i++) {
        const obj = await getObject(files[i]);
        objects[i] = obj.scene;
    }

    objects.forEach((obj, index) => {
        scene.add(obj);
        objects[index] = obj.children[0];
        objects[index].angle = 0;
    });

    document.querySelector('.welcome').remove();

    scene.traverse((object) => {
        if (object.isMesh) object.material.transparent = false;
    });
    
    const sun = objects[0];
    const mercury = objects[1];
    const venus = objects[2];
    const earth = objects[3];
    const mars = objects[4];
    const jupiter = objects[5];
    const saturn = objects[6];
    const uranus = objects[7];
    const neptune = objects[8];

    spin(sun, 0.005);

    mercury.scale.multiplyScalar(0.025);
    spin(mercury, 0.03);
    orbit(mercury, 0.387, 88/365.25, sun);

    venus.scale.multiplyScalar(0.03);
    venus.rotation.y = 3 * Math.PI/180;
    spin(venus, 0.03);
    orbit(venus, 0.723, 225/365.25, sun)

    earth.scale.multiplyScalar(3);
    earth.rotation.y = 23.436 * Math.PI/180;
    spin(earth, 0.03);
    orbit(earth, 1, 1, sun);

    mars.scale.multiplyScalar(0.03);
    mars.rotation.y = 25 * Math.PI/180;
    spin(mars, 0.03);
    orbit(mars, 1.524, 687/365.25, sun);

    jupiter.scale.multiplyScalar(0.05);
    spin(jupiter, 0.03);
    orbit(jupiter, 5.202, 12, sun);

    saturn.scale.multiplyScalar(0.06);
    spin(saturn, 0.03);
    orbit(saturn, 9.537, 29.457, sun);

    uranus.scale.multiplyScalar(0.06);
    spin(uranus, 0.03);
    orbit(uranus, 19.191, 84, sun);

    neptune.scale.multiplyScalar(0.6);
    neptune.rotation.y = 28 * Math.PI/180;
    spin(neptune, 0.03);
    orbit(neptune, 30.07, 165, sun);
    renderer.render(scene, camera);

    function spin(objeto, vel){
        requestAnimationFrame(() => {spin(objeto, vel);});
        objeto.rotation.z += vel;
        renderer.render(scene, camera);
    }

    function orbit(objeto, dist, period, parent) {
        requestAnimationFrame(() => {orbit(objeto, dist, period, parent);});
        objeto.angle += 0.004/period;
        objeto.position.x = parent.position.x + Math.cos(objeto.angle) * dist * 50;
        objeto.position.z = parent.position.z + Math.sin(objeto.angle) * -dist * 50;
    }
}
main();

container.addEventListener('click', (e) => {
    mouse.x = (e.clientX/renderer.domElement.clientWidth)*2 -1;
    mouse.y = -(e.clientY/renderer.domElement.clientHeight)*2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children);
    if(hits.length > 0) {
        const holder = hits[0].object.name;
        info.innerHTML = holder.replace(/_/g, ' ');
        card.style.visibility = "visible";
        for(let key in data[holder][0]) {
            info.appendChild(document.createElement("br"));
            info.innerHTML += (key + ": " + data[holder][0][key]);
        }
    }
});

card.addEventListener('click', (e) => {
    e.stopPropagation();
});