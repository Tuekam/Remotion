import type { Asset } from "../../core/models/Asset.js";
import type { AssetManifestRepository } from "../../core/repository/AssetManifestRepository.js";
import type {
  RegisterAssetInput,
  RegisterAssetUseCase,
} from "../../core/use-case/RegisterAssetUseCase.js";
import { AssetService } from "../services/asset/AssetService.js";

export class RegisterAssetUseCaseImpl implements RegisterAssetUseCase {
  public constructor(
    private readonly assetService: AssetService,
    private readonly assetManifestRepository: AssetManifestRepository,
  ) {}

  public async execute(input: RegisterAssetInput): Promise<Asset> {
    const manifest = await this.assetManifestRepository.getByVideoId(input.videoId);
    if (!manifest) {
      throw new Error(`Asset manifest not found: ${input.videoId}`);
    }
    const result = input.sourceUrl
      ? await this.assetService.registerUrl(
          input.videoId,
          input.sourceUrl,
          input.type,
          input.name,
          input.key ?? null,
          manifest,
        )
      : input.contentBase64
      ? await this.assetService.registerContent(
          input.videoId,
          input.contentBase64,
          input.type,
          input.name,
          input.key ?? null,
          manifest,
        )
      : await this.assetService.register(
          input.videoId,
          input.sourcePath ?? "",
          input.type,
          input.name,
          input.key ?? null,
          manifest,
        );
    await this.assetManifestRepository.update(result.manifest);
    return result.asset;
  }
}
