/**
 * three-scene.js
 * Creates an elegant, abstract 3D background for the hero section using Three.js
 */

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    
    // We want the background to be transparent so the CSS background shows through
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 2. Lighting (Luxury feel requires good lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4af37, 2); // Gold tinted light
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // 3. Objects (Abstract elegant shapes: a sphere and an icosahedron)
    const objects = [];

    // Material: Glass/Gold like reflection
    const material1 = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const material2 = new THREE.MeshPhysicalMaterial({
        color: 0xd4af37, // Gold
        metalness: 0.5,
        roughness: 0.2,
        wireframe: true
    });

    // Main Sphere
    const geometry1 = new THREE.SphereGeometry(2, 64, 64);
    const sphere = new THREE.Mesh(geometry1, material1);
    sphere.position.set(3, 0, -5);
    scene.add(sphere);
    objects.push(sphere);

    // Secondary Shape (Icosahedron)
    const geometry2 = new THREE.IcosahedronGeometry(1.5, 0);
    const icosahedron = new THREE.Mesh(geometry2, material2);
    icosahedron.position.set(-3, 1, -8);
    scene.add(icosahedron);
    objects.push(icosahedron);

    // Floating particles (dust)
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xd4af37,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    camera.position.z = 5;

    // 4. Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle Theme Change to adjust 3D object color
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                const isDark = document.body.getAttribute('data-theme') === 'dark';
                // Change sphere color based on theme
                gsap.to(material1.color, {
                    r: isDark ? 1.0 : 0.04, // White in dark theme, black in light theme
                    g: isDark ? 1.0 : 0.04,
                    b: isDark ? 1.0 : 0.04,
                    duration: 1
                });
            }
        });
    });
    observer.observe(document.body, { attributes: true });

    // 5. Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse follow
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        // Parallax effect on camera
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Object floating animations
        sphere.position.y = Math.sin(elapsedTime * 0.5) * 0.5;
        sphere.rotation.y += 0.005;
        sphere.rotation.z += 0.002;

        icosahedron.position.y = 1 + Math.cos(elapsedTime * 0.4) * 0.5;
        icosahedron.rotation.x += 0.01;
        icosahedron.rotation.y += 0.01;

        // Particle subtle rotation
        particlesMesh.rotation.y = elapsedTime * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // 6. Responsive Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
