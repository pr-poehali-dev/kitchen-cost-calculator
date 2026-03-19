import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── DATA ────────────────────────────────────────────────────────────────────

const MATERIALS = [
  { id: "mdf_gloss", name: "МДФ глянец", pricePerM: 8500, desc: "Влагостойкий, простой уход" },
  { id: "mdf_matt", name: "МДФ матовый", pricePerM: 9200, desc: "Современный вид, антибликовый" },
  { id: "veneer", name: "Шпон дерева", pricePerM: 14800, desc: "Натуральная текстура, премиум" },
  { id: "acrylic", name: "Акрил", pricePerM: 12400, desc: "Зеркальный блеск, без швов" },
  { id: "solid_oak", name: "Массив дуба", pricePerM: 22000, desc: "Элитный класс, на века" },
];

const FITTINGS = [
  { id: "blum", name: "Blum (Австрия)", price: 18000, desc: "Плавное закрытие, 10 лет гарантии" },
  { id: "hettich", name: "Hettich (Германия)", price: 14500, desc: "Надёжность, широкий ассортимент" },
  { id: "grass", name: "Grass (Австрия)", price: 16000, desc: "Push-to-open, без ручек" },
  { id: "domestic", name: "Отечественная", price: 6500, desc: "Экономичное решение" },
];

const EXTRAS = [
  { id: "sink", name: "Мойка врезная", price: 8500, icon: "Droplets" },
  { id: "worktop_stone", name: "Столешница из камня", price: 32000, icon: "Square" },
  { id: "worktop_hpl", name: "Столешница HPL", price: 12000, icon: "LayoutDashboard" },
  { id: "backlight", name: "Подсветка LED", price: 7800, icon: "Lightbulb" },
  { id: "carousel", name: "Карусель в угловой шкаф", price: 9200, icon: "RefreshCw" },
  { id: "rail", name: "Рейлинговая система", price: 4500, icon: "AlignJustify" },
  { id: "lift", name: "Подъёмник Aventos", price: 15000, icon: "ArrowUpDown" },
  { id: "trash", name: "Выдвижная корзина", price: 5800, icon: "Trash2" },
];

const GALLERY = [
  {
    id: 1,
    name: "Венге Модерн",
    img: "https://cdn.poehali.dev/projects/7ea79d30-0e02-4235-ad28-aa971681a0db/files/55031250-9335-476d-b048-5d9993670e15.jpg",
    material: "veneer",
    fitting: "blum",
    width: 3.2,
    price: 285000,
    style: "Минимализм",
    materialName: "Шпон дерева",
    fittingName: "Blum (Австрия)",
  },
  {
    id: 2,
    name: "Белый Классик",
    img: "https://cdn.poehali.dev/projects/7ea79d30-0e02-4235-ad28-aa971681a0db/files/24d9b766-4213-4ebd-b829-caee73385ab2.jpg",
    material: "mdf_gloss",
    fitting: "hettich",
    width: 2.8,
    price: 198000,
    style: "Скандинавский",
    materialName: "МДФ глянец",
    fittingName: "Hettich (Германия)",
  },
  {
    id: 3,
    name: "Дуб Натуральный",
    img: "https://cdn.poehali.dev/projects/7ea79d30-0e02-4235-ad28-aa971681a0db/files/60ba1d00-9412-43c4-a308-4d353b762f07.jpg",
    material: "solid_oak",
    fitting: "blum",
    width: 3.6,
    price: 412000,
    style: "Классика",
    materialName: "Массив дуба",
    fittingName: "Blum (Австрия)",
  },
];

const NAV_TABS = [
  { id: "calc", label: "Калькулятор", icon: "Calculator" },
  { id: "materials", label: "Материалы и фурнитура", icon: "Layers" },
  { id: "gallery", label: "Галерея", icon: "Image" },
  { id: "extras", label: "Доп. опции", icon: "Plus" },
  { id: "result", label: "Результат", icon: "FileText" },
  { id: "contacts", label: "Контакты", icon: "Phone" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Config {
  width: number;
  height: number;
  depth: number;
  materialId: string;
  fittingId: string;
  extras: string[];
}

const defaultConfig = (): Config => ({
  width: 2.4,
  height: 2.2,
  depth: 0.6,
  materialId: "mdf_matt",
  fittingId: "hettich",
  extras: [],
});

function calcPrice(cfg: Config): number {
  const material = MATERIALS.find((m) => m.id === cfg.materialId)!;
  const fitting = FITTINGS.find((f) => f.id === cfg.fittingId)!;
  const area = cfg.width * cfg.height * 2 + cfg.width * cfg.depth * 2 + cfg.height * cfg.depth * 2;
  const matCost = area * material.pricePerM;
  const extCost = cfg.extras.reduce((sum, id) => {
    const ex = EXTRAS.find((e) => e.id === id);
    return sum + (ex ? ex.price : 0);
  }, 0);
  return Math.round(matCost + fitting.price + extCost);
}

// ─── UI PARTS ─────────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p>}
      <div className="mt-4 h-px bg-[hsl(var(--border))]" />
    </div>
  );
}

function NumberInput({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
          className="w-8 h-8 flex items-center justify-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))] transition-colors"
        >
          <Icon name="Minus" size={14} />
        </button>
        <span className="font-mono-num text-xl font-medium w-16 text-center">{value.toFixed(1)}</span>
        <button
          onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
          className="w-8 h-8 flex items-center justify-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--secondary))] transition-colors"
        >
          <Icon name="Plus" size={14} />
        </button>
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full accent-[hsl(var(--foreground))]"
      />
    </div>
  );
}

// ─── TABS ────────────────────────────────────────────────────────────────────

function CalcTab({ cfg, setCfg }: { cfg: Config; setCfg: (c: Config) => void }) {
  const area = cfg.width * cfg.height * 2 + cfg.width * cfg.depth * 2 + cfg.height * cfg.depth * 2;
  return (
    <div className="animate-slide-up">
      <SectionHeader title="Параметры гарнитура" subtitle="Укажите размеры вашей кухни" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <NumberInput label="Ширина" value={cfg.width} min={1.2} max={6.0} step={0.1} unit="м" onChange={(v) => setCfg({ ...cfg, width: v })} />
        <NumberInput label="Высота" value={cfg.height} min={1.8} max={2.6} step={0.1} unit="м" onChange={(v) => setCfg({ ...cfg, height: v })} />
        <NumberInput label="Глубина" value={cfg.depth} min={0.5} max={0.8} step={0.05} unit="м" onChange={(v) => setCfg({ ...cfg, depth: v })} />
      </div>
      <div className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest opacity-60 mb-1">Предварительная стоимость</div>
          <div className="font-mono-num text-3xl font-medium">{fmt(calcPrice(cfg))}</div>
        </div>
        <div className="text-left sm:text-right opacity-60 text-sm space-y-0.5">
          <div>{cfg.width} × {cfg.height} × {cfg.depth} м</div>
          <div>Площадь ~{area.toFixed(1)} м²</div>
        </div>
      </div>
    </div>
  );
}

function MaterialsTab({ cfg, setCfg }: { cfg: Config; setCfg: (c: Config) => void }) {
  return (
    <div className="animate-slide-up">
      <SectionHeader title="Материал фасадов" subtitle="От выбора материала зависит 60% итоговой стоимости" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {MATERIALS.map((m) => {
          const active = cfg.materialId === m.id;
          return (
            <button key={m.id} onClick={() => setCfg({ ...cfg, materialId: m.id })}
              className={`p-4 text-left border transition-all ${active ? "border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))] bg-white"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{m.name}</span>
                {active && <Icon name="Check" size={16} />}
              </div>
              <div className={`text-xs mb-2 ${active ? "opacity-70" : "text-[hsl(var(--muted-foreground))]"}`}>{m.desc}</div>
              <div className={`font-mono-num text-sm font-medium ${active ? "opacity-80" : "text-[hsl(var(--gold))]"}`}>
                {m.pricePerM.toLocaleString("ru-RU")} ₽/м²
              </div>
            </button>
          );
        })}
      </div>
      <SectionHeader title="Фурнитура" subtitle="Механизмы открывания, петли, направляющие" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FITTINGS.map((f) => {
          const active = cfg.fittingId === f.id;
          return (
            <button key={f.id} onClick={() => setCfg({ ...cfg, fittingId: f.id })}
              className={`p-4 text-left border transition-all flex items-start gap-4 ${active ? "border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))] bg-white"}`}
            >
              <Icon name="Settings2" size={20} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{f.name}</span>
                  {active && <Icon name="Check" size={16} />}
                </div>
                <div className={`text-xs mt-1 ${active ? "opacity-70" : "text-[hsl(var(--muted-foreground))]"}`}>{f.desc}</div>
              </div>
              <div className={`font-mono-num text-sm font-semibold shrink-0 ${active ? "opacity-80" : "text-[hsl(var(--gold))]"}`}>
                {f.price.toLocaleString("ru-RU")} ₽
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GalleryTab({ cfg, setCfg, setTab }: { cfg: Config; setCfg: (c: Config) => void; setTab: (t: string) => void }) {
  return (
    <div className="animate-slide-up">
      <SectionHeader title="Готовые решения" subtitle="Выберите понравившийся вариант — параметры применятся автоматически" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {GALLERY.map((item) => (
          <div key={item.id} className="border border-[hsl(var(--border))] overflow-hidden group bg-white">
            <div className="relative overflow-hidden h-52">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-xs px-2 py-1 font-medium">{item.style}</div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{item.name}</h3>
                <span className="font-mono-num text-sm font-medium text-[hsl(var(--gold))]">{fmt(item.price)}</span>
              </div>
              <div className="space-y-1 text-xs text-[hsl(var(--muted-foreground))] mb-4">
                <div className="flex gap-2"><span className="opacity-60">Материал:</span><span>{item.materialName}</span></div>
                <div className="flex gap-2"><span className="opacity-60">Фурнитура:</span><span>{item.fittingName}</span></div>
                <div className="flex gap-2"><span className="opacity-60">Ширина:</span><span>{item.width} м</span></div>
              </div>
              <button
                onClick={() => { setCfg({ ...cfg, materialId: item.material, fittingId: item.fitting, width: item.width }); setTab("result"); }}
                className="w-full py-2 text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
              >
                Выбрать этот вариант
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExtrasTab({ cfg, setCfg }: { cfg: Config; setCfg: (c: Config) => void }) {
  const toggle = (id: string) => {
    const extras = cfg.extras.includes(id) ? cfg.extras.filter((e) => e !== id) : [...cfg.extras, id];
    setCfg({ ...cfg, extras });
  };
  const totalExtras = cfg.extras.reduce((s, id) => s + (EXTRAS.find((e) => e.id === id)?.price ?? 0), 0);
  return (
    <div className="animate-slide-up">
      <SectionHeader title="Дополнительные опции" subtitle="Улучшите функциональность вашей кухни" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXTRAS.map((ex) => {
          const active = cfg.extras.includes(ex.id);
          return (
            <button key={ex.id} onClick={() => toggle(ex.id)}
              className={`p-4 text-left border transition-all flex items-center gap-4 ${active ? "border-[hsl(var(--foreground))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--foreground))] bg-white"}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center border shrink-0 ${active ? "border-white/30 bg-white/10" : "border-[hsl(var(--border))]"}`}>
                <Icon name={ex.icon} size={16} fallback="Package" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{ex.name}</div>
                <div className={`font-mono-num text-xs mt-0.5 ${active ? "opacity-70" : "text-[hsl(var(--gold))]"}`}>
                  +{ex.price.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${active ? "border-white bg-white" : "border-[hsl(var(--border))]"}`}>
                {active && <Icon name="Check" size={12} className="text-[hsl(var(--primary))]" />}
              </div>
            </button>
          );
        })}
      </div>
      {cfg.extras.length > 0 && (
        <div className="mt-6 p-4 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] flex items-center justify-between">
          <span className="text-sm">Выбрано опций: <strong>{cfg.extras.length}</strong></span>
          <span className="font-mono-num font-semibold text-[hsl(var(--gold))]">+{totalExtras.toLocaleString("ru-RU")} ₽</span>
        </div>
      )}
    </div>
  );
}

function ResultTab({ cfg, cfg2, setCfg2 }: { cfg: Config; cfg2: Config | null; setCfg2: (c: Config | null) => void }) {
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

function ContactsTab({ price }: { price: number }) {
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

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Index() {
  const [activeTab, setActiveTab] = useState("calc");
  const [cfg, setCfg] = useState<Config>(defaultConfig());
  const [cfg2, setCfg2] = useState<Config | null>(null);
  const price = calcPrice(cfg);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <header className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: "hsl(35 85% 52%)" }}>
              <Icon name="UtensilsCrossed" size={18} className="text-white" />
            </div>
            <div>
              <div className="font-semibold tracking-tight">КухняПро</div>
              <div className="text-xs opacity-50 leading-tight">Калькулятор гарнитура</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-50 mb-0.5">Текущий расчёт</div>
            <div className="font-mono-num text-lg font-medium" style={{ color: "hsl(35 85% 65%)" }}>{fmt(price)}</div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-[hsl(var(--border))] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <div className="flex">
            {NAV_TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-xs font-medium uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id ? "border-[hsl(var(--foreground))] text-[hsl(var(--foreground))]" : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"}`}
              >
                <Icon name={tab.icon} size={14} fallback="Circle" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "calc" && <CalcTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "materials" && <MaterialsTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "gallery" && <GalleryTab cfg={cfg} setCfg={setCfg} setTab={setActiveTab} />}
        {activeTab === "extras" && <ExtrasTab cfg={cfg} setCfg={setCfg} />}
        {activeTab === "result" && <ResultTab cfg={cfg} cfg2={cfg2} setCfg2={setCfg2} />}
        {activeTab === "contacts" && <ContactsTab price={price} />}
      </main>

      {activeTab !== "result" && activeTab !== "contacts" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[hsl(var(--border))] z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Итоговая стоимость</div>
            <div className="flex items-center gap-4">
              <div className="font-mono-num text-xl font-semibold">{fmt(price)}</div>
              <button onClick={() => setActiveTab("contacts")}
                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium px-5 py-2 hover:opacity-90 transition-opacity flex items-center gap-2">
                Оформить заявку
                <Icon name="ArrowRight" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab !== "result" && activeTab !== "contacts" && <div className="h-20" />}
    </div>
  );
}