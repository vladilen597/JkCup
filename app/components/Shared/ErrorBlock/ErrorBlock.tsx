import { AlertCircle } from "lucide-react";

const ErrorBlock = ({ error }: { error: string }) => {
  return (
    <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-sm text-red-400">
      <AlertCircle className="h-4 w-4" />
      {error}
    </div>
  );
};

export default ErrorBlock;
