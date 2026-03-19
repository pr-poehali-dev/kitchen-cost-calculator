import Icon from "@/components/ui/icon";
import { Config, MATERIALS, FITTINGS, calcPrice, fmt } from "@/data/kitchenData";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{subtitle}</p>}
      <div className="mt-4 h-px bg-[hsl(var(--border))]" />
    </div>
  );
}

export function NumberInput({
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

export function CalcTab({ cfg, setCfg }: { cfg: Config; setCfg: (c: Config) => void }) {
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

export function MaterialsTab({ cfg, setCfg }: { cfg: Config; setCfg: (c: Config) => void }) {
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
