import { UserLock } from "lucide-react";

interface HeaderProps {
  label?: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-4">
      <h1 className="flex  gap-2 text-2xl uppercase font-semibold">
        <UserLock size={28} />
        Auth
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
