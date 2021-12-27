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
const asp = container.clientWidth / window.innerHeight;
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
    obj2 = obj2.scene

    scene.add(obj);
    scene.add(obj2);
    obj = obj.children[0];
    obj.angle = 0;
    obj2 = obj2.children[0];
    obj2.angle = 0;

    spin(obj);
    obj2.scale.multiplyScalar(3);
    obj2.position.set(20,0,0);
    spin(obj2);
    orbit(obj2);
    renderer.render(scene, camera);

    function spin(objeto){
        requestAnimationFrame(() => {spin(objeto);});
        objeto.rotation.z += 0.005;
        renderer.render(scene, camera);
    }

    function orbit(objeto) {
        requestAnimationFrame(() => {orbit(objeto);});
        objeto.angle += 0.005;
        const off = [Math.cos(objeto.angle) * 20, Math.sin(objeto.angle) * -20];
        objeto.position.x = off[0];
        objeto.position.z = off[1];
        renderer.render(scene, camera);
    }

}

main();