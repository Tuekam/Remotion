import type { Render } from "../../core/models/Render.js";
import type {
  GenerateVideoInput,
  GenerateVideoUseCase,
} from "../../core/use-case/GenerateVideoUseCase.js";
import type { VideoEngine } from "../services/video-engine/contracts/VideoEngine.js";

/** Orchestre les opérations du composant GenerateVideoUseCaseImpl dans le flux applicatif. */
export class GenerateVideoUseCaseImpl implements GenerateVideoUseCase {
/** Initialise l’instance avec les dépendances injectées nécessaires à son rôle. */
  public constructor(private readonly videoEngine: VideoEngine) {}

/** Exécute le cas d’usage avec les données reçues et retourne son résultat. */
  public execute(input: GenerateVideoInput): Promise<Render> {
    return this.videoEngine.render(input);
  }
}
