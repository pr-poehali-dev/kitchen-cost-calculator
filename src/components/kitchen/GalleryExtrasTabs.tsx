import Icon from "@/components/ui/icon";
import { Config, GALLERY, EXTRAS, fmt } from "@/data/kitchenData";
import { SectionHeader } from "./CalcMaterialsTabs";

export function GalleryTab({ cfg, setCfg, setTab }: { cfg: Config; setCfg: (c: Config) => void; setTab: (t: string) => void }) {
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

export function ExtrasTab({ cfg, setCfg }: { cfg: Config; setCfg: (c: Config) => void }) {
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
