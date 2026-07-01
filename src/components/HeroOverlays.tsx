import ResponsiveImage from './ResponsiveImage';

interface HeroOverlaysProps {
  imageSrc: string;
  imageAlt: string;
  imageOpacity?: string;
  imageClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  gradients: string[];
  blueprintOpacity?: string;
  roadRuleOpacity?: string;
  showMeasurementRules?: boolean;
  measurementRulesOpacity?: string;
}

export default function HeroOverlays({
  imageSrc,
  imageAlt,
  imageOpacity = 'opacity-20',
  imageClassName,
  imageWidth = 1600,
  imageHeight = 900,
  loading,
  fetchPriority,
  gradients,
  blueprintOpacity = 'opacity-12',
  roadRuleOpacity = 'opacity-70',
  showMeasurementRules = false,
  measurementRulesOpacity = 'opacity-16',
}: HeroOverlaysProps) {
  return (
    <>
      <ResponsiveImage
        src={imageSrc}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        loading={loading}
        fetchPriority={fetchPriority}
        className={
          imageClassName ??
          `absolute inset-0 h-full w-full object-cover ${imageOpacity} pointer-events-none`
        }
      />
      {gradients.map((cls) => (
        <div key={cls} className={`absolute inset-0 ${cls}`} />
      ))}
      <div className={`blueprint-grid absolute inset-0 ${blueprintOpacity}`} />
      <div
        className={`road-rule absolute left-0 top-0 h-1 w-full ${roadRuleOpacity}`}
      />
      {showMeasurementRules && (
        <div
          className={`measurement-rules absolute inset-0 ${measurementRulesOpacity}`}
        />
      )}
    </>
  );
}
