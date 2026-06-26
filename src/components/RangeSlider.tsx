interface RangeSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}

export default function RangeSlider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: RangeSliderProps) {
  const minLabel = `${min}${suffix ? ` ${suffix}` : ''}`;
  const maxLabel = `${max}${suffix ? ` ${suffix}` : ''}`;
  const displayValue = `${value}${suffix ? ` ${suffix}` : ''}`;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-black">
        <span className="text-[#c9c1b4]">{label}</span>
        <span className="text-white font-mono">{displayValue}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white bg-white/10 h-1 cursor-ew-resize focus-visible:outline-none"
      />
      <div className="flex justify-between text-xs text-gray-400 font-mono">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
