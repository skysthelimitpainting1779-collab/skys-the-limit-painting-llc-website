import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import type { Key } from 'react';

type Market = 'residential' | 'commercial' | 'public-sector';

type FrameAsset = {
  src: string;
  start: number;
  duration: number;
  fromScale: number;
  toScale: number;
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
  objectPosition: string;
};

const assets = {
  hero: 'brand/remotion/sky-premium-market-hero-v2.png',
  generatedSpray: 'brand/generated/premium-residential-spray.png',
  generatedFinishedRoom:
    'brand/generated/premium-residential-finished-room.png',
  generatedRoller: 'brand/generated/premium-residential-roller.png',
  generatedCommercialCrew: 'brand/generated/premium-commercial-crew.png',
  generatedCommercialInspection:
    'brand/generated/premium-commercial-inspection.png',
  interiorAction: 'brand/gbp/SkyGBP_Interior_Action.png',
  exteriorAction: 'brand/gbp/SkyGBP_Exterior_Action_Logo.png',
  equipment: 'brand/gbp/SkyGBP_Branded_Equipment.png',
  lightPole: 'brand/gbp/SkyGBP_LightPole_Painting.png',
  prep: 'brand/gbp/SkyGBP_SurfacePrep_Closeup_1.png',
  livingRoom: 'brand/work/sky-work-02-finished-living-room.png',
  commercial: 'brand/work/sky-work-08-finished-commercial.png',
  striping: 'brand/work/SkyLLP_ParkingLot_Striping.png',
};

const heroFrames: FrameAsset[] = [
  {
    src: assets.generatedSpray,
    start: 0,
    duration: 118,
    fromScale: 1.02,
    toScale: 1.1,
    fromX: 28,
    toX: -24,
    fromY: 0,
    toY: -7,
    objectPosition: '52% center',
  },
  {
    src: assets.generatedFinishedRoom,
    start: 86,
    duration: 112,
    fromScale: 1.03,
    toScale: 1.11,
    fromX: -36,
    toX: 4,
    fromY: 0,
    toY: -8,
    objectPosition: '48% center',
  },
  {
    src: assets.generatedCommercialCrew,
    start: 165,
    duration: 118,
    fromScale: 1.03,
    toScale: 1.11,
    fromX: 28,
    toX: -24,
    fromY: 0,
    toY: -8,
    objectPosition: '52% center',
  },
  {
    src: assets.generatedCommercialInspection,
    start: 246,
    duration: 114,
    fromScale: 1.04,
    toScale: 1.12,
    fromX: -28,
    toX: -60,
    fromY: 0,
    toY: -8,
    objectPosition: '56% center',
  },
  {
    src: assets.hero,
    start: 292,
    duration: 68,
    fromScale: 1.05,
    toScale: 1.1,
    fromX: 10,
    toX: -20,
    fromY: 0,
    toY: -6,
    objectPosition: '58% center',
  },
];

const marketAssets: Record<Market, FrameAsset[]> = {
  residential: [
    {
      src: assets.generatedFinishedRoom,
      start: 0,
      duration: 120,
      fromScale: 1.03,
      toScale: 1.1,
      fromX: -22,
      toX: 12,
      fromY: 0,
      toY: -8,
      objectPosition: '48% center',
    },
    {
      src: assets.generatedRoller,
      start: 82,
      duration: 100,
      fromScale: 1.04,
      toScale: 1.12,
      fromX: 22,
      toX: -18,
      fromY: 0,
      toY: -8,
      objectPosition: '50% center',
    },
  ],
  commercial: [
    {
      src: assets.generatedCommercialCrew,
      start: 0,
      duration: 118,
      fromScale: 1.03,
      toScale: 1.11,
      fromX: 18,
      toX: -22,
      fromY: 0,
      toY: -8,
      objectPosition: '50% center',
    },
    {
      src: assets.generatedCommercialInspection,
      start: 78,
      duration: 108,
      fromScale: 1.04,
      toScale: 1.12,
      fromX: -20,
      toX: -52,
      fromY: 0,
      toY: -7,
      objectPosition: '56% center',
    },
  ],
  'public-sector': [
    {
      src: assets.equipment,
      start: 0,
      duration: 118,
      fromScale: 1.05,
      toScale: 1.13,
      fromX: 18,
      toX: -20,
      fromY: 0,
      toY: -10,
      objectPosition: '52% center',
    },
    {
      src: assets.lightPole,
      start: 76,
      duration: 110,
      fromScale: 1.08,
      toScale: 1.16,
      fromX: -24,
      toX: -48,
      fromY: 0,
      toY: -7,
      objectPosition: '58% center',
    },
  ],
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const slowEase = Easing.bezier(0.45, 0, 0.55, 1);

const Grain = () => (
  <AbsoluteFill
    style={{
      opacity: 0.09,
      mixBlendMode: 'overlay',
      backgroundImage:
        'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22) 0 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.14) 0 1px, transparent 1px)',
      backgroundSize: '7px 7px, 11px 11px',
    }}
  />
);

const BlueprintGrid = ({ opacity = 0.28 }: { opacity?: number }) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage:
        'linear-gradient(rgba(238,225,203,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(238,225,203,0.12) 1px, transparent 1px)',
      backgroundSize: '72px 72px',
    }}
  />
);

const StripeLanguage = ({ compact = false }: { compact?: boolean }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 180], [-60, 70], {
    ...clamp,
    easing: slowEase,
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          right: compact ? -80 : -120,
          bottom: compact ? 54 : 78,
          width: compact ? 520 : 820,
          height: compact ? 5 : 7,
          transform: `translateX(${drift}px) rotate(-10deg)`,
          background:
            'linear-gradient(90deg, transparent, rgba(240,192,103,0.95), transparent)',
          boxShadow: '0 0 42px rgba(240,192,103,0.24)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: compact ? -36 : -48,
          bottom: compact ? 88 : 126,
          width: compact ? 330 : 520,
          height: compact ? 2 : 3,
          transform: `translateX(${-drift * 0.55}px) rotate(-10deg)`,
          background: 'rgba(255,255,255,0.58)',
        }}
      />
    </AbsoluteFill>
  );
};

const CinematicGrade = ({ compact = false }: { compact?: boolean }) => (
  <AbsoluteFill>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, rgba(6,6,5,0.9) 0%, rgba(6,6,5,0.66) 35%, rgba(6,6,5,0.16) 72%, rgba(6,6,5,0.54) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(0deg, rgba(6,6,5,0.86) 0%, rgba(6,6,5,0.15) 34%, rgba(6,6,5,0.22) 100%)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: compact ? -150 : -220,
        top: compact ? -120 : -200,
        width: compact ? 460 : 760,
        height: compact ? 460 : 760,
        borderRadius: 999,
        background:
          'radial-gradient(circle, rgba(240,192,103,0.34), transparent 62%)',
        filter: 'blur(35px)',
      }}
    />
  </AbsoluteFill>
);

const AnimatedFrame = ({ asset }: { asset: FrameAsset; key?: Key }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - asset.start;
  const fadeIn = interpolate(localFrame, [0, 24], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const fadeOut = interpolate(
    localFrame,
    [asset.duration - 36, asset.duration],
    [1, 0],
    {
      ...clamp,
      easing: Easing.in(Easing.cubic),
    }
  );
  const move = interpolate(localFrame, [0, asset.duration], [0, 1], {
    ...clamp,
    easing: slowEase,
  });

  const scale = interpolate(move, [0, 1], [asset.fromScale, asset.toScale]);
  const x = interpolate(move, [0, 1], [asset.fromX, asset.toX]);
  const y = interpolate(move, [0, 1], [asset.fromY, asset.toY]);

  return (
    <Sequence from={asset.start} durationInFrames={asset.duration}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <Img
          src={staticFile(asset.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: asset.objectPosition,
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
            filter: 'saturate(0.86) contrast(1.08) brightness(0.82)',
          }}
        />
      </AbsoluteFill>
    </Sequence>
  );
};

const MeasurementMarks = ({ compact = false }: { compact?: boolean }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, compact ? 180 : 360], [0, 1], {
    ...clamp,
    easing: slowEase,
  });

  return (
    <AbsoluteFill>
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: compact ? 42 + index * 62 : 92 + index * 104,
            bottom: compact ? 34 : 58,
            width: 1,
            height: index % 2 === 0 ? (compact ? 34 : 58) : compact ? 22 : 38,
            opacity: 0.38 + progress * 0.22,
            background: 'rgba(238,225,203,0.72)',
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          left: compact ? 42 : 92,
          bottom: compact ? 34 : 58,
          width: compact ? 318 : 520,
          height: 1,
          opacity: 0.5,
          background: 'rgba(238,225,203,0.68)',
        }}
      />
    </AbsoluteFill>
  );
};

export const BrandHeroLoop = () => (
  <AbsoluteFill style={{ backgroundColor: '#070706' }}>
    {heroFrames.map((asset) => (
      <AnimatedFrame key={`${asset.src}-${asset.start}`} asset={asset} />
    ))}
    <CinematicGrade />
    <BlueprintGrid />
    <StripeLanguage />
    <MeasurementMarks />
    <Grain />
  </AbsoluteFill>
);

export type MarketLoopProps = {
  market: Market;
};

export const MarketLoop = ({ market }: MarketLoopProps) => {
  const assetsList =
    market === 'commercial'
      ? marketAssets.commercial
      : market === 'public-sector'
        ? marketAssets['public-sector']
        : marketAssets.residential;

  return (
    <AbsoluteFill style={{ backgroundColor: '#070706' }}>
      {assetsList.map((asset) => (
        <AnimatedFrame key={`${asset.src}-${asset.start}`} asset={asset} />
      ))}
      <CinematicGrade compact />
      <BlueprintGrid opacity={0.18} />
      <StripeLanguage compact />
      <MeasurementMarks compact />
      <Grain />
    </AbsoluteFill>
  );
};
