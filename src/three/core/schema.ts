import { z } from "zod";
import { random } from "remotion";

export const QualityPresetSchema = z.enum(["preview", "standard", "high"]).default("standard");

export const CameraPresetSchema = z.enum([
  "static",
  "orbit",
  "dolly",
  "zoom",
  "flyThrough",
  "topDown",
  "isometric",
]).default("orbit");

export const LightingPresetSchema = z.enum([
  "studio",
  "cyberpunk",
  "dramatic",
  "warm",
  "cool",
  "flat",
]).default("studio");

export const ObjectTypeSchema = z.enum([
  "cube",
  "sphere",
  "cylinder",
  "torus",
  "text3d",
  "particles",
  "networkGraph",
  "barChart",
  "gltfModel",
]);

export const AnimationTypeSchema = z.enum([
  "rotate",
  "pulse",
  "float",
  "scaleUp",
  "explode",
  "orbit",
  "dataFlow",
  "none",
]).default("rotate");

export const AnimationConfigSchema = z.object({
  type: AnimationTypeSchema,
  startFrame: z.number().int().min(0).optional().default(0),
  endFrame: z.number().int().min(1).optional(),
  speed: z.number().min(-10).max(10).optional().default(1),
  axis: z.enum(["x", "y", "z", "all"]).optional().default("y"),
  range: z.number().optional().default(1),
  reverse: z.boolean().optional().default(false),
}).optional();

export const BaseObjectSchema = z.object({
  id: z.string().default(() => `obj-${random(null).toString(36).substring(2, 7)}`),
  type: ObjectTypeSchema,
  position: z.tuple([z.number(), z.number(), z.number()]).optional().default([0, 0, 0]),
  rotation: z.tuple([z.number(), z.number(), z.number()]).optional().default([0, 0, 0]),
  scale: z.union([z.tuple([z.number(), z.number(), z.number()]), z.number()]).optional().default(1),
  color: z.string().optional().default("#38BDF8"),
  metalness: z.number().min(0).max(1).optional().default(0.2),
  roughness: z.number().min(0).max(1).optional().default(0.4),
  wireframe: z.boolean().optional().default(false),
  opacity: z.number().min(0).max(1).optional().default(1),
  animation: AnimationConfigSchema,
});

export const GeometryObjectSchema = BaseObjectSchema.extend({
  type: z.enum(["cube", "sphere", "cylinder", "torus"]),
  args: z.array(z.number()).optional(),
});

export const Text3DObjectSchema = BaseObjectSchema.extend({
  type: z.literal("text3d"),
  text: z.string().min(1),
  fontSize: z.number().positive().optional().default(0.8),
  letterSpacing: z.number().optional().default(0.02),
});

export const ParticlesObjectSchema = BaseObjectSchema.extend({
  type: z.literal("particles"),
  count: z.number().int().min(10).max(5000).optional().default(500),
  spread: z.number().positive().optional().default(6),
  particleSize: z.number().positive().optional().default(0.06),
  seed: z.number().int().optional().default(42),
});

export const NetworkGraphObjectSchema = BaseObjectSchema.extend({
  type: z.literal("networkGraph"),
  nodeCount: z.number().int().min(3).max(50).optional().default(8),
  radius: z.number().positive().optional().default(3),
  activeFlow: z.boolean().optional().default(true),
  nodeLabels: z.array(z.string()).optional(),
});

export const BarChartObjectSchema = BaseObjectSchema.extend({
  type: z.literal("barChart"),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      color: z.string().optional(),
    })
  ).min(1),
  maxHeight: z.number().positive().optional().default(4),
  barWidth: z.number().positive().optional().default(0.6),
});

export const GLTFModelObjectSchema = BaseObjectSchema.extend({
  type: z.literal("gltfModel"),
  modelUrl: z.string().min(1),
  fallbackType: z.enum(["cube", "sphere"]).optional().default("cube"),
});

export const Any3DObjectSchema = z.discriminatedUnion("type", [
  GeometryObjectSchema,
  Text3DObjectSchema,
  ParticlesObjectSchema,
  NetworkGraphObjectSchema,
  BarChartObjectSchema,
  GLTFModelObjectSchema,
]);

export const CameraConfigSchema = z.object({
  preset: CameraPresetSchema,
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  target: z.tuple([z.number(), z.number(), z.number()]).optional().default([0, 0, 0]),
  fov: z.number().min(10).max(120).optional().default(45),
  distance: z.number().positive().optional().default(8),
  speed: z.number().optional().default(1),
}).optional().default({ preset: "orbit", distance: 8, fov: 45, speed: 1, target: [0, 0, 0] });

export const LightingConfigSchema = z.object({
  preset: LightingPresetSchema,
  ambientIntensity: z.number().min(0).max(5).optional().default(0.6),
  mainLightIntensity: z.number().min(0).max(10).optional().default(1.5),
  accentColor: z.string().optional().default("#38BDF8"),
}).optional().default({ preset: "studio", ambientIntensity: 0.6, mainLightIntensity: 1.5, accentColor: "#38BDF8" });

export const ParticlePresetSchema = z.enum([
  "explosion",
  "formation",
  "disintegration",
  "wave",
  "galaxy",
  "data-flow",
  "energy-sphere",
  "tunnel",
  "hologram",
  "morphing",
]);

export const ParticleConfigSchema = z.object({
  preset: ParticlePresetSchema,
  particleCount: z.number().int().min(100).max(30000).optional(),
  seed: z.number().int().optional().default(42),
  color: z.string().optional().default("#38BDF8"),
  secondaryColor: z.string().optional().default("#A855F7"),
  size: z.number().min(0.01).max(1.0).optional().default(0.08),
  opacity: z.number().min(0.0).max(1.0).optional().default(0.9),
  speed: z.number().min(0.1).max(10.0).optional().default(1.0),
  spread: z.number().min(0.1).max(50.0).optional().default(5.0),
  startFrame: z.number().int().min(0).optional().default(0),
  durationInFrames: z.number().int().min(15).max(3600).optional(),
  quality: QualityPresetSchema.optional().default("standard"),
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  rotation: z.tuple([z.number(), z.number(), z.number()]).optional(),
  targetShape: z.enum(["cube", "sphere", "torus", "cylinder", "logo-text"]).optional(),
  sourceShape: z.enum(["cube", "sphere", "torus"]).optional(),
  shapeA: z.enum(["sphere", "cube", "torus"]).optional(),
  shapeB: z.enum(["torus", "sphere", "cube"]).optional(),
  shape: z.enum(["cube", "sphere", "cylinder"]).optional(),
  arms: z.number().int().min(1).max(8).optional(),
  frequency: z.number().optional(),
  amplitude: z.number().optional(),
  radius: z.number().optional(),
  tunnelRadius: z.number().optional(),
  tunnelLength: z.number().optional(),
  travelSpeed: z.number().optional(),
  scanSpeed: z.number().optional(),
  pulseSpeed: z.number().optional(),
  noiseStrength: z.number().optional(),
  flowSpeed: z.number().optional(),
  curveTightness: z.number().optional(),
  explosionForce: z.number().optional(),
  gravity: z.number().optional(),
});

export const Scene3DConfigSchema = z.object({
  id: z.string().optional(),
  type: z.enum([
    "3d-tech-explainer",
    "3d-product-showcase",
    "3d-algorithm-viz",
    "3d-data-viz",
    "3d-cinematic-intro",
    "3d-hybrid-explainer",
    "3d-particle",
  ]),
  durationInFrames: z.number().int().min(15).max(3600),
  camera: CameraConfigSchema,
  lighting: LightingConfigSchema,
  background: z.string().optional().default("#0B0F19"),
  quality: QualityPresetSchema,
  objects: z.array(Any3DObjectSchema).default([]),
  particleConfig: ParticleConfigSchema.optional(),
  captionOverlay: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.string().optional(),
    safeArea: z.boolean().optional().default(true),
  }).optional(),
});

export type ValidatedScene3D = z.infer<typeof Scene3DConfigSchema>;

export function validateScene3D(json: unknown): ValidatedScene3D {
  return Scene3DConfigSchema.parse(json);
}

export function safeValidateScene3D(json: unknown) {
  return Scene3DConfigSchema.safeParse(json);
}
