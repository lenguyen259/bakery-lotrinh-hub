import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";

export async function TrustPanel() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <section className="rounded-2xl border border-clay/30 bg-clay/5 p-4 text-sm leading-relaxed">
      <h2 className="font-display text-lg text-clay">{t.trust.title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/85">
        <li>{t.ideas.tooVague}</li>
        <li>INVENTED_IMPACT — shaper must not add đồng amounts.</li>
        <li>BAD_CITATION — brief cites only ids on the board.</li>
        <li>{t.aiBanner.demo}</li>
        <li>{t.trust.completion}</li>
      </ul>
    </section>
  );
}
