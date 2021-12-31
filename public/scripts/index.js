let obj;
let obj2;
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

async function main(){
    const loader = new THREE.GLTFLoader();
    data = await getData("./public/data/info.json");
    const ambient = new THREE.AmbientLight(0xffffff)
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0,1,1).normalize();
    scene.add(directionalLight);

    //Credit to Sebastian Sosnowski from Sketchfab
    sun = await loader.loadAsync("./public/objects/sun/scene.gltf");
    sun = sun.scene

    //Credit to Akshat from Sketchfab
    mercury = await loader.loadAsync("./public/objects/mercury/scene.gltf");
    mercury = mercury.scene;
    venus = await loader.loadAsync("./public/objects/venus/scene.gltf");
    venus = venus.scene;
    mars = await loader.loadAsync("./public/objects/mars/scene.gltf");
    mars = mars.scene
    jupiter = await loader.loadAsync("./public/objects/jupiter/scene.gltf");
    jupiter = jupiter.scene;
    saturn = await loader.loadAsync("./public/objects/saturn/scene.gltf");
    saturn = saturn.scene
    uranus = await loader.loadAsync("./public/objects/uranus/scene.gltf");
    uranus = uranus.scene

    neptune = await loader.loadAsync("./public/objects/neptune/scene.gltf");
    neptune = neptune.scene

    //Credit to Scrunchy32205 from Sketchfab
    earth = await loader.loadAsync("./public/objects/earth/scene.gltf");
    earth = earth.scene;

    scene.add(sun);
    scene.add(mercury);
    scene.add(venus);
    scene.add(mars);
    scene.add(earth);
    scene.add(jupiter);
    scene.add(saturn);
    scene.add(uranus);
    scene.add(neptune);
    
    const welcome = document.querySelector('.welcome');
    welcome.remove();

    scene.traverse((object) => {
        if (object.isMesh) object.material.transparent = false;
    });
    
    sun = sun.children[0];
    sun.angle = 0;
    mercury = mercury.children[0];
    mercury.angle = 0;
    venus = venus.children[0];
    venus.angle = 0;
    earth = earth.children[0];
    earth.angle = 0;
    mars = mars.children[0];
    mars.angle = 0;
    jupiter = jupiter.children[0];
    jupiter.angle = 0;
    saturn = saturn.children[0];
    saturn.angle = 0;
    uranus = uranus.children[0];
    uranus.angle = 0;
    neptune = neptune.children[0];
    neptune.angle = 0;

    spin(sun, 0.005);

    mercury.scale.multiplyScalar(0.025);
    spin(mercury, 0.03);
    orbit(mercury, 0.387, 88/365.25);

    venus.scale.multiplyScalar(0.03);
    venus.rotation.y = 3 * Math.PI/180;
    spin(venus, 0.03);
    orbit(venus, 0.723, 225/365.25)

    earth.scale.multiplyScalar(3);
    earth.rotation.y = 23.436 * Math.PI/180;
    spin(earth, 0.03);
    orbit(earth, 1, 1);

    mars.scale.multiplyScalar(0.03);
    mars.rotation.y = 25 * Math.PI/180;
    spin(mars, 0.03);
    orbit(mars, 1.524, 687/365.25);

    jupiter.scale.multiplyScalar(0.05);
    
    
    spin(jupiter, 0.03);
    orbit(jupiter, 5.202, 12);
    renderer.render(scene, camera);

    saturn.scale.multiplyScalar(0.06);
    spin(saturn, 0.03);
    orbit(saturn, 9.537, 29.457);
    renderer.render(scene, camera);

    uranus.scale.multiplyScalar(0.06);
    spin(uranus, 0.03);
    orbit(uranus, 19.191, 84);

    neptune.scale.multiplyScalar(0.6);
    neptune.rotation.y = 28 * Math.PI/180;
    spin(neptune, 0.03);
    orbit(neptune, 30.07, 165);
    renderer.render(scene, camera);

    function spin(objeto, vel){
        requestAnimationFrame(() => {spin(objeto, vel);});
        objeto.rotation.z += vel;
        renderer.render(scene, camera);
    }

    function orbit(objeto, dist, period) {
        requestAnimationFrame(() => {orbit(objeto, dist, period);});
        objeto.angle += 0.004/period;
        objeto.position.copy(new THREE.Vector3(Math.cos(objeto.angle) * dist * 50, 0, Math.sin(objeto.angle) * -dist * 50))
    }

    let scale = 400;
    let horizontal = 0;
    let vertical = 70; 

    // zooms and moves left + right 
    function zoom(event) {
        event.preventDefault();

       // !! scale += event.deltaY * -1;
       // !! camera.position.set(0, scale, 70);

       // the camera is repositioned as the user 'scrolls'
        horizontal += event.deltaX * -1;
        scale += event.deltaY * -1;

        camera.position.set(horizontal, scale, 70);

    }
    container.onwheel = zoom;
    scene.onwheel = zoom;

    

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
        console.log(hits[0].object.position);
        info.innerHTML = holder.replace(/_/g, ' ');
        card.style.visibility = "visible";
        container.appendChild(card);
        for(var key in data[holder][0]) {
            info.appendChild(document.createElement("br"));
            info.innerHTML += (key + ": ");
            info.innerHTML += (data[holder][0][key]);
        }
    }
});

card.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

