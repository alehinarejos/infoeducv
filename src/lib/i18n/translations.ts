export type Language = 'es' | 'va' | 'en';

export interface Translations {
  nav: {
    searchSchools: string;
    home: string;
    language: string;
    selectLanguage: string;
  };
  hero: {
    title1: string;
    title2: string;
    subtitle: string;
  };
  search: {
    centerPlaceholder: string;
    zipPlaceholder: string;
    locating: string;
    locationActive: string;
    myLocation: string;
    shareTitle: string;
    shareText: string;
    linkCopied: string;
    geoNotSupported: string;
    geoError: string;
    listView: string;
    mapView: string;
    loadingMap: string;
  };
  filters: {
    centerType: string;
    all: string;
    public: string;
    private: string;
    concerted: string;
    privateAndConcerted: string;
    province: string;
    allProvinces: string;
    educationLevel: string;
    allLevels: string;
    schoolType: string;
    allSchoolTypes: string;
    fpCycleName: string;
    fpCyclePlaceholder: string;
    fpFamily: string;
    allFamilies: string;
    fpGrade: string;
    allGrades: string;
    clearFilters: string;
    clearFilterSingular: string;
    clearFilterPlural: string;
  };
  levels: {
    infantil: string;
    primaria: string;
    eso: string;
    bachillerato: string;
    fp: string;
    fpShort: string;
  };
  fpGrades: {
    basica: string;
    medio: string;
    superior: string;
  };
  provinces: {
    alicante: string;
    castellon: string;
    valencia: string;
  };
  cards: {
    ownWebsite: string;
    location: string;
    exploreCenter: string;
    openWebsite: string;
    openOfficialWeb: string;
    noCentersFound: string;
    tryChangingFilters: string;
    loadMoreCenters: string;
    showingCentersCount: string;
  };
  centerDetail: {
    backToSearch: string;
    code: string;
    unspecified: string;
    centerLocation: string;
    openInGoogleMaps: string;
    openInMaps: string;
    address: string;
    phone: string;
    officialWebsite: string;
    gvaPortal: string;
    gvaCard: string;
    ownWebsiteBadge: string;
    alsoSeeGvaCard: string;
    educationalOffer: string;
    levelsAvailable: string;
    levelsAvailableSubtitle: string;
    modalities: string;
    modalitiesDesc: string;
    scienceTech: string;
    humanitiesSocial: string;
    artsGeneral: string;
    noFpDetails: string;
    breadcrumbsHome: string;
    relatedSchoolsTitle: string;
    viewCenter: string;
    officialSourceNote: string;
    reviewsTitle: string;
    reviewsSubtitle: string;
    reviewsBadge: string;
    reviewsGoogleMaps: string;
    reviewsGoogleMapsDesc: string;
    reviewsSearchExperiences: string;
    reviewsSearchExperiencesDesc: string;
    reviewsOfficialGva: string;
    reviewsOfficialGvaDesc: string;
    reviewsSourceLabel: string;
    reviewsSourceForums: string;
    reviewsOpenReviews: string;
    reviewsSearchThreads: string;
    reviewsViewOfficial: string;
    reviewsDisclaimer: string;
    viewAllInMunicipality: string;
    socialMediaTitle: string;
    socialMediaSubtitle: string;
    socialMediaBadge: string;
    noSocialMediaTitle: string;
    noSocialMediaDesc: string;
    searchOnSocial: string;
    visitProfile: string;
  };
  faq: {
    badge: string;
    titlePre: string;
    titleHighlight: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  footer: {
    description: string;
    openSourceTitle: string;
    openSourceDesc: string;
    viewOnGithub: string;
    usefulLinks: string;
    searchSchools: string;
    faq: string;
    gvaOpenData: string;
    createdWith: string;
    by: string;
    mitLicense: string;
    disclaimer: string;
    legalTitle: string;
    legalNotice: string;
    privacyPolicy: string;
    cookiePolicy: string;
    cookieSettings: string;
  };
  cookiesBanner: {
    title: string;
    description: string;
    acceptAll: string;
    rejectNonEssential: string;
    customize: string;
    savePreferences: string;
    technicalTitle: string;
    technicalDesc: string;
    advertisingTitle: string;
    advertisingDesc: string;
    moreInfo: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  es: {
    nav: {
      searchSchools: "Buscar Centros",
      home: "Inicio",
      language: "Idioma",
      selectLanguage: "Seleccionar idioma"
    },
    hero: {
      title1: "Busca tu centro educativo en la",
      title2: "Comunitat Valenciana",
      subtitle: "Encuentra colegios, institutos y todos los ciclos formativos de FP de la GVA en nuestro mapa interactivo y listado inteligente."
    },
    search: {
      centerPlaceholder: "Buscar centro...",
      zipPlaceholder: "Código postal",
      locating: "Localizando...",
      locationActive: "Ubicación activa",
      myLocation: "Mi ubicación",
      shareTitle: "Compartir esta búsqueda",
      shareText: "Mira esta búsqueda de centros educativos en InfoEdu CV",
      linkCopied: "¡Enlace de tu búsqueda copiado al portapapeles!",
      geoNotSupported: "Tu navegador no soporta geolocalización.",
      geoError: "Error al obtener la ubicación. Por favor, asegúrate de haber dado permiso de ubicación a la página web.",
      listView: "Vista de lista",
      mapView: "Vista de mapa",
      loadingMap: "Cargando mapa..."
    },
    filters: {
      centerType: "Centro:",
      all: "Todos",
      public: "Público",
      private: "Privado",
      concerted: "Concertado",
      privateAndConcerted: "Privado y Concertado",
      province: "Provincia",
      allProvinces: "Todas las provincias",
      educationLevel: "Nivel Educativo",
      allLevels: "Todos los niveles",
      schoolType: "Centro Público / Privado",
      allSchoolTypes: "Público y Privado (Todos)",
      fpCycleName: "Nombre del ciclo",
      fpCyclePlaceholder: "Ej: Desarrollo Web",
      fpFamily: "Familia",
      allFamilies: "Todas",
      fpGrade: "Nivel FP",
      allGrades: "Todos",
      clearFilters: "Eliminar",
      clearFilterSingular: "filtro",
      clearFilterPlural: "filtros"
    },
    levels: {
      infantil: "Infantil",
      primaria: "Primaria",
      eso: "ESO",
      bachillerato: "Bachillerato",
      fp: "Formación Profesional",
      fpShort: "Form. Profesional"
    },
    fpGrades: {
      basica: "FP Básica",
      medio: "Grado Medio",
      superior: "Grado Superior"
    },
    provinces: {
      alicante: "Alicante",
      castellon: "Castellón",
      valencia: "Valencia"
    },
    cards: {
      ownWebsite: "Web Propia",
      location: "Ubicación",
      exploreCenter: "Explorar centro",
      openWebsite: "Abrir web oficial del centro",
      openOfficialWeb: "Abrir web / ficha oficial",
      noCentersFound: "No se encontraron centros",
      tryChangingFilters: "Prueba a cambiar los filtros de búsqueda.",
      loadMoreCenters: "Cargar más centros",
      showingCentersCount: "Mostrando {shown} de {total} centros"
    },
    centerDetail: {
      backToSearch: "Volver al buscador",
      code: "CÓDIGO:",
      unspecified: "Sin especificar",
      centerLocation: "Ubicación del centro",
      openInGoogleMaps: "Abrir en Google Maps",
      openInMaps: "Abrir en Maps",
      address: "Dirección",
      phone: "Teléfono",
      officialWebsite: "Sitio Web Oficial del Centro",
      gvaPortal: "Web del Centro (Portal GVA)",
      gvaCard: "Ficha Oficial del Centro (GVA)",
      ownWebsiteBadge: "Web Propia",
      alsoSeeGvaCard: "Ver también Ficha Oficial en Conselleria (GVA)",
      educationalOffer: "Oferta Educativa",
      levelsAvailable: "niveles",
      levelsAvailableSubtitle: "Niveles formativos disponibles en este centro educativo.",
      modalities: "Modalidades",
      modalitiesDesc: "Consulta directamente con el centro qué modalidades oferta este curso académico:",
      scienceTech: "Ciencias y Tecnología",
      humanitiesSocial: "Humanidades y Ciencias Sociales",
      artsGeneral: "Artes / General",
      noFpDetails: "No hay detalles de ciclos formativos disponibles para este centro.",
      breadcrumbsHome: "Inicio",
      relatedSchoolsTitle: "Otros centros educativos en",
      viewCenter: "Ver centro",
      officialSourceNote: "Datos oficiales de la Generalitat Valenciana (GVA) y Conselleria d'Educació.",
      reviewsTitle: "Opiniones y Reputación del Centro",
      reviewsSubtitle: "Consulta valoraciones públicas, experiencias y puntuaciones reales de familias y alumnos.",
      reviewsBadge: "Reputación y Experiencias",
      reviewsGoogleMaps: "Ver opiniones en Google Maps",
      reviewsGoogleMapsDesc: "Puntuación de estrellas y reseñas de la comunidad en Google Business.",
      reviewsSearchExperiences: "Buscar experiencias en la red",
      reviewsSearchExperiencesDesc: "Foros educativos, testimonios y debates públicos de familias.",
      reviewsOfficialGva: "Ficha oficial de Conselleria (GVA)",
      reviewsOfficialGvaDesc: "Registro administrativo oficial y oferta formativa verificada.",
      reviewsSourceLabel: "Fuente:",
      reviewsSourceForums: "Foros y Web",
      reviewsOpenReviews: "Abrir reseñas",
      reviewsSearchThreads: "Buscar debates",
      reviewsViewOfficial: "Ver ficha oficial",
      reviewsDisclaimer: "InfoEdu CV no aloja opiniones de texto libre de forma directa para proteger la privacidad de los usuarios (RGPD) y garantizar que las valoraciones provengan de fuentes públicas transparentes y contrastadas.",
      viewAllInMunicipality: "Ver todos en",
      socialMediaTitle: "Redes Sociales del Centro",
      socialMediaSubtitle: "Canales oficiales de comunicación y perfiles sociales verificados",
      socialMediaBadge: "Comunidad y Redes",
      noSocialMediaTitle: "Sin redes sociales oficiales registradas",
      noSocialMediaDesc: "Este centro docente no dispone de perfiles en redes sociales enlazados en el registro oficial o en su ficha actual.",
      searchOnSocial: "Buscar perfiles en Google",
      visitProfile: "Visitar perfil"
    },
    faq: {
      badge: "Preguntas Frecuentes",
      titlePre: "Todo lo que necesitas saber sobre",
      titleHighlight: "InfoEdu CV",
      items: [
        {
          question: "¿Cómo puedo encontrar un colegio específico en la Comunitat Valenciana?",
          answer: "Puedes usar nuestro buscador avanzado en la parte superior. Solo tienes que escribir el nombre del centro, el municipio o incluso el código postal. También puedes filtrar por provincia (Valencia, Alicante o Castellón) para acotar los resultados."
        },
        {
          question: "¿Qué tipos de centros educativos aparecen en InfoEdu CV?",
          answer: "En nuestra plataforma encontrarás todos los centros registrados en la Generalitat Valenciana (GVA), incluyendo colegios públicos, concertados y privados, así como institutos de secundaria y centros integrados de Formación Profesional (CIPFP)."
        },
        {
          question: "¿Está actualizada la información de los ciclos de FP?",
          answer: "Sí, utilizamos datos abiertos de la GVA que incluyen la oferta completa de ciclos de Grado Básico, Medio y Superior. Puedes buscar por familia profesional o por el nombre del ciclo específico para ver qué centros lo imparten este curso."
        },
        {
          question: "¿Cómo puedo ver la ubicación exacta de un centro?",
          answer: "Cada centro tiene una ficha detallada con su dirección y un mapa interactivo. Además, desde el buscador principal puedes cambiar a la 'Vista de Mapa' para ver todos los centros geolocalizados en tu zona."
        }
      ]
    },
    footer: {
      description: "Una plataforma independiente y de alto rendimiento diseñada para facilitar la búsqueda interactiva, visual e inteligente de colegios, institutos y ciclos formativos de Formación Profesional en la Comunitat Valenciana. Accede a datos oficiales de forma fluida y ágil.",
      openSourceTitle: "Código Abierto (Open Source)",
      openSourceDesc: "InfoEdu CV es un proyecto 100% de código abierto. Creemos firmemente en el software libre para mejorar el acceso a los servicios públicos de educación. Todo el desarrollo y los datos son transparentes.",
      viewOnGithub: "Ver en GitHub",
      usefulLinks: "Enlaces Útiles",
      searchSchools: "Buscar Centros",
      faq: "Preguntas Frecuentes",
      gvaOpenData: "GVA Dades Obertes",
      createdWith: "InfoEdu CV. Creado con",
      by: "por",
      mitLicense: "Licencia MIT.",
      disclaimer: "Este portal no tiene vinculación oficial con la Generalitat Valenciana. Los datos expuestos provienen de portales de datos abiertos de la GVA.",
      legalTitle: "Legalidad y Privacidad",
      legalNotice: "Aviso Legal",
      privacyPolicy: "Política de Privacidad",
      cookiePolicy: "Política de Cookies",
      cookieSettings: "Configuración de Cookies"
    },
    cookiesBanner: {
      title: "Configuración de Cookies y Privacidad",
      description: "En InfoEdu CV utilizamos cookies propias (técnicas para recordar tu idioma y tema) y de terceros (Google AdSense) para financiar el servicio y mostrar anuncios. Puedes aceptar todas las cookies, rechazarlas o configurar tus preferencias.",
      acceptAll: "Aceptar todas",
      rejectNonEssential: "Rechazar no esenciales",
      customize: "Personalizar",
      savePreferences: "Guardar preferencias",
      technicalTitle: "Cookies Técnicas y Funcionales",
      technicalDesc: "Imprescindibles para el correcto funcionamiento del sitio (recordar tu preferencia de idioma, tema claro/oscuro y estado de consentimiento). Siempre activas.",
      advertisingTitle: "Cookies Publicitarias (Google AdSense)",
      advertisingDesc: "Permiten mostrar anuncios publicitarios para financiar los costes de mantenimiento del buscador. Si las desactivas, se mostrarán anuncios genéricos no personalizados.",
      moreInfo: "Más información en nuestra",
      close: "Cerrar"
    }
  },
  va: {
    nav: {
      searchSchools: "Cercar Centres",
      home: "Inici",
      language: "Idioma",
      selectLanguage: "Seleccionar idioma"
    },
    hero: {
      title1: "Busca el teu centre educatiu a la",
      title2: "Comunitat Valenciana",
      subtitle: "Troba col·legis, instituts i tots els cicles formatius d'FP de la GVA al nostre mapa interactiu i llistat intel·ligent."
    },
    search: {
      centerPlaceholder: "Cercar centre...",
      zipPlaceholder: "Codi postal",
      locating: "Localitzant...",
      locationActive: "Ubicació activa",
      myLocation: "La meua ubicació",
      shareTitle: "Compartir esta cerca",
      shareText: "Mira esta cerca de centres educatius a InfoEdu CV",
      linkCopied: "Enllaç de la cerca copiat al porta-retalls!",
      geoNotSupported: "El teu navegador no admet geolocalització.",
      geoError: "Error en obtindre la ubicació. Per favor, assegura't d'haver donat permís d'ubicació al lloc web.",
      listView: "Vista de llista",
      mapView: "Vista de mapa",
      loadingMap: "Carregant mapa..."
    },
    filters: {
      centerType: "Centre:",
      all: "Tots",
      public: "Públic",
      private: "Privat",
      concerted: "Concertat",
      privateAndConcerted: "Privat i Concertat",
      province: "Província",
      allProvinces: "Totes les províncies",
      educationLevel: "Nivell Educatiu",
      allLevels: "Tots els nivells",
      schoolType: "Centre Públic / Privat",
      allSchoolTypes: "Públic i Privat (Tots)",
      fpCycleName: "Nom del cicle",
      fpCyclePlaceholder: "Ex: Desenvolupament Web",
      fpFamily: "Família",
      allFamilies: "Totes",
      fpGrade: "Nivell FP",
      allGrades: "Tots",
      clearFilters: "Eliminar",
      clearFilterSingular: "filtre",
      clearFilterPlural: "filtres"
    },
    levels: {
      infantil: "Infantil",
      primaria: "Primària",
      eso: "ESO",
      bachillerato: "Batxillerat",
      fp: "Formació Professional",
      fpShort: "Form. Professional"
    },
    fpGrades: {
      basica: "FP Bàsica",
      medio: "Grau Mitjà",
      superior: "Grau Superior"
    },
    provinces: {
      alicante: "Alacant",
      castellon: "Castelló",
      valencia: "València"
    },
    cards: {
      ownWebsite: "Web Pròpia",
      location: "Ubicació",
      exploreCenter: "Explorar centre",
      openWebsite: "Obrir web oficial del centre",
      openOfficialWeb: "Obrir web / fitxa oficial",
      noCentersFound: "No s'han trobat centres",
      tryChangingFilters: "Prova a canviar els filtres de cerca.",
      loadMoreCenters: "Carregar més centres",
      showingCentersCount: "Mostrant {shown} de {total} centres"
    },
    centerDetail: {
      backToSearch: "Tornar al cercador",
      code: "CODI:",
      unspecified: "Sense especificar",
      centerLocation: "Ubicació del centre",
      openInGoogleMaps: "Obrir a Google Maps",
      openInMaps: "Obrir a Maps",
      address: "Adreça",
      phone: "Telèfon",
      officialWebsite: "Lloc Web Oficial del Centre",
      gvaPortal: "Web del Centre (Portal GVA)",
      gvaCard: "Fitxa Oficial del Centre (GVA)",
      ownWebsiteBadge: "Web Pròpia",
      alsoSeeGvaCard: "Veure també Fitxa Oficial a Conselleria (GVA)",
      educationalOffer: "Oferta Educativa",
      levelsAvailable: "nivells",
      levelsAvailableSubtitle: "Nivells formatius disponibles en este centre educatiu.",
      modalities: "Modalitats",
      modalitiesDesc: "Consulta directament amb el centre quines modalitats oferta este curs acadèmic:",
      scienceTech: "Ciències i Tecnologia",
      humanitiesSocial: "Humanitats i Ciències Socials",
      artsGeneral: "Arts / General",
      noFpDetails: "No hi ha detalls de cicles formatius disponibles per a este centre.",
      breadcrumbsHome: "Inici",
      relatedSchoolsTitle: "Altres centres educatius a",
      viewCenter: "Veure centre",
      officialSourceNote: "Dades oficials de la Generalitat Valenciana (GVA) i Conselleria d'Educació.",
      reviewsTitle: "Opinions i Reputació del Centre",
      reviewsSubtitle: "Consulta valoracions públiques, experiències i puntuacions reals de famílies i alumnes.",
      reviewsBadge: "Reputació i Experiències",
      reviewsGoogleMaps: "Veure opinions a Google Maps",
      reviewsGoogleMapsDesc: "Puntuació d'estreles i ressenyes de la comunitat a Google Business.",
      reviewsSearchExperiences: "Cercar experiències a la xarxa",
      reviewsSearchExperiencesDesc: "Fòrums educatius, testimonis i debats públics de famílies.",
      reviewsOfficialGva: "Fitxa oficial de Conselleria (GVA)",
      reviewsOfficialGvaDesc: "Registre administratiu oficial i oferta formativa verificada.",
      reviewsSourceLabel: "Font:",
      reviewsSourceForums: "Fòrums i Web",
      reviewsOpenReviews: "Obrir ressenyes",
      reviewsSearchThreads: "Cercar debats",
      reviewsViewOfficial: "Veure fitxa oficial",
      reviewsDisclaimer: "InfoEdu CV no allotja opinions de text lliure de manera directa per a protegir la privacitat dels usuaris (RGPD) i garantir que les valoracions provenen de fonts públiques transparents i contrastades.",
      viewAllInMunicipality: "Veure tots a",
      socialMediaTitle: "Xarxes Socials del Centre",
      socialMediaSubtitle: "Canals oficials de comunicació i perfils socials verificats",
      socialMediaBadge: "Comunitat i Xarxes",
      noSocialMediaTitle: "Sense xarxes socials oficials registrades",
      noSocialMediaDesc: "Este centre educatiu no disposa de perfils en xarxes socials enllaçats en el registre oficial o en la seua fitxa actual.",
      searchOnSocial: "Cercar perfils a Google",
      visitProfile: "Visitar perfil"
    },
    faq: {
      badge: "Preguntes Freqüents",
      titlePre: "Tot el que necessites saber sobre",
      titleHighlight: "InfoEdu CV",
      items: [
        {
          question: "Com puc trobar un col·legi específic a la Comunitat Valenciana?",
          answer: "Pots utilitzar el nostre cercador avançat a la part superior. Només has d'escriure el nom del centre, el municipi o el codi postal. També pots filtrar per província (València, Alacant o Castelló) per acotar els resultats."
        },
        {
          question: "Quins tipus de centres educatius apareixen a InfoEdu CV?",
          answer: "A la nostra plataforma trobaràs tots els centres registrats a la Generalitat Valenciana (GVA), incloent col·legis públics, concertats i privats, així com instituts de secundària i centres integrats de Formació Professional (CIPFP)."
        },
        {
          question: "Està actualitzada la informació dels cicles d'FP?",
          answer: "Sí, fem servir dades obertes de la GVA que inclouen l'oferta completa de cicles de Grau Bàsic, Mitjà i Superior. Pots cercar per família professional o pel nom del cicle específic per a veure quins centres l'imparteixen este curs."
        },
        {
          question: "Com puc vore la ubicació exacta d'un centre?",
          answer: "Cada centre compta amb una fitxa detallada amb la seua adreça i un mapa interactiu. A més, des del cercador principal pots canviar a la 'Vista de Mapa' per a vore tots els centres geolocalitzats a la teua zona."
        }
      ]
    },
    footer: {
      description: "Una plataforma independent i d'alt rendiment dissenyada per a facilitar la cerca interactiva, visual i intel·ligent de col·legis, instituts i cicles formatius de Formació Professional a la Comunitat Valenciana. Accedeix a dades oficials de manera fluida i àgil.",
      openSourceTitle: "Codi Obert (Open Source)",
      openSourceDesc: "InfoEdu CV és un projecte 100% de codi obert. Creiem fermament en el programari lliure per a millorar l'accés als serveis públics d'educació. Tot el desenvolupament i les dades són transparents.",
      viewOnGithub: "Veure a GitHub",
      usefulLinks: "Enllaços Útils",
      searchSchools: "Cercar Centres",
      faq: "Preguntes Freqüents",
      gvaOpenData: "GVA Dades Obertes",
      createdWith: "InfoEdu CV. Creat amb",
      by: "per",
      mitLicense: "Llicència MIT.",
      disclaimer: "Este portal no té vinculació oficial amb la Generalitat Valenciana. Les dades exposades provenen de portals de dades obertes de la GVA.",
      legalTitle: "Legalitat i Privacitat",
      legalNotice: "Avís Legal",
      privacyPolicy: "Política de Privacitat",
      cookiePolicy: "Política de Cookies",
      cookieSettings: "Configuració de Cookies"
    },
    cookiesBanner: {
      title: "Configuració de Cookies i Privacitat",
      description: "A InfoEdu CV utilitzem cookies pròpies (tècniques per a recordar el teu idioma i tema) i de tercers (Google AdSense) per a finançar el servici i mostrar anuncis. Pots acceptar totes les cookies, rebutjar-les o configurar les teues preferències.",
      acceptAll: "Acceptar totes",
      rejectNonEssential: "Rebutjar no essencials",
      customize: "Personalitzar",
      savePreferences: "Guardar preferències",
      technicalTitle: "Cookies Tècniques i Funcionals",
      technicalDesc: "Imprescindibles per al funcionament correcte del lloc web (recordar la teua preferència d'idioma, tema clar/fosc i estat de consentiment). Sempre actives.",
      advertisingTitle: "Cookies Publicitàries (Google AdSense)",
      advertisingDesc: "Permeten mostrar anuncis publicitaris per a finançar els costos de manteniment del cercador. Si les desactives, es mostraran anuncis genèrics no personalitzats.",
      moreInfo: "Més informació a la nostra",
      close: "Tancar"
    }
  },
  en: {
    nav: {
      searchSchools: "Search Schools",
      home: "Home",
      language: "Language",
      selectLanguage: "Select language"
    },
    hero: {
      title1: "Find your educational center in the",
      title2: "Valencian Community",
      subtitle: "Find schools, high schools, and all vocational training (VET/FP) programs in the Valencian Community on our interactive map and smart directory."
    },
    search: {
      centerPlaceholder: "Search school or center...",
      zipPlaceholder: "Postal code",
      locating: "Locating...",
      locationActive: "Location active",
      myLocation: "My location",
      shareTitle: "Share this search",
      shareText: "Check out this search for schools on InfoEdu CV",
      linkCopied: "Search link copied to clipboard!",
      geoNotSupported: "Your browser does not support geolocation.",
      geoError: "Error retrieving location. Please make sure location permissions are enabled for this website.",
      listView: "List view",
      mapView: "Map view",
      loadingMap: "Loading map..."
    },
    filters: {
      centerType: "School:",
      all: "All",
      public: "Public",
      private: "Private",
      concerted: "Charter / Subsidized",
      privateAndConcerted: "Private & Charter",
      province: "Province",
      allProvinces: "All provinces",
      educationLevel: "Education Level",
      allLevels: "All levels",
      schoolType: "Public / Private Institution",
      allSchoolTypes: "Public & Private (All)",
      fpCycleName: "VET/FP Program name",
      fpCyclePlaceholder: "e.g.: Web Development",
      fpFamily: "Family / Field",
      allFamilies: "All",
      fpGrade: "VET Grade",
      allGrades: "All",
      clearFilters: "Clear",
      clearFilterSingular: "filter",
      clearFilterPlural: "filters"
    },
    levels: {
      infantil: "Preschool / Kindergarten",
      primaria: "Primary School",
      eso: "Secondary School (ESO)",
      bachillerato: "High School (Baccalaureate)",
      fp: "Vocational Training (VET/FP)",
      fpShort: "Vocational (FP)"
    },
    fpGrades: {
      basica: "Basic VET",
      medio: "Intermediate VET",
      superior: "Higher VET"
    },
    provinces: {
      alicante: "Alicante",
      castellon: "Castellón",
      valencia: "Valencia"
    },
    cards: {
      ownWebsite: "Official Website",
      location: "Location",
      exploreCenter: "Explore school",
      openWebsite: "Open school's official website",
      openOfficialWeb: "Open website / official profile",
      noCentersFound: "No schools found",
      tryChangingFilters: "Try adjusting your search filters.",
      loadMoreCenters: "Load more schools",
      showingCentersCount: "Showing {shown} of {total} schools"
    },
    centerDetail: {
      backToSearch: "Back to search",
      code: "CODE:",
      unspecified: "Unspecified",
      centerLocation: "School Location",
      openInGoogleMaps: "Open in Google Maps",
      openInMaps: "Open in Maps",
      address: "Address",
      phone: "Phone",
      officialWebsite: "School's Official Website",
      gvaPortal: "School Web (GVA Portal)",
      gvaCard: "Official GVA School Profile",
      ownWebsiteBadge: "Official Website",
      alsoSeeGvaCard: "Also view Official Profile in Conselleria (GVA)",
      educationalOffer: "Educational Programs",
      levelsAvailable: "levels",
      levelsAvailableSubtitle: "Educational levels taught at this school.",
      modalities: "High School Tracks",
      modalitiesDesc: "Check directly with the school which tracks are offered this academic year:",
      scienceTech: "Science & Technology",
      humanitiesSocial: "Humanities & Social Sciences",
      artsGeneral: "Arts / General",
      noFpDetails: "No specific vocational training cycles listed for this school.",
      breadcrumbsHome: "Home",
      relatedSchoolsTitle: "Other educational institutions in",
      viewCenter: "View school",
      officialSourceNote: "Official data from Generalitat Valenciana (GVA) and Conselleria d'Educació.",
      reviewsTitle: "Reviews & School Reputation",
      reviewsSubtitle: "Check public ratings, experiences, and authentic feedback from families and students.",
      reviewsBadge: "Reputation & Experiences",
      reviewsGoogleMaps: "View reviews on Google Maps",
      reviewsGoogleMapsDesc: "Star ratings and community reviews on Google Business profile.",
      reviewsSearchExperiences: "Search experiences online",
      reviewsSearchExperiencesDesc: "Educational forums, testimonials, and public community discussions.",
      reviewsOfficialGva: "Official Conselleria Profile (GVA)",
      reviewsOfficialGvaDesc: "Official administrative registry and verified educational programs.",
      reviewsSourceLabel: "Source:",
      reviewsSourceForums: "Forums & Web",
      reviewsOpenReviews: "Open reviews",
      reviewsSearchThreads: "Search discussions",
      reviewsViewOfficial: "View official profile",
      reviewsDisclaimer: "InfoEdu CV does not directly host user comments to protect user privacy (GDPR) and ensure reviews come from transparent and verified public platforms.",
      viewAllInMunicipality: "View all in",
      socialMediaTitle: "School Social Networks",
      socialMediaSubtitle: "Official communication channels and verified social profiles",
      socialMediaBadge: "Community & Social",
      noSocialMediaTitle: "No official social media registered",
      noSocialMediaDesc: "This educational center does not currently have official social media accounts linked.",
      searchOnSocial: "Search profiles on Google",
      visitProfile: "Visit profile"
    },
    faq: {
      badge: "Frequently Asked Questions",
      titlePre: "Everything you need to know about",
      titleHighlight: "InfoEdu CV",
      items: [
        {
          question: "How can I find a specific school in the Valencian Community?",
          answer: "You can use our advanced search at the top. Simply type the school's name, municipality, or postal code. You can also filter by province (Valencia, Alicante, or Castellón) to narrow down your results."
        },
        {
          question: "What types of educational centers are listed in InfoEdu CV?",
          answer: "Our platform includes all schools and colleges registered with the Generalitat Valenciana (GVA), including public, subsidized charter ('concertado'), and private schools, as well as secondary high schools and integrated vocational training centers (CIPFP)."
        },
        {
          question: "Is the vocational training (VET/FP) information up to date?",
          answer: "Yes, we use official open data from the GVA which includes the full offering of Basic, Intermediate, and Higher VET programs. You can search by professional family or by the specific program name to see where it is offered."
        },
        {
          question: "How can I check the exact location of a school?",
          answer: "Each school has a detailed profile with its full address and an interactive map. You can also switch to 'Map View' in the main search directory to see all schools geolocated in your area."
        }
      ]
    },
    footer: {
      description: "An independent, high-performance platform designed to provide an interactive, visual, and smart directory of schools, high schools, and vocational training cycles in the Valencian Community. Access official educational data seamlessly.",
      openSourceTitle: "Open Source",
      openSourceDesc: "InfoEdu CV is a 100% open-source project. We believe in free and open software to enhance access to public education services. All code and data are transparent.",
      viewOnGithub: "View on GitHub",
      usefulLinks: "Useful Links",
      searchSchools: "Search Schools",
      faq: "Frequently Asked Questions",
      gvaOpenData: "GVA Open Data",
      createdWith: "InfoEdu CV. Built with",
      by: "by",
      mitLicense: "MIT License.",
      disclaimer: "This portal is not officially affiliated with the Generalitat Valenciana. All data is sourced from GVA public open data portals.",
      legalTitle: "Legal & Privacy",
      legalNotice: "Legal Notice",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
      cookieSettings: "Cookie Settings"
    },
    cookiesBanner: {
      title: "Cookie & Privacy Settings",
      description: "At InfoEdu CV we use first-party cookies (technical, to remember your language and theme) and third-party cookies (Google AdSense) to support the service and display ads. You can accept all, reject non-essential cookies, or customize your preferences.",
      acceptAll: "Accept All",
      rejectNonEssential: "Reject Non-Essential",
      customize: "Customize",
      savePreferences: "Save Preferences",
      technicalTitle: "Technical & Functional Cookies",
      technicalDesc: "Essential for the website to function properly (language, dark/light theme, and consent state). Always active.",
      advertisingTitle: "Advertising Cookies (Google AdSense)",
      advertisingDesc: "Allows displaying advertisements to support the free hosting and maintenance of this search tool. If disabled, non-personalized generic ads will be served.",
      moreInfo: "Learn more in our",
      close: "Close"
    }
  }
};
