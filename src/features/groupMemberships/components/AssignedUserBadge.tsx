import { Badge } from "@/components/ui/badge";

interface AssignedUserBadgeProps {
  userId: string;
  userName: string;
  onRemove: (userId: string) => void;
  disabled: boolean;
}

export function AssignedUserBadge({
  userId,
  userName,
  onRemove,
  disabled,
}: AssignedUserBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="flex h-8 items-center gap-2 rounded-md px-2"
    >
      <span className="max-w-56 truncate">{userName}</span>
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
        disabled={disabled}
        onClick={() => {
          onRemove(userId);
        }}
      >
        Odebrat
      </button>
    </Badge>
  );
}
