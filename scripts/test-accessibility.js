// Accessibility Contrast Ratio Validator (WCAG 2.1)
// Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html

console.log('Initiating WCAG 2.1 Accessibility Contrast Scanner... 🧬');

function getRGB(color) {
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrast(color1, color2) {
  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// Brand color palette definitions
const brandColors = {
  bgBlack: '#070706',
  bgCharcoal: '#11100d',
  goldAccent: '#f0c067',
  brandText: '#e7dfd2',
  whiteText: '#ffffff',
  greyMuted: '#9fa9a9',
  orangeSafety: '#8b4d20',
  warmBeige: '#e6dfd2'
};

const checks = [
  { name: 'Gold Accent on Dark Background', fg: brandColors.goldAccent, bg: brandColors.bgBlack, min: 4.5 },
  { name: 'Brand Text on Dark Background', fg: brandColors.brandText, bg: brandColors.bgBlack, min: 4.5 },
  { name: 'White Text on Dark Background', fg: brandColors.whiteText, bg: brandColors.bgBlack, min: 4.5 },
  { name: 'Gold Accent on Charcoal Background', fg: brandColors.goldAccent, bg: brandColors.bgCharcoal, min: 4.5 },
  { name: 'Brand Text on Charcoal Background', fg: brandColors.brandText, bg: brandColors.bgCharcoal, min: 4.5 },
  { name: 'Muted Grey on Dark Background', fg: brandColors.greyMuted, bg: brandColors.bgBlack, min: 4.5 },
  { name: 'Dark Text on Warm Beige Background', fg: brandColors.bgBlack, bg: brandColors.warmBeige, min: 4.5 },
  { name: 'Safety Orange on Warm Beige Background', fg: brandColors.orangeSafety, bg: brandColors.warmBeige, min: 4.5 }
];

let failed = false;

console.log('\n--- WCAG Contrast Ratio Audit Results ---');
checks.forEach(check => {
  const ratio = calculateContrast(check.fg, check.bg);
  const passed = ratio >= check.min;
  const status = passed ? '[PASS]' : '[FAIL]';
  
  console.log(`${status} ${check.name}:`);
  console.log(`  Foreground: ${check.fg} | Background: ${check.bg}`);
  console.log(`  Measured Ratio: ${ratio.toFixed(2)}:1 (Required: >= ${check.min}:1)`);
  
  if (!passed) {
    failed = true;
  }
});

console.log('\n----------------------------------------');
if (failed) {
  console.log('[WARNING] One or more color contrast ratios do not meet WCAG AA requirements. 🧬');
} else {
  console.log('[SUCCESS] All key brand color contrast pairings fully meet WCAG AA standards! 🧬');
}
