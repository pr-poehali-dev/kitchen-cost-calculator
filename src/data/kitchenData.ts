export const MATERIALS = [
  { id: "mdf_gloss", name: "МДФ глянец", pricePerM: 8500, desc: "Влагостойкий, простой уход" },
  { id: "mdf_matt", name: "МДФ матовый", pricePerM: 9200, desc: "Современный вид, антибликовый" },
  { id: "veneer", name: "Шпон дерева", pricePerM: 14800, desc: "Натуральная текстура, премиум" },
  { id: "acrylic", name: "Акрил", pricePerM: 12400, desc: "Зеркальный блеск, без швов" },
  { id: "solid_oak", name: "Массив дуба", pricePerM: 22000, desc: "Элитный класс, на века" },
];

export const FITTINGS = [
  { id: "blum", name: "Blum (Австрия)", price: 18000, desc: "Плавное закрытие, 10 лет гарантии" },
  { id: "hettich", name: "Hettich (Германия)", price: 14500, desc: "Надёжность, широкий ассортимент" },
  { id: "grass", name: "Grass (Австрия)", price: 16000, desc: "Push-to-open, без ручек" },
  { id: "domestic", name: "Отечественная", price: 6500, desc: "Экономичное решение" },
];

export const EXTRAS = [
  { id: "sink", name: "Мойка врезная", price: 8500, icon: "Droplets" },
  { id: "worktop_stone", name: "Столешница из камня", price: 32000, icon: "Square" },
  { id: "worktop_hpl", name: "Столешница HPL", price: 12000, icon: "LayoutDashboard" },
  { id: "backlight", name: "Подсветка LED", price: 7800, icon: "Lightbulb" },
  { id: "carousel", name: "Карусель в угловой шкаф", price: 9200, icon: "RefreshCw" },
  { id: "rail", name: "Рейлинговая система", price: 4500, icon: "AlignJustify" },
  { id: "lift", name: "Подъёмник Aventos", price: 15000, icon: "ArrowUpDown" },
  { id: "trash", name: "Выдвижная корзина", price: 5800, icon: "Trash2" },
];

export const GALLERY = [
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

export const NAV_TABS = [
  { id: "calc", label: "Калькулятор", icon: "Calculator" },
  { id: "materials", label: "Материалы и фурнитура", icon: "Layers" },
  { id: "gallery", label: "Галерея", icon: "Image" },
  { id: "extras", label: "Доп. опции", icon: "Plus" },
  { id: "result", label: "Результат", icon: "FileText" },
  { id: "contacts", label: "Контакты", icon: "Phone" },
];

export const fmt = (n: number) =>
  n.toLocaleString("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

export interface Config {
  width: number;
  height: number;
  depth: number;
  materialId: string;
  fittingId: string;
  extras: string[];
}

export const defaultConfig = (): Config => ({
  width: 2.4,
  height: 2.2,
  depth: 0.6,
  materialId: "mdf_matt",
  fittingId: "hettich",
  extras: [],
});

export function calcPrice(cfg: Config): number {
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
