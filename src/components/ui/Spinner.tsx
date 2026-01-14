export function Spinner() {
  return (
    <div className="flex h-full min-h-50 items-center justify-center">
      <div className="h-10 w-10 border-4 border-(--color-border) border-t-(--color-primary) rounded-full animate-spin" />
    </div>
  );
}
