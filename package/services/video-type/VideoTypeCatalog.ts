import type {
  AssetRequirement,
  InformationRequirement,
  VideoTypeDefinition,
  VideoTypeId,
} from "../../../core/models/VideoType.js";

const ALL_PLATFORMS = [
  "TikTok",
  "Instagram",
  "Facebook",
  "YouTube",
  "LinkedIn",
  "Web",
];

const ALL_FORMATS = ["9:16", "1:1", "16:9"];

export class VideoTypeCatalog {
  private readonly definitions: readonly VideoTypeDefinition[] = [
    createDefinition({
      id: "product-presentation",
      name: "Product Presentation",
      description: "Présenter et faire découvrir un produit.",
      objective: "Faire connaître le produit et ses caractéristiques.",
      informationRequirements: [
        information("product", "required", "Produit présenté."),
        information("name", "required", "Nom du produit."),
        information("description", "required", "Description du produit."),
        information("features", "required", "Caractéristiques principales."),
        information("benefits", "required", "Bénéfices pour le client."),
      ],
      assetRequirements: [
        asset("productVisual", "image", "recommended", "Visuel du produit."),
        asset("logo", "image", "recommended", "Logo de la marque."),
      ],
      narrativeGuidance: [
        "Présenter le produit.",
        "Mettre en avant ses caractéristiques.",
        "Relier les caractéristiques aux bénéfices.",
      ],
      recommendedDurationInSeconds: 30,
    }),
    createDefinition({
      id: "product-promotion",
      name: "Product Promotion",
      description: "Promouvoir un produit et favoriser l'achat.",
      objective: "Inciter le public à acheter le produit.",
      informationRequirements: [
        information("product", "required", "Produit promu."),
        information("offer", "required", "Offre commerciale."),
        information("price", "required", "Prix ou montant de l'offre."),
        information("callToAction", "required", "Action attendue du public."),
        information("benefits", "recommended", "Avantage principal."),
        information("targetAudience", "recommended", "Public ciblé."),
      ],
      assetRequirements: [
        asset("productVisual", "image", "recommended", "Photo du produit."),
        asset("logo", "image", "recommended", "Logo de la marque."),
        asset("promotionalVisual", "image", "optional", "Visuel promotionnel."),
      ],
      narrativeGuidance: [
        "Accrocher rapidement l'attention.",
        "Présenter le produit et l'offre.",
        "Terminer par un appel à l'action clair.",
      ],
      recommendedDurationInSeconds: 30,
    }),
    createDefinition({
      id: "product-demo",
      name: "Product Demo",
      description: "Montrer le fonctionnement ou l'utilisation d'un produit.",
      objective: "Permettre au public de comprendre l'utilisation du produit.",
      informationRequirements: [
        information("product", "required", "Produit démontré."),
        information("howItWorks", "required", "Fonctionnement ou étapes d'utilisation."),
        information("benefits", "required", "Bénéfice principal."),
      ],
      assetRequirements: [
        asset("productDemo", "video", "recommended", "Vidéo de démonstration."),
        asset("productVisual", "image", "recommended", "Photo du produit."),
      ],
      narrativeGuidance: [
        "Présenter le contexte d'utilisation.",
        "Montrer les étapes essentielles.",
        "Conclure sur le bénéfice obtenu.",
      ],
      recommendedDurationInSeconds: 30,
    }),
    createDefinition({
      id: "service-presentation",
      name: "Service Presentation",
      description: "Présenter un service et expliquer sa valeur.",
      objective: "Faire comprendre la valeur du service.",
      informationRequirements: [
        information("service", "required", "Service présenté."),
        information("targetAudience", "required", "Public ciblé."),
        information("benefits", "required", "Bénéfices du service."),
        information("valueProposition", "required", "Proposition de valeur."),
        information("callToAction", "required", "Action attendue du public."),
      ],
      assetRequirements: [
        asset("logo", "image", "recommended", "Logo de l'entreprise."),
        asset("serviceVisual", "image", "recommended", "Visuel du service."),
      ],
      narrativeGuidance: [
        "Identifier le besoin du public.",
        "Présenter le service et sa valeur.",
        "Terminer par un appel à l'action.",
      ],
      recommendedDurationInSeconds: 30,
    }),
    createDefinition({
      id: "problem-solution",
      name: "Problem Solution",
      description: "Partir d'un problème du client et présenter une solution.",
      objective: "Montrer comment une solution répond à un problème.",
      informationRequirements: [
        information("problem", "required", "Problème du client."),
        information("solution", "required", "Solution proposée."),
        information("benefits", "required", "Bénéfices de la solution."),
        information("callToAction", "required", "Action attendue du public."),
      ],
      assetRequirements: [
        asset("serviceVisual", "image", "recommended", "Visuel du produit ou service."),
        asset("logo", "image", "recommended", "Logo de la marque."),
      ],
      narrativeGuidance: [
        "Présenter le problème.",
        "Montrer la frustration ou la conséquence.",
        "Présenter la solution et ses bénéfices.",
        "Terminer par un appel à l'action.",
      ],
      recommendedDurationInSeconds: 30,
    }),
    createDefinition({
      id: "company-presentation",
      name: "Company Presentation",
      description: "Présenter une entreprise ou une marque.",
      objective: "Faire connaître l'entreprise et sa proposition de valeur.",
      informationRequirements: [
        information("company", "required", "Nom de l'entreprise ou de la marque."),
        information("activity", "required", "Activité de l'entreprise."),
        information("valueProposition", "required", "Proposition de valeur."),
      ],
      assetRequirements: [
        asset("logo", "image", "recommended", "Logo de l'entreprise."),
        asset("companyVisual", "image", "recommended", "Photo de l'entreprise, de l'équipe ou des locaux."),
      ],
      narrativeGuidance: [
        "Présenter l'identité de l'entreprise.",
        "Expliquer son activité.",
        "Mettre en avant sa proposition de valeur.",
      ],
      recommendedDurationInSeconds: 45,
    }),
    createDefinition({
      id: "testimonial",
      name: "Testimonial",
      description: "Utiliser l'expérience d'un client comme preuve sociale.",
      objective: "Renforcer la confiance grâce à une expérience client.",
      informationRequirements: [
        information("client", "required", "Client ou personne témoignant."),
        information("experience", "required", "Expérience vécue."),
        information("initialProblem", "required", "Problème initial."),
        information("result", "required", "Résultat ou bénéfice obtenu."),
      ],
      assetRequirements: [
        asset("testimonial", "video", "recommended", "Témoignage vidéo ou audio."),
        asset("clientPhoto", "image", "optional", "Photo du client."),
        asset("proof", "document", "optional", "Preuve chiffrée ou document."),
      ],
      narrativeGuidance: [
        "Présenter le client et son contexte.",
        "Expliquer le problème initial.",
        "Présenter l'expérience et le résultat.",
      ],
      recommendedDurationInSeconds: 45,
    }),
    createDefinition({
      id: "event-promotion",
      name: "Event Promotion",
      description: "Promouvoir un événement.",
      objective: "Informer le public et encourager sa participation.",
      informationRequirements: [
        information("name", "required", "Nom de l'événement."),
        information("eventDate", "required", "Date de l'événement."),
        information("locationOrLink", "required", "Lieu ou lien de participation."),
        information("objective", "required", "Objectif ou intérêt de l'événement."),
        information("callToAction", "required", "Action attendue du public."),
      ],
      assetRequirements: [
        asset("eventPoster", "image", "recommended", "Affiche de l'événement."),
        asset("logo", "image", "recommended", "Logo de l'organisateur."),
        asset("speakerVisual", "image", "optional", "Visuel des intervenants."),
        asset("program", "document", "optional", "Programme de l'événement."),
      ],
      narrativeGuidance: [
        "Présenter l'événement et son intérêt.",
        "Afficher clairement la date et le lieu ou lien.",
        "Terminer par un appel à l'action.",
      ],
      recommendedDurationInSeconds: 30,
    }),
  ];

  public list(): readonly VideoTypeDefinition[] {
    return this.definitions;
  }

  public get(id: VideoTypeId): VideoTypeDefinition {
    const definition = this.definitions.find((item) => item.id === id);
    if (!definition) {
      throw new Error(`Video type not found: ${id}`);
    }
    return definition;
  }
}

function createDefinition(
  definition: Omit<
    VideoTypeDefinition,
    "supportedPlatforms" | "supportedFormats"
  >,
): VideoTypeDefinition {
  return {
    ...definition,
    supportedPlatforms: ALL_PLATFORMS,
    supportedFormats: ALL_FORMATS,
  };
}

function information(
  key: InformationRequirement["key"],
  level: InformationRequirement["level"],
  description: string,
): InformationRequirement {
  return { key, level, description };
}

function asset(
  key: AssetRequirement["key"],
  kind: AssetRequirement["kind"],
  level: AssetRequirement["level"],
  description: string,
): AssetRequirement {
  return { key, kind, level, description };
}
