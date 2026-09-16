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
// Design tokens
// ---------------------------------------------------------------------------
const COLORS = {
	bg: '#12161F',
	bgPanelTop: '#171C27',
	accent: '#F2A93B',
	accentDim: 'rgba(242,169,59,0.16)',
	text: '#F5F3EF',
	textMuted: '#9AA3B8',
	line: 'rgba(242,169,59,0.14)',
};

const FONT_HEAD = "'Segoe UI', Arial, sans-serif";
const FONT_BODY = "'Segoe UI', Arial, sans-serif";

const SERVICE_DURATION = 160;
const INTRO_DURATION = 90;
const OUTRO_DURATION = 160;

// ---------------------------------------------------------------------------
// Background: slow drifting technical grid, present for the whole film
// ---------------------------------------------------------------------------
const AnimatedGridBackground: React.FC = () => {
	const frame = useCurrentFrame();
	const shift = (frame * 0.35) % 72;
	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 50% 28%, #1B2130 0%, #12161F 62%)',
				}}
			/>
			<svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
				<defs>
					<pattern
						id="grid"
						width={72}
						height={72}
						patternUnits="userSpaceOnUse"
						patternTransform={`translate(${shift} ${shift})`}
					>
						<path
							d="M 72 0 L 0 0 0 72"
							fill="none"
							stroke={COLORS.line}
							strokeWidth={1}
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill="url(#grid)" />
			</svg>
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
			<div
				style={{height: '100%', width: `${pct}%`, background: COLORS.accent}}
			/>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Reveal: staggered fade + rise entrance for inner elements
// ---------------------------------------------------------------------------
const Reveal: React.FC<{
	delay: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({delay, children, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const local = Math.max(0, frame - delay);
	const progress = spring({
		frame: local,
		fps,
		config: {damping: 200, stiffness: 130, mass: 0.9},
	});
	const opacity = interpolate(progress, [0, 1], [0, 1]);
	const translateY = interpolate(progress, [0, 1], [26, 0]);
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
// Icons - simple line icons, drawn with basic shapes
// ---------------------------------------------------------------------------
const IconWrap: React.FC<{children: React.ReactNode; scale: number}> = ({
	children,
	scale,
}) => (
	<div
		style={{
			transform: `scale(${scale})`,
			width: 120,
			height: 120,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		{children}
	</div>
);

const svgBase = {
	width: 108,
	height: 108,
	viewBox: '0 0 100 100',
	fill: 'none' as const,
	stroke: COLORS.accent,
	strokeWidth: 5,
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
};

const IconCode: React.FC = () => (
	<svg {...svgBase}>
		<polyline points="36,24 14,50 36,76" />
		<polyline points="64,24 86,50 64,76" />
	</svg>
);

const IconMaintenance: React.FC = () => {
	const teeth = [0, 60, 120, 180, 240, 300];
	return (
		<svg {...svgBase}>
			<circle cx={50} cy={50} r={17} />
			<circle cx={50} cy={50} r={5} fill={COLORS.accent} stroke="none" />
			{teeth.map((a) => {
				const r1 = 22;
				const r2 = 33;
				const rad = (a * Math.PI) / 180;
				const x1 = 50 + r1 * Math.cos(rad);
				const y1 = 50 + r1 * Math.sin(rad);
				const x2 = 50 + r2 * Math.cos(rad);
				const y2 = 50 + r2 * Math.sin(rad);
				return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
			})}
		</svg>
	);
};

const IconFormation: React.FC = () => (
	<svg {...svgBase}>
		<polygon points="50,22 92,42 50,60 8,42" />
		<polyline points="26,50 26,68 50,80 74,68 74,50" />
		<line x1={86} y1={44} x2={86} y2={70} />
	</svg>
);

const IconAutomation: React.FC = () => (
	<svg {...svgBase}>
		<path d="M 24 32 A 28 28 0 1 0 30 74" />
		<polyline points="12,26 24,32 21,45" />
		<path d="M 76 68 A 28 28 0 1 0 70 26" />
		<polyline points="88,74 76,68 79,55" />
	</svg>
);

const IconAudit: React.FC = () => (
	<svg {...svgBase}>
		<circle cx={42} cy={42} r={22} />
		<line x1={58} y1={58} x2={86} y2={86} />
		<polyline points="32,43 40,51 54,31" />
	</svg>
);

const ICONS = {
	code: IconCode,
	maintenance: IconMaintenance,
	formation: IconFormation,
	automation: IconAutomation,
	audit: IconAudit,
} as const;
type IconKey = keyof typeof ICONS;

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------
const Logo: React.FC<{size?: number}> = ({size = 88}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const progress = spring({frame, fps, config: {damping: 200, stiffness: 120}});
	const lineWidth = interpolate(progress, [0, 1], [0, 1]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div
				style={{
					fontFamily: FONT_HEAD,
					fontWeight: 700,
					fontSize: size,
					letterSpacing: -1.5,
					color: COLORS.text,
				}}
			>
				Sopha<span style={{color: COLORS.accent}}>Tech</span>
			</div>
			<div
				style={{
					marginTop: 14,
					height: 3,
					width: 210 * lineWidth,
					background: COLORS.accent,
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
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				opacity: exitOpacity,
			}}
		>
			<Logo />
			<Reveal delay={22} style={{marginTop: 26}}>
				<div
					style={{
						fontFamily: FONT_BODY,
						fontSize: 32,
						color: COLORS.textMuted,
						letterSpacing: 0.2,
					}}
				>
					Votre partenaire informatique
				</div>
			</Reveal>
		</AbsoluteFill>
	);
};

const ServiceScene: React.FC<{
	iconKey: IconKey;
	title: string;
	subtitle: string;
	index: number;
	total: number;
}> = ({iconKey, title, subtitle, index, total}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const exitOpacity = useExitOpacity(SERVICE_DURATION);
	const iconProgress = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 130, mass: 0.7},
	});
	const iconScale = interpolate(iconProgress, [0, 1], [0.6, 1]);
	const Icon = ICONS[iconKey];

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				opacity: exitOpacity,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					maxWidth: 1180,
					padding: '0 80px',
				}}
			>
				<div
					style={{
						width: 156,
						height: 156,
						borderRadius: '50%',
						background: COLORS.accentDim,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 40,
					}}
				>
					<IconWrap scale={iconScale}>
						<Icon />
					</IconWrap>
				</div>

				<Reveal delay={14}>
					<div
						style={{
							fontFamily: FONT_HEAD,
							fontWeight: 700,
							fontSize: 62,
							color: COLORS.text,
							textAlign: 'center',
							letterSpacing: -0.5,
						}}
					>
						{title}
					</div>
				</Reveal>

				<Reveal delay={26} style={{marginTop: 22}}>
					<div
						style={{
							fontFamily: FONT_BODY,
							fontWeight: 400,
							fontSize: 30,
							color: COLORS.textMuted,
							textAlign: 'center',
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
	const services: {key: IconKey; label: string}[] = [
		{key: 'code', label: 'Programmation'},
		{key: 'maintenance', label: 'Maintenance'},
		{key: 'formation', label: 'Formation'},
		{key: 'automation', label: 'Automatisation'},
		{key: 'audit', label: 'Audit'},
	];

	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				opacity: exitOpacity,
			}}
		>
			<Reveal delay={0}>
				<Logo size={64} />
			</Reveal>

			<Reveal delay={16} style={{marginTop: 34}}>
				<div
					style={{
						fontFamily: FONT_HEAD,
						fontWeight: 700,
						fontSize: 46,
						color: COLORS.text,
						textAlign: 'center',
						maxWidth: 900,
					}}
				>
					Votre partenaire informatique au quotidien
				</div>
			</Reveal>

			<Reveal delay={34} style={{marginTop: 36}}>
				<div style={{display: 'flex', gap: 46}}>
					{services.map((s) => {
						const Icon = ICONS[s.key];
						return (
							<div
								key={s.key}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: 10,
								}}
							>
								<div style={{transform: 'scale(0.42)', height: 46}}>
									<Icon />
								</div>
								<div
									style={{
										fontFamily: FONT_BODY,
										fontSize: 18,
										color: COLORS.textMuted,
									}}
								>
									{s.label}
								</div>
							</div>
						);
					})}
				</div>
			</Reveal>

			<Reveal delay={58} style={{marginTop: 48}}>
				<div
					style={{
						fontFamily: FONT_HEAD,
						fontWeight: 600,
						fontSize: 30,
						color: COLORS.bg,
						background: COLORS.accent,
						padding: '18px 46px',
						borderRadius: 8,
					}}
				>
					Parlons de votre projet
				</div>
			</Reveal>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
const SophaTechAd: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<AnimatedGridBackground />

			<Sequence from={0} durationInFrames={INTRO_DURATION}>
				<IntroScene />
			</Sequence>

			<Sequence from={INTRO_DURATION} durationInFrames={SERVICE_DURATION}>
				<ServiceScene
					iconKey="code"
					title="Programmation sur mesure"
					subtitle="Des logiciels et applications pensés pour votre activité"
					index={1}
					total={5}
				/>
			</Sequence>

			<Sequence
				from={INTRO_DURATION + SERVICE_DURATION}
				durationInFrames={SERVICE_DURATION}
			>
				<ServiceScene
					iconKey="maintenance"
					title="Maintenance et support"
					subtitle="Un système fiable, disponible quand vous en avez besoin"
					index={2}
					total={5}
				/>
			</Sequence>

			<Sequence
				from={INTRO_DURATION + SERVICE_DURATION * 2}
				durationInFrames={SERVICE_DURATION}
			>
				<ServiceScene
					iconKey="formation"
					title="Formation informatique"
					subtitle="Vos équipes autonomes sur leurs outils numériques"
					index={3}
					total={5}
				/>
			</Sequence>

			<Sequence
				from={INTRO_DURATION + SERVICE_DURATION * 3}
				durationInFrames={SERVICE_DURATION}
			>
				<ServiceScene
					iconKey="automation"
					title="Automatisation"
					subtitle="Moins de tâches répétitives, plus de temps pour l'essentiel"
					index={4}
					total={5}
				/>
			</Sequence>

			<Sequence
				from={INTRO_DURATION + SERVICE_DURATION * 4}
				durationInFrames={SERVICE_DURATION}
			>
				<ServiceScene
					iconKey="audit"
					title="Audit informatique"
					subtitle="Un diagnostic clair pour renforcer votre infrastructure"
					index={5}
					total={5}
				/>
			</Sequence>

			<Sequence
				from={INTRO_DURATION + SERVICE_DURATION * 5}
				durationInFrames={OUTRO_DURATION}
			>
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
			component={SophaTechAd}
			durationInFrames={INTRO_DURATION + SERVICE_DURATION * 5 + OUTRO_DURATION}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};

registerRoot(RemotionRoot);
