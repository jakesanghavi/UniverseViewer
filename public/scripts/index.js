let container;
let camera;
let renderer;
let scene;
let obj;
let obj2;
let data;

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}
 
container = document.querySelector('.scene');
scene = new THREE.Scene();

const fov = 75;
// const asp = container.clientWidth / container.clientHeight;
const asp = document.body.clientWidth/document.body.clientHeight;
const near = 1;
const far = 500;
camera = new THREE.PerspectiveCamera(fov, asp, near, far);
// camera.position.set(0, 100, 0);
camera.position.set(10, 60, 20);
camera.lookAt(new THREE.Vector3(0,0,0));

renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
// renderer.setSize(container.clientWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

var card = document.createElement("div");
card.style.visibility = "hidden";
card.style.fontSize = "5px";
card.innerHTML = "";
var ex = card.appendChild(document.createElement("button"));
ex.id = "ex";
var extext = ex.appendChild(document.createElement("span"));
extext.innerHTML = "x";
var info = card.appendChild(document.createElement("p"));
info.id = "info";
document.body.appendChild(card);

function closeCard() {  
    card.style.visibility = "hidden";
    console.log("triggered");
}
ex.onclick = closeCard;

async function main(){
    data = await getData("./public/data/info.json");
    // const ambient = new THREE.AmbientLight(0x404040, 3);
    const ambient = new THREE.AmbientLight(0xffffff)
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0,1,1).normalize();
    scene.add(directionalLight);

    //Credit to Sebastian Sosnowski from Sketchfab
    sun = await loader.loadAsync("./public/sun/scene.gltf");
    sun = sun.scene
    //Credit to Scrunchy32205 from Sketchfab
    earth = await loader.loadAsync("./public/earth/scene.gltf");
    earth = earth.scene;
    scene.add(sun);
    scene.add(earth);

    scene.traverse((object) => {
        if (object.isMesh) object.material.transparent = false;
    });

    // scene.children[1].object.material.transparent = false;
    sun = sun.children[0];
    sun.angle = 0;
    earth = earth.children[0];
    earth.angle = 0;

    spin(sun, 0.005);
    earth.scale.multiplyScalar(3);
    earth.position.set(40,0,0);
    spin(earth, 0.03);
    orbit(earth, 40);
    renderer.render(scene, camera);

    function spin(objeto, vel){
        requestAnimationFrame(() => {spin(objeto, vel);});
        objeto.rotation.z += vel;
        renderer.render(scene, camera);
    }

    function orbit(objeto, dist) {
        requestAnimationFrame(() => {orbit(objeto, dist);});
        objeto.angle += 0.005;
        const polar = [Math.cos(objeto.angle) * dist, Math.sin(objeto.angle) * -dist];
        objeto.position.x = polar[0];
        objeto.position.z = polar[1];
        renderer.render(scene, camera);
    }

}
main();

document.addEventListener('mousedown', () => {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children);
    if(hits.length > 0) {
        document.getElementById("info").innerHTML = "";
        card.style.position = 'absolute';
        // text2.style.zIndex = 1;
        card.style.width = 100;
        card.style.height = 100;
        card.style.backgroundColor = "white";
        const holder = hits[0].object.name;
        info.innerHTML = holder.replace(/_/g, ' ');
        card.style.top = 20 + 'vh';
        card.style.left = 20 + 'vw';
        card.style.visibility = "visible";
        document.body.appendChild(card);
        for(var key in data[holder][0]) {
            info.appendChild(document.createElement("br"));
            info.innerHTML += (key + ": ");
            info.innerHTML += (data[holder][0][key]);
        }
    }
    renderer.render(scene, camera);
});

document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX/renderer.domElement.clientWidth)*2 -1;
    mouse.y = -(e.clientY/renderer.domElement.clientHeight)*2 + 1;
});