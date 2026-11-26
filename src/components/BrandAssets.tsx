import React from 'react';

/**
 * Official Agri-Next Vietnam brand assets, exported from the AgriElement brand kit
 * (logos, Youth 4 Climate co-brand mark, mascots, brocade patterns, social icons).
 * Files live in /public/brand — swap them there to update the whole site.
 */
const B = '/brand';

export const BRAND = {
  logo: {
    stackedOlive: `${B}/logo-stacked-olive.png`,
    stackedWhite: `${B}/logo-stacked-white.png`,
    horizontalOlive: `${B}/logo-horizontal-olive.png`,
    horizontalWhite: `${B}/logo-horizontal-white.png`,
  },
  y4c: {
    color: `${B}/y4c-color.png`,
    white: `${B}/y4c-white.png`,
  },
  motif: {
    diamond: `${B}/motif-diamond.png`,
    maze: `${B}/motif-maze.png`,
    star: `${B}/motif-star.png`,
    flower: `${B}/motif-flower.png`,
  },
  pattern: {
    tile: `${B}/pattern-tile.webp`,
    olive: `${B}/bg-olive.webp`,
    moss: `${B}/bg-moss.webp`,
    lime: `${B}/bg-lime.webp`,
    cream: `${B}/bg-cream.webp`,
    amber: `${B}/bg-amber.webp`,
  },
} as const;

export type LeafMood =
  | 'happy'
  | 'idea'
  | 'telescope'
  | 'analytics'
  | 'curious'
  | 'point'
  | 'walk'
  | 'cheer'
  | 'video'
  | 'money'
  | 'check'
  | 'call';

const LEAF_FILES: Record<LeafMood, string> = {
  happy: 'mascot-leaf-cheer',
  cheer: 'mascot-leaf-cheer',
  idea: 'mascot-leaf-idea',
  telescope: 'mascot-leaf-telescope',
  analytics: 'mascot-leaf-chart',
  curious: 'mascot-leaf-think',
  point: 'mascot-leaf-point',
  walk: 'mascot-leaf-walk',
  video: 'mascot-leaf-video',
  money: 'mascot-leaf-money',
  check: 'mascot-leaf-check',
  call: 'mascot-leaf-call',
};

interface LogoProps {
  variant?: 'horizontal' | 'stacked';
  color?: 'olive' | 'white';
  className?: string;
}

export const AgriNextLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  color = 'olive',
  className = '',
}) => {
  const src =
    variant === 'stacked'
      ? color === 'white'
        ? BRAND.logo.stackedWhite
        : BRAND.logo.stackedOlive
      : color === 'white'
        ? BRAND.logo.horizontalWhite
        : BRAND.logo.horizontalOlive;
  const size = variant === 'stacked' ? 'h-20 w-auto' : 'h-9 md:h-10 w-auto';
  return (
    <img
      src={src}
      alt="Agri-Next Vietnam"
      className={`${size} shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
};

export const Youth4ClimateLogo: React.FC<{
  color?: 'white' | 'olive' | 'brand';
  className?: string;
}> = ({ color = 'white', className = '' }) => (
  <img
    src={color === 'white' ? BRAND.y4c.white : BRAND.y4c.color}
    alt="Youth 4 Climate"
    className={`w-12 h-12 object-contain shrink-0 select-none ${className}`}
    draggable={false}
  />
);

const STRIP_BG: Record<'olive' | 'moss' | 'lime' | 'cream' | 'amber', string> = {
  olive: BRAND.pattern.olive,
  moss: BRAND.pattern.moss,
  lime: BRAND.pattern.lime,
  cream: BRAND.pattern.cream,
  amber: BRAND.pattern.amber,
};

/** Thin brand band filled with the official brocade pattern (as in the brand kit headers). */
export const BrocadeStrip: React.FC<{
  tone?: 'olive' | 'moss' | 'lime' | 'cream' | 'amber';
  heightClass?: string;
  className?: string;
}> = ({ tone = 'olive', heightClass = 'h-7', className = '' }) => (
  <div
    aria-hidden="true"
    className={`w-full ${heightClass} ${className}`}
    style={{
      backgroundImage: `url(${STRIP_BG[tone]})`,
      backgroundSize: '220px 220px',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
    }}
  />
);

/** Full-surface brand pattern background (use on hero/feature panels). */
export const patternStyle = (
  tone: 'olive' | 'moss' | 'lime' | 'cream' | 'amber',
  size = 420
): React.CSSProperties => ({
  backgroundImage: `url(${STRIP_BG[tone]})`,
  backgroundSize: `${size}px ${size}px`,
  backgroundRepeat: 'repeat',
});

/** "Bé Mầm" — the official Agri-Next leaf mascot. */
export const LeafMascot: React.FC<{ mood?: LeafMood; className?: string }> = ({
  mood = 'happy',
  className = 'w-20 h-20',
}) => (
  <img
    src={`${B}/${LEAF_FILES[mood]}.png`}
    alt=""
    aria-hidden="true"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

/** "Bé Hạt" — the official orange seed mascot. */
export const GrainMascot: React.FC<{ mood?: 'happy' | 'wave'; className?: string }> = ({
  mood = 'happy',
  className = 'w-20 h-20',
}) => (
  <img
    src={`${B}/${mood === 'wave' ? 'mascot-seed-run' : 'mascot-seed-stand'}.png`}
    alt=""
    aria-hidden="true"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

export const BrandMotif: React.FC<{
  kind?: keyof typeof BRAND.motif;
  className?: string;
}> = ({ kind = 'diamond', className = 'w-10 h-10' }) => (
  <img
    src={BRAND.motif[kind]}
    alt=""
    aria-hidden="true"
    className={`object-contain select-none ${className}`}
    draggable={false}
  />
);

const SOCIAL_KEY = { facebook: 'fb', instagram: 'ig', linkedin: 'in' } as const;

export const SocialDiamondIcon: React.FC<{
  platform: 'facebook' | 'instagram' | 'linkedin';
  tone?: 'white' | 'olive' | 'black';
  className?: string;
}> = ({ platform, tone = 'white', className = 'w-11 h-11' }) => {
  const t = tone === 'olive' ? 'moss' : tone;
  return (
    <img
      src={`${B}/social-${SOCIAL_KEY[platform]}-${t}.png`}
      alt=""
      aria-hidden="true"
      className={`object-contain select-none ${className}`}
      draggable={false}
    />
  );
};

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=61581455772414',
  instagram: 'https://www.instagram.com/agri_next.vietnam/',
  linkedin: 'https://www.linkedin.com/company/agri-next-vietnam/',
  email: 'agrinextvietnam@gmail.com',
} as const;
