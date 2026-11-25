import type {
  FeaturedProjectMeta,
  LanguageCode,
  TechItem,
} from '../types/portfolio.js';

/**
 * Contact email configuration.
 * GitHub API returned `email: null` for @claudiovictors.
 * Update `contactEmail` below if you want to display and copy a public email address.
 */
export const PROFILE_CONFIG = {
  name: 'Cláudio Victor',
  username: 'claudiovictors',
  role: 'Software Developer',
  location: 'Luanda, Angola',
  coordinates: '8.8390° S, 13.2894° E',
  availability: {
    en: 'Open to opportunities, remote work and relocation',
    pt: 'Disponível para oportunidades, trabalho remoto e realocação',
  },
  avatarUrl: 'https://avatars.githubusercontent.com/u/157994325?v=4',
  contactEmail: 'barrosclaudio147@gmail.com' as string | null,
  links: {
    github: 'https://github.com/claudiovictors',
    linkedin: 'https://linkedin.com/in/cláudio-victor-710986291',
    x: 'https://x.com/VictorCla20025',
    legacyPortfolio: 'https://claudiovictordev.vercel.app',
    kiteDocs: 'http://kitego.vercel.app/',
  },
};

export interface TimelineStep {
  period: string;
  label: { en: string; pt: string };
  summary: { en: string; pt: string };
  repos: string[];
}

export const ENGINEERING_TIMELINE: TimelineStep[] = [
  {
    period: '2024',
    label: {
      en: 'Foundations & Open-Source Start',
      pt: 'Fundações & Início Open Source',
    },
    summary: {
      en: 'Established public GitHub presence, exploring web fundamentals, relational schemas, and backend logic.',
      pt: 'Início da presença pública no GitHub, explorando fundamentos web, bases de dados relacionais e lógica backend.',
    },
    repos: ['claudiovictors'],
  },
  {
    period: '2025',
    label: {
      en: 'PHP MVC Architecture & Tooling',
      pt: 'Arquitetura MVC em PHP & Ferramentas',
    },
    summary: {
      en: 'Created Slenix (MVC micro-framework in PHP), Lirien-env (.env loader), and API Events with JWT authentication.',
      pt: 'Criação do Slenix (micro-framework MVC em PHP), Lirien-env (.env loader) e API Events com autenticação JWT.',
    },
    repos: ['slenix', 'lirien-env', 'api-events'],
  },
  {
    period: '2026 · Q1–Q3',
    label: {
      en: 'Zero-Dependency Go Systems & PyTorch Study',
      pt: 'Sistemas em Go sem Dependências & PyTorch',
    },
    summary: {
      en: 'Engineered Kite (Go web framework over standard library), Clinic API, ChatApp, NetPOS, and Mini-LLM from scratch in PyTorch.',
      pt: 'Desenvolvimento do Kite (framework web em Go puro), Clinic API, ChatApp, NetPOS e Mini-LLM em PyTorch.',
    },
    repos: ['kite', 'clinic-api', 'chatapp', 'netpos', 'Mini-LLM'],
  },
  {
    period: '2026 · Q4',
    label: {
      en: 'Cross-Language Runtimes & Civic Mobile',
      pt: 'Runtimes Multi-linguagem & Mobile Cívico',
    },
    summary: {
      en: 'Built Oche (Dart server framework), Stash (zero-dependency Go HTTP sessions), and SOS Mobile + SOS API for emergency response in Angola.',
      pt: 'Criação do Oche (framework Dart no servidor), Stash (sessões HTTP em Go) e SOS Mobile + SOS API para emergências em Angola.',
    },
    repos: ['oche', 'stash', 'sos-mobile', 'sos-api'],
  },
];

export interface EditorialProjectSpec extends FeaturedProjectMeta {
  accentHex: string;
  tagline: { en: string; pt: string };
  highlights: { en: string[]; pt: string[] };
  visualKind: 'kite-router' | 'slenix-mvc' | 'stash-crypto' | 'sos-mobile' | 'oche-dart' | 'clinic-rest';
}

export const FEATURED_EXHIBITION: EditorialProjectSpec[] = [
  {
    repoName: 'kite',
    category: 'framework',
    accentHex: '#00ADD8',
    visualKind: 'kite-router',
    roleLabel: {
      en: '01 / Go Web Framework',
      pt: '01 / Framework Web em Go',
    },
    tagline: {
      en: 'Express ergonomics & Eloquent-style ORM using zero external packages.',
      pt: 'Ergonomia Express & ORM estilo Eloquent sem dependências externas.',
    },
    architectureSummary: {
      en: 'Built entirely over the Go standard library (net/http, database/sql, crypto/hmac, html/template, reflect) in a single cohesive module.',
      pt: 'Construído integralmente sobre a biblioteca padrão do Go (net/http, database/sql, crypto/hmac, html/template, reflect) num único módulo.',
    },
    highlights: {
      en: [
        'Dynamic HTTP router & composable middleware pipeline',
        'Eloquent-inspired SQL query builder over database/sql',
        'Built-in HMAC/JWT session auth & Blade-like templates',
      ],
      pt: [
        'Router HTTP dinâmico e pipeline de middleware composável',
        'Query builder estilo Eloquent sobre database/sql',
        'Autenticação JWT/sessão e templates estilo Blade integrados',
      ],
    },
    verifiedTech: ['Go', 'net/http', 'database/sql', 'JWT', 'MIT'],
    codePreview: {
      filename: 'cmd/server/main.go',
      language: 'go',
      snippet: `app := kite.New()
app.Use(kite.Logger(), kite.Recover())

api := app.Group("/api/v1", auth.RequireJWT())
api.Get("/health", func(c *kite.Ctx) error {
  return c.JSON(200, kite.Map{"engine": "kite", "deps": 0})
})

app.Listen(":8080")`,
    },
  },
  {
    repoName: 'slenix',
    category: 'framework',
    accentHex: '#818CF8',
    visualKind: 'slenix-mvc',
    roleLabel: {
      en: '02 / PHP 8.1+ MVC Framework',
      pt: '02 / Framework MVC em PHP 8.1+',
    },
    tagline: {
      en: 'Predictable, explicit MVC architecture powering multi-tenant web systems.',
      pt: 'Arquitetura MVC explícita e previsível por trás de sistemas web multi-tenant.',
    },
    architectureSummary: {
      en: 'A lightweight PHP framework eliminating hidden magic—combining dynamic routing, ORM relations, Luna templates, and Veil authentication scaffolding.',
      pt: 'Micro-framework PHP leve que elimina magia implícita — unindo roteamento dinâmico, relações ORM, templates Luna e autenticação Veil.',
    },
    highlights: {
      en: [
        'Isolated request/response lifecycle & middleware filters',
        'Fluent ORM supporting HasManyThrough & MorphMany',
        'Powers production-style apps: NetPOS, ChatApp, API Events',
      ],
      pt: [
        'Ciclo de vida request/response isolado e filtros de middleware',
        'ORM fluente com suporte a HasManyThrough e MorphMany',
        'Base dos projetos NetPOS, ChatApp e API Events',
      ],
    },
    verifiedTech: ['PHP 8.1+', 'MVC', 'ORM', 'Luna', 'Veil Auth', 'MIT'],
    codePreview: {
      filename: 'routes/api.php',
      language: 'php',
      snippet: `Route::group(['prefix' => '/api/v1'], function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store'])
        ->middleware([JwtMiddleware::class]);
});`,
    },
  },
  {
    repoName: 'sos-mobile',
    category: 'mobile',
    accentHex: '#F59E0B',
    visualKind: 'sos-mobile',
    roleLabel: {
      en: '03 / Civic Emergency Mobile App',
      pt: '03 / App Móvel de Emergência Cívica',
    },
    tagline: {
      en: 'Real-time GPS emergency reporting built for citizens in Angola.',
      pt: 'Pedidos de socorro com GPS em tempo real para cidadãos em Angola.',
    },
    architectureSummary: {
      en: 'React Native + Expo Router mobile application enabling fast emergency classification, live GPS pin adjustment, and direct 115 Bombeiros Angola dispatch.',
      pt: 'Aplicação móvel em React Native + Expo Router com seleção rápida de ocorrência, ajuste manual de GPS e ligação direta ao 115 dos Bombeiros Angola.',
    },
    highlights: {
      en: [
        'High-accuracy geolocation via expo-location & react-native-maps',
        'Zero-auth fast dispatch flow with local AsyncStorage preferences',
        'Paired with Go net/http backend service (sos-api)',
      ],
      pt: [
        'Geolocalização de alta precisão com expo-location e mapas',
        'Fluxo rápido sem autenticação para situações críticas',
        'Integrado com serviço backend em Go (sos-api)',
      ],
    },
    verifiedTech: ['TypeScript', 'React Native', 'Expo', 'expo-location'],
    codePreview: {
      filename: 'src/app/location.tsx',
      language: 'tsx',
      snippet: `const { coords } = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
});
await sendEmergencyReport({
  incident: selectedType,
  latitude: coords.latitude,
  longitude: coords.longitude,
});`,
    },
  },
  {
    repoName: 'stash',
    category: 'api',
    accentHex: '#22D3A6',
    visualKind: 'stash-crypto',
    roleLabel: {
      en: '04 / Zero-Dependency Go Package',
      pt: '04 / Pacote Go sem Dependências',
    },
    tagline: {
      en: 'Secure HTTP session management for Go standard library servers.',
      pt: 'Gestão segura de sessões HTTP para servidores na biblioteca padrão do Go.',
    },
    architectureSummary: {
      en: 'Published Go module providing signed cookie stores, context propagation, and zero third-party supply-chain surface.',
      pt: 'Módulo Go publicado oferecendo cookies assinados, propagação por contexto e zero dependências externas.',
    },
    highlights: {
      en: [
        'Works natively with net/http ServeMux and custom routers',
        'Zero external dependencies verified on pkg.go.dev',
        'Clean context extraction via stash.FromContext(r.Context())',
      ],
      pt: [
        'Compatível nativamente com net/http ServeMux',
        'Zero dependências externas verificado no pkg.go.dev',
        'Extração limpa via stash.FromContext(r.Context())',
      ],
    },
    verifiedTech: ['Go', 'HTTP Sessions', 'Crypto', 'MIT'],
    codePreview: {
      filename: 'middleware/session.go',
      language: 'go',
      snippet: `store := stash.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))
mux.Handle("/account", store.Middleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    s := stash.FromContext(r.Context())
    s.Set("authenticated", true)
})))`,
    },
  },
  {
    repoName: 'oche',
    category: 'framework',
    accentHex: '#38BDF8',
    visualKind: 'oche-dart',
    roleLabel: {
      en: '05 / Server-Side Dart Framework',
      pt: '05 / Framework Server-Side em Dart',
    },
    tagline: {
      en: 'Express-style routing, JWT, webhooks & Blade templates over dart:io.',
      pt: 'Roteamento estilo Express, JWT, webhooks e templates sobre dart:io.',
    },
    architectureSummary: {
      en: 'Minimalist server-side framework bringing familiar Node/Express handler ergonomics into typed Dart.',
      pt: 'Framework minimalista no servidor que traz a ergonomia de handlers e middlewares do Express para Dart tipado.',
    },
    highlights: {
      en: [
        'Typed (Request req, Response res) async handlers',
        'Built-in CORS, logger, session, and JWT middleware',
        'Structured HttpError exceptions & webhook dispatch',
      ],
      pt: [
        'Handlers assíncronos tipados (Request req, Response res)',
        'Middlewares integrados de CORS, logger, sessão e JWT',
        'Exceções HttpError estruturadas e suporte a webhooks',
      ],
    },
    verifiedTech: ['Dart', 'dart:io', 'JWT', 'Middleware', 'Webhooks'],
    codePreview: {
      filename: 'bin/server.dart',
      language: 'dart',
      snippet: `final app = Oche()..use(Oche.json())..use(Oche.logger());

app.get('/status', (req, res) => res.json({
  'runtime': 'dart:io',
  'framework': 'oche',
}));

await app.listen(3000);`,
    },
  },
  {
    repoName: 'clinic-api',
    category: 'api',
    accentHex: '#10B981',
    visualKind: 'clinic-rest',
    roleLabel: {
      en: '06 / Healthcare REST API',
      pt: '06 / API REST Clínica',
    },
    tagline: {
      en: 'LGPD consent-aware medical records, prescriptions & audit trails in Go.',
      pt: 'Registos clínicos, prescrições e logs de auditoria com consentimento LGPD em Go.',
    },
    architectureSummary: {
      en: 'Demonstrates Kite in a structured domain: authenticated patient endpoints, LGPD consent enforcement, prescriptions, and immutable audit logging.',
      pt: 'Demonstra o framework Kite num domínio real: endpoints autenticados de pacientes, controlo de consentimento LGPD, prescrições e auditoria.',
    },
    highlights: {
      en: [
        'JWT-protected clinical routes & role guards',
        'Explicit patient LGPD consent verification',
        'Structured prescription & audit log endpoints',
      ],
      pt: [
        'Rotas clínicas protegidas com JWT',
        'Verificação explícita de consentimento LGPD do paciente',
        'Registos de prescrições e trilhos de auditoria',
      ],
    },
    verifiedTech: ['Go', 'Kite', 'REST API', 'JWT', 'Audit Logs'],
    codePreview: {
      filename: 'routes/clinic.go',
      language: 'go',
      snippet: `patients := api.Group("/patients", auth.RequireJWT())
patients.Post("/", handlers.CreatePatientWithConsent)
patients.Get("/:id/records", handlers.GetClinicalRecords)
patients.Post("/:id/prescriptions", handlers.IssuePrescription)`,
    },
  },
];

// Kept for modal compatibility
export const FEATURED_PROJECTS_META: FeaturedProjectMeta[] =
  FEATURED_EXHIBITION;

export const TECH_STACK_ITEMS: TechItem[] = [
  // Languages
  {
    id: 'go',
    name: 'Go',
    iconKey: 'go',
    category: 'languages',
    context: {
      en: 'Standard-library web frameworks, REST APIs, CLI tools & session libraries (Kite, Stash, Clinic API, Animerse).',
      pt: 'Frameworks web sobre a stdlib, APIs REST, CLIs e bibliotecas de sessão (Kite, Stash, Clinic API, Animerse).',
    },
  },
  {
    id: 'php',
    name: 'PHP',
    iconKey: 'php',
    category: 'languages',
    context: {
      en: 'MVC architecture, multi-tenant POS systems, JWT APIs & environment tooling (Slenix, NetPOS, ChatApp, Lirien-env).',
      pt: 'Arquitetura MVC, sistemas POS multi-tenant, APIs JWT e pacotes (Slenix, NetPOS, ChatApp, Lirien-env).',
    },
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    iconKey: 'javascript',
    category: 'languages',
    context: {
      en: 'Interactive browser interfaces, lightweight e-commerce storefronts & client scripting.',
      pt: 'Interfaces interativas no navegador, lojas leves e lógica client-side.',
    },
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    iconKey: 'typescript',
    category: 'languages',
    context: {
      en: 'Strictly typed React web applications, Angular interfaces & React Native mobile codebases.',
      pt: 'Aplicações React tipadas, interfaces e código móvel em React Native.',
    },
  },
  {
    id: 'python',
    name: 'Python',
    iconKey: 'python',
    category: 'languages',
    context: {
      en: 'Automation scripts, PDF text pipelines & neural language experiments from scratch (Mini-LLM).',
      pt: 'Scripts de automação, pipelines de PDF e experiências com modelos de linguagem (Mini-LLM).',
    },
  },
  {
    id: 'html5',
    name: 'HTML',
    iconKey: 'html5',
    category: 'languages',
    context: {
      en: 'Semantic document structure, accessible landmarks & SEO foundations.',
      pt: 'Estrutura semântica, acessibilidade e base técnica de SEO.',
    },
  },
  {
    id: 'css3',
    name: 'CSS',
    iconKey: 'css3',
    category: 'languages',
    context: {
      en: 'Modern responsive grid/flex architecture, design tokens & dark editorial systems.',
      pt: 'Layouts responsivos modernos, tokens visuais e interfaces escuras.',
    },
  },

  // Frameworks
  {
    id: 'laravel',
    name: 'Laravel',
    iconKey: 'laravel',
    category: 'frameworks',
    context: {
      en: 'Full-stack PHP engineering, Eloquent ORM patterns & structured API backends.',
      pt: 'Desenvolvimento PHP full-stack, padrões Eloquent e backends estruturados.',
    },
  },
  {
    id: 'react',
    name: 'React',
    iconKey: 'react',
    category: 'frameworks',
    context: {
      en: 'Component-driven web applications, interactive UIs & WebGL/motion orchestration.',
      pt: 'Aplicações web por componentes, interfaces interativas e animação.',
    },
  },
  {
    id: 'react-native',
    name: 'React Native',
    iconKey: 'react-native',
    category: 'frameworks',
    context: {
      en: 'Cross-platform mobile apps with Expo Router, real-time GPS & native integrations (SOS Mobile).',
      pt: 'Aplicações móveis multiplataforma com Expo Router e GPS em tempo real (SOS Mobile).',
    },
  },

  // Databases
  {
    id: 'mysql',
    name: 'MySQL',
    iconKey: 'mysql',
    category: 'databases',
    context: {
      en: 'Relational modeling for multi-tenant POS inventories, e-commerce & Go/PHP APIs.',
      pt: 'Modelação relacional para inventários POS multi-tenant, e-commerce e APIs Go/PHP.',
    },
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    iconKey: 'sqlite',
    category: 'databases',
    context: {
      en: 'Zero-config embedded SQL persistence for self-contained Go & PHP services.',
      pt: 'Persistência SQL embutida e leve para serviços autónomos em Go e PHP.',
    },
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    iconKey: 'postgresql',
    category: 'databases',
    context: {
      en: 'ACID transactions, structured relational schemas & reliable backend storage.',
      pt: 'Transações ACID, esquemas relacionais robustos e integridade de dados.',
    },
  },

  // Tools
  {
    id: 'git',
    name: 'Git',
    iconKey: 'git',
    category: 'tools',
    context: {
      en: 'Version control, clean branching models & collaborative release workflows.',
      pt: 'Controlo de versões, organização de branches e fluxo de releases.',
    },
  },
  {
    id: 'github',
    name: 'GitHub',
    iconKey: 'github',
    category: 'tools',
    context: {
      en: 'Open-source package hosting, documentation & 26 public repositories.',
      pt: 'Publicação open source, documentação e 26 repositórios públicos.',
    },
  },
  {
    id: 'postman',
    name: 'Postman',
    iconKey: 'postman',
    category: 'tools',
    context: {
      en: 'Endpoint verification, JWT bearer flows & REST contract testing.',
      pt: 'Validação de endpoints, fluxos JWT e testes de contratos REST.',
    },
  },

  // APIs
  {
    id: 'rest-apis',
    name: 'REST API development',
    iconKey: 'rest',
    category: 'tools', // grouped neatly in UI under APIs
    context: {
      en: 'Resource design, status semantics, rate-safe middleware & stateless JWT authentication.',
      pt: 'Desenho de recursos, semântica HTTP, middlewares e autenticação JWT stateless.',
    },
  },

  // Operating Systems
  {
    id: 'linux',
    name: 'Linux',
    iconKey: 'linux',
    category: 'os',
    context: {
      en: 'Primary engineering environment, shell workflows, Go/PHP compilation & server deployments.',
      pt: 'Ambiente principal de desenvolvimento, terminal, compilação e servidores.',
    },
  },
  {
    id: 'windows',
    name: 'Windows',
    iconKey: 'windows',
    category: 'os',
    context: {
      en: 'Cross-platform compatibility validation & local tooling.',
      pt: 'Validação multiplataforma e compatibilidade de ferramentas.',
    },
  },
  {
    id: 'macos',
    name: 'macOS',
    iconKey: 'macos',
    category: 'os',
    context: {
      en: 'Unix-compatible development & mobile simulator testing.',
      pt: 'Ambiente Unix e testes em simuladores móveis.',
    },
  },
];

export const LANGUAGE_COLORS: Record<string, string> = {
  Go: '#00ADD8',
  PHP: '#818CF8',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Dart: '#38BDF8',
  Python: '#EAB308',
  CSS: '#6366F1',
  HTML: '#F97316',
};
