export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-stone-500">
        <p className="font-medium text-stone-700">Антик — антикварный магазин</p>
        <p className="mt-1">
          Курируемый антиквариат с провенансом и экспертизой. Подбор и продажа
          предметов в наличии.
        </p>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} Антик. Все предметы уникальны и
          представлены в единственном экземпляре.
        </p>
      </div>
    </footer>
  );
}
