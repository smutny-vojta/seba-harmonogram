interface TermsMenuProps {
  count: number;
}

export default function TermsMenu({ count }: TermsMenuProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-muted-foreground text-sm">
        Počet turnusů:{" "}
        <span className="text-foreground font-medium">{count}</span>
      </div>
      <div className="text-muted-foreground text-sm">
        Turnusy jsou pevně nastavené v kódu (read-only).
      </div>
    </div>
  );
}
