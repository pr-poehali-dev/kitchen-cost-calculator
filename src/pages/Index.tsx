import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Config, NAV_TABS, calcPrice, defaultConfig, fmt } from "@/data/kitchenData";
import { CalcTab, MaterialsTab } from "@/components/kitchen/CalcMaterialsTabs";
import { GalleryTab, ExtrasTab } from "@/components/kitchen/GalleryExtrasTabs";
import { ResultTab, ContactsTab } from "@/components/kitchen/ResultContactsTabs";

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
