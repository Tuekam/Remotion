import type {
  ElevenLabsTranscriptionResult,
} from "../contracts/ElevenLabsClient.js";

interface ElevenLabsTranscriptionResponse {
  words?: Array<{
    text?: string;
    start?: number;
    end?: number;
    type?: string;
  }>;
}

/** Transforme la réponse Speech-to-Text en mots horodatés utilisables pour synchroniser la voix. */
export function mapTranscriptionResponse(
  payload: ElevenLabsTranscriptionResponse,
): ElevenLabsTranscriptionResult {
  const words = (payload.words ?? []).flatMap((word) => {
    const start = word.start;
    const end = word.end;
    const validStart =
      typeof start === "number" && Number.isFinite(start) ? start : null;
    const validEnd =
      typeof end === "number" && Number.isFinite(end) ? end : null;
    if (
      word.type !== "word" ||
      typeof word.text !== "string" ||
      validStart === null ||
      validEnd === null ||
      validEnd < validStart
    ) {
      return [];
    }
    return [
      {
        text: word.text,
        startMs: Math.round(validStart * 1000),
        endMs: Math.round(validEnd * 1000),
      },
    ];
  });

  return { words };
}
