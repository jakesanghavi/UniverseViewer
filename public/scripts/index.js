let container;
let camera;
let renderer;
let scene;
let obj;
let obj2;

container = document.querySelector('.scene');
scene = new THREE.Scene();

const fov = 75;
// const asp = container.clientWidth / container.clientHeight;
const asp = document.body.clientWidth/document.body.clientHeight;
const near = 1;
const far = 100;
camera = new THREE.PerspectiveCamera(fov, asp, near, far);
camera.position.set(0, 0, 40);

renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
// renderer.setSize(container.clientWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

console.log(renderer.domElement);

function rays() {
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children);
    if(hits.length > 0) {
        console.log(hits[0].object.name);
    }
    renderer.render(scene, camera);
}

async function main(){

    // const ambient = new THREE.AmbientLight(0x404040, 3);
    const ambient = new THREE.AmbientLight(0xffffff)
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0,1,1).normalize();
    scene.add(directionalLight);

    //Credit to Sebastian Sosnowski from Sketchfab
    obj = await loader.loadAsync("./public/modelo/scene.gltf");
    obj = obj.scene
    //Credit to Scrunchy32205 from Sketchfab
    obj2 = await loader.loadAsync("./public/earth/scene.gltf");
    obj2 = obj2.scene;
    // obj2 = obj2.scene.children[0];

    scene.add(obj);
    scene.add(obj2);
    obj = obj.children[0];
    obj.angle = 0;
    console.log(obj);
    obj2 = obj2.children[0];
    obj2.angle = 0;

    spin(obj, 0.005);
    obj2.scale.multiplyScalar(3);
    obj2.position.set(20,0,0);
    spin(obj2, 0.03);
    orbit(obj2, 20);
    renderer.render(scene, camera);

    function spin(objeto, vel){
        requestAnimationFrame(() => {spin(objeto, vel);});
        objeto.rotation.z += vel;
        renderer.render(scene, camera);
    }

    function orbit(objeto, dist) {
        requestAnimationFrame(() => {orbit(objeto, dist);});
        objeto.angle += 0.005;
        const off = [Math.cos(objeto.angle) * dist, Math.sin(objeto.angle) * -dist];
        objeto.position.x = off[0];
        objeto.position.z = off[1];
        renderer.render(scene, camera);
    }

}

main();

document.addEventListener('mousedown', (e) => {
    rays();
});

document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX/renderer.domElement.clientWidth)*2 -1;
    mouse.y = -(e.clientY/renderer.domElement.clientHeight)*2 + 1;
});