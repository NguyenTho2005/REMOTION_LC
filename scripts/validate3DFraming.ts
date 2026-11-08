import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import * as THREE from "three";
import { projectBoundingBox } from "../src/3d/utils/projectBoundingBox";
import { getSafeAreaForAspectRatio, validateScreenBounds } from "../src/3d/utils/validateScreenBounds";
import { getAspectRatioInfo } from "../src/3d/utils/fitObjectToCamera";

interface FrameTestResult {
  frame: number;
  timeSec: number;
  cameraPos: [number, number, number];
  contentBounds3D: { min: [number, number, number]; max: [number, number, number] };
  projectedScreenBox: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  isValid: boolean;
  status: string;
  overflowPx: { left: number; right: number; top: number; bottom: number };
  coverageRatio: number;
  fillRatio: number;
  diagnosis: string;
}

interface CompositionFramingReport {
  compositionId: string;
  resolution: { width: number; height: number };
  aspectRatio: string;
  mode: string;
  totalFrames: number;
  sampledFramesCount: number;
  passedFramesCount: number;
  failedFramesCount: number;
  passRate: string;
  status: "PASSED" | "FAILED";
  safeZone: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  frameSamples: FrameTestResult[];
  exportedStills: string[];
}

interface MasterQAReport {
  timestamp: string;
  engine: string;
  summary: {
    totalCompositionsTested: number;
    passedCompositions: number;
    allPassed: boolean;
    aspectRatiosTested: string[];
  };
  compositions: CompositionFramingReport[];
}

function runFramingQA(): void {
  console.log("=================================================");
  console.log("   AUTOMATED 3D FRAMING & OVERFLOW QA SUITE     ");
  console.log("=================================================\n");

  const qaOutputDir = path.resolve(process.cwd(), "production/qa");
  const stillsDir = path.resolve(qaOutputDir, "stills");
  if (!fs.existsSync(stillsDir)) {
    fs.mkdirSync(stillsDir, { recursive: true });
  }

  const compositionsToTest = [
    {
      id: "Responsive3D-9x16",
      width: 1080,
      height: 1920,
      aspectRatio: "9:16",
      duration: 180,
      framesToSample: [0, 30, 60, 90, 120, 150, 179],
      contentBox: new THREE.Box3(new THREE.Vector3(-2.2, -0.6, -0.5), new THREE.Vector3(2.2, 1.2, 0.5)),
      cameraPreset: "orbit",
      baseDistance: 8.5,
    },
    {
      id: "Responsive3D-16x9",
      width: 1920,
      height: 1080,
      aspectRatio: "16:9",
      duration: 180,
      framesToSample: [0, 30, 60, 90, 120, 150, 179],
      contentBox: new THREE.Box3(new THREE.Vector3(-3.2, -1.0, -0.5), new THREE.Vector3(3.2, 1.2, 0.5)),
      cameraPreset: "orbit",
      baseDistance: 8.5,
    },
    {
      id: "ThreeTestAlgorithmViz",
      width: 1080,
      height: 1920,
      aspectRatio: "9:16",
      duration: 180,
      framesToSample: [0, 45, 90, 135, 179],
      // 10 blocks scaled at 0.44: width ~4.8 units
      contentBox: new THREE.Box3(new THREE.Vector3(-2.4, 0.1, -0.5), new THREE.Vector3(2.4, 1.6, 0.5)),
      cameraPreset: "static",
      baseDistance: 10.5,
    },
  ];

  const compositionReports: CompositionFramingReport[] = [];

  for (const comp of compositionsToTest) {
    console.log(`Testing ${comp.id} (${comp.width}x${comp.height}, ${comp.aspectRatio})...`);
    const aspectInfo = getAspectRatioInfo(comp.width, comp.height);
    const safeZone = getSafeAreaForAspectRatio(comp.width, comp.height);

    const camera = new THREE.PerspectiveCamera(45, comp.width / comp.height, 0.1, 1000);
    const frameSamples: FrameTestResult[] = [];
    const exportedStills: string[] = [];

    let passedCount = 0;

    for (const f of comp.framesToSample) {
      // Calculate camera position according to preset & frame
      const distanceMultiplier = aspectInfo.isPortrait ? 1.58 : 1.0;
      const distance = comp.baseDistance * distanceMultiplier;

      if (comp.cameraPreset === "orbit") {
        const angle = f * 0.012 * 0.8;
        camera.position.x = Math.sin(angle) * distance;
        camera.position.z = Math.cos(angle) * distance;
        camera.position.y = aspectInfo.isPortrait ? 1.5 : 1.0;
        camera.lookAt(0, aspectInfo.isPortrait ? 0.35 : 0, 0);
      } else {
        camera.position.set(0, 2.0, distance);
        camera.lookAt(0, 0.7, 0);
      }

      camera.updateMatrixWorld(true);
      camera.updateProjectionMatrix();

      // Project bounding box
      const screenBox = projectBoundingBox(comp.contentBox, camera, comp.width, comp.height);
      const validation = validateScreenBounds(screenBox, safeZone);

      if (validation.isValid) {
        passedCount++;
      }

      frameSamples.push({
        frame: f,
        timeSec: Number((f / 30).toFixed(2)),
        cameraPos: [
          Number(camera.position.x.toFixed(2)),
          Number(camera.position.y.toFixed(2)),
          Number(camera.position.z.toFixed(2)),
        ],
        contentBounds3D: {
          min: [comp.contentBox.min.x, comp.contentBox.min.y, comp.contentBox.min.z],
          max: [comp.contentBox.max.x, comp.contentBox.max.y, comp.contentBox.max.z],
        },
        projectedScreenBox: {
          minX: Math.round(screenBox.minX),
          maxX: Math.round(screenBox.maxX),
          minY: Math.round(screenBox.minY),
          maxY: Math.round(screenBox.maxY),
          width: Math.round(screenBox.width),
          height: Math.round(screenBox.height),
        },
        isValid: validation.isValid,
        status: validation.status,
        overflowPx: {
          left: Math.round(validation.overflowPx.left),
          right: Math.round(validation.overflowPx.right),
          top: Math.round(validation.overflowPx.top),
          bottom: Math.round(validation.overflowPx.bottom),
        },
        coverageRatio: Number((validation.coverageRatio * 100).toFixed(2)),
        fillRatio: Number((validation.fillRatio * 100).toFixed(2)),
        diagnosis: validation.diagnosis,
      });
    }

    // Export key still frames using Remotion CLI
    const stillFrames = [comp.framesToSample[1], comp.framesToSample[3]];
    for (const sf of stillFrames) {
      const stillFilename = `${comp.id}_f${sf}.png`;
      const stillPath = path.join(stillsDir, stillFilename);
      try {
        console.log(`  Rendering still frame ${sf} -> ${stillFilename}...`);
        execSync(`npx remotion still ${comp.id} ${stillPath} --frame=${sf}`, {
          stdio: "pipe",
        });
        exportedStills.push(`production/qa/stills/${stillFilename}`);
      } catch (err) {
        console.error(`  Warning: Still render failed for ${comp.id} f${sf}:`, err);
      }
    }

    const passRate = `${((passedCount / comp.framesToSample.length) * 100).toFixed(1)}%`;
    const isOverallPassed = passedCount === comp.framesToSample.length;

    console.log(`  -> Result: ${passedCount}/${comp.framesToSample.length} frames passed (${passRate})\n`);

    compositionReports.push({
      compositionId: comp.id,
      resolution: { width: comp.width, height: comp.height },
      aspectRatio: comp.aspectRatio,
      mode: aspectInfo.mode,
      totalFrames: comp.duration,
      sampledFramesCount: comp.framesToSample.length,
      passedFramesCount: passedCount,
      failedFramesCount: comp.framesToSample.length - passedCount,
      passRate,
      status: isOverallPassed ? "PASSED" : "FAILED",
      safeZone: {
        minX: safeZone.minX,
        maxX: safeZone.maxX,
        minY: safeZone.minY,
        maxY: safeZone.maxY,
        width: safeZone.width,
        height: safeZone.height,
      },
      frameSamples,
      exportedStills,
    });
  }

  const allPassed = compositionReports.every((c) => c.status === "PASSED");
  const masterReport: MasterQAReport = {
    timestamp: new Date().toISOString(),
    engine: "Remotion + Three.js Responsive 3D Framing System",
    summary: {
      totalCompositionsTested: compositionReports.length,
      passedCompositions: compositionReports.filter((c) => c.status === "PASSED").length,
      allPassed,
      aspectRatiosTested: ["9:16 (1080x1920)", "16:9 (1920x1080)"],
    },
    compositions: compositionReports,
  };

  const reportPath = path.join(qaOutputDir, "framing-qa-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(masterReport, null, 2), "utf-8");
  console.log(`QA Report successfully written to: ${reportPath}`);

  if (allPassed) {
    console.log("ALL 3D FRAMING TESTS PASSED PERFECTLY!\n");
  } else {
    console.warn("SOME FRAMES FAILED VALIDATION — INSPECT REPORT FOR DETAILS.\n");
  }
}

runFramingQA();
