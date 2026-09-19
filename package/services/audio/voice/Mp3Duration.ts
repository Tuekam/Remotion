/** Calcule la durée d’un MP3 en millisecondes en parcourant ses trames MPEG. */
export function measureMp3DurationMs(audio: Buffer): number | null {
  let offset = 0;
  if (audio.length >= 10 && audio.toString("ascii", 0, 3) === "ID3") {
    offset = 10 + syncSafeInteger(audio, 6);
  }

  let durationMs = 0;
  let frameCount = 0;
  while (offset + 4 <= audio.length) {
    const frame = readMp3Frame(audio, offset);
    if (!frame) {
      offset += 1;
      continue;
    }
    durationMs += (frame.samplesPerFrame / frame.sampleRate) * 1000;
    frameCount += 1;
    offset += frame.frameLength;
  }

  return frameCount > 0 ? Math.round(durationMs) : null;
}

interface Mp3Frame {
  frameLength: number;
  samplesPerFrame: number;
  sampleRate: number;
}

/** Lit les en-têtes d’une trame MP3 à un offset donné et retourne ses paramètres de décodage. */
function readMp3Frame(audio: Buffer, offset: number): Mp3Frame | null {
  const header = audio.readUInt32BE(offset);
  if (((header & 0xffe00000) >>> 0) !== 0xffe00000) {
    return null;
  }

  const versionBits = (header >> 19) & 0b11;
  const layerBits = (header >> 17) & 0b11;
  const bitrateIndex = (header >> 12) & 0b1111;
  const sampleRateIndex = (header >> 10) & 0b11;
  const padding = (header >> 9) & 0b1;
  if (
    versionBits === 0b01 ||
    layerBits !== 0b01 ||
    bitrateIndex === 0 ||
    bitrateIndex === 0b1111 ||
    sampleRateIndex === 0b11
  ) {
    return null;
  }

  const version = versionBits === 0b11 ? "mpeg1" : "mpeg2";
  const sampleRates =
    version === "mpeg1"
      ? [44100, 48000, 32000]
      : versionBits === 0b10
        ? [22050, 24000, 16000]
        : [11025, 12000, 8000];
  const sampleRate = sampleRates[sampleRateIndex];
  if (!sampleRate) {
    return null;
  }

  const bitrates =
    version === "mpeg1"
      ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
      : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  const bitrate = bitrates[bitrateIndex];
  if (!bitrate) {
    return null;
  }

  const samplesPerFrame = version === "mpeg1" ? 1152 : 576;
  const frameLength =
    Math.floor(
      (version === "mpeg1" ? 144 : 72) * (bitrate * 1000) / sampleRate,
    ) + padding;
  if (frameLength < 4 || offset + frameLength > audio.length) {
    return null;
  }

  return { frameLength, samplesPerFrame, sampleRate };
}

/** Décode un entier sync-safe utilisé par les métadonnées ID3 du fichier MP3. */
function syncSafeInteger(audio: Buffer, offset: number): number {
  return (
    ((audio[offset] ?? 0) & 0x7f) * 0x200000 +
    ((audio[offset + 1] ?? 0) & 0x7f) * 0x4000 +
    ((audio[offset + 2] ?? 0) & 0x7f) * 0x80 +
    ((audio[offset + 3] ?? 0) & 0x7f)
  );
}
