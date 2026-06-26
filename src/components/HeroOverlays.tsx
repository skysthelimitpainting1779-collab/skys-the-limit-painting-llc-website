import ResponsiveImage from './ResponsiveImage';

interface HeroOverlaysProps {
  imageSrc: string;
  imageAlt: string;
  bgColor?: string;
  imageOpacity?: string;
  imageClassName?: string;
  gradients?: string[];
  blueprintOpacity?: string;
  roadRuleOpacity?: string;
  showMeasurementRules?: boolean;
  measurementRulesOpacity?: string;
}

const defaultGradients = (bg: string) => [
  `bg-gradient-to-r from-[${bg}] via-[${bg}]/94 to-transparent`,
  `bg-gradient-to-t from-[${bg}] via-transparent to-transparent`,
];

export default function HeroOverlays({
  imageSrc,
  imageAlt,
  bgColor = '#050505',
  imageOpacity = 'opacity-20',
  imageClassName,
  gradients,
  blueprintOpacity = 'opacity-12',
  roadRuleOpacity = 'opacity-70',
  showMeasurementRules = false,
  measurementRulesOpacity = 'opacity-16',
}: HeroOverlaysProps) {
  const resolvedGradients = gradients ?? defaultGradients(bgColor);

  return (
    <>
      <ResponsiveImage
        src={imageSrc}
        alt={imageAlt}
        width={1600}
        height={900}
        className={imageClassName ?? `absolute inset-0 h-full w-full object-cover ${imageOpacity} pointer-events-none`}
      />
      {resolvedGradients.map((cls) => (
        <div key={cls} className={`absolute inset-0 ${cls}`} />
      ))}
      <div className={`blueprint-grid absolute inset-0 ${blueprintOpacity}`} />
      <div className={`road-rule absolute left-0 top-0 h-1 w-full ${roadRuleOpacity}`} />
      {showMeasurementRules && (
        <div className={`measurement-rules absolute inset-0 ${measurementRulesOpacity}`} />
      )}
    </>
  );
}
