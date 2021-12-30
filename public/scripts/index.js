let obj;
let obj2;
let data;

async function getData(url) {
    const response = await fetch(url);
    return response.json();
}
 
const container = document.querySelector('.scene');
const scene = new THREE.Scene();

const fov = 75;
// const asp = container.clientWidth / container.clientHeight;
const asp = document.body.clientWidth/document.body.clientHeight;
const near = 1;
const far = 500;
const camera = new THREE.PerspectiveCamera(fov, asp, near, far);
camera.position.set(10, 200, 20);
camera.lookAt(new THREE.Vector3(0,0,0));

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
// renderer.setSize(container.clientWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let card = container.appendChild(document.createElement("div"));
card.id = "card";
card.innerHTML = "";
let ex = card.appendChild(document.createElement("button"));
ex.id = "ex";
let extext = ex.appendChild(document.createElement("span"));
extext.innerHTML = "x";
let info = card.appendChild(document.createElement("p"));
info.id = "info";
container.appendChild(card);

function closeCard() {  
    card.style.visibility = "hidden";
}
ex.onclick = closeCard;

async function main(){
    const loader = new THREE.GLTFLoader();
    data = await getData("./public/data/info.json");
    // const ambient = new THREE.AmbientLight(0x404040, 3);
    const ambient = new THREE.AmbientLight(0xffffff)
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0,1,1).normalize();
    scene.add(directionalLight);

    //Credit to Sebastian Sosnowski from Sketchfab
    sun = await loader.loadAsync("./public/sun/scene.gltf");
    sun = sun.scene

    //Credit to Scrunchy32205 from Sketchfab
    earth = await loader.loadAsync("./public/earth/scene.gltf");
    earth = earth.scene;

    jupiter = await loader.loadAsync("./public/jupiter/scene.gltf");
    jupiter = jupiter.scene;

    mercury = await loader.loadAsync("./public/mercury/scene.gltf");
    mercury = mercury.scene;
    scene.add(sun);
    scene.add(mercury);
    scene.add(earth);
    scene.add(jupiter);

    scene.traverse((object) => {
        if (object.isMesh) object.material.transparent = false;
    });
    
    sun = sun.children[0];
    sun.angle = 0;
    mercury = mercury.children[0];
    mercury.angle = 0;
    earth = earth.children[0];
    earth.angle = 0;
    jupiter = jupiter.children[0];
    jupiter.angle = 0;

    spin(sun, 0.005);
    mercury.scale.multiplyScalar(0.025);
    mercury.position.set(10,0,0);
    spin(mercury, 0.03);
    orbit(mercury, 0.387, (88/365.25));
    earth.scale.multiplyScalar(3);
    earth.position.set(25,0,0);
    earth.rotation.y = 23.436 * Math.PI/180;
    spin(earth, 0.03);
    orbit(earth, 1, 1);
    jupiter.scale.multiplyScalar(0.05);
    jupiter.position.set(45, 0, 0);
    jupiter.rotation.y = 3.13 * Math.PI/180;
    spin(jupiter, 0.03);
    orbit(jupiter, 5.202, 12);
    renderer.render(scene, camera);

    function spin(objeto, vel){
        requestAnimationFrame(() => {spin(objeto, vel);});
        objeto.rotation.z += vel;
        renderer.render(scene, camera);
    }

    function orbit(objeto, dist, period) {
        requestAnimationFrame(() => {orbit(objeto, dist, period);});
        objeto.angle += 0.004/period;
        const polar = [Math.cos(objeto.angle) * dist * 50, Math.sin(objeto.angle) * -dist * 50];
        objeto.position.x = polar[0];
        objeto.position.z = polar[1];
        renderer.render(scene, camera);
    }

}
main();

container.addEventListener('mousedown', (e) => {
    mouse.x = (e.clientX/renderer.domElement.clientWidth)*2 -1;
    mouse.y = -(e.clientY/renderer.domElement.clientHeight)*2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children);
    if(hits.length > 0) {
        document.getElementById("info").innerHTML = "";
        const holder = hits[0].object.name;
        info.innerHTML = holder.replace(/_/g, ' ');
        card.style.visibility = "visible";
        container.appendChild(card);
        for(var key in data[holder][0]) {
            info.appendChild(document.createElement("br"));
            info.innerHTML += (key + ": ");
            info.innerHTML += (data[holder][0][key]);
        }
    }
    renderer.render(scene, camera);
});

card.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});