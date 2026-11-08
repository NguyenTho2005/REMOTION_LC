import React from "react";
import type { AnyParticleConfig, WaveConfig } from "../types";
import { ExplosionEffect } from "./ExplosionEffect";
import { FormationEffect } from "./FormationEffect";
import { DisintegrationEffect } from "./DisintegrationEffect";
import { WaveEffect } from "./WaveEffect";
import { GalaxyEffect } from "./GalaxyEffect";
import { DataFlowEffect } from "./DataFlowEffect";
import { EnergySphereEffect } from "./EnergySphereEffect";
import { TunnelEffect } from "./TunnelEffect";
import { HologramEffect } from "./HologramEffect";
import { MorphingEffect } from "./MorphingEffect";

export {
  ExplosionEffect,
  FormationEffect,
  DisintegrationEffect,
  WaveEffect,
  GalaxyEffect,
  DataFlowEffect,
  EnergySphereEffect,
  TunnelEffect,
  HologramEffect,
  MorphingEffect,
};

export const ParticleDispatcher: React.FC<{ config: AnyParticleConfig }> = ({
  config,
}) => {
  switch (config.preset) {
    case "explosion":
      return <ExplosionEffect {...config} />;
    case "formation":
      return <FormationEffect {...config} />;
    case "disintegration":
      return <DisintegrationEffect {...config} />;
    case "wave":
      return <WaveEffect {...config} />;
    case "galaxy":
      return <GalaxyEffect {...config} />;
    case "data-flow":
      return <DataFlowEffect {...config} />;
    case "energy-sphere":
      return <EnergySphereEffect {...config} />;
    case "tunnel":
      return <TunnelEffect {...config} />;
    case "hologram":
      return <HologramEffect {...config} />;
    case "morphing":
      return <MorphingEffect {...config} />;
    default:
      return <WaveEffect {...(config as WaveConfig)} />;
  }
};
