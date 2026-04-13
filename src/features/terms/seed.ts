export async function seedTermsFeature(options?: { prune?: boolean }) {
  if (options?.prune) {
    console.log(
      "Prune je pro turnusy přeskočen, protože turnusy jsou fixní hodnoty v kódu.",
    );
  }

  console.log("Seed turnusů přeskočen: turnusy jsou fixní v src/lib/terms.");
}
