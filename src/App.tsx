import { useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Clock3, Download, EyeOff, Github, Globe2, Heart, HelpCircle, Home, Info, Layers3, LogIn, Mail, Map, MapPin, Menu, Search, Share2, SlidersHorizontal, Upload, User, ZoomIn, ZoomOut } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import * as Tabs from "@radix-ui/react-tabs";
import * as SwitchPrimitive from "@radix-ui/react-switch";

const logoUrl = "https://www.figma.com/api/mcp/asset/123ce0ec-5da9-4bbf-9327-f6a933f38e5b";
const loginImageUrl = "https://www.figma.com/api/mcp/asset/a1d7a84a-4e7d-47ee-b99d-09e984a9c46d";

type Page = "login" | "home" | "map";
type Modal = "register" | "recover" | "filters" | "upload" | "layer" | "help" | null;

type Layer = { id: string; title: string; author: string; tags: string[]; color: string; active: boolean; favorite: boolean; points: { x: number; y: number }[] };
type BaseMap = { id: string; title: string; description: string; active: boolean };

function getInitialPage(): Page {
  const path = window.location.pathname;
  if (path.includes("login")) return "login";
  if (path.includes("explore") || path.includes("mapa")) return "map";
  return "home";
}

function cn(...classes: Array<string | false | null | undefined>) { return classes.filter(Boolean).join(" "); }

function Button({ children, variant = "default", size = "md", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg" | "icon" }) {
  return <button className={cn("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className)} {...props}>{children}</button>;
}

function Logo({ className = "" }: { className?: string }) {
  return <img className={cn("logo-img", className)} src={logoUrl} alt="Pauliceia 2.0" />;
}

function Header({ active, onNavigate, onModal, language, setLanguage }: { active: Page; onNavigate: (page: Page) => void; onModal: (m: Modal) => void; language: string; setLanguage: (v: string) => void }) {
  return (
    <header className="app-header">
      <button className="header-logo" onClick={() => onNavigate("home")} aria-label="Ir para início"><Logo /></button>
      <nav className="header-nav" aria-label="Navegação principal">
        <button className={active === "home" ? "active" : ""} onClick={() => onNavigate("home")}><Home size={14} />Início</button>
        <button className={active === "map" ? "active" : ""} onClick={() => onNavigate("map")}><Map size={14} />Mapa</button>
        <button onClick={() => onModal("help")}><HelpCircle size={14} />Sobre</button>
        <button onClick={() => onModal("help")}><BookOpen size={14} />Tutorial</button>
        <button onClick={() => onModal("help")}><Mail size={14} />Contato</button>
      </nav>
      <div className="header-actions">
        <div className="lang-switch" role="group" aria-label="Idioma">
          <button className={language === "PT" ? "selected" : ""} onClick={() => setLanguage("PT")}><Globe2 size={13} />PT</button>
          <button className={language === "EN" ? "selected" : ""} onClick={() => setLanguage("EN")}><Globe2 size={13} />EN</button>
        </div>
        <Popover.Root><Popover.Trigger asChild><Button variant="secondary" size="sm"><LogIn size={14} />Entrar</Button></Popover.Trigger><Popover.Content className="popover-card" sideOffset={8}><button onClick={() => onNavigate("login")}>Entrar com e-mail</button><button onClick={() => onModal("register")}>Criar conta</button></Popover.Content></Popover.Root>
        <Button variant="outline" size="sm" onClick={() => onModal("register")}><User size={14} />Cadastrar-se</Button>
      </div>
    </header>
  );
}

function LoginPage({ onNavigate, onModal, toast }: { onNavigate: (p: Page) => void; onModal: (m: Modal) => void; toast: (m: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  function submit() { if (!email || !password) { setError(true); return; } onNavigate("home"); }
  return (
    <section className="login-page">
      <div className="login-form-panel">
        <div className="login-box">
          <Logo className="login-logo" />
          <div className="login-title"><h1>Boas-vindas ao Pauliceia!</h1><p>Entre com sua conta para continuar</p></div>
          <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="login-form">
            <label className="input-group"><span>E-mail</span><input className={error ? "input-error" : ""} value={email} onChange={(e) => { setEmail(e.target.value); setError(false); }} placeholder="seu@email.com" /></label>
            <label className="input-group"><span>Senha</span><div className="password-field"><input className={error ? "input-error" : ""} value={password} onChange={(e) => { setPassword(e.target.value); setError(false); }} type={show ? "text" : "password"} placeholder="Digite sua senha" /><button type="button" aria-label="Mostrar senha" onClick={() => setShow(!show)}><EyeOff size={16} /></button></div></label>
            {error && <p className="form-error">Informe seu e-mail e senha para continuar.</p>}
            <div className="login-row"><label className="checkbox-row"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span />Lembrar de mim</label><button type="button" className="link-button" onClick={() => onModal("recover")}>Esqueceu a senha?</button></div>
            <Button className="login-submit" size="md"><LogIn size={16} />Entrar</Button>
          </form>
          <div className="or-line"><span>ou continue com</span></div>
          <div className="social-row"><Button variant="outline" onClick={() => toast("Login social indisponível no protótipo")}><span className="google-g">G</span>Google</Button><Button variant="outline" onClick={() => toast("Login social indisponível no protótipo")}><Github size={16} />GitHub</Button></div>
          <p className="create-account">Não tem uma conta? <button onClick={() => onModal("register")}>Criar conta</button></p>
        </div>
      </div>
      <div className="login-image-panel" style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.58)),linear-gradient(125deg,rgba(123,51,6,.3),rgba(187,77,0,.4),transparent),url(${loginImageUrl})` }}>
        <div className="login-image-copy"><p><MapPin size={24} />São Paulo Histórica</p><h2>Explore a história de São Paulo através dos mapas</h2><span>Descubra como a cidade evoluiu entre 1870 e 1940 com mapas históricos georreferenciados.</span></div>
      </div>
    </section>
  );
}

function HomePage({ onNavigate, onModal, language, setLanguage }: { onNavigate: (p: Page) => void; onModal: (m: Modal) => void; language: string; setLanguage: (v: string) => void }) {
  const cards = [
    [Map, "Mapas históricos", "Explore mapas detalhados de São Paulo entre 1870 e 1940, com sobreposição de camadas cartográficas."],
    [Clock3, "Navegação temporal", "Use o slider temporal para viajar no tempo e ver as transformações urbanas década a década."],
    [Search, "Busca de endereços", "Pesquise endereços históricos por nome de rua, número e ano, ou faça upload de listas em CSV."],
    [Layers3, "Camadas colaborativas", "Crie e compartilhe camadas de dados geográficos com a comunidade de pesquisadores."],
    [Upload, "Upload de dados", "Importe seus dados de pesquisa em formatos CSV ou Shapefile e visualize-os no mapa."],
    [Download, "Exportação", "Baixe dados e imagens para documentação, análise e apresentação dos resultados."],
  ] as const;
  return (
    <section className="home-page"><Header active="home" onNavigate={onNavigate} onModal={onModal} language={language} setLanguage={setLanguage} />
      <section className="home-hero"><div className="home-hero-content"><span className="hero-pill"><MapPin size={14} />Plataforma de mapeamento histórico</span><h1>Explore a história de <strong>São Paulo</strong> através dos mapas</h1><p>Uma plataforma colaborativa para pesquisadores, estudantes e curiosos explorarem a transformação urbana de São Paulo entre 1870 e 1940.</p><div className="hero-buttons"><Button onClick={() => onNavigate("map")}><Map size={16} />Explorar o mapa</Button><Button variant="secondary" onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}><Search size={16} />Saiba mais sobre o projeto</Button></div></div></section>
      <section className="stats"><div><b>50+</b><span>Mapas históricos</span></div><div><b>200+</b><span>Camadas de dados</span></div><div><b>1.200+</b><span>Pesquisadores</span></div><div><b>70</b><span>Anos cobertos</span></div></section>
      <section id="tools" className="tools-section"><div className="section-heading"><h2>Ferramentas para sua <strong>pesquisa</strong></h2><p>Ferramentas poderosas para pesquisa histórica e análise geoespacial</p></div><div className="tool-grid">{cards.map(([Icon, title, desc]) => <article key={title} className="tool-card"><div><Icon size={24} /></div><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
      <footer className="footer"><div><Logo /><p>Plataforma colaborativa de mapeamento histórico de São Paulo (1870-1940)</p></div><div><h4>Links rápidos</h4><button onClick={() => onNavigate("map")}>Explorar Mapa</button><button onClick={() => onModal("help")}>Sobre o Projeto</button><button onClick={() => onModal("help")}>Contato</button><button onClick={() => onNavigate("login")}>Entrar</button></div><div><h4>Recursos</h4><button>Documentação</button><button>API</button><button>Tutorial</button><button>FAQ</button></div><div><h4>Contato</h4><p>contato@pauliceia.org</p><p>Universidade Federal de São Paulo<br />Guarulhos, SP</p></div></footer>
    </section>
  );
}

function MapPage({ onNavigate, onModal, language, setLanguage, toast }: { onNavigate: (p: Page) => void; onModal: (m: Modal) => void; language: string; setLanguage: (v: string) => void; toast: (m: string) => void }) {
  const [tab, setTab] = useState("layers");
  const [query, setQuery] = useState("");
  const [mapQuery, setMapQuery] = useState("");
  const [address, setAddress] = useState("");
  const [marker, setMarker] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [years, setYears] = useState([1868, 1940]);
  const [selectedLayer, setSelectedLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([
    { id: "1", title: "A enchente de 1850", author: "Orlando Guarnieri", tags: ["enchente", "anhangabau"], color: "#2563EB", active: false, favorite: false, points: [{ x: 66, y: 42 }, { x: 72, y: 48 }] },
    { id: "2", title: "A enchente de 1929 em SP", author: "Luis A. C. Ferla", tags: ["enchente", "história ambiental"], color: "#16A34A", active: true, favorite: false, points: [{ x: 59, y: 54 }, { x: 73, y: 59 }, { x: 82, y: 46 }] },
    { id: "3", title: "Area servida de esgotos ate 1893", author: "Orlando Guarnieri", tags: ["esgoto", "cantareira"], color: "#DC2626", active: true, favorite: false, points: [{ x: 62, y: 36 }, { x: 78, y: 34 }] },
    { id: "4", title: "Areas ocupadas por homossexuais 1939 a 1959", author: "Cintia Almeida", tags: ["resistencia", "homossexuais"], color: "#9333EA", active: false, favorite: false, points: [{ x: 69, y: 63 }] },
    { id: "5", title: "Anuário de escolas até 1892", author: "Cintia Almeida", tags: ["educação", "institucional"], color: "#0891B2", active: false, favorite: false, points: [{ x: 57, y: 46 }, { x: 84, y: 62 }] },
  ]);
  const [bases, setBases] = useState<BaseMap[]>([
    { id: "osm", title: "OpenStreetMap", description: "Mapa base atual", active: true },{ id: "1930", title: "São Paulo 1930", description: "Levantamento SARA Brasil 1:5000", active: false },{ id: "1924", title: "São Paulo 1924", description: "Mapa da cidade - 1924", active: false },{ id: "1905", title: "São Paulo 1905", description: "Planta geral da capital", active: false },{ id: "1890", title: "São Paulo 1890", description: "Planta da cidade", active: false },{ id: "1881", title: "São Paulo 1881", description: "Mapa cadastral", active: false },{ id: "1877", title: "São Paulo 1877", description: "Carta da capital", active: false },{ id: "1868", title: "São Paulo 1868", description: "Planta da imperial cidade", active: false },
  ]);
  const filteredLayers = layers.filter(l => [l.title, l.author, ...l.tags].join(" ").toLowerCase().includes(query.toLowerCase()));
  const filteredMaps = bases.filter(b => `${b.title} ${b.description}`.toLowerCase().includes(mapQuery.toLowerCase()));
  const points = layers.filter(l => l.active).flatMap(l => l.points.map((p, i) => ({ ...p, id: `${l.id}-${i}`, color: l.color })));
  const toggleLayer = (id: string) => setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  const favLayer = (id: string) => setLayers(prev => prev.map(l => l.id === id ? { ...l, favorite: !l.favorite } : l));
  const selectBase = (id: string) => setBases(prev => prev.map(b => ({ ...b, active: b.id === id })));
  const searchAddress = () => { if (!address.trim()) return toast("Digite um endereço para buscar"); setMarker(true); toast("Endereço encontrado"); };
  return (
    <section className="map-page"><Header active="map" onNavigate={onNavigate} onModal={onModal} language={language} setLanguage={setLanguage} />
      <div className={cn("map-layout", collapsed && "is-collapsed")}>
        <aside className="map-sidebar"><Tabs.Root value={tab} onValueChange={setTab}><Tabs.List className="map-tabs"><Tabs.Trigger value="maps"><Map size={16} />Mapas</Tabs.Trigger><Tabs.Trigger value="layers"><Layers3 size={16} />Camadas</Tabs.Trigger></Tabs.List></Tabs.Root>
          {tab === "layers" ? <><div className="sidebar-heading"><h2>Camadas de dados (50)</h2><Button variant="ghost" size="sm" onClick={() => onModal("filters")}><SlidersHorizontal size={14} />Filtrar</Button></div><label className="sidebar-search"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar camadas" /></label><div className="card-list">{filteredLayers.map(layer => <article key={layer.id} className={cn("layer-card", layer.active && "selected")}><div className="layer-row"><span className="layer-dot" style={{ background: layer.color }} /><div><h3>{layer.title}</h3><p>{layer.author}</p></div><SwitchPrimitive.Root checked={layer.active} onCheckedChange={() => toggleLayer(layer.id)} className="switch-root"><SwitchPrimitive.Thumb className="switch-thumb" /></SwitchPrimitive.Root></div><div className="badges">{layer.tags.map(t => <span key={t}>{t}</span>)}</div><div className="card-actions"><button onClick={() => favLayer(layer.id)} className={layer.favorite ? "active" : ""}><Heart size={15} />Favoritar</button><button onClick={() => { setSelectedLayer(layer); onModal("layer"); }}><Info size={15} />Detalhes</button></div></article>)}</div></> : <><div className="sidebar-heading"><h2>Mapas Base</h2></div><label className="sidebar-search"><Search size={16} /><input value={mapQuery} onChange={e => setMapQuery(e.target.value)} placeholder="Pesquisar mapas" /></label><div className="card-list">{filteredMaps.map(base => <article key={base.id} className={cn("base-card", base.active && "selected")}><div><h3>{base.title}</h3><p>{base.description}</p></div><SwitchPrimitive.Root checked={base.active} onCheckedChange={() => selectBase(base.id)} className="switch-root"><SwitchPrimitive.Thumb className="switch-thumb" /></SwitchPrimitive.Root></article>)}</div></>}
        </aside>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</button>
        <main className="map-canvas"><div className="osm-map" />
          <div className="map-search"><label><Search size={18} /><input value={address} onChange={e => setAddress(e.target.value)} onKeyDown={e => e.key === "Enter" && searchAddress()} placeholder="Buscar endereço: rua, número, ano" /></label><Button size="icon" onClick={searchAddress}><Search size={22} /></Button><Button size="icon" variant="secondary" onClick={() => onModal("upload")}><Upload size={22} /></Button></div>
          {points.map(p => <span key={p.id} className="map-point" style={{ left: `${p.x}%`, top: `${p.y}%`, background: p.color }} />)}{marker && <span className="found-marker">Endereço encontrado</span>}
          <div className="legend"><h3>Legenda</h3><p><span className="legend-orange" />Encontrado</p><p><span className="legend-blue" />Geocodificado</p><p><span className="legend-yellow" />Extrapolado</p></div>
          <div className="zoom-controls"><Button size="icon" variant="secondary" onClick={() => setZoom(z => z + 1)}><ZoomIn /></Button><Button size="icon" variant="secondary" onClick={() => setZoom(z => z - 1)}><ZoomOut /></Button><Button size="icon" variant="secondary" onClick={() => toast("Mapa centralizado")}><MapPin /></Button></div><span className="zoom-badge">Zoom {zoom}</span>
          <div className="timeline"><Clock3 size={20} /><input value={years[0]} onChange={e => setYears([Number(e.target.value), years[1]])} type="number" /><input value={years[0]} onChange={e => setYears([Number(e.target.value), years[1]])} type="range" min="1868" max="1940" /><input value={years[1]} onChange={e => setYears([years[0], Number(e.target.value)])} type="range" min="1868" max="1940" /><input value={years[1]} onChange={e => setYears([years[0], Number(e.target.value)])} type="number" /><b>{Math.min(...years)}–{Math.max(...years)}</b></div>
        </main>
      </div><ModalBridge selectedLayer={selectedLayer} />
    </section>
  );
}

function ModalBridge({ selectedLayer }: { selectedLayer: Layer | null }) { return null; }

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage());
  const [modal, setModal] = useState<Modal>(null);
  const [language, setLanguage] = useState("PT");
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2200); };
  function navigate(p: Page) { setPage(p); const path = p === "login" ? "/portal/login" : p === "map" ? "/portal/explore" : "/portal/home"; window.history.pushState({}, "", path); }
  const modalTitle = useMemo(() => ({ register: "Criar conta", recover: "Recuperar senha", filters: "Filtrar camadas", upload: "Enviar lista de endereços", help: "Ajuda do mapa", layer: "Detalhes da camada" }[modal || "help"]), [modal]);
  return <><main className="app-shell">{page === "login" && <LoginPage onNavigate={navigate} onModal={setModal} toast={showToast} />}{page === "home" && <HomePage onNavigate={navigate} onModal={setModal} language={language} setLanguage={setLanguage} />}{page === "map" && <MapPage onNavigate={navigate} onModal={setModal} language={language} setLanguage={setLanguage} toast={showToast} />}</main>
    <Dialog.Root open={!!modal} onOpenChange={(open) => !open && setModal(null)}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content"><Dialog.Close className="dialog-close">×</Dialog.Close><Dialog.Title>{modalTitle}</Dialog.Title>{modal === "upload" ? <><p>Formatos aceitos: CSV.</p><div className="dropzone"><Upload size={32} /><b>Arraste seu arquivo aqui</b><span>ou clique em selecionar arquivo</span></div><div className="dialog-actions"><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={() => { setUploading(true); setTimeout(() => { setUploading(false); setModal(null); showToast("Arquivo enviado com sucesso"); }, 900); }}>{uploading ? "Enviando..." : "Enviar"}</Button></div></> : modal === "filters" ? <><div className="filter-grid"><input placeholder="Período" /><input placeholder="Autor" /><input placeholder="Categoria" /><input placeholder="Status" /></div><div className="dialog-actions"><Button variant="outline">Limpar filtros</Button><Button onClick={() => { setModal(null); showToast("Filtros aplicados"); }}>Aplicar filtros</Button></div></> : modal === "register" || modal === "recover" ? <><p>{modal === "register" ? "Cadastro simulado para o protótipo navegável." : "Informe seu e-mail para receber instruções."}</p><input className="modal-input" placeholder={modal === "register" ? "Nome" : "seu@email.com"} />{modal === "register" && <input className="modal-input" placeholder="seu@email.com" />}<div className="dialog-actions"><Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button><Button onClick={() => { setModal(null); showToast(modal === "register" ? "Conta criada no protótipo" : "Instruções enviadas"); }}>{modal === "register" ? "Cadastrar" : "Enviar"}</Button></div></> : <p>Use a sidebar para alternar mapas base e camadas, a busca para localizar endereços e a linha do tempo para filtrar o intervalo histórico.</p>}</Dialog.Content></Dialog.Portal></Dialog.Root>
    {toast && <div className="toast">{toast}</div>}
  </>;
}
