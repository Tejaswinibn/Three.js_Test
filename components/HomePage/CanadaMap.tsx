"use client";

import { JSX, useEffect, useRef, useState } from "react";

const CONFIG = {
  scene: { background: "#182434" },
  map: {
    outlineColor: "#ffffff",
    outlineWidth: 1.2,
    /** Line2 pixel width for glowing borders */
    line2Width: 2.5,
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
      { lat: 44.65, lng: -63.57, name: "Halifax", date: "TBA", description: "Enable Canada Tour stop — Halifax. Event details and registration coming soon." },
      { lat: 47.57, lng: -52.71, name: "St. John's", date: "TBA", description: "Enable Canada Tour stop — St. John's. Event details and registration coming soon." },
      { lat: 46.24, lng: -63.13, name: "Charlottetown", date: "TBA", description: "Enable Canada Tour stop — Charlottetown. Event details and registration coming soon." },
      { lat: 62.45, lng: -114.37, name: "Yellowknife", date: "TBA", description: "Enable Canada Tour stop — Yellowknife. Event details and registration coming soon." },
      { lat: 60.72, lng: -135.06, name: "Whitehorse", date: "TBA", description: "Enable Canada Tour stop — Whitehorse. Event details and registration coming soon." },
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
    let raycastMesh: import("three").InstancedMesh | null = null;
    let raycaster: import("three").Raycaster | null = null;
    let mouseVector: import("three").Vector2 | null = null;
    let onMouseMoveHandler: ((e: MouseEvent) => void) | undefined;
    let onMouseLeaveHandler: (() => void) | undefined;
    let onWheelHandler: ((e: WheelEvent) => void) | undefined;
    let onClickHandler: ((e: MouseEvent) => void) | undefined;
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
            color: CONFIG.map.outlineColor,
            linewidth: CONFIG.map.line2Width,
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
        if (!renderer) return;
        const el = renderer.domElement;
        const rect = el.getBoundingClientRect();
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w === 0 || h === 0) return;
        mouseNormX = ((_e.clientX - rect.left) / w) * 2 - 1;
        mouseNormY = 1 - ((_e.clientY - rect.top) / h) * 2;

        if (tooltipRef.current && raycaster && mouseVector && raycastMesh) {
          mouseVector.set(mouseNormX, mouseNormY);
          raycaster.setFromCamera(mouseVector, camera);
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
      }
      function onMouseLeave() {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
      }
      onMouseMoveHandler = onMouseMove;
      onMouseLeaveHandler = onMouseLeave;
      renderer.domElement.addEventListener("mousemove", onMouseMove);
      renderer.domElement.addEventListener("mouseleave", onMouseLeave);

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
        const lookAt = new THREE.Vector3(lookAtVector.x, lookAtVector.y, lookAtVector.z);
        const dir = new THREE.Vector3().subVectors(camera.position, lookAt).normalize();
        let dist = camera.position.distanceTo(lookAt);
        const delta = e.deltaY > 0 ? 1.15 : 0.87;
        dist = Math.min(CONFIG.camera.zoomMax, Math.max(CONFIG.camera.zoomMin, dist * delta));
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
        const pts = FALLBACK_OUTLINE.map(([lng, lat]) => {
          const x = -(((lng - b.lngMin) / (b.lngMax - b.lngMin)) * 2 - 1);
          const z = ((lat - b.latMin) / (b.latMax - b.latMin)) * 2 - 1;
          return new THREE.Vector3(x, 0, z);
        });
        pts.push(pts[0].clone());
        const flat: number[] = [];
        for (const p of pts) flat.push(p.x, p.y, p.z);
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
      }
      if (tooltipRef.current) tooltipRef.current.style.display = "none";
      const r = rendererRef.current;
      if (r && container && r.domElement.parentNode === container) {
        container.removeChild(r.domElement);
        r.dispose();
        rendererRef.current = null;
      }
    };
  }, []);

  const point = selectedCityIndex !== null ? CONFIG.tour.points[selectedCityIndex] : null;

  return (
    <section
      className="relative z-0 w-full overflow-hidden bg-[#182434] touch-pan-y"
      style={{ minHeight: "clamp(280px, 50vw, 560px)" }}
      aria-label="Canada tour map"
    >
      <div
        ref={containerRef}
        className="h-full w-full cursor-grab active:cursor-grabbing touch-pan-y"
        style={{ minHeight: "clamp(280px, 50vw, 560px)" }}
      />
      <div
        ref={tooltipRef}
        role="tooltip"
        aria-live="polite"
        className="pointer-events-none fixed z-[9999] rounded-lg bg-slate-900 px-4 py-2.5 text-base font-semibold text-white shadow-xl ring-1 ring-white/20"
        style={{ display: "none" }}
      />
      {/* Tour info panel when a city is clicked */}
      {point && (
        <div
          className="absolute bottom-4 left-4 right-4 z-[100] max-w-md rounded-xl border border-white/20 bg-slate-900/95 p-5 shadow-2xl backdrop-blur sm:left-6 sm:right-auto"
          role="dialog"
          aria-labelledby="tour-info-title"
          aria-modal="true"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 id="tour-info-title" className="text-xl font-bold text-white">
                {point.name}
              </h3>
              <p className="mt-1 text-sm text-amber-400/90">
                Enable Canada Tour · {point.date}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {"description" in point ? point.description : "Tour stop — event details and registration coming soon."}
              </p>
              <a
                href="#cities"
                className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Event details & registration
              </a>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCityIndex(null)}
              className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Close tour info"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
