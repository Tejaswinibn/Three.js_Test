"use client";

import { JSX, useEffect, useRef, useState } from "react";

const CONFIG = {
  scene: { background: "#182434" },
  map: {
    outlineColor: "#ffffff",
    outlineWidth: 1.2,
    /** Line2 pixel width for coast outline */
    line2Width: 2.5,
    /** Province/territory borders inside Canada — slightly thicker and tinted so they stand out */
    provincesLineWidth: 3.5,
    provincesOutlineColor: "#94a3b8",
    /** Base fill for land (interior) */
    landFillColor: "#243044",
    /** Fill when mouse hovers over a region */
    landHighlightColor: "#3d4f6e",
    scale: 1.5,
    scaleX: 1,
    scaleZ: 1,
    position: { x: -0.4, y: 1, z: 0 },
    rotation: { x: -Math.PI / 4, y: Math.PI, z: 0 },
    mouseRotate: { maxTiltX: 0.15, maxRotateY: 0.25, damp: 0.08 },
  },
  geoJsonUrl: "/canada.json",
  provincesGeoJsonUrl: "/canada-provinces.json",
  camera: {
    position: { x: 0, y: 6, z: 2 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 28,
    near: 0.1,
    far: 1000,
    zoomMin: 2,
    zoomMax: 14,
  },
  mapBounds: { lngMin: -141, lngMax: -52, latMin: 41, latMax: 83 },
  tour: {
    color: "#FDCD6C",
    points: [
      { lat: 45.42, lng: -75.7, name: "Ottawa", date: "TBA", description: "Enable Canada Tour stop — Ottawa. Event details and registration coming soon." },
      { lat: 43.65, lng: -79.38, name: "Toronto", date: "TBA", description: "Enable Canada Tour stop — Toronto. Event details and registration coming soon." },
      { lat: 45.5, lng: -73.57, name: "Montreal", date: "TBA", description: "Enable Canada Tour stop — Montreal. Event details and registration coming soon." },
      { lat: 46.81, lng: -71.21, name: "Quebec City", date: "TBA", description: "Enable Canada Tour stop — Quebec City. Event details and registration coming soon." },
      { lat: 43.09, lng: -79.08, name: "Niagara Falls", date: "TBA", description: "Enable Canada Tour stop — Niagara Falls. Event details and registration coming soon." },
      { lat: 42.98, lng: -81.25, name: "London", date: "TBA", description: "Enable Canada Tour stop — London. Event details and registration coming soon." },
      { lat: 46.49, lng: -80.99, name: "Sudbury", date: "TBA", description: "Enable Canada Tour stop — Sudbury. Event details and registration coming soon." },
      { lat: 49.28, lng: -123.12, name: "Vancouver", date: "TBA", description: "Enable Canada Tour stop — Vancouver. Event details and registration coming soon." },
      { lat: 48.43, lng: -123.37, name: "Victoria", date: "TBA", description: "Enable Canada Tour stop — Victoria. Event details and registration coming soon." },
      { lat: 51.04, lng: -114.07, name: "Calgary", date: "TBA", description: "Enable Canada Tour stop — Calgary. Event details and registration coming soon." },
      { lat: 53.55, lng: -113.49, name: "Edmonton", date: "TBA", description: "Enable Canada Tour stop — Edmonton. Event details and registration coming soon." },
      { lat: 52.16, lng: -106.67, name: "Saskatoon", date: "TBA", description: "Enable Canada Tour stop — Saskatoon. Event details and registration coming soon." },
      { lat: 50.45, lng: -104.61, name: "Regina", date: "TBA", description: "Enable Canada Tour stop — Regina. Event details and registration coming soon." },
      { lat: 49.9, lng: -97.14, name: "Winnipeg", date: "TBA", description: "Enable Canada Tour stop — Winnipeg. Event details and registration coming soon." },
      { lat: 44.65, lng: -63.57, name: "Halifax", date: "TBA", description: "Enable Canada Tour stop — Halifax. Event details and registration coming soon." },
      { lat: 45.27, lng: -66.06, name: "Saint John", date: "TBA", description: "Enable Canada Tour stop — Saint John. Event details and registration coming soon." },
      { lat: 46.09, lng: -64.78, name: "Moncton", date: "TBA", description: "Enable Canada Tour stop — Moncton. Event details and registration coming soon." },
      { lat: 47.57, lng: -52.71, name: "St. John's", date: "TBA", description: "Enable Canada Tour stop — St. John's. Event details and registration coming soon." },
      { lat: 46.24, lng: -63.13, name: "Charlottetown", date: "TBA", description: "Enable Canada Tour stop — Charlottetown. Event details and registration coming soon." },
      { lat: 62.45, lng: -114.37, name: "Yellowknife", date: "TBA", description: "Enable Canada Tour stop — Yellowknife. Event details and registration coming soon." },
      { lat: 60.72, lng: -135.06, name: "Whitehorse", date: "TBA", description: "Enable Canada Tour stop — Whitehorse. Event details and registration coming soon." },
      { lat: 63.75, lng: -68.52, name: "Iqaluit", date: "TBA", description: "Enable Canada Tour stop — Iqaluit. Event details and registration coming soon." },
    ],
    markerSize: 0.001,
    markerGlowSize: 0.012,
    bloomStrength: 0.35,
    bloomRadius: 0.02,
    bloomThreshold: 0.05,
  },
};

const FALLBACK_OUTLINE: [number, number][] = [
  [-123.51, 48.51], [-124.92, 49.48], [-127.03, 49.81], [-128.06, 49.99],
  [-125.76, 50.29], [-123.92, 49.06], [-132.71, 54.04], [-133.24, 53.85],
  [-131.18, 52.18], [-90.55, 69.5], [-94.24, 60.9], [-94.68, 58.95],
  [-92.76, 57.85], [-89.04, 56.85], [-85.01, 55.3], [-82.27, 55.15],
  [-79.91, 51.21], [-78.6, 52.56], [-77.34, 55.84], [-77.41, 62.55],
  [-75.7, 62.28], [-71.68, 61.14], [-69.29, 58.96], [-61.52, 45.88],
  [-63.25, 44.67], [-65.36, 43.55], [-73.35, 45.01], [-76.82, 43.63],
  [-79.01, 43.27], [-82.44, 41.68], [-83.03, 41.83], [-82.14, 43.57],
  [-82.55, 45.35], [-84.09, 46.28], [-87.44, 47.94], [-89.6, 48.01],
  [-94.64, 48.84], [-97.23, 49], [-104.05, 49], [-110.05, 49], [-116.05, 49],
  [-122.97, 49], [-125.62, 50.42], [-127.99, 51.72], [-129.98, 55.29],
  [-131.71, 56.55], [-134.27, 58.86], [-140.01, 60.28], [-140.99, 66],
  [-139.12, 69.47], [-129.79, 70.19], [-119.94, 69.38], [-113.9, 68.4],
  [-106.95, 68.7], [-100.98, 70.02], [-95.3, 69.69], [-92.41, 71.26],
  [-86.56, 73.16], [-68.5, 83.11], [-79.31, 83.13], [-82.42, 82.86],
  [-86.97, 82.28], [-91.37, 81.89], [-95.21, 71.92], [-96.39, 71.19],
  [-100.36, 73.84], [-108.21, 76.2], [-116.2, 77.65], [-123.94, 73.68],
  [-120.46, 71.38],
];

export default function CanadaMap(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);
  const rendererRef = useRef<import("three").WebGLRenderer | null>(null);
  const [selectedCityIndex, setSelectedCityIndex] = useState<number | null>(null);
  const [lumaByCity, setLumaByCity] = useState<Record<string, { title: string; start: string; url?: string }>>({});
  const setSelectedCityIndexRef = useRef(setSelectedCityIndex);
  setSelectedCityIndexRef.current = setSelectedCityIndex;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    cancelledRef.current = false;
    let animationId: number | undefined;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;
    let renderer: import("three").WebGLRenderer | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let composer: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bloomPass: any;
    let handleResize: (() => void) | undefined;
    let mouseNormX = 0;
    let mouseNormY = 0;
    const mouseRot = {
      x: CONFIG.map.rotation.x,
      y: CONFIG.map.rotation.y,
      z: CONFIG.map.rotation.z,
    };
    let mapGroup: import("three").Group;
    let landFillMeshes: import("three").Mesh[] = [];
    let hoveredLandMesh: import("three").Mesh | null = null;
    let raycastMesh: import("three").InstancedMesh | null = null;
    let raycaster: import("three").Raycaster | null = null;
    let mouseVector: import("three").Vector2 | null = null;
    let onMouseMoveHandler: ((e: MouseEvent) => void) | undefined;
    let onMouseLeaveHandler: (() => void) | undefined;
    let onWheelHandler: ((e: WheelEvent) => void) | undefined;
    let onClickHandler: ((e: MouseEvent) => void) | undefined;
    let onTouchStartHandler: ((e: TouchEvent) => void) | undefined;
    let onTouchMoveHandler: ((e: TouchEvent) => void) | undefined;
    let onTouchEndHandler: ((e: TouchEvent) => void) | undefined;
    const lookAtVector = { x: CONFIG.camera.lookAt.x, y: CONFIG.camera.lookAt.y, z: CONFIG.camera.lookAt.z };

    const init = async () => {
      if (cancelledRef.current) return;
      const THREE = await import("three");
      if (cancelledRef.current) return;
      const { EffectComposer } = await import(
        "three/examples/jsm/postprocessing/EffectComposer.js"
      );
      const { RenderPass } = await import(
        "three/examples/jsm/postprocessing/RenderPass.js"
      );
      const { UnrealBloomPass } = await import(
        "three/examples/jsm/postprocessing/UnrealBloomPass.js"
      );
      const { Line2 } = await import("three/examples/jsm/lines/Line2.js");
      const { LineGeometry } = await import("three/examples/jsm/lines/LineGeometry.js");
      const { LineMaterial } = await import("three/examples/jsm/lines/LineMaterial.js");

      // Load Luma events and map them to the nearest tour city marker (by GEO if available, fallback to text).
      try {
        const r = await fetch("/api/luma/events");
        if (r.ok) {
          const data = (await r.json()) as {
            events?: Array<{
              title: string;
              start: string;
              location?: string;
              url?: string;
              geo?: { lat: number; lng: number };
            }>;
          };
          const byCity: Record<string, { title: string; start: string; url?: string }> = {};
          for (const e of data.events || []) {
            let city: string | undefined;
            if (e.geo && Number.isFinite(e.geo.lat) && Number.isFinite(e.geo.lng)) {
              let best: { name: string; d: number } | null = null;
              for (const p of CONFIG.tour.points) {
                const d = Math.hypot(p.lat - e.geo.lat, p.lng - e.geo.lng);
                if (!best || d < best.d) best = { name: p.name, d };
              }
              if (best && best.d < 2.0) city = best.name;
            }
            if (!city) {
              const hay = `${e.title} ${(e.location || "")}`.toLowerCase();
              city = CONFIG.tour.points.find((p) => hay.includes(p.name.toLowerCase()))?.name;
            }
            if (!city) continue;
            // keep earliest upcoming per city
            if (!byCity[city] || (e.start && e.start < byCity[city].start)) {
              byCity[city] = { title: e.title, start: e.start, url: e.url };
            }
          }
          if (!cancelledRef.current) setLumaByCity(byCity);
        }
      } catch {
        // ignore
      }

      const bounds = CONFIG.mapBounds;
      type Bounds = typeof bounds;

      function lngLatToMapPosition(
        lng: number,
        lat: number,
        b: Bounds
      ): { x: number; z: number } {
        const { lngMin, lngMax, latMin, latMax } = b;
        const x = -(((lng - lngMin) / (lngMax - lngMin)) * 2 - 1);
        const z = ((lat - latMin) / (latMax - latMin)) * 2 - 1;
        return { x, z };
      }

      function ringToPoints(
        ring: number[][],
        b: Bounds,
        y: number
      ): import("three").Vector3[] {
        const { lngMin, lngMax, latMin, latMax } = b;
        return ring.map(([lng, lat]) => {
          const x = -(((lng - lngMin) / (lngMax - lngMin)) * 2 - 1);
          const z = ((lat - latMin) / (latMax - latMin)) * 2 - 1;
          return new THREE.Vector3(x, y, z);
        });
      }

      type GeoFeature = {
        type: "Feature";
        geometry: { type: "MultiPolygon"; coordinates: number[][][][] };
      };
      type ProvinceFeature = {
        type: "Feature";
        geometry:
          | { type: "Polygon"; coordinates: number[][][] }
          | { type: "MultiPolygon"; coordinates: number[][][][] };
      };

      const resolution = new THREE.Vector2(container.clientWidth, container.clientHeight);
      const borderLineMaterials: { resolution: { set: (x: number, y: number) => void } }[] = [];

      function buildOutlineFromGeoJson(
        coordinates: number[][][][],
        b: Bounds
      ): import("three").Group {
        const group = new THREE.Group();
        const y = 0;
        for (const polygon of coordinates) {
          const exterior = polygon[0];
          if (!exterior || exterior.length < 3) continue;
          const points = ringToPoints(exterior, b, y);
          points.push(points[0].clone());
          const flat: number[] = [];
          for (const p of points) flat.push(p.x, p.y, p.z);
          const lineGeom = new LineGeometry().setPositions(flat);
          const lineMat = new LineMaterial({
            color: CONFIG.map.outlineColor,
            linewidth: CONFIG.map.line2Width,
            resolution,
          });
          borderLineMaterials.push(lineMat);
          const line = new Line2(lineGeom, lineMat);
          group.add(line);
        }
        return group;
      }

      function buildBordersFromFeatureCollection(
        data: { features: ProvinceFeature[] },
        b: Bounds
      ): import("three").Group {
        const group = new THREE.Group();
        const y = 0.001;
        function addRing(ring: number[][]) {
          if (ring.length < 3) return;
          const points = ringToPoints(ring, b, y);
          points.push(points[0].clone());
          const flat: number[] = [];
          for (const p of points) flat.push(p.x, p.y, p.z);
          const lineGeom = new LineGeometry().setPositions(flat);
          const lineMat = new LineMaterial({
            color: CONFIG.map.provincesOutlineColor,
            linewidth: CONFIG.map.provincesLineWidth,
            resolution,
          });
          borderLineMaterials.push(lineMat);
          const line = new Line2(lineGeom, lineMat);
          group.add(line);
        }
        for (const feature of data.features || []) {
          const geom = feature.geometry;
          if (!geom || !geom.coordinates) continue;
          if (geom.type === "Polygon") {
            for (const ring of geom.coordinates) addRing(ring);
          } else if (geom.type === "MultiPolygon") {
            for (const polygon of geom.coordinates) {
              for (const ring of polygon) addRing(ring);
            }
          }
        }
        return group;
      }

      /** Filled land polygons (interiors) for hover highlight */
      function buildLandFillFromGeoJson(
        coordinates: number[][][][],
        b: Bounds
      ): { group: import("three").Group; meshes: import("three").Mesh[] } {
        const group = new THREE.Group();
        const meshes: import("three").Mesh[] = [];
        const y = -0.0005; // just below border lines so lines draw on top
        for (const polygon of coordinates) {
          const exterior = polygon[0];
          if (!exterior || exterior.length < 3) continue;
          const points = ringToPoints(exterior, b, y);
          const shape = new THREE.Shape();
          shape.moveTo(points[0].x, points[0].z);
          for (let i = 1; i < points.length; i++) {
            shape.lineTo(points[i].x, points[i].z);
          }
          const geom = new THREE.ShapeGeometry(shape);
          geom.translate(0, y, 0);
          geom.rotateX(-Math.PI / 2);
          const mat = new THREE.MeshBasicMaterial({
            color: CONFIG.map.landFillColor,
            depthWrite: true,
            side: THREE.DoubleSide,
          });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.name = "landFill";
          meshes.push(mesh);
          group.add(mesh);
        }
        return { group, meshes };
      }

      function buildTourMarkers(b: Bounds): {
        group: import("three").Group;
        coreMesh: import("three").InstancedMesh;
        glowMesh: import("three").InstancedMesh;
      } {
        const group = new THREE.Group();
        const yMarker = 0.015;
        const c = CONFIG.tour.color;
        const points = CONFIG.tour.points;
        const positions = points.map((p) =>
          lngLatToMapPosition(p.lng, p.lat, b)
        );
        const n = positions.length;
        const dummy = new THREE.Object3D();
        const glowGeom = new THREE.SphereGeometry(
          CONFIG.tour.markerGlowSize,
          12,
          10
        );
        const glowMat = new THREE.MeshBasicMaterial({
          color: c,
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        });
        const glowMesh = new THREE.InstancedMesh(glowGeom, glowMat, n);
        glowMesh.count = n;
        const coreGeom = new THREE.SphereGeometry(
          CONFIG.tour.markerSize,
          10,
          8
        );
        const coreMat = new THREE.MeshBasicMaterial({ color: c });
        const coreMesh = new THREE.InstancedMesh(coreGeom, coreMat, n);
        coreMesh.name = "tourMarkers";
        coreMesh.count = n;
        for (let i = 0; i < n; i++) {
          const { x, z } = positions[i];
          dummy.position.set(x, yMarker, z);
          dummy.updateMatrix();
          glowMesh.setMatrixAt(i, dummy.matrix);
          coreMesh.setMatrixAt(i, dummy.matrix);
        }
        glowMesh.instanceMatrix.needsUpdate = true;
        coreMesh.instanceMatrix.needsUpdate = true;
        group.add(glowMesh);
        group.add(coreMesh);
        return { group, coreMesh, glowMesh };
      }

      scene = new THREE.Scene();
      scene.background = new THREE.Color(CONFIG.scene.background);

      camera = new THREE.PerspectiveCamera(
        CONFIG.camera.fov,
        container.clientWidth / container.clientHeight,
        CONFIG.camera.near,
        CONFIG.camera.far
      );
      camera.position.set(
        CONFIG.camera.position.x,
        CONFIG.camera.position.y,
        CONFIG.camera.position.z
      );
      camera.lookAt(
        CONFIG.camera.lookAt.x,
        CONFIG.camera.lookAt.y,
        CONFIG.camera.lookAt.z
      );

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      if (cancelledRef.current) return;
      while (container.firstChild) container.removeChild(container.firstChild);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      resolution.set(container.clientWidth, container.clientHeight);
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        resolution,
        CONFIG.tour.bloomStrength,
        CONFIG.tour.bloomRadius,
        CONFIG.tour.bloomThreshold
      );
      composer.addPass(bloomPass);

      raycaster = new THREE.Raycaster();
      mouseVector = new THREE.Vector2();

      function onMouseMove(_e: MouseEvent) {
        if (!renderer || !raycaster || !mouseVector) return;
        const el = renderer.domElement;
        const rect = el.getBoundingClientRect();
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w === 0 || h === 0) return;
        mouseNormX = ((_e.clientX - rect.left) / w) * 2 - 1;
        mouseNormY = 1 - ((_e.clientY - rect.top) / h) * 2;

        mouseVector.set(mouseNormX, mouseNormY);
        raycaster.setFromCamera(mouseVector, camera);

        if (tooltipRef.current && raycastMesh) {
          const hits = raycaster.intersectObject(raycastMesh);
          if (hits.length > 0) {
            const inst = hits[0] as { instanceId?: number };
            const idx = typeof inst.instanceId === "number" ? inst.instanceId : 0;
            const name = CONFIG.tour.points[idx]?.name ?? "City";
            tooltipRef.current.textContent = name;
            tooltipRef.current.style.display = "block";
            tooltipRef.current.style.left = `${_e.clientX + 14}px`;
            tooltipRef.current.style.top = `${_e.clientY + 14}px`;
          } else {
            tooltipRef.current.style.display = "none";
          }
        }

        if (landFillMeshes.length > 0) {
          const landHits = raycaster.intersectObjects(landFillMeshes);
          if (landHits.length > 0) {
            const hitMesh = landHits[0].object as import("three").Mesh;
            if (hitMesh !== hoveredLandMesh) {
              if (hoveredLandMesh && hoveredLandMesh.material) {
                (hoveredLandMesh.material as import("three").MeshBasicMaterial).color.set(CONFIG.map.landFillColor);
              }
              hoveredLandMesh = hitMesh;
              (hitMesh.material as import("three").MeshBasicMaterial).color.set(CONFIG.map.landHighlightColor);
            }
          } else {
            if (hoveredLandMesh && hoveredLandMesh.material) {
              (hoveredLandMesh.material as import("three").MeshBasicMaterial).color.set(CONFIG.map.landFillColor);
              hoveredLandMesh = null;
            }
          }
        }
      }
      function onMouseLeave() {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
        if (hoveredLandMesh && hoveredLandMesh.material) {
          (hoveredLandMesh.material as import("three").MeshBasicMaterial).color.set(CONFIG.map.landFillColor);
          hoveredLandMesh = null;
        }
      }
      onMouseMoveHandler = onMouseMove;
      onMouseLeaveHandler = onMouseLeave;
      renderer.domElement.addEventListener("mousemove", onMouseMove);
      renderer.domElement.addEventListener("mouseleave", onMouseLeave);

      // Effective zoom limits: tighter on mobile so the map feels contained
      function getZoomLimits() {
        const narrow = typeof window !== "undefined" && window.innerWidth < 768;
        return {
          min: narrow ? 3 : CONFIG.camera.zoomMin,
          max: narrow ? 8 : CONFIG.camera.zoomMax,
        };
      }

      // Touch UX (mobile): drag to rotate, pinch to zoom.
      let touchDragging = false;
      let lastTouchX = 0;
      let lastTouchY = 0;
      let lastPinchDist: number | null = null;

      function getPinchDistance(t1: Touch, t2: Touch) {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return Math.hypot(dx, dy);
      }

      function onTouchStart(e: TouchEvent) {
        if (!renderer) return;
        if (e.touches.length === 1) {
          touchDragging = true;
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
          lastPinchDist = null;
        } else if (e.touches.length >= 2) {
          touchDragging = false;
          lastPinchDist = getPinchDistance(e.touches[0], e.touches[1]);
        }
      }

      function onTouchMove(e: TouchEvent) {
        if (!renderer || !camera) return;
        const el = renderer.domElement;
        const rect = el.getBoundingClientRect();
        const w = el.clientWidth || rect.width || 1;
        const h = el.clientHeight || rect.height || 1;

        // Prevent page scroll while interacting with the map.
        if (e.cancelable) e.preventDefault();

        if (e.touches.length >= 2) {
          const dist = getPinchDistance(e.touches[0], e.touches[1]);
          if (lastPinchDist) {
            const ratio = lastPinchDist / dist;
            const { min: zoomMin, max: zoomMax } = getZoomLimits();
            const lookAt = new THREE.Vector3(lookAtVector.x, lookAtVector.y, lookAtVector.z);
            const dir = new THREE.Vector3().subVectors(camera.position, lookAt).normalize();
            let d = camera.position.distanceTo(lookAt);
            d = Math.min(zoomMax, Math.max(zoomMin, d * ratio));
            camera.position.copy(lookAt).add(dir.multiplyScalar(d));
          }
          lastPinchDist = dist;
          return;
        }

        if (touchDragging && e.touches.length === 1) {
          const t = e.touches[0];
          const dx = t.clientX - lastTouchX;
          const dy = t.clientY - lastTouchY;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;

          // Convert drag delta into normalized rotation driver.
          mouseNormX = Math.max(-1, Math.min(1, mouseNormX + (dx / w) * 2));
          mouseNormY = Math.max(-1, Math.min(1, mouseNormY - (dy / h) * 2));
        }
      }

      function onTouchEnd(e: TouchEvent) {
        if (e.touches.length === 0) {
          touchDragging = false;
          lastPinchDist = null;
        } else if (e.touches.length === 1) {
          touchDragging = true;
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
          lastPinchDist = null;
        }
      }

      onTouchStartHandler = onTouchStart;
      onTouchMoveHandler = onTouchMove;
      onTouchEndHandler = onTouchEnd;
      renderer.domElement.addEventListener("touchstart", onTouchStart, { passive: true });
      renderer.domElement.addEventListener("touchmove", onTouchMove, { passive: false });
      renderer.domElement.addEventListener("touchend", onTouchEnd, { passive: true });

      // Scroll to zoom: only allow page scroll when touch device AND narrow; otherwise zoom the map
      function onWheel(e: WheelEvent) {
        const coarsePointer = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
        const narrow = typeof window !== "undefined" && window.innerWidth < 768;
        if (coarsePointer && narrow) {
          return; // touch + narrow: allow page scroll
        }
        e.preventDefault();
        e.stopPropagation();
        if (!camera) return;
        const { min: zoomMin, max: zoomMax } = getZoomLimits();
        const lookAt = new THREE.Vector3(lookAtVector.x, lookAtVector.y, lookAtVector.z);
        const dir = new THREE.Vector3().subVectors(camera.position, lookAt).normalize();
        let dist = camera.position.distanceTo(lookAt);
        const delta = e.deltaY > 0 ? 1.15 : 0.87;
        dist = Math.min(zoomMax, Math.max(zoomMin, dist * delta));
        camera.position.copy(lookAt).add(dir.multiplyScalar(dist));
      }
      onWheelHandler = onWheel;
      renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

      // Click on city marker to show tour info
      function onClick(e: MouseEvent) {
        if (!renderer || !raycaster || !mouseVector || !raycastMesh) return;
        const el = renderer.domElement;
        const rect = el.getBoundingClientRect();
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w === 0 || h === 0) return;
        const nx = ((e.clientX - rect.left) / w) * 2 - 1;
        const ny = 1 - ((e.clientY - rect.top) / h) * 2;
        mouseVector.set(nx, ny);
        raycaster.setFromCamera(mouseVector, camera);
        const hits = raycaster.intersectObject(raycastMesh);
        if (hits.length > 0) {
          const inst = hits[0] as { instanceId?: number };
          const idx = typeof inst.instanceId === "number" ? inst.instanceId : 0;
          setSelectedCityIndexRef.current?.(idx);
        }
      }
      onClickHandler = onClick;
      renderer.domElement.addEventListener("click", onClick);

      mapGroup = new THREE.Group();
      mapGroup.position.set(
        CONFIG.map.position.x,
        CONFIG.map.position.y,
        CONFIG.map.position.z
      );
      mapGroup.scale.set(
        CONFIG.map.scale * CONFIG.map.scaleX,
        1,
        CONFIG.map.scale * CONFIG.map.scaleZ
      );
      mapGroup.rotation.set(
        CONFIG.map.rotation.x,
        CONFIG.map.rotation.y,
        CONFIG.map.rotation.z
      );
      scene.add(mapGroup);

      async function loadCanadaGeoJson(): Promise<number[][][][]> {
        const res = await fetch(CONFIG.geoJsonUrl);
        if (!res.ok) throw new Error("Failed to load GeoJSON");
        const data = (await res.json()) as { features: GeoFeature[] };
        const feature = data.features?.find(
          (f) => f.geometry?.type === "MultiPolygon"
        );
        if (!feature?.geometry?.coordinates)
          throw new Error("Invalid GeoJSON structure");
        return feature.geometry.coordinates;
      }

      try {
        const coords = await loadCanadaGeoJson();
        if (cancelledRef.current) return;
        const { group: landFillGroup, meshes: fillMeshes } = buildLandFillFromGeoJson(coords, bounds);
        mapGroup.add(landFillGroup);
        landFillMeshes = fillMeshes;
        const outlineGroup = buildOutlineFromGeoJson(coords, bounds);
        mapGroup.add(outlineGroup);
        try {
          const res = await fetch(CONFIG.provincesGeoJsonUrl);
          if (res.ok) {
            const provincesData = (await res.json()) as {
              features: ProvinceFeature[];
            };
            const bordersGroup = buildBordersFromFeatureCollection(
              provincesData,
              bounds
            );
            mapGroup.add(bordersGroup);
          }
        } catch {
          // Provinces optional
        }
        const { group: tourGroup, glowMesh } = buildTourMarkers(bounds);
        mapGroup.add(tourGroup);
        raycastMesh = glowMesh;
      } catch (err) {
        console.warn("GeoJSON load failed, using fallback outline:", err);
        const b = bounds;
        const fillPts = FALLBACK_OUTLINE.map(([lng, lat]) => {
          const x = -(((lng - b.lngMin) / (b.lngMax - b.lngMin)) * 2 - 1);
          const z = ((lat - b.latMin) / (b.latMax - b.latMin)) * 2 - 1;
          return new THREE.Vector3(x, -0.0005, z);
        });
        const shape = new THREE.Shape();
        shape.moveTo(fillPts[0].x, fillPts[0].z);
        for (let i = 1; i < fillPts.length; i++) shape.lineTo(fillPts[i].x, fillPts[i].z);
        const fallbackGeom = new THREE.ShapeGeometry(shape);
        fallbackGeom.translate(0, -0.0005, 0);
        fallbackGeom.rotateX(-Math.PI / 2);
        const fallbackMat = new THREE.MeshBasicMaterial({
          color: CONFIG.map.landFillColor,
          depthWrite: true,
          side: THREE.DoubleSide,
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeom, fallbackMat);
        fallbackMesh.name = "landFill";
        mapGroup.add(fallbackMesh);
        landFillMeshes = [fallbackMesh];
        const linePts = FALLBACK_OUTLINE.map(([lng, lat]) => {
          const x = -(((lng - b.lngMin) / (b.lngMax - b.lngMin)) * 2 - 1);
          const z = ((lat - b.latMin) / (b.latMax - b.latMin)) * 2 - 1;
          return new THREE.Vector3(x, 0, z);
        });
        linePts.push(linePts[0].clone());
        const flat: number[] = [];
        for (const p of linePts) flat.push(p.x, p.y, p.z);
        const lineGeom = new LineGeometry().setPositions(flat);
        const lineMat = new LineMaterial({
          color: CONFIG.map.outlineColor,
          linewidth: CONFIG.map.line2Width,
          resolution,
        });
        borderLineMaterials.push(lineMat);
        const outlineLine = new Line2(lineGeom, lineMat);
        mapGroup.add(outlineLine);
        const { group: tourGroup, glowMesh } = buildTourMarkers(bounds);
        mapGroup.add(tourGroup);
        raycastMesh = glowMesh;
      }

      handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        resolution.set(w, h);
        borderLineMaterials.forEach((m) => m.resolution.set(w, h));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        composer.setSize(w, h);
        composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        bloomPass.resolution.set(w, h);
        bloomPass.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      const baseRot = {
        x: CONFIG.map.rotation.x,
        y: CONFIG.map.rotation.y,
        z: CONFIG.map.rotation.z,
      };
      const damp = CONFIG.map.mouseRotate.damp;
      const maxTiltX = CONFIG.map.mouseRotate.maxTiltX;
      const maxRotateY = CONFIG.map.mouseRotate.maxRotateY;

      function animate() {
        if (cancelledRef.current) return;
        animationId = requestAnimationFrame(animate);
        const targetX = baseRot.x + mouseNormY * maxTiltX;
        const targetY = baseRot.y + mouseNormX * maxRotateY;
        mouseRot.x += (targetX - mouseRot.x) * damp;
        mouseRot.y += (targetY - mouseRot.y) * damp;
        mouseRot.z = baseRot.z;
        mapGroup.rotation.set(mouseRot.x, mouseRot.y, mouseRot.z);
        composer.render();
      }
      animate();
    };

    const tooltipEl = tooltipRef.current;
    init();

    return () => {
      cancelledRef.current = true;
      if (typeof animationId !== "undefined") cancelAnimationFrame(animationId);
      if (typeof handleResize !== "undefined")
        window.removeEventListener("resize", handleResize);
      const ren = rendererRef.current;
      if (ren?.domElement) {
        if (onMouseMoveHandler) ren.domElement.removeEventListener("mousemove", onMouseMoveHandler);
        if (onMouseLeaveHandler) ren.domElement.removeEventListener("mouseleave", onMouseLeaveHandler);
        if (onWheelHandler) ren.domElement.removeEventListener("wheel", onWheelHandler);
        if (onClickHandler) ren.domElement.removeEventListener("click", onClickHandler);
        if (onTouchStartHandler) ren.domElement.removeEventListener("touchstart", onTouchStartHandler);
        if (onTouchMoveHandler) ren.domElement.removeEventListener("touchmove", onTouchMoveHandler);
        if (onTouchEndHandler) ren.domElement.removeEventListener("touchend", onTouchEndHandler);
      }
      if (tooltipEl) tooltipEl.style.display = "none";
      const r = rendererRef.current;
      if (r && container && r.domElement.parentNode === container) {
        container.removeChild(r.domElement);
        r.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  const point = selectedCityIndex !== null ? CONFIG.tour.points[selectedCityIndex] : null;
  const lumaEvent = point ? lumaByCity[point.name] : undefined;

  return (
    <section
      className="relative z-0 w-full overflow-hidden bg-[#182434] touch-pan-y px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      style={{ minHeight: "clamp(220px, 36vw, 380px)" }}
      aria-label="Canada tour map"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
        <div
          ref={containerRef}
          className="h-full w-full cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ minHeight: "clamp(220px, 36vw, 380px)" }}
        />
      </div>
      <div
        ref={tooltipRef}
        role="tooltip"
        aria-live="polite"
        className="pointer-events-none fixed z-[9999] rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-xl ring-1 ring-white/20"
        style={{ display: "none" }}
      />
      {/* Tour info panel when a city is clicked */}
      {point && (
        <>
          {/* Mobile: backdrop to allow tap-outside close */}
          <button
            type="button"
            className="fixed inset-0 z-[90] bg-black/30 sm:hidden"
            aria-label="Close tour info"
            onClick={() => setSelectedCityIndex(null)}
          />

          <div
            className="fixed inset-x-3 bottom-3 z-[100] max-h-[60vh] overflow-auto rounded-2xl border border-white/15 bg-slate-900/95 p-4 shadow-2xl backdrop-blur sm:absolute sm:bottom-4 sm:left-6 sm:right-auto sm:inset-x-auto sm:max-h-none sm:overflow-visible sm:rounded-xl sm:border-white/20 sm:p-5"
            role="dialog"
            aria-labelledby="tour-info-title"
            aria-modal="true"
          >
            <div className="sm:hidden mx-auto mb-2 h-1.5 w-10 rounded-full bg-white/20" aria-hidden />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 id="tour-info-title" className="text-lg font-bold text-white sm:text-xl">
                  {point.name}
                </h3>
                <p className="mt-1 text-xs text-amber-400/90 sm:text-sm">
                  {lumaEvent?.start
                    ? `Luma event · ${new Date(lumaEvent.start).toLocaleString()}`
                    : `Enable Canada Tour · ${point.date}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCityIndex(null)}
                className="shrink-0 rounded-xl p-2 text-slate-200/80 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-label="Close tour info"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mt-3 whitespace-normal break-words text-sm leading-relaxed text-slate-200/90 sm:text-sm">
              {lumaEvent?.title ||
                ("description" in point
                  ? point.description
                  : "Tour stop — event details and registration coming soon.")}
            </p>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <a
                href={lumaEvent?.url || "#cities"}
                target={lumaEvent?.url ? "_blank" : undefined}
                rel={lumaEvent?.url ? "noreferrer" : undefined}
                className="inline-flex w-full max-w-full whitespace-normal break-words items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-semibold leading-snug text-slate-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:max-w-[18rem] sm:px-4 sm:py-2.5"
              >
                {lumaEvent?.url ? "Open registration" : "Event details & registration"}
              </a>
              <button
                type="button"
                onClick={() => setSelectedCityIndex(null)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 sm:w-auto sm:px-4 sm:py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
