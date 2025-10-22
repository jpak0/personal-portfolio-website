import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

export default function Portfolio3D() {
  const mountRef = useRef(null);
  const [section, setSection] = useState('classified');
  const [logs, setLogs] = useState([]);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const earthRef = useRef(null);

  useEffect(() => {
    const logMessages = [
      '[GPS-SAT-01] Position update: 42.3°N, 71.0°W | Altitude: 20,200km',
      '[DEF-SAT-02] Threat scan complete | Status: CLEAR',
      '[COM-SAT-03] Data relay established | Throughput: 2.4Gbps',
      '[SPY-SAT-04] Surveillance sweep sector 7 | Targets: 0',
      '[MIL-SAT-05] Encrypted transmission | Recipients: 3',
      '[OBS-SAT-06] Optical calibration | Resolution: 0.3m/pixel',
      '[SYSTEM] Ground station handoff | Signal strength: -87dBm',
      '[GPS-SAT-01] Orbital correction | Delta-V: 0.02m/s',
      '[DEF-SAT-02] Tracking object #47281 | Classification: DEBRIS',
      '[COM-SAT-03] Channel allocation | Bandwidth: 500MHz',
      '[SPY-SAT-04] Thermal imaging | Temperature range: -15°C to 42°C',
      '[MIL-SAT-05] Collision avoidance maneuver | Probability: 0.001%',
      '[OBS-SAT-06] Image capture | Coverage: 250km²',
      '[SYSTEM] Network synchronization | Latency: 340ms',
      '[GPS-SAT-01] Atomic clock drift correction | Accuracy: ±0.0001ms',
      '[DEF-SAT-02] Radar sweep complete | Objects detected: 12',
      '[COM-SAT-03] Uplink established | Station: VANDENBERG',
      '[SPY-SAT-04] Pattern recognition | Confidence: 94.7%',
      '[MIL-SAT-05] Fuel status | Hydrazine: 87.3%',
      '[OBS-SAT-06] Trajectory adjustment | Inclination: 98.2°',
    ];

    const addLog = () => {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      const newLog = `[${timestamp}] ${randomMsg}`;

      setLogs(prev => {
        const updated = [...prev, newLog];
        return updated.slice(-12);
      });
    };

    for (let i = 0; i < 6; i++) {
      setTimeout(() => addLog(), i * 300);
    }

    const interval = setInterval(addLog, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Deep space starfield
    const createStarfield = (count, size, distance) => {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = distance + (Math.random() - 0.5) * distance * 0.3;

        positions.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );

        const brightness = 0.5 + Math.random() * 0.5;
        colors.push(brightness, brightness, brightness);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      return new THREE.Points(geometry, material);
    };

    const stars1 = createStarfield(10000, 0.5, 300);
    const stars2 = createStarfield(5000, 0.8, 400);
    scene.add(stars1, stars2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1a3a, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(50, 20, 50);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x0088ff, 0.4);
    fillLight.position.set(-30, 10, -30);
    scene.add(fillLight);

    // Earth base - moon-like sphere
    const earthGeometry = new THREE.SphereGeometry(10, 128, 128);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x808080,
      emissive: 0x1a1a1a,
      shininess: 15,
      specular: 0x555555
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earthRef.current = earth;
    scene.add(earth);

    // Create glowing continent outlines
    const createContinentOutlines = () => {
      const group = new THREE.Group();

      // Define continent paths (simplified outlines)
      const continents = [
        // North America
        [
          [-2, 4, 9], [-1, 5, 9], [0, 6, 9], [1, 6, 9], [2, 5, 9],
          [2, 4, 9], [1, 3, 9], [0, 3, 9], [-1, 3, 9], [-2, 4, 9]
        ],
        // South America
        [
          [-1, 0, 10], [0, 1, 10], [1, 0, 10], [1, -2, 10],
          [0, -3, 10], [-1, -2, 10], [-1, 0, 10]
        ],
        // Europe
        [
          [3, 5, 9], [4, 6, 8], [5, 6, 8], [6, 5, 8],
          [5, 5, 8], [4, 5, 8], [3, 5, 9]
        ],
        // Africa
        [
          [3, 3, 9], [4, 3, 9], [5, 2, 9], [5, 0, 10],
          [4, -2, 10], [3, -2, 10], [3, 0, 10], [3, 3, 9]
        ],
        // Asia
        [
          [6, 6, 7], [7, 6, 7], [8, 5, 6], [9, 4, 5],
          [8, 3, 6], [7, 3, 7], [6, 4, 7], [6, 6, 7]
        ],
        // Australia
        [
          [7, -2, 8], [8, -1, 7], [9, -2, 6], [8, -3, 7], [7, -2, 8]
        ]
      ];

      continents.forEach(points => {
        const vertices = [];
        points.forEach(p => {
          const vec = new THREE.Vector3(p[0], p[1], p[2]).normalize().multiplyScalar(10.05);
          vertices.push(vec);
        });

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xb0b0b0,
          linewidth: 2,
          transparent: true,
          opacity: 0.6
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        group.add(line);

        // Add glowing tubes for continents
        for (let i = 0; i < vertices.length - 1; i++) {
          const tubeGeometry = new THREE.CylinderGeometry(0.08, 0.08, vertices[i].distanceTo(vertices[i + 1]), 8);
          const tubeMaterial = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.5
          });
          const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

          tube.position.copy(vertices[i]).lerp(vertices[i + 1], 0.5);
          tube.lookAt(vertices[i + 1]);
          tube.rotateX(Math.PI / 2);

          group.add(tube);
        }
      });

      return group;
    };

    const continentLines = createContinentOutlines();
    earth.add(continentLines);

    // Particle ring around Earth
    const createParticleRing = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      for (let i = 0; i < 3000; i++) {
        const angle = (i / 3000) * Math.PI * 2;
        const radius = 12 + Math.random() * 2;
        const height = (Math.random() - 0.5) * 0.5;

        positions.push(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );

        colors.push(0.3, 0.7, 1.0);
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      return new THREE.Points(geometry, material);
    };

    const particleRing = createParticleRing();
    earth.add(particleRing);

    // Massive atmospheric glow
    const glowGeometry = new THREE.SphereGeometry(11, 64, 64);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xffffff) },
        intensity: { value: 0.4 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = pow(0.7 - dot(viewDirection, vNormal), 2.5);
          gl_FragColor = vec4(glowColor, 1.0) * fresnel * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const atmosphereGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    earth.add(atmosphereGlow);

    // Outer glow layer
    const outerGlowGeometry = new THREE.SphereGeometry(12.5, 64, 64);
    const outerGlowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xdddddd) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = pow(0.5 - dot(viewDirection, vNormal), 1.8);
          gl_FragColor = vec4(glowColor, 1.0) * fresnel * 0.3;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
    earth.add(outerGlow);

    // City markers and flight paths
    const cityPositions = [
      { lat: 40.7, lon: -74, name: 'New York' },
      { lat: 51.5, lon: -0.1, name: 'London' },
      { lat: 35.7, lon: 139.7, name: 'Tokyo' },
      { lat: -33.9, lon: 151.2, name: 'Sydney' },
      { lat: 19.4, lon: -99.1, name: 'Mexico City' },
      { lat: 1.3, lon: 103.8, name: 'Singapore' }
    ];

    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    cityPositions.forEach((city, i) => {
      const pos = latLonToVector3(city.lat, city.lon, 10.15);

      const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffaa00 : 0x00ffff,
        transparent: true,
        opacity: 0.9
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pos);
      earth.add(marker);

      // Add glow to markers
      const glowGeom = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xffaa00 : 0x00ffff,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });
      const glow = new THREE.Mesh(glowGeom, glowMat);
      glow.position.copy(pos);
      earth.add(glow);
    });

    // Flight paths between cities
    for (let i = 0; i < cityPositions.length - 1; i++) {
      const start = latLonToVector3(cityPositions[i].lat, cityPositions[i].lon, 10.15);
      const end = latLonToVector3(cityPositions[i + 1].lat, cityPositions[i + 1].lon, 10.15);

      const curvePoints = [];
      for (let j = 0; j <= 50; j++) {
        const t = j / 50;
        const point = new THREE.Vector3().lerpVectors(start, end, t);
        point.normalize().multiplyScalar(10.15 + Math.sin(t * Math.PI) * 2);
        curvePoints.push(point);
      }

      const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMaterial = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xff6600 : 0x00aaff,
        transparent: true,
        opacity: 0.5,
        linewidth: 2
      });
      const curve = new THREE.Line(curveGeometry, curveMaterial);
      earth.add(curve);
    }

    // Satellites
    const satellites = [];
    const satelliteData = [
      { orbit: 15, speed: 0.01, color: 0x00ff00, label: 'GPS-SAT-01' },
      { orbit: 18, speed: 0.008, color: 0xff0000, label: 'DEF-SAT-02' },
      { orbit: 21, speed: 0.006, color: 0xffff00, label: 'COM-SAT-03' },
      { orbit: 17, speed: 0.012, color: 0x00ffff, label: 'SPY-SAT-04' },
      { orbit: 19, speed: 0.009, color: 0xff00ff, label: 'MIL-SAT-05' },
      { orbit: 23, speed: 0.005, color: 0xffffff, label: 'OBS-SAT-06' }
    ];

    satelliteData.forEach((data, index) => {
      const satelliteGroup = new THREE.Group();

      const bodyGeometry = new THREE.BoxGeometry(1.2, 1.2, 2);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        emissive: data.color,
        emissiveIntensity: 0.3,
        shininess: 120,
        specular: 0xffffff
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      satelliteGroup.add(body);

      const panelGeometry = new THREE.BoxGeometry(3.5, 0.08, 1.5);
      const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a5a,
        emissive: 0x0000ff,
        emissiveIntensity: 0.3,
        shininess: 80
      });

      const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel1.position.x = 2.5;
      satelliteGroup.add(panel1);

      const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel2.position.x = -2.5;
      satelliteGroup.add(panel2);

      const angle = (index / satelliteData.length) * Math.PI * 2;
      satelliteGroup.position.set(
        Math.cos(angle) * data.orbit,
        Math.sin(angle * 0.3) * 4,
        Math.sin(angle) * data.orbit
      );

      satelliteGroup.userData = {
        orbit: data.orbit,
        speed: data.speed,
        angle: angle
      };

      satellites.push(satelliteGroup);
      scene.add(satelliteGroup);

      // Orbit lines
      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(
          Math.cos(theta) * data.orbit,
          Math.sin(theta * 0.3) * 4,
          Math.sin(theta) * data.orbit
        ));
      }
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.3
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);
    });

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      if (earthRef.current) {
        earthRef.current.rotation.y += 0.002;
      }

      stars1.rotation.y += 0.00005;
      stars2.rotation.y += 0.00008;

      satellites.forEach((sat) => {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.orbit;
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.orbit;
        sat.position.y = Math.sin(sat.userData.angle * 0.3) * 4;

        sat.lookAt(0, 0, 0);
        sat.rotation.z += 0.005;
      });

      const targetX = mouseX * 8;
      const targetY = -mouseY * 5 + 5;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const content = {
    classified: {
      title: "CLEARANCE LEVEL: TOP SECRET",
      text: "Senior Aerospace Systems Engineer specializing in satellite defense systems, orbital mechanics, and advanced space-based technologies. Security clearance verified."
    },
    missions: {
      title: "OPERATIONAL HISTORY",
      items: [
        {
          role: "Lead Satellite Defense Engineer",
          company: "US Space Force - Delta 9",
          year: "2022-Present",
          clearance: "TS/SCI",
          desc: "Designed and deployed next-generation orbital defense systems. Managed constellation of 47 surveillance satellites monitoring global threats."
        },
        {
          role: "Senior Aerospace Engineer",
          company: "Lockheed Martin - Skunk Works",
          year: "2019-2022",
          clearance: "Top Secret",
          desc: "Developed classified propulsion systems for rapid orbital insertion. Led team of 12 engineers on Project Nightwatch."
        },
        {
          role: "Systems Integration Specialist",
          company: "Northrop Grumman Space",
          year: "2016-2019",
          clearance: "Secret",
          desc: "Integrated communication systems for military satellite networks. Achieved 99.97% uptime across 23 satellites."
        }
      ]
    },
    operations: {
      title: "ACTIVE PROJECTS",
      items: [
        {
          name: "Project Guardian Shield",
          classification: "TS/SCI",
          tech: "Autonomous Threat Detection AI",
          desc: "Real-time satellite network monitoring 10,000+ orbital objects. Neural network identifies potential threats with 99.2% accuracy."
        },
        {
          name: "Operation Darkstar",
          classification: "Top Secret",
          tech: "Advanced Propulsion Systems",
          desc: "Next-gen ion drive technology enabling 3x faster orbital repositioning. Successfully tested on classified platform."
        },
        {
          name: "Sentinel Defense Grid",
          classification: "Secret",
          tech: "Multi-layer Space Defense",
          desc: "Coordinated defense network across 64 satellites providing hemisphere coverage with redundant fail-safes."
        },
        {
          name: "Project Starwatch",
          classification: "Confidential",
          tech: "Quantum-encrypted Comms",
          desc: "Unhackable communication protocol for military space assets. Zero breaches in 18 months of deployment."
        }
      ]
    },
    contact: {
      title: "SECURE COMMUNICATIONS",
      text: "For inquiries regarding collaboration on classified aerospace projects, contact through secure channels only.",
      channels: [
        { icon: "🔐", label: "Encrypted Email", value: "your.name@secure.mil" },
        { icon: "📡", label: "Secure Line", value: "+1 (555) DEFENSE" },
        { icon: "🛡️", label: "Clearance Verification", value: "DOD-REF-####-####" },
        { icon: "🌐", label: "LinkedIn (Unclass)", value: "linkedin.com/in/yourprofile" }
      ]
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 0.8;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>

      <div ref={mountRef} className="absolute inset-0" />

      <div className="absolute top-0 left-0 right-0 z-10 bg-red-900/30 backdrop-blur border-b border-red-500/50 px-4 md:px-6 py-2">
        <div className="flex justify-center items-center text-red-500 text-xs md:text-sm font-mono relative">
          <span className="absolute left-0">⚠ CLASSIFIED - TOP SECRET ⚠</span>
          <span>AUTHORIZED PERSONNEL ONLY</span>
          <span className="absolute right-0">{new Date().toISOString().split('T')[0]}</span>
        </div>
      </div>

      <nav className="absolute top-12 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-4">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
            <div className="text-xl md:text-2xl font-bold text-red-500 font-mono tracking-wider">
              [YOUR NAME]
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
              {[
                { key: 'classified', label: 'HOME' },
                { key: 'experience', label: 'MY EXPERIENCE' },
                { key: 'projects', label: 'PROJECTS' },
                { key: 'contact', label: 'CONTACT JOE' },
                { key: 'about', label: 'ABOUT JOE' }
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`text-xs md:text-sm uppercase font-mono tracking-wider transition-colors border px-2 md:px-3 py-1 ${
                    section === s.key
                      ? 'text-red-500 border-red-500 bg-red-500/10'
                      : 'text-gray-400 border-gray-600 hover:text-white hover:border-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {section === 'classified' && (
        <div className="hidden xl:block absolute left-0 top-44 z-0 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6">
            <div className="w-64 xl:w-72 2xl:w-80 pointer-events-auto">
              <div className="bg-black/70 backdrop-blur border border-red-500/50 rounded p-2 xl:p-3 h-64 xl:h-72 2xl:h-96">
                <div className="flex items-center gap-2 mb-2 border-b border-red-500/50 pb-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-mono text-xs">SATELLITE TELEMETRY STREAM</span>
                </div>
                <div className="font-mono text-xs space-y-1 overflow-y-auto h-48 xl:h-56 2xl:h-80">
                  {logs.map((log, i) => (
                    <div key={i} className="text-gray-300/80 animate-fadeIn">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-8 bg-gradient-to-t from-black via-black/98 to-transparent pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-red-500 font-mono tracking-wider">
              {content[section].title}
            </h2>
          </div>

          {section === 'classified' && (
            <div className="border border-red-500/50 bg-black/50 backdrop-blur p-4 md:p-6 rounded font-mono">
              <p className="text-base md:text-lg text-red-400">{content[section].text}</p>
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-red-500/30 text-xs md:text-sm text-red-400">
                <p>SPECIALIZATIONS: Orbital Mechanics • Satellite Systems • Defense Architecture • AI/ML Integration</p>
              </div>
            </div>
          )}

          {section === 'missions' && (
            <div className="space-y-4">
              {content[section].items.map((item, i) => (
                <div key={i} className="border border-yellow-600/30 bg-black/60 backdrop-blur p-5 rounded font-mono">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-yellow-400">{item.role}</h3>
                    <span className="text-xs px-2 py-1 bg-red-900/50 text-red-400 border border-red-500/50 rounded">
                      {item.clearance}
                    </span>
                  </div>
                  <p className="text-gray-300">{item.company}</p>
                  <p className="text-sm text-gray-500 mb-2">{item.year}</p>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {section === 'operations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content[section].items.map((item, i) => (
                <div key={i} className="border border-cyan-500/30 bg-black/60 backdrop-blur p-5 rounded font-mono">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-cyan-400">{item.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-800 text-red-400 border border-red-500/50 rounded">
                      {item.classification}
                    </span>
                  </div>
                  <p className="text-xs text-purple-400 mb-3">{item.tech}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {section === 'contact' && (
            <div className="border border-green-400/30 bg-black/60 backdrop-blur p-6 rounded font-mono">
              <p className="text-lg text-gray-300 mb-6">{content[section].text}</p>
              <div className="space-y-3">
                {content[section].channels.map((channel, i) => (
                  <div key={i} className="flex items-center gap-4 text-green-400">
                    <span className="text-2xl">{channel.icon}</span>
                    <div>
                      <p className="text-sm text-gray-500">{channel.label}</p>
                      <p className="text-base">{channel.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {section === 'classified' && (
        <div className="hidden xl:block absolute right-0 top-44 z-0 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6">
            <div className="w-56 xl:w-64 2xl:w-72 pointer-events-auto font-mono text-xs space-y-2">
              <div className="bg-black/80 backdrop-blur border border-red-500/50 p-2 xl:p-3 rounded">
                <p className="text-red-400 mb-1 xl:mb-2">⚡ SATELLITE STATUS</p>
                <div className="space-y-0.5 xl:space-y-1 text-gray-400 text-xs">
                  <p>🛰️ GPS-SAT-01: <span className="text-green-400">OPERATIONAL</span></p>
                  <p>🛰️ DEF-SAT-02: <span className="text-green-400">OPERATIONAL</span></p>
                  <p>🛰️ COM-SAT-03: <span className="text-green-400">OPERATIONAL</span></p>
                  <p>🛰️ SPY-SAT-04: <span className="text-green-400">OPERATIONAL</span></p>
                  <p>🛰️ MIL-SAT-05: <span className="text-green-400">OPERATIONAL</span></p>
                  <p>🛰️ OBS-SAT-06: <span className="text-green-400">OPERATIONAL</span></p>
                </div>
              </div>
              <div className="bg-black/80 backdrop-blur border border-red-500/50 p-2 xl:p-3 rounded">
                <p className="text-red-400">🌍 EARTH DEFENSE GRID</p>
                <p className="text-green-400 mt-1">ACTIVE - ALL SECTORS</p>
              </div>
              <div className="bg-black/80 backdrop-blur border border-red-500/50 p-2 xl:p-3 rounded">
                <p className="text-red-400 mb-2">🔗 QUICK LINKS</p>
                <div className="space-y-1.5">
                  <a
                    href="https://www.linkedin.com/in/yourprofile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs uppercase font-mono tracking-wider transition-colors border border-gray-600 hover:border-white text-gray-400 hover:text-white px-2 py-1"
                  >
                    LINKEDIN
                  </a>
                  <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs uppercase font-mono tracking-wider transition-colors border border-gray-600 hover:border-white text-gray-400 hover:text-white px-2 py-1"
                  >
                    GITHUB
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
