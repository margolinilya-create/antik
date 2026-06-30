export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center" aria-label="Загрузка">
      <span className="size-7 animate-spin rounded-full border-2 border-line border-t-accent" />
    </div>
  );
}
