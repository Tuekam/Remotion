import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	registerRoot,
	Composition,
	Sequence,
	staticFile,
	Easing,
} from 'remotion';

// --- CONSTANTS ---
const COLORS = {
	blue: '#004369',
	orange: '#DA6220',
	white: '#FFFFFF',
	lightBlue: '#005a8d',
	gray: '#F5F5F5',
};

const FONTS = {
	primary: 'Lucky Bones, sans-serif',
	secondary: 'Nunito, sans-serif',
};

// --- COMPONENTS ---

const ProductCard: React.FC<{ frame: number }> = ({ frame }) => {
	const spr = spring({ frame, fps: 30, config: { damping: 12 } });
	const float = Math.sin(frame / 20) * 10;
	
	const scale = interpolate(frame, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' });
	const opacity = interpolate(frame, [0, 15], [0, 1]);

	return (
		<div style={{
			width: 700,
			height: 900,
			backgroundColor: COLORS.white,
			borderRadius: 40,
			boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
			display: 'flex',
			flexDirection: 'column',
			padding: 40,
			transform: `scale(${scale * spr}) translateY(${float}px)`,
			opacity,
			position: 'relative',
			overflow: 'hidden',
		}}>
			<div style={{
				width: '100%',
				height: 500,
				backgroundColor: COLORS.gray,
				borderRadius: 20,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<div style={{ fontSize: 200 }}>📦</div>
			</div>
			<div style={{ marginTop: 40, fontFamily: FONTS.secondary }}>
				<div style={{ fontSize: 40, fontWeight: 700, color: COLORS.blue }}>Premium Tech Item</div>
				<div style={{ fontSize: 28, color: '#666', marginTop: 10 }}>International Shipping Available</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 60 }}>
					<div style={{ fontSize: 60, fontWeight: 800, color: COLORS.blue }}>€249.00</div>
					<div style={{ 
						backgroundColor: COLORS.orange, 
						color: 'white', 
						padding: '20px 40px', 
						borderRadius: 15,
						fontSize: 24,
						fontWeight: 700,
                        transform: `scale(${interpolate(frame, [120, 125, 130], [1, 0.9, 1], {extrapolateRight: 'clamp'})})`
					}}>
						ADD TO CART
					</div>
				</div>
			</div>
		</div>
	);
};

const KineticText: React.FC<{ text: string, frame: number, delay: number, color?: string, fontSize?: number, font?: string }> = ({ text, frame, delay, color = COLORS.white, fontSize = 80, font = FONTS.primary }) => {
	const words = text.split(' ');
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
			{words.map((word, i) => {
				const wordFrame = frame - delay - (i * 3);
				const spr = spring({ frame: wordFrame, fps: 30, config: { damping: 15 } });
				const y = interpolate(spr, [0, 1], [50, 0]);
				const op = interpolate(spr, [0, 1], [0, 1]);
				
				return (
					<span key={i} style={{
						fontFamily: font,
						fontSize,
						color,
						transform: `translateY(${y}px)`,
						opacity: op,
						display: 'inline-block'
					}}>
						{word}
					</span>
				);
			})}
		</div>
	);
};

const LogoReveal: React.FC<{ frame: number }> = ({ frame }) => {
	const scale = spring({ frame, fps: 30, config: { damping: 12 } });
	const opacity = interpolate(frame, [0, 20], [0, 1]);
    const glow = interpolate(Math.sin(frame / 10), [-1, 1], [10, 30]);

	return (
		<div style={{ transform: `scale(${scale})`, opacity, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
                width: 500,
                height: 200,
                backgroundColor: COLORS.orange,
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 ${glow}px rgba(218, 98, 32, 0.5)`
            }}>
                <span style={{ fontFamily: FONTS.primary, fontSize: 100, color: COLORS.white }}>OLOSTO</span>
            </div>
            <div style={{ 
                marginTop: 20,
                fontFamily: FONTS.secondary, 
                fontSize: 30, 
                color: COLORS.white,
                letterSpacing: 5,
                opacity: 0.8
            }}>VOTRE FACILITATEUR D'ACHAT</div>
		</div>
	);
};

const JourneyMap: React.FC<{ frame: number }> = ({ frame }) => {
    const pathProgress = interpolate(frame, [0, 200], [0, 1], { easing: Easing.bezier(0.42, 0, 0.58, 1) });
    const dashOffset = interpolate(frame, [0, 200], [1000, 0]);
    
    return (
        <svg width="800" height="1200" viewBox="0 0 800 1200" fill="none">
            <path 
                d="M400 100 Q 600 400 400 600 T 400 1100" 
                stroke={COLORS.orange} 
                strokeWidth="6" 
                strokeDasharray="20 20"
                strokeDashoffset={dashOffset}
                opacity={0.6}
            />
            <g style={{ 
                transform: `translate(${interpolate(pathProgress, [0, 1], [400, 400])}px, ${interpolate(pathProgress, [0, 1], [100, 1100])}px)`
            }}>
                <rect x="-30" y="-30" width="60" height="60" fill={COLORS.white} rx="10" />
                <rect x="-20" y="-20" width="40" height="40" fill={COLORS.orange} rx="5" />
            </g>
            <circle cx="400" cy="100" r="15" fill={COLORS.white} />
            <text x="430" y="110" fill="white" fontFamily={FONTS.secondary} fontSize="30">EUROPE</text>
            <circle cx="400" cy="1100" r="15" fill={COLORS.orange} />
            <text x="430" y="1110" fill={COLORS.orange} fontFamily={FONTS.secondary} fontSize="30" fontWeight="bold">CAMEROUN</text>
        </svg>
    );
};

const BackgroundDecor: React.FC<{ frame: number }> = ({ frame }) => {
    return (
        <AbsoluteFill style={{ overflow: 'hidden', zIndex: -1 }}>
            {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    border: `1px solid ${COLORS.lightBlue}`,
                    borderRadius: '50%',
                    top: 200 + i * 150,
                    left: -100 + i * 100,
                    opacity: 0.1,
                    transform: `scale(${1 + Math.sin(frame / 50 + i) * 0.1})`,
                }} />
            ))}
        </AbsoluteFill>
    );
};

export const MainVideo: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{ 
            backgroundColor: frame < 150 ? COLORS.gray : COLORS.blue,
            transition: 'background-color 0.5s ease'
        }}>
            <BackgroundDecor frame={frame} />

			<Sequence from={0} durationInFrames={160}>
				<AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
					<ProductCard frame={frame} />
					<div style={{ marginTop: 60 }}>
						<KineticText text="VOUS AVEZ TROUVÉ." frame={frame} delay={30} fontSize={60} color={COLORS.blue} />
                        <KineticText text="LE PRODUIT QU'IL VOUS FALLAIT." frame={frame} delay={60} fontSize={40} color={COLORS.lightBlue} font={FONTS.secondary} />
					</div>
				</AbsoluteFill>
			</Sequence>

			<Sequence from={150} durationInFrames={270}>
				<AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
					<div style={{ 
                        transform: `scale(${interpolate(frame, [150, 180], [0.5, 1], {extrapolateLeft: 'clamp'})})`,
                        opacity: interpolate(frame, [150, 170], [0, 1])
                    }}>
                        <LogoReveal frame={frame - 180} />
                    </div>
				</AbsoluteFill>
			</Sequence>

			<Sequence from={420} durationInFrames={150}>
				<AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ 
                        width: 400, 
                        height: 400, 
                        backgroundColor: COLORS.white, 
                        borderRadius: 20,
                        transform: `rotate(${interpolate(frame, [420, 570], [0, 360])}deg) scale(${spring({frame: frame-420, fps: 30})})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 150
                    }}>
                        {frame < 490 ? '🛒' : frame < 530 ? '📝' : '📦'}
                    </div>
                    <div style={{ position: 'absolute', bottom: 300 }}>
                        <KineticText text="OLOSTO PREND LE RELAIS." frame={frame} delay={450} fontSize={60} />
                    </div>
				</AbsoluteFill>
			</Sequence>

			<Sequence from={570} durationInFrames={390}>
				<AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<JourneyMap frame={frame - 570} />
                    <div style={{ position: 'absolute', top: 200 }}>
                        <KineticText text="VOTRE COLIS VOYAGE." frame={frame} delay={600} fontSize={70} />
                    </div>
                    {frame > 850 && (
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 400, 
                            backgroundColor: 'white', 
                            padding: '20px 60px', 
                            borderRadius: 100,
                            transform: `scale(${spring({frame: frame - 850, fps: 30})})`
                        }}>
                            <span style={{ fontFamily: FONTS.primary, color: COLORS.orange, fontSize: 60 }}>ARRIVÉ !</span>
                        </div>
                    )}
				</AbsoluteFill>
			</Sequence>

			<Sequence from={960} durationInFrames={180}>
				<AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
					<div style={{ transform: `translateX(${interpolate(frame, [960, 1140], [1000, -1000])}px)` }}>
                        <div style={{ fontFamily: FONTS.primary, fontSize: 180, color: 'rgba(255,255,255,0.1)' }}>EUROPE</div>
                    </div>
                    <KineticText text="NOUS SIMPLIFIONS VOS ACHATS." frame={frame} delay={1000} fontSize={80} />
                    <div style={{ transform: `translateX(${interpolate(frame, [960, 1140], [-1000, 1000])}px)`, marginTop: 50 }}>
                        <div style={{ fontFamily: FONTS.primary, fontSize: 180, color: 'rgba(218, 98, 32, 0.1)' }}>CAMEROUN</div>
                    </div>
				</AbsoluteFill>
			</Sequence>

			<Sequence from={1140} durationInFrames={210}>
				<AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
					<LogoReveal frame={frame - 1140} />
					<div style={{ marginTop: 80, textAlign: 'center' }}>
						<KineticText text="ACHETEZ EN EUROPE." frame={frame} delay={1160} fontSize={50} />
						<KineticText text="RECEVEZ AU CAMEROUN." frame={frame} delay={1190} fontSize={50} />
                        <div style={{ 
                            marginTop: 60,
                            padding: '30px 60px',
                            border: `4px solid ${COLORS.orange}`,
                            borderRadius: 20,
                            fontFamily: FONTS.secondary,
                            color: COLORS.white,
                            fontSize: 35,
                            fontWeight: 800,
                            transform: `scale(${spring({frame: frame - 1220, fps: 30})})`
                        }}>
                            VOS ACHATS INTERNATIONAUX, PLUS SIMPLES.
                        </div>
					</div>
				</AbsoluteFill>
			</Sequence>

            {frame > 145 && frame < 155 && (
                <AbsoluteFill style={{ backgroundColor: 'white', opacity: interpolate(frame, [145, 150, 155], [0, 1, 0]) }} />
            )}
		</AbsoluteFill>
	);
};

registerRoot(() => (
	<Composition
		id="MainVideo"
		component={MainVideo}
		durationInFrames={1350}
		fps={30}
		width={1080}
		height={1920}
	/>
));
