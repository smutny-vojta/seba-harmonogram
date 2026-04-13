import { stdin as input, stdout as output } from "node:process";
import { emitKeypressEvents } from "node:readline";
import { seedActivitiesFeature } from "@/features/activities/seed";
import { listLocations } from "@/features/locations/dal";
import { seedLocationsFeature } from "@/features/locations/seed";
import { seedTermsFeature } from "@/features/terms/seed";

type SeedEntityId = "locations" | "activities" | "terms";

type SeedContext = {
  locationIds: string[];
  prune: boolean;
};

type SeedEntity = {
  id: SeedEntityId;
  label: string;
  aliases: string[];
  run: (ctx: SeedContext) => Promise<void>;
};

const ANSI = {
  reset: "\u001b[0m",
  bold: "\u001b[1m",
  dim: "\u001b[2m",
  cyan: "\u001b[36m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  red: "\u001b[31m",
  white: "\u001b[37m",
} as const;

class UserCancelledError extends Error {
  constructor() {
    super("Seed zrušen uživatelem.");
  }
}

const ENTITIES: SeedEntity[] = [
  {
    id: "locations",
    label: "Lokace",
    aliases: ["locations", "lokace", "1"],
    run: async (ctx) => {
      ctx.locationIds = await seedLocationsFeature({
        prune: ctx.prune,
      });
    },
  },
  {
    id: "activities",
    label: "Aktivity",
    aliases: ["activities", "aktivity", "2"],
    run: async (ctx) => {
      const locationIds =
        ctx.locationIds.length > 0
          ? ctx.locationIds
          : (await listLocations()).map((location) => location.id);

      if (locationIds.length === 0) {
        throw new Error(
          "Pro seed aktivit nejsou dostupné žádné lokace. Nejprve seedni lokace.",
        );
      }

      await seedActivitiesFeature(locationIds, { prune: ctx.prune });
    },
  },
  {
    id: "terms",
    label: "Turnusy",
    aliases: ["terms", "turnusy", "turnus", "3"],
    run: async (ctx) => {
      await seedTermsFeature({ prune: ctx.prune });
    },
  },
];

const ALL_ENTITY_IDS = ENTITIES.map((entity) => entity.id);

function parsePruneFromArgs(argv: string[]) {
  return argv.includes("--prune") || argv.includes("-p");
}

function color(text: string, ...styles: string[]) {
  return `${styles.join("")}${text}${ANSI.reset}`;
}

function parseEntityToken(token: string): SeedEntityId[] {
  const normalized = token.trim().toLowerCase();

  if (normalized.length === 0) {
    return [];
  }

  if (
    normalized === "all" ||
    normalized === "vse" ||
    normalized === String(ENTITIES.length + 1)
  ) {
    return [...ALL_ENTITY_IDS];
  }

  const match = ENTITIES.find((entity) => entity.aliases.includes(normalized));

  if (!match) {
    throw new Error(
      `Neznámá entita '${token}'. Použij --entities=locations,activities,terms nebo --entities=all.`,
    );
  }

  return [match.id];
}

function parseEntities(tokens: string[]): SeedEntityId[] {
  const parsed = new Set<SeedEntityId>();

  for (const token of tokens) {
    for (const id of parseEntityToken(token)) {
      parsed.add(id);
    }
  }

  return [...parsed];
}

function parseEntitiesFromArgs(argv: string[]): SeedEntityId[] | null {
  const arg = argv.find(
    (item) => item.startsWith("--entities=") || item.startsWith("-e="),
  );

  if (!arg) {
    return null;
  }

  const rawValue = arg.split("=")[1]?.trim();

  if (!rawValue) {
    throw new Error("Chybí hodnota parametru --entities.");
  }

  return parseEntities(rawValue.split(/[\s,]+/));
}

async function selectEntitiesInteractively(): Promise<SeedEntityId[]> {
  type Option = {
    id: SeedEntityId;
    label: string;
    selected: boolean;
  };

  const options: Option[] = ENTITIES.map((entity) => ({
    id: entity.id,
    label: entity.label,
    selected: true,
  }));

  let cursor = 0;
  let prune = false;
  let error = "";

  function render() {
    output.write("\x1Bc");
    output.write(`${color("SEED SELECTOR", ANSI.bold, ANSI.cyan)}\n`);
    output.write(`${color("-".repeat(56), ANSI.dim)}\n\n`);

    for (const [index, option] of options.entries()) {
      const isActive = index === cursor;
      const pointer = isActive ? color(">", ANSI.bold, ANSI.yellow) : " ";
      const checkbox = option.selected
        ? color("[x]", ANSI.bold, ANSI.green)
        : color("[ ]", ANSI.dim);
      const label = isActive
        ? color(option.label, ANSI.bold, ANSI.white)
        : color(option.label, ANSI.white);

      output.write(`${pointer} ${checkbox} ${label}\n`);
    }

    const selectedCount = options.filter((option) => option.selected).length;
    output.write(
      `\n${color("Vybráno:", ANSI.bold)} ${color(`${selectedCount}/${options.length}`, ANSI.green)}\n`,
    );
    output.write(
      `${color("Ovládání:", ANSI.bold, ANSI.cyan)} sipky nahoru/dolu, mezernik, Enter, Ctrl+C\n`,
    );
    output.write(
      `${color("Prune:", ANSI.bold)} ${prune ? color("zapnuto", ANSI.yellow) : color("vypnuto", ANSI.dim)} (${color("p", ANSI.cyan)} = přepnout)\n`,
    );

    if (error) {
      output.write(`${color(error, ANSI.bold, ANSI.red)}\n`);
    }
  }

  return new Promise<SeedEntityId[]>((resolve, reject) => {
    emitKeypressEvents(input);
    input.setRawMode?.(true);
    input.resume();

    function cleanup() {
      input.removeListener("keypress", onKeypress);
      input.setRawMode?.(false);
      input.pause();
      output.write("\n");
    }

    function onKeypress(_: string, key: { name?: string; ctrl?: boolean }) {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new UserCancelledError());
        return;
      }

      if (key.name === "up") {
        cursor = cursor > 0 ? cursor - 1 : options.length - 1;
        error = "";
        render();
        return;
      }

      if (key.name === "down") {
        cursor = cursor < options.length - 1 ? cursor + 1 : 0;
        error = "";
        render();
        return;
      }

      if (key.name === "space") {
        const option = options[cursor];

        if (!option) {
          return;
        }

        option.selected = !option.selected;
        error = "";
        render();
        return;
      }

      if (key.name === "p") {
        prune = !prune;
        error = "";
        render();
        return;
      }

      if (key.name === "return") {
        const selected = options
          .filter((option) => option.selected)
          .map((option) => option.id);

        if (selected.length === 0) {
          error = "Vyber alespon jednu entitu.";
          render();
          return;
        }

        cleanup();
        resolve(selected);
      }
    }

    input.on("keypress", onKeypress);
    render();
  }).then((selected) => {
    process.env.SEED_PRUNE_INTERACTIVE = prune ? "1" : "0";
    return selected;
  });
}

async function resolveEntities(argv: string[]): Promise<SeedEntityId[]> {
  const fromArgs = parseEntitiesFromArgs(argv);

  if (fromArgs && fromArgs.length > 0) {
    return fromArgs;
  }

  if (!process.stdin.isTTY) {
    throw new Error(
      "Interaktivní volba není dostupná. Spusť skript s --entities=locations,activities,terms",
    );
  }

  return selectEntitiesInteractively();
}

function resolvePrune(argv: string[]) {
  if (parsePruneFromArgs(argv)) {
    return true;
  }

  return process.env.SEED_PRUNE_INTERACTIVE === "1";
}

async function runSelectedEntities(selected: SeedEntityId[], prune: boolean) {
  const context: SeedContext = { locationIds: [], prune };

  for (const entity of ENTITIES) {
    if (!selected.includes(entity.id)) {
      continue;
    }

    await entity.run(context);
  }
}

async function runSeed() {
  try {
    const argv = process.argv.slice(2);
    const selected = await resolveEntities(argv);
    const prune = resolvePrune(argv);

    if (prune) {
      console.log(
        "Prune režim je zapnutý: stará data vybraných entit budou smazána.",
      );
    }

    await runSelectedEntities(selected, prune);
    process.exit(0);
  } catch (error) {
    if (error instanceof UserCancelledError) {
      console.error(error.message);
      process.exit(0);
    }

    console.error("Seed selhal.");
    console.error(error);
    process.exit(1);
  }
}

runSeed();
