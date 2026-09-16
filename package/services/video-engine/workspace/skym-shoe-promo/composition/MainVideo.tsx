import {
	AbsoluteFill,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
	registerRoot,
	Composition,
} from 'remotion';

// ---------------------------------------------------------------------------
// Design tokens - bold, sporty, high energy
// ---------------------------------------------------------------------------
const COLORS = {
	bg: '#0D0D10',
	panel: '#141417',
	accent: '#C6FF3D',
	accentDim: 'rgba(198,255,61,0.14)',
	pop: '#FF3D7A',
	text: '#F5F5F5',
	textMuted: '#8A8A93',
};

const FONT_HEAD = "'Segoe UI', Arial, sans-serif";
const FONT_BODY = "'Segoe UI', Arial, sans-serif";

const INTRO_DURATION = 90;
const FEATURE_DURATION = 210;
const OUTRO_DURATION = 180;

// ---------------------------------------------------------------------------
// Background: continuous diagonal speed streaks
// ---------------------------------------------------------------------------
const SpeedLines: React.FC = () => {
	const frame = useCurrentFrame();
	const lines = [0, 1, 2, 3, 4, 5];
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 60% 40%, #16161A 0%, #0D0D10 65%)',
				}}
			/>
			{lines.map((i) => {
				const speed = 6 + i * 1.6;
				const raw = (frame * speed + i * 260) % 2600;
				const x = raw - 500;
				const opacity = i % 2 === 0 ? 0.05 : 0.035;
				const color = i % 3 === 0 ? COLORS.accent : COLORS.pop;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							top: `${8 + i * 15}%`,
							left: x,
							width: 420,
							height: 26,
							background: color,
							opacity,
							transform: 'skewX(-24deg)',
							borderRadius: 4,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

const ProgressBar: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const pct = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
		extrapolateRight: 'clamp',
	});
	return (
		<div
			style={{
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				height: 5,
				background: 'rgba(255,255,255,0.05)',
			}}
		>
			<div style={{height: '100%', width: `${pct}%`, background: COLORS.accent}} />
		</div>
	);
};

// ---------------------------------------------------------------------------
// Reveal helper
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
	delay: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
	from?: number;
}> = ({delay, children, style, from = 30}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = Math.max(0, frame - delay);
	const progress = spring({
		frame: local,
		fps,
		config: {damping: 200, stiffness: 140, mass: 0.8},
	});
	const opacity = interpolate(progress, [0, 1], [0, 1]);
	const translateY = interpolate(progress, [0, 1], [from, 0]);
	return (
		<div style={{opacity, transform: `translateY(${translateY}px)`, ...style}}>
			{children}
		</div>
	);
};

const useExitOpacity = (durationInFrames: number, exitLength = 22) => {
	const frame = useCurrentFrame();
	return interpolate(
		frame,
		[durationInFrames - exitLength, durationInFrames],
		[1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);
};

// ---------------------------------------------------------------------------
// Hero shoe silhouette - one consistent graphic, reused with different
// contextual overlays per scene
// ---------------------------------------------------------------------------
const ShoeSilhouette: React.FC<{overlay?: 'waves' | 'speed' | null}> = ({
	overlay = null,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'relative', width: 480, height: 260}}>
			<svg viewBox="0 0 240 130" width={480} height={260}>
				<path
					d="M14,92
					   C14,78 24,66 40,61
					   C58,55 66,40 88,32
					   C120,21 165,23 196,40
					   C213,49 220,60 216,70
					   L214,73
					   C198,69 180,72 166,79
					   C142,90 96,95 60,93
					   C40,92 22,93 14,92 Z"
					fill={COLORS.accent}
				/>
				<rect x={16} y={90} width={202} height={12} rx={6} fill={COLORS.text} opacity={0.92} />
				<line x1={96} y1={40} x2={78} y2={58} stroke={COLORS.bg} strokeWidth={4} strokeLinecap="round" />
				<line x1={114} y1={36} x2={96} y2={56} stroke={COLORS.bg} strokeWidth={4} strokeLinecap="round" />
				<line x1={132} y1={34} x2={114} y2={54} stroke={COLORS.bg} strokeWidth={4} strokeLinecap="round" />
				<circle cx={200} cy={46} r={5} fill={COLORS.bg} />
			</svg>

			{overlay === 'waves' && (
				<svg
					viewBox="0 0 240 60"
					width={480}
					height={70}
					style={{position: 'absolute', bottom: -30, left: 0}}
				>
					{[0, 1, 2].map((i) => {
						const phase = (frame * 2 + i * 40) % 240;
						const o = interpolate(
							(frame + i * 12) % 60,
							[0, 30, 60],
							[0.05, 0.35, 0.05]
						);
						return (
							<path
								key={i}
								d={`M0,${20 + i * 12} Q60,${8 + i * 12} 120,${20 + i * 12} T240,${20 + i * 12}`}
								fill="none"
								stroke={COLORS.pop}
								strokeWidth={3}
								opacity={o}
								transform={`translate(${-phase / 6},0)`}
							/>
						);
					})}
				</svg>
			)}

			{overlay === 'speed' && (
				<>
					{[0, 1, 2, 3].map((i) => {
						const local = (frame * 10 + i * 30) % 160;
						const o = interpolate(local, [0, 40, 160], [0, 0.5, 0]);
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: -local,
									top: 40 + i * 22,
									width: 90,
									height: 6,
									background: COLORS.pop,
									opacity: o,
									borderRadius: 3,
								}}
							/>
						);
					})}
				</>
			)}
		</div>
	);
};

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------
const Logo: React.FC<{size?: number}> = ({size = 96}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const progress = spring({frame, fps, config: {damping: 200, stiffness: 120}});
	const lineWidth = interpolate(progress, [0, 1], [0, 1]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div
				style={{
					fontFamily: FONT_HEAD,
					fontWeight: 800,
					fontSize: size,
					letterSpacing: 1,
					color: COLORS.text,
					transform: 'skewX(-6deg)',
				}}
			>
				s<span style={{color: COLORS.accent}}>KYM</span>
			</div>
			<div
				style={{
					marginTop: 12,
					height: 4,
					width: 160 * lineWidth,
					background: COLORS.pop,
					borderRadius: 2,
				}}
			/>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------
const IntroScene: React.FC = () => {
	const exitOpacity = useExitOpacity(INTRO_DURATION);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: exitOpacity}}>
			<Logo />
			<Reveal delay={22} style={{marginTop: 24}}>
				<div
					style={{
						fontFamily: FONT_BODY,
						fontSize: 30,
						color: COLORS.textMuted,
						letterSpacing: 0.5,
					}}
				>
					Chaque pas a du style
				</div>
			</Reveal>
		</AbsoluteFill>
	);
};

const FeatureScene: React.FC<{
	title: string;
	subtitle: string;
	overlay?: 'waves' | 'speed' | null;
	index: number;
	total: number;
}> = ({title, subtitle, overlay = null, index, total}) => {
	const exitOpacity = useExitOpacity(FEATURE_DURATION);
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const shoeProgress = spring({frame, fps, config: {damping: 16, stiffness: 120, mass: 0.8}});
	const shoeX = interpolate(shoeProgress, [0, 1], [-60, 0]);
	const shoeOpacity = interpolate(shoeProgress, [0, 1], [0, 1]);

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: exitOpacity}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{opacity: shoeOpacity, transform: `translateX(${shoeX}px)`, marginBottom: 24}}>
					<ShoeSilhouette overlay={overlay} />
				</div>

				<Reveal delay={16}>
					<div
						style={{
							fontFamily: FONT_HEAD,
							fontWeight: 800,
							fontSize: 64,
							color: COLORS.text,
							textAlign: 'center',
							letterSpacing: 0.5,
						}}
					>
						{title}
					</div>
				</Reveal>

				<Reveal delay={28} style={{marginTop: 18}}>
					<div
						style={{
							fontFamily: FONT_BODY,
							fontSize: 28,
							color: COLORS.textMuted,
							textAlign: 'center',
							maxWidth: 760,
							lineHeight: 1.4,
						}}
					>
						{subtitle}
					</div>
				</Reveal>
			</div>

			<div
				style={{
					position: 'absolute',
					bottom: 56,
					right: 80,
					fontFamily: FONT_BODY,
					fontSize: 22,
					color: COLORS.textMuted,
					letterSpacing: 1,
				}}
			>
				{String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
			</div>
		</AbsoluteFill>
	);
};

const OutroScene: React.FC = () => {
	const exitOpacity = useExitOpacity(OUTRO_DURATION, 16);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: exitOpacity}}>
			<Reveal delay={0}>
				<Logo size={78} />
			</Reveal>

			<Reveal delay={18} style={{marginTop: 30}}>
				<div
					style={{
						fontFamily: FONT_HEAD,
						fontWeight: 800,
						fontSize: 44,
						color: COLORS.text,
						textAlign: 'center',
					}}
				>
					Nouvelle collection disponible
				</div>
			</Reveal>

			<Reveal delay={34} style={{marginTop: 14}}>
				<div style={{fontFamily: FONT_BODY, fontSize: 26, color: COLORS.textMuted}}>
					Design, confort et mouvement — sans compromis
				</div>
			</Reveal>

			<Reveal delay={54} style={{marginTop: 40}}>
				<div
					style={{
						fontFamily: FONT_HEAD,
						fontWeight: 700,
						fontSize: 30,
						color: COLORS.bg,
						background: COLORS.accent,
						padding: '18px 46px',
						borderRadius: 8,
						transform: 'skewX(-6deg)',
					}}
				>
					Découvrez la collection
				</div>
			</Reveal>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
const SkymAd: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<SpeedLines />

			<Sequence from={0} durationInFrames={INTRO_DURATION}>
				<IntroScene />
			</Sequence>

			<Sequence from={INTRO_DURATION} durationInFrames={FEATURE_DURATION}>
				<FeatureScene
					title="Design audacieux"
					subtitle="Une silhouette qui se démarque, partout où vous allez"
					overlay={null}
					index={1}
					total={3}
				/>
			</Sequence>

			<Sequence from={INTRO_DURATION + FEATURE_DURATION} durationInFrames={FEATURE_DURATION}>
				<FeatureScene
					title="Confort à chaque pas"
					subtitle="Une semelle pensée pour tenir toute la journée"
					overlay="waves"
					index={2}
					total={3}
				/>
			</Sequence>

			<Sequence from={INTRO_DURATION + FEATURE_DURATION * 2} durationInFrames={FEATURE_DURATION}>
				<FeatureScene
					title="Faite pour bouger"
					subtitle="Légère, résistante, prête pour l'action"
					overlay="speed"
					index={3}
					total={3}
				/>
			</Sequence>

			<Sequence from={INTRO_DURATION + FEATURE_DURATION * 3} durationInFrames={OUTRO_DURATION}>
				<OutroScene />
			</Sequence>

			<ProgressBar />
		</AbsoluteFill>
	);
};

const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="Main"
			component={SkymAd}
			durationInFrames={INTRO_DURATION + FEATURE_DURATION * 3 + OUTRO_DURATION}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};

registerRoot(RemotionRoot);
