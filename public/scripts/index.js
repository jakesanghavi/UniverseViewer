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
const far = 50;

camera = new THREE.PerspectiveCamera(fov, asp, near, far);
camera.position.set(1, 1, 40);

renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
renderer.setSize(document.body.clientWidth, document.body.clientHeight);
// renderer.setSize(container.clientWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

const loader = new THREE.GLTFLoader();

async function init(){

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
    spin(obj.children[0]);
    obj2.children[0].scale.multiplyScalar(3);
    obj2.children[0].position.set(20,0,0);
    spin(obj2.children[0]);
    console.log(obj2.children[0].position);
    orbit(obj2.children[0]);
    renderer.render(scene, camera);

    function spin(objeto){
        requestAnimationFrame(() => {spin(objeto);});
        objeto.rotation.z += 0.005;
        renderer.render(scene, camera);
    }

    function orbit(objeto) {
        requestAnimationFrame(() => {orbit(objeto);});
        if(objeto.position.z >= 0) {
            objeto.position.x += 1;
        }
        else {
            objeto.position.x -= 1;
        }
        if(objeto.position.x >= 0) {
            objeto.position.z -= 1;
        }
        else {
            objeto.position.z += 1;
        }
        renderer.render(scene, camera);
    }

}

init();