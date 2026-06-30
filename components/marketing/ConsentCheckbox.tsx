import Link from "next/link";

/**
 * 152-ФЗ personal-data processing consent — required on every lead form.
 * Submits `consent=1`; server actions reject the lead if it's absent.
 */
export function ConsentCheckbox({ id = "consent" }: { id?: string }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-2 text-xs leading-relaxed text-muted"
    >
      <input
        id={id}
        name="consent"
        type="checkbox"
        required
        value="1"
        className="mt-0.5 size-4 shrink-0 accent-[#806645] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
      />
      <span>
        Я даю согласие на обработку персональных данных в соответствии с{" "}
        <Link
          href="/politika-konfidencialnosti"
          target="_blank"
          className="text-accent underline-offset-2 hover:underline"
        >
          Политикой конфиденциальности
        </Link>
        .
      </span>
    </label>
  );
}
