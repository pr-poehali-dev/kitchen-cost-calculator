import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Config, MATERIALS, FITTINGS, EXTRAS, calcPrice, defaultConfig, fmt } from "@/data/kitchenData";
import { SectionHeader } from "./CalcMaterialsTabs";

export function ResultTab({ cfg, cfg2, setCfg2 }: { cfg: Config; cfg2: Config | null; setCfg2: (c: Config | null) => void }) {
  const price1 = calcPrice(cfg);
  const price2 = cfg2 ? calcPrice(cfg2) : null;
  const material = MATERIALS.find((m) => m.id === cfg.materialId)!;
  const fitting = FITTINGS.find((f) => f.id === cfg.fittingId)!;
  const area = cfg.width * cfg.height * 2 + cfg.width * cfg.depth * 2 + cfg.height * cfg.depth * 2;

  const breakdown = [
    { label: "Материал фасадов", value: Math.round(area * material.pricePerM) },
    { label: "Фурнитура", value: fitting.price },
    ...EXTRAS.filter((e) => cfg.extras.includes(e.id)).map((e) => ({ label: e.name, value: e.price })),
  ];

  return (
    <div className="animate-slide-up">
      <SectionHeader title="Итоговый расчёт" subtitle="Детализация стоимости вашего гарнитура" />
      <div className={`grid gap-8 ${cfg2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 max-w-lg"}`}>
        <div>
          {cfg2 && <div className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-4">Вариант А</div>}
          <div className="border border-[hsl(var(--border))]">
            <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-5">
              <div className="text-xs opacity-60 mb-1">Итого</div>
              <div className="font-mono-num text-4xl font-medium">{fmt(price1)}</div>
              <div className="text-xs opacity-60 mt-1">{material.name} · {fitting.name}</div>
            </div>
            <div className="divide-y divide-[hsl(var(--border))] bg-white">
              {breakdown.map((row, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{row.label}</span>
                  <span className="font-mono-num font-medium">{row.value.toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {cfg2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Вариант Б</div>
              <button onClick={() => setCfg2(null)} className="text-xs text-[hsl(var(--muted-foreground))] hover:text-foreground flex items-center gap-1">
                <Icon name="X" size={12} /> Удалить сравнение
              </button>
            </div>
            <div className="border border-[hsl(var(--border))] bg-white">
              <div className="bg-[hsl(var(--secondary))] p-5">
                <div className="text-xs opacity-60 mb-1">Итого</div>
                <div className="font-mono-num text-4xl font-medium">{fmt(price2!)}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                  {MATERIALS.find((m) => m.id === cfg2.materialId)?.name} · {FITTINGS.find((f) => f.id === cfg2.fittingId)?.name}
                </div>
                <div className={`text-xs mt-2 font-medium font-mono-num ${price2! - price1 > 0 ? "text-red-500" : "text-green-600"}`}>
                  {price2! - price1 > 0 ? "+" : ""}{(price2! - price1).toLocaleString("ru-RU")} ₽ {price2! - price1 > 0 ? "дороже" : "дешевле"}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Материал</label>
                  <select value={cfg2.materialId} onChange={(e) => setCfg2({ ...cfg2, materialId: e.target.value })}
                    className="w-full border border-[hsl(var(--border))] px-3 py-2 text-sm bg-white">
                    {MATERIALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Фурнитура</label>
                  <select value={cfg2.fittingId} onChange={(e) => setCfg2({ ...cfg2, fittingId: e.target.value })}
                    className="w-full border border-[hsl(var(--border))] px-3 py-2 text-sm bg-white">
                    {FITTINGS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[hsl(var(--muted-foreground))] block mb-1">Ширина (м)</label>
                  <input type="number" min={1.2} max={6.0} step={0.1} value={cfg2.width}
                    onChange={(e) => setCfg2({ ...cfg2, width: +e.target.value })}
                    className="w-full border border-[hsl(var(--border))] px-3 py-2 text-sm bg-white font-mono-num" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!cfg2 && (
        <button onClick={() => setCfg2(defaultConfig())}
          className="mt-6 flex items-center gap-2 text-sm border border-dashed border-[hsl(var(--border))] px-4 py-3 hover:border-[hsl(var(--foreground))] transition-colors bg-white">
          <Icon name="GitCompare" size={16} />
          Добавить вариант для сравнения
        </button>
      )}
    </div>
  );
}

export function ContactsTab({ price }: { price: number }) {
  const [form, setForm] = useState({ name: "", phone: "", comment: "" });
  const [sent, setSent] = useState(false);
  return (
    <div className="animate-slide-up">
      <SectionHeader title="Оформить заявку" subtitle="Оставьте контакты — менеджер свяжется в течение 30 минут" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {!sent ? (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] block mb-2">Ваше имя</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Иван Петров"
                  className="w-full border border-[hsl(var(--border))] px-4 py-3 text-sm bg-white focus:border-[hsl(var(--foreground))] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] block mb-2">Телефон</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__"
                  className="w-full border border-[hsl(var(--border))] px-4 py-3 text-sm bg-white focus:border-[hsl(var(--foreground))] outline-none transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] block mb-2">Комментарий</label>
                <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} rows={3} placeholder="Дополнительные пожелания..."
                  className="w-full border border-[hsl(var(--border))] px-4 py-3 text-sm bg-white focus:border-[hsl(var(--foreground))] outline-none transition-colors resize-none" />
              </div>
              <button type="submit"
                className="w-full py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Icon name="Send" size={16} />
                Отправить заявку
              </button>
            </form>
          ) : (
            <div className="border border-[hsl(var(--border))] bg-white p-8 text-center animate-fade-in">
              <div className="w-12 h-12 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCheck" size={24} />
              </div>
              <div className="font-semibold mb-2">Заявка принята!</div>
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Менеджер свяжется с вами в течение 30 минут в рабочее время.</div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div className="border border-[hsl(var(--border))] bg-white p-5">
            <div className="text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Ваш расчёт</div>
            <div className="font-mono-num text-3xl font-medium">{fmt(price)}</div>
            <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Предварительная стоимость</div>
          </div>
          <div className="space-y-4">
            {[
              { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35" },
              { icon: "Mail", label: "Email", value: "info@kuhnya.ru" },
              { icon: "MapPin", label: "Адрес", value: "г. Москва, ул. Примерная, 1" },
              { icon: "Clock", label: "Режим работы", value: "Пн–Сб, 9:00–19:00" },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <div className="w-8 h-8 border border-[hsl(var(--border))] bg-white flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name={row.icon} size={14} />
                </div>
                <div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">{row.label}</div>
                  <div className="text-sm font-medium">{row.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
