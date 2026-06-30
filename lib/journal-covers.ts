/**
 * Editorial cover photos for journal articles.
 *
 * Real, topic-matched, freely-licensed images (Wikimedia Commons — museum
 * objects and public-domain paintings), served statically from `public/journal`.
 * A real uploaded photo (`journal_posts.cover_path`) still takes precedence in
 * the cover component; this is the curated default.
 *
 * Attribution is shown under the cover on the article page — required for the
 * CC BY / CC BY-SA images, and kept for PD/CC0 too for consistency.
 */

export interface JournalCoverMeta {
  /** Local static path under /public. */
  src: string;
  /** Author / source for the credit line. */
  author: string;
  /** Short licence label, e.g. "CC BY-SA 4.0", "Public domain". */
  license: string;
  /** Licence deed URL (empty for public-domain works). */
  licenseUrl: string;
  /** Wikimedia Commons file page. */
  sourceUrl: string;
}

const COVERS: Record<string, JournalCoverMeta> = {
  "samovary-istoriya-i-vybor": {
    src: "/journal/samovary-istoriya-i-vybor.jpg",
    author: "Semenov.m7",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Batashev%27s_samovar_1.jpg",
  },
  "imperatorskiy-farfor-kleyma": {
    src: "/journal/imperatorskiy-farfor-kleyma.jpg",
    author: "Императорский фарфоровый завод · Cleveland Museum of Art",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Clevelandart_1963.671.jpg",
  },
  "kak-otlichit-podlinnyy-antikvariat": {
    src: "/journal/kak-otlichit-podlinnyy-antikvariat.jpg",
    author: "Max Schödl",
    license: "Public domain",
    licenseUrl: "",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Max_Sch%C3%B6dl_-_Still_Life_with_Antiques.jpg",
  },
  "kak-opredelit-shkolu-ikony": {
    src: "/journal/kak-opredelit-shkolu-ikony.jpg",
    author: "Jordan Schnitzer Museum of Art (фото Daderot)",
    license: "Public domain",
    licenseUrl: "",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Christ_Pantocrator,_late_1600s_to_early_1700s,_with_later_additions,_egg_tempera_on_wood,_gold_leaf,_bronze_powder_-_Jordan_Schnitzer_Museum_of_Art,_University_of_Oregon_-_Eugene,_Oregon_-_DSC09267.jpg",
  },
  "kleyma-na-russkom-serebre": {
    src: "/journal/kleyma-na-russkom-serebre.jpg",
    author: "Walters Art Museum",
    license: "Public domain",
    licenseUrl: "",
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Russian_-_%22Kovsh%22_with_Imperial_Eagle_-_Walters_571076_-_View_A.jpg',
  },
  "staraya-gzhel": {
    src: "/journal/staraya-gzhel.jpg",
    author: "Валентин Розанов",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:1976.%D0%9A%D1%83%D0%BC%D0%B3%D0%B0%D0%BD..JPG",
  },
  "modern-steklo-galle-podlinnik": {
    src: "/journal/modern-steklo-galle-podlinnik.jpg",
    author: "Émile Gallé · Cleveland Museum of Art",
    license: "CC0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Emile_Gall%C3%A9_-_Vase_-_1979.10_-_Cleveland_Museum_of_Art.tif",
  },
  "kak-uhazhivat-za-antikvariatom": {
    src: "/journal/kak-uhazhivat-za-antikvariatom.jpg",
    author: "Marek Ślusarczyk",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06_Restoration_of_gilded_mirror_in_Muzeum_Gornoslaskie,_Bytom,_Poland_-_furniture_restorer_working.jpg",
  },
  "sovetskiy-farfor-lfz-dulevo": {
    src: "/journal/sovetskiy-farfor-lfz-dulevo.jpg",
    author: "Soli1705",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bistr_pljasunji.jpg",
  },
  "provenans-pochemu-vazhna-istoriya": {
    src: "/journal/provenans-pochemu-vazhna-istoriya.jpg",
    author: "Evert Collier · National Trust",
    license: "Public domain",
    licenseUrl: "",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Edwaert_Collier_(c.1640-c.1707)_-_Vanitas_Still_Life_with_a_Statuette_of_an_Antique_Athlete_and_a_Print_of_Michelangelo_-_453822_-_National_Trust.jpg",
  },
};

export function coverFor(slug: string): JournalCoverMeta | null {
  return COVERS[slug] ?? null;
}
