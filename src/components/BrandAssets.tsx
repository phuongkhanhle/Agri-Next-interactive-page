import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked';
  color?: 'olive' | 'white';
  className?: string;
}

/**
 * Exact Agri-Next Vietnam geometric emblem & wordmark from AgriElement PDF (Pages 1, 20, 23).
 * Features dashed diamond border, 3-leaf sprout, 3 diagonal terraced furrows, and 3 concentric curved hills.
 */
export const AgriNextLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  color = 'olive',
  className = '',
}) => {
  const stroke = color === 'white' ? '#FFFFFF' : '#556B2F';
  const textColor = color === 'white' ? 'text-white' : 'text-[#556B2F]';

  const Emblem = (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={variant === 'stacked' ? 'w-16 h-16 shrink-0' : 'w-10 h-10 shrink-0'}
      aria-hidden="true"
    >
      {/* Outer dashed diamond frame */}
      <path
        d="M60 6 L72 18 M78 24 L96 42 M102 48 L114 60 L102 72 M96 78 L78 96 M72 102 L60 114 L48 102 M42 96 L24 78 M18 72 L6 60 L18 48 M24 42 L42 24 M48 18 L60 6"
        stroke={stroke}
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner solid diamond */}
      <polygon
        points="60,15 105,60 60,105 15,60"
        stroke={stroke}
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      {/* Sprout center leaf */}
      <path
        d="M60 58 C53 48 53 33 60 24 C67 33 67 48 60 58 Z"
        stroke={stroke}
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      {/* Left leaf */}
      <path
        d="M60 58 C50 58 43 52 41 44 C50 44 56 49 60 58 Z"
        stroke={stroke}
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Right leaf */}
      <path
        d="M60 58 C70 58 77 52 79 44 C70 44 64 49 60 58 Z"
        stroke={stroke}
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      {/* Sprout stem */}
      <line x1="60" y1="58" x2="60" y2="69" stroke={stroke} strokeWidth="3.8" strokeLinecap="round" />
      {/* Left terraced furrows */}
      <line x1="27" y1="62" x2="55" y2="90" stroke={stroke} strokeWidth="3.6" strokeLinecap="round" />
      <line x1="34" y1="59" x2="56" y2="81" stroke={stroke} strokeWidth="3.6" strokeLinecap="round" />
      <line x1="42" y1="58" x2="57" y2="73" stroke={stroke} strokeWidth="3.6" strokeLinecap="round" />
      {/* Right concentric curved hills */}
      <path d="M60 99 C60 72 76 60 100 60" stroke={stroke} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M68 96 C68 77 80 68 95 68" stroke={stroke} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M77 88 C78 80 83 76 89 76" stroke={stroke} strokeWidth="3.6" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
        {Emblem}
        <div className={`text-center leading-none ${textColor}`}>
          <div className="font-brand text-xl font-bold tracking-[0.06em]">AGRI-NEXT</div>
          <div className="font-brand text-xs font-semibold tracking-[0.18em] mt-0.5">VIETNAM</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      {Emblem}
      <div className={`leading-none ${textColor}`}>
        <span className="font-brand text-lg font-bold tracking-[0.05em] block">AGRI-NEXT</span>
        <span className="font-brand text-[10px] font-semibold tracking-[0.22em] block mt-0.5 opacity-90">
          VIETNAM
        </span>
      </div>
    </div>
  );
};

/**
 * Exact Youth 4 Climate (Y4C) co-branding mark from AgriElement PDF (Pages 2, 10–19).
 */
export const Youth4ClimateLogo: React.FC<{
  color?: 'white' | 'olive' | 'brand';
  className?: string;
}> = ({ color = 'white', className = '' }) => {
  const yColor = color === 'white' ? '#FFFFFF' : color === 'olive' ? '#556B2F' : '#3B55B5';
  const fourColor = color === 'white' ? '#FFFFFF' : color === 'olive' ? '#556B2F' : '#4ADE80';
  const textInside = color === 'white' ? '#556B2F' : color === 'olive' ? '#EFF5D2' : '#FFFFFF';

  return (
    <svg
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-12 h-12 shrink-0 ${className}`}
      aria-label="Youth 4 Climate"
    >
      {/* Y block */}
      <rect x="6" y="6" width="46" height="46" rx="10" fill={yColor} />
      <path d="M18 16 L29 31 L40 16 M29 31 L29 44" stroke={textInside} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* 4 block */}
      <rect x="58" y="6" width="48" height="46" rx="10" fill={fourColor} />
      <path d="M84 16 L71 33 H92 M84 16 V42" stroke={color === 'brand' ? '#3B55B5' : textInside} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      {/* C block */}
      <rect x="6" y="58" width="46" height="48" rx="10" fill={yColor} />
      <path d="M40 72 C36 67 24 67 20 74 C16 81 18 93 27 95 C34 97 39 93 41 90" stroke={textInside} strokeWidth="6" strokeLinecap="round" />
      {/* YOUTH 4 CLIMATE square */}
      <rect x="58" y="58" width="48" height="48" rx="10" fill={yColor} />
      <text
        x="82"
        y="79"
        textAnchor="middle"
        fill={color === 'brand' ? '#4ADE80' : textInside}
        fontSize="10.5"
        fontWeight="800"
        fontFamily="Montserrat, sans-serif"
      >
        YOUTH 4
      </text>
      <text
        x="82"
        y="94"
        textAnchor="middle"
        fill={color === 'brand' ? '#4ADE80' : textInside}
        fontSize="10.5"
        fontWeight="800"
        fontFamily="Montserrat, sans-serif"
      >
        CLIMATE
      </text>
    </svg>
  );
};

/**
 * Exact 4-tile Cao Bang geometric brocade band from AgriElement PDF (Pages 5, 6, 11–21).
 */
export const BrocadeStrip: React.FC<{
  tone?: 'olive' | 'moss' | 'lime' | 'cream' | 'amber';
  heightClass?: string;
  className?: string;
}> = ({ tone = 'olive', heightClass = 'h-7', className = '' }) => {
  const palettes = {
    olive: { bg: '#556B2F', stroke: 'rgba(198, 216, 112, 0.36)' },
    moss: { bg: '#8FA31E', stroke: 'rgba(239, 245, 210, 0.36)' },
    lime: { bg: '#C6D870', stroke: 'rgba(85, 107, 47, 0.28)' },
    cream: { bg: '#EFF5D2', stroke: 'rgba(85, 107, 47, 0.24)' },
    amber: { bg: '#F4991A', stroke: 'rgba(255, 255, 255, 0.34)' },
  };
  const p = palettes[tone];
  const patternId = `brocade-${tone}`;

  return (
    <div
      className={`w-full overflow-hidden ${heightClass} ${className}`}
      style={{ backgroundColor: p.bg }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width="96" height="48" patternUnits="userSpaceOnUse">
            {/* Tile 1: Concentric Diamond */}
            <polygon points="24,4 44,24 24,44 4,24" fill="none" stroke={p.stroke} strokeWidth="1.8" />
            <polygon points="24,11 37,24 24,37 11,24" fill="none" stroke={p.stroke} strokeWidth="1.6" />
            <polygon points="24,18 30,24 24,30 18,24" fill="none" stroke={p.stroke} strokeWidth="1.5" />
            {/* Tile 2: Four-petal highland flower diamond */}
            <polygon points="72,4 92,24 72,44 52,24" fill="none" stroke={p.stroke} strokeWidth="1.8" />
            <path
              d="M72 12 C76 18 76 22 72 24 C68 22 68 18 72 12 Z M72 36 C76 30 76 26 72 24 C68 26 68 30 72 36 Z M60 24 C66 20 70 20 72 24 C70 28 66 28 60 24 Z M84 24 C78 20 74 20 72 24 C74 28 78 28 84 24 Z"
              fill="none"
              stroke={p.stroke}
              strokeWidth="1.5"
            />
            {/* Connecting wave arcs */}
            <path d="M44 24 C46 20 50 20 52 24" fill="none" stroke={p.stroke} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

/**
 * Exact Agri-Next Leaf Mascot ("Bé Mầm") from AgriElement PDF Page 8.
 */
export const LeafMascot: React.FC<{
  mood?: 'happy' | 'idea' | 'telescope' | 'analytics' | 'curious';
  className?: string;
}> = ({ mood = 'happy', className = 'w-20 h-20' }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Idea lightbulb */}
      {mood === 'idea' && (
        <g>
          <circle cx="24" cy="24" r="9" fill="#FFF8D6" stroke="#F4991A" strokeWidth="2.5" />
          <path d="M21 33 H27 M24 10 V13 M11 24 H14 M34 24 H37 M15 15 L17 17 M33 15 L31 17" stroke="#F4991A" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}
      {/* Curious swirl */}
      {mood === 'curious' && (
        <path
          d="M22 30 C16 22 25 14 31 20 C35 24 27 32 23 28"
          stroke="#212122"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
      )}
      {/* Analytics mini chart behind */}
      {mood === 'analytics' && (
        <g>
          <rect x="64" y="20" width="42" height="28" rx="4" fill="#556B2F" />
          <path d="M71 40 L80 32 L88 36 L99 26" stroke="#EFF5D2" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* Legs */}
      <path d="M51 94 V107 H45" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M67 94 V107 H73" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Arms */}
      {mood === 'idea' ? (
        <>
          <path d="M38 66 L26 48" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M82 68 L94 74 L84 82" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M38 68 L24 60" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" />
          <path d="M82 68 L96 58" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" />
        </>
      )}

      {/* Leaf Body */}
      <path
        d="M60 16 C35 28 30 58 36 78 C41 92 50 97 60 97 C70 97 79 92 84 78 C90 58 85 28 60 16 Z"
        fill="#8FA31E"
      />
      {/* Leaf central & diagonal veins */}
      <path d="M60 22 V95" stroke="#6E8214" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M60 44 L45 36 M60 44 L75 36 M60 78 L42 69 M60 78 L78 69" stroke="#6E8214" strokeWidth="2.4" strokeLinecap="round" />

      {/* White visor eye band (signature Page 8 detail) */}
      <path d="M40 59 C40 50 48 45 60 45 C72 45 80 50 80 59 L78 63 H42 Z" fill="#FFFFFF" />

      {/* Eyes */}
      {mood === 'happy' ? (
        <>
          <path d="M49 57 C50 52 55 52 56 57" stroke="#212122" strokeWidth="3" strokeLinecap="round" />
          <path d="M64 57 C65 52 70 52 71 57" stroke="#212122" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="53" y1="51" x2="53" y2="59" stroke="#212122" strokeWidth="3.4" strokeLinecap="round" />
          <line x1="67" y1="51" x2="67" y2="59" stroke="#212122" strokeWidth="3.4" strokeLinecap="round" />
        </>
      )}

      {/* Telescope prop */}
      {mood === 'telescope' && (
        <path
          d="M68 55 L100 42 L104 51 L72 62 Z"
          fill="#F4991A"
          stroke="#212122"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

/**
 * Exact Agri-Next Grain/Chestnut Mascot ("Bé Hạt") from AgriElement PDF Page 8.
 */
export const GrainMascot: React.FC<{
  mood?: 'happy' | 'wave';
  className?: string;
}> = ({ mood = 'happy', className = 'w-20 h-20' }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Legs */}
      <path d="M51 94 V107 H45" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M69 94 V107 H75" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Arms */}
      <path d="M36 68 L22 76" stroke="#212122" strokeWidth="3.8" strokeLinecap="round" />
      <path
        d={mood === 'wave' ? 'M84 66 L99 54' : 'M84 68 L98 76'}
        stroke="#212122"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* Faceted amber grain/chestnut body */}
      <polygon
        points="60,14 86,38 89,68 74,95 46,95 31,68 34,38"
        fill="#F4991A"
      />
      {/* Warm darker amber stripes matching Page 8 */}
      <path
        d="M45 31 L65 36 M40 44 L76 52 M41 75 L74 82"
        stroke="#D47D0E"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* White visor eye band */}
      <polygon points="41,51 79,51 76,68 44,68" fill="#FFFFFF" />
      <line x1="54" y1="55" x2="54" y2="64" stroke="#212122" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="66" y1="55" x2="66" y2="64" stroke="#212122" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Exact dashed-diamond social icons from AgriElement PDF Pages 7 & 10.
 */
export const SocialDiamondIcon: React.FC<{
  platform: 'facebook' | 'instagram' | 'linkedin';
  tone?: 'white' | 'olive';
  className?: string;
}> = ({ platform, tone = 'white', className = 'w-11 h-11' }) => {
  const frameStroke = tone === 'white' ? '#FFFFFF' : '#8FA31E';
  const fillBg = tone === 'white' ? '#FFFFFF' : '#8FA31E';
  const glyphColor = tone === 'white' ? '#556B2F' : '#FFFFFF';

  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path
        d="M32 3 L40 11 M44 15 L54 25 M58 29 L61 32 L58 35 M54 39 L44 49 M40 53 L32 61 L24 53 M20 49 L10 39 M6 35 L3 32 L6 29 M10 25 L20 15 M24 11 L32 3"
        stroke={frameStroke}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <polygon points="32,10 54,32 32,54 10,32" fill={fillBg} />
      {platform === 'facebook' && (
        <path
          d="M35 23 H38 V19 H34.5 C31.2 19 29.5 21 29.5 24 V27 H26.5 V31 H29.5 V43 H34 V31 H37.5 L38 27 H34 V24.5 C34 23.6 34.4 23 35 23 Z"
          fill={glyphColor}
        />
      )}
      {platform === 'instagram' && (
        <g stroke={glyphColor} strokeWidth="2.3">
          <rect x="23" y="23" width="18" height="18" rx="5" fill="none" />
          <circle cx="32" cy="32" r="4.2" fill="none" />
          <circle cx="37.2" cy="26.8" r="1.1" fill={glyphColor} stroke="none" />
        </g>
      )}
      {platform === 'linkedin' && (
        <g fill={glyphColor}>
          <circle cx="25.5" cy="24.5" r="2" />
          <rect x="23.8" y="28.2" width="3.4" height="11.3" rx="0.6" />
          <path d="M29.8 28.2 H33 V29.8 C33.8 28.7 35.1 27.9 36.8 27.9 C39.5 27.9 41 29.7 41 32.8 V39.5 H37.6 V33.6 C37.6 31.9 36.9 31 35.5 31 C34 31 33.2 32 33.2 33.7 V39.5 H29.8 V28.2 Z" />
        </g>
      )}
    </svg>
  );
};
