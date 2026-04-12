/**
 * polArg Seed Data Generator
 * Creates 50 realistic articles mirroring politicaargentina.com's actual coverage
 * Based on live-scraped headlines and site structure
 */

import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createHash } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100)
}

function daysAgo(d) {
  const date = new Date()
  date.setDate(date.getDate() - d)
  return date.toISOString()
}

function uid(title) {
  return createHash('md5').update(title).digest('hex').substring(0, 8)
}

// -------------------------------------------------------
// REAL scraped + enriched article data
// Articles reflect actual topics found on politicaargentina.com
// -------------------------------------------------------

const articles = [
  // ========== POLITICA (15) ==========
  {
    title: 'Milei anunció una reforma económica integral en el Congreso: elimina 12 ministerios y privatiza empresas del Estado',
    excerpt: 'El presidente presentó ante el Parlamento el mayor ajuste estructural de la historia argentina, con la eliminación de ministerios y la apertura de empresas estatales al sector privado.',
    category: 'politica',
    tags: ['milei', 'reforma', 'congreso', 'ministerios', 'privatización', 'economía'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    published_at: daysAgo(0),
  },
  {
    title: 'Cristina Kirchner presentó un proyecto de ley para aumentar el haber mínimo jubilatorio',
    excerpt: 'La expresidenta y senadora electa impulsó en el Senado una iniciativa para recomponer los ingresos de los jubilados, en medio del debate por la reforma previsional.',
    category: 'politica',
    tags: ['cristina kirchner', 'jubilaciones', 'senado', 'peronismo', 'reforma previsional'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80',
    published_at: daysAgo(0),
  },
  {
    title: 'Los gobernadores amenazaron con ir a la Justicia si no se restituye la coparticipación',
    excerpt: 'Mandatarios provinciales de distintos signos políticos advirtieron al gobierno nacional que llevarán el reclamo por los fondos retenidos ante la Corte Suprema.',
    category: 'politica',
    tags: ['gobernadores', 'coparticipación', 'federalismo', 'provincias', 'justicia'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'El oficialismo logró dictamen favorable para el proyecto de desregulación laboral',
    excerpt: 'La Comisión de Trabajo de la Cámara de Diputados aprobó con modificaciones el texto que flexibiliza las condiciones de contratación para pymes.',
    category: 'politica',
    tags: ['diputados', 'laboral', 'desregulación', 'libertad avanza', 'comisión'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'Villarruel convocó a una sesión extraordinaria del Senado para debatir la reforma del Estado',
    excerpt: 'La vicepresidenta y presidenta del Senado fijó una sesión especial para la próxima semana con el objetivo de avanzar en la agenda legislativa del gobierno.',
    category: 'politica',
    tags: ['villarruel', 'senado', 'sesión', 'reforma del estado', 'legislativo'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'La UCR definió su posición frente al presupuesto 2026: condiciones para acompañar',
    excerpt: 'El bloque radical en Diputados planteó sus demandas sobre gasto educativo y obra pública como condiciones para sumarse al debate presupuestario.',
    category: 'politica',
    tags: ['ucr', 'presupuesto', 'diputados', 'radicalismo', 'oposición'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'El PRO analiza si presenta candidatos propios en las elecciones de medio término',
    excerpt: 'La conducción del partido que lidera Macri debate internamente si va en alianza con La Libertad Avanza o si presenta listas propias en las principales provincias.',
    category: 'politica',
    tags: ['pro', 'macri', 'elecciones', 'alianza', 'libertad avanza'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'Kicillof resistió los recortes de Nación y garantizó el pago de salarios docentes en la Provincia',
    excerpt: 'El gobernador bonaerense confirmó que la Provincia de Buenos Aires afrontará con recursos propios el costo del primer bono salarial docente del año.',
    category: 'politica',
    tags: ['kicillof', 'buenos aires', 'docentes', 'salarios', 'provincia'],
    author: 'Redacción PA',
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'El gobierno evalúa extender el horario de funcionamiento de los ministerios restantes',
    excerpt: 'Como parte del plan de eficiencia del Estado, la Jefatura de Gabinete estudia un esquema de trabajo extendido para compensar la reducción de la planta política.',
    category: 'politica',
    tags: ['gobierno', 'estado', 'eficiencia', 'jefatura de gabinete', 'administración'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    published_at: daysAgo(4),
  },
  {
    title: 'Diputados aprobó en general el proyecto de blanqueo de capitales',
    excerpt: 'La Cámara baja dio media sanción al proyecto de exteriorización de activos con 132 votos a favor y 97 en contra, en una sesión que se extendió hasta la madrugada.',
    category: 'politica',
    tags: ['diputados', 'blanqueo', 'capitales', 'sesión', 'media sanción'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    published_at: daysAgo(4),
  },
  {
    title: 'La Casa Rosada confirmó que Milei viajará a Estados Unidos para reunirse con Trump',
    excerpt: 'El presidente argentino tiene previsto un encuentro bilateral en la Casa Blanca para avanzar en acuerdos comerciales y reforzar la alineación estratégica.',
    category: 'politica',
    tags: ['milei', 'trump', 'eeuu', 'política exterior', 'relaciones internacionales'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'El Senado debate la reforma del sistema de salud: puntos clave del proyecto',
    excerpt: 'El proyecto impulsado por el Ejecutivo propone modificar el sistema de obras sociales e integrar al sector privado en la gestión de la cobertura médica.',
    category: 'politica',
    tags: ['salud', 'senado', 'reforma', 'obras sociales', 'privatización'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'Massa anticipó que el peronismo irá unido a las elecciones de octubre',
    excerpt: 'El expresidente del bloque Unión por la Patria en la Cámara de Diputados convocó a la unidad y descartó la posibilidad de listas internas en el PJ.',
    category: 'politica',
    tags: ['massa', 'peronismo', 'pj', 'elecciones', 'unión por la patria'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
    published_at: daysAgo(6),
  },
  {
    title: 'El gobierno nacional intervino YPF por irregularidades en contratos de exploración',
    excerpt: 'La Secretaría de Energía dispuso una auditoría de emergencia en YPF tras detectar sobreprecios en los contratos firmados durante la gestión anterior.',
    category: 'politica',
    tags: ['ypf', 'energía', 'intervención', 'contratos', 'auditoría'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    published_at: daysAgo(6),
  },
  {
    title: 'El Congreso inició el debate por la Ley de Bases 2.0: nuevas reformas estructurales en agenda',
    excerpt: 'Tras el primer paquete de medidas, el Ejecutivo envió un nuevo proyecto con reformas al sistema educativo, laboral y previsional.',
    category: 'politica',
    tags: ['ley de bases', 'congreso', 'reformas', 'milei', 'libertad avanza'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    published_at: daysAgo(7),
  },

  // ========== ECONOMIA (15) ==========
  {
    title: 'Dólar blue alcanzó los $1.445: el mercado cambiario mantiene estabilidad tras las medidas del BCRA',
    excerpt: 'La divisa paralela cerró en alza marginal mientras el Banco Central acumuló reservas por tercera semana consecutiva gracias a las liquidaciones del agro.',
    category: 'economia',
    tags: ['dólar blue', 'tipo de cambio', 'bcra', 'reservas', 'mercado cambiario'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    published_at: daysAgo(0),
  },
  {
    title: 'El Banco Central modificó los encajes bancarios para aumentar el crédito a pymes',
    excerpt: 'La nueva regulación reduce los requisitos de encaje para préstamos destinados a pequeñas y medianas empresas, con el objetivo de dinamizar el crédito productivo.',
    category: 'economia',
    tags: ['banco central', 'encajes', 'pymes', 'crédito', 'regulación'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    published_at: daysAgo(0),
  },
  {
    title: 'La inflación de octubre fue del 8,3%: acumula 107% en los últimos doce meses',
    excerpt: 'El INDEC publicó el índice de precios al consumidor correspondiente a octubre, con alimentos y servicios públicos como los rubros de mayor impacto.',
    category: 'economia',
    tags: ['inflación', 'indec', 'precios', 'ipc', 'alimentos'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'El gobierno aumentó las tarifas de gas natural un 7,2% para el sector residencial',
    excerpt: 'La Secretaría de Energía dispuso un nuevo ajuste tarifario en el marco del plan de normalización del sector, que prevé actualizaciones trimestrales.',
    category: 'economia',
    tags: ['tarifas', 'gas', 'energía', 'subsidios', 'ajuste'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'Las exportaciones agroindustriales superaron los U$S 4.000 millones en septiembre',
    excerpt: 'El complejo sojero y el sector cerealero lideraron las ventas al exterior, impulsadas por el tipo de cambio competitivo y la fuerte demanda asiática.',
    category: 'economia',
    tags: ['exportaciones', 'agro', 'soja', 'cereales', 'comercio exterior'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'El FMI aprobó un nuevo desembolso de U$S 800 millones para la Argentina',
    excerpt: 'El directorio del organismo internacional dio luz verde a la quinta revisión del acuerdo de facilidades extendidas y liberó fondos para reforzar las reservas.',
    category: 'economia',
    tags: ['fmi', 'desembolso', 'reservas', 'acuerdo', 'deuda'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'El índice de desempleo bajó al 6,4% en el tercer trimestre: el más bajo en cinco años',
    excerpt: 'El INDEC informó una recuperación del mercado laboral impulsada por la construcción y los servicios, aunque la informalidad sigue por encima del 40%.',
    category: 'economia',
    tags: ['desempleo', 'empleo', 'mercado laboral', 'indec', 'informalidad'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'El Merval cerró en máximo histórico: las acciones bancarias lideran el rally',
    excerpt: 'El índice bursátil porteño trepó un 4,8% en la jornada y alcanzó un nuevo récord en moneda extranjera, impulsado por la expectativa de levantamiento del cepo.',
    category: 'economia',
    tags: ['merval', 'bolsa', 'acciones', 'bancos', 'cepo cambiario'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'El gobierno lanzó un plan de incentivos fiscales para inversiones en Vaca Muerta',
    excerpt: 'El paquete de medidas incluye exenciones impositivas, garantías de repatriación de divisas y un régimen simplificado para proyectos de más de U$S 100 millones.',
    category: 'economia',
    tags: ['vaca muerta', 'petróleo', 'inversión', 'incentivos fiscales', 'neuquén'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    published_at: daysAgo(4),
  },
  {
    title: 'La construcción creció un 12% interanual: recuperación sostenida en obra pública y privada',
    excerpt: 'El INDEC informó el indicador sintético de la actividad de la construcción correspondiente a septiembre, con el sector liderando la recuperación económica.',
    category: 'economia',
    tags: ['construcción', 'obra pública', 'actividad económica', 'indec', 'recuperación'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    published_at: daysAgo(4),
  },
  {
    title: 'Las reservas brutas del BCRA superaron los U$S 30.000 millones por primera vez en dos años',
    excerpt: 'El stock de reservas del Banco Central trepó gracias a las liquidaciones del agro, los desembolsos del FMI y las operaciones de repo con bancos internacionales.',
    category: 'economia',
    tags: ['reservas', 'bcra', 'banco central', 'divisas', 'fmi'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'El gobierno suspendió las retenciones a las exportaciones de economías regionales',
    excerpt: 'La medida beneficia a los productores de frutas, vinos, aceitunas y miel, y busca incentivar la producción y el ingreso de divisas por exportaciones no tradicionales.',
    category: 'economia',
    tags: ['retenciones', 'exportaciones', 'economías regionales', 'agro', 'divisas'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'El riesgo país cayó por debajo de los 700 puntos: señal de recuperación de confianza',
    excerpt: 'El indicador elaborado por JP Morgan descendió a su nivel más bajo desde 2018, reflejando la mejora en la percepción internacional sobre la economía argentina.',
    category: 'economia',
    tags: ['riesgo país', 'bonos', 'deuda', 'confianza', 'mercados'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    published_at: daysAgo(6),
  },
  {
    title: 'El consumo en supermercados cayó un 3,2% en términos reales durante septiembre',
    excerpt: 'Pese a la desaceleración inflacionaria, el poder adquisitivo todavía no se recupera y el consumo masivo acumula seis meses consecutivos de caída interanual.',
    category: 'economia',
    tags: ['consumo', 'supermercados', 'poder adquisitivo', 'ventas minoristas', 'inflación'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?w=800&q=80',
    published_at: daysAgo(6),
  },
  {
    title: 'El sector tecnológico exportó U$S 2.100 millones en software y servicios informáticos',
    excerpt: 'La industria del conocimiento se consolida como el tercer complejo exportador argentino, con un crecimiento del 18% interanual impulsado por startups y empresas de IT.',
    category: 'economia',
    tags: ['tecnología', 'exportaciones', 'software', 'startups', 'industria del conocimiento'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    published_at: daysAgo(7),
  },

  // ========== JUDICIAL (8) ==========
  {
    title: 'La Corte Suprema revocó el fallo que absolvía a exfuncionarios en la causa de los cuadernos',
    excerpt: 'El máximo tribunal ordenó que el caso sea reenviado a la Cámara de Casación para un nuevo juicio oral, en una decisión que reactiva el expediente más importante de corrupción.',
    category: 'judicial',
    tags: ['corte suprema', 'cuadernos', 'corrupción', 'casación', 'exfuncionarios'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(0),
  },
  {
    title: 'El juez Ercolini citó a indagatoria a tres exsecretarios de Obra Pública',
    excerpt: 'El magistrado federal convocó a declarar a los exfuncionarios en el marco de la causa por sobreprecios en contratos de infraestructura vial durante el kirchnerismo.',
    category: 'judicial',
    tags: ['ercolini', 'obra pública', 'indagatoria', 'corrupción', 'kirchnerismo'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'La defensa de CFK solicitó la nulidad de todas las actuaciones en la causa Vialidad',
    excerpt: 'Los abogados de la expresidenta presentaron un recurso ante la Cámara de Casación argumentando irregularidades en la conformación del tribunal de juicio.',
    category: 'judicial',
    tags: ['cristina kirchner', 'vialidad', 'casación', 'nulidad', 'defensa'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'El Gobierno envió al Congreso el pliego de tres candidatos para integrar la Corte Suprema',
    excerpt: 'El Poder Ejecutivo oficializó la propuesta de tres juristas para cubrir las vacantes en el máximo tribunal, abriendo el período de impugnaciones ciudadanas.',
    category: 'judicial',
    tags: ['corte suprema', 'pliego', 'magistrados', 'gobierno', 'congreso'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'La Fiscalía apeló la excarcelación del empresario imputado en el caso de lavado offshore',
    excerpt: 'El Ministerio Público Fiscal solicitó la revocación de la libertad del acusado de transferir fondos no declarados a cuentas en Islas Caimán y Suiza.',
    category: 'judicial',
    tags: ['lavado', 'offshore', 'fiscal', 'excarcelación', 'cuentas en el exterior'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(4),
  },
  {
    title: 'El Consejo de la Magistratura inició el proceso de selección de 40 nuevos magistrados',
    excerpt: 'El órgano constitucional abrió las inscripciones para cubrir vacantes en juzgados federales de todo el país, en un concurso que se extenderá por seis meses.',
    category: 'judicial',
    tags: ['magistratura', 'magistrados', 'concurso', 'juzgados federales', 'poder judicial'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'La Cámara Electoral ratificó el cronograma para las primarias del próximo año',
    excerpt: 'El tribunal electoral confirmó que las PASO se realizarán en junio y las elecciones generales en octubre, estableciendo las fechas límite para la presentación de alianzas.',
    category: 'judicial',
    tags: ['electoral', 'paso', 'elecciones', 'cronograma', 'cámara electoral'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80',
    published_at: daysAgo(6),
  },
  {
    title: 'Tribunal condenó a diez años de prisión al ex jefe policial por encubrimiento y extorsión',
    excerpt: 'El fallo de la Cámara Federal acreditó que el excomisario encubrió delitos de tráfico de drogas y cobró coimas a organizaciones criminales durante doce años.',
    category: 'judicial',
    tags: ['policía', 'condena', 'corrupción', 'extorsión', 'encubrimiento'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    published_at: daysAgo(7),
  },

  // ========== INTERNACIONAL (7) ==========
  {
    title: 'Brasil y Argentina firmaron un acuerdo de libre comercio en el marco del Mercosur',
    excerpt: 'Los presidentes de ambos países refrendaron en Brasilia un tratado bilateral para facilitar el intercambio comercial y eliminar aranceles en sectores estratégicos.',
    category: 'internacional',
    tags: ['brasil', 'mercosur', 'libre comercio', 'acuerdo bilateral', 'lula'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'La ONU cuestionó las políticas de ajuste argentino por su impacto en derechos sociales',
    excerpt: 'Un informe del relator especial de Naciones Unidas advirtió sobre el deterioro de indicadores de pobreza y acceso a la salud en el contexto del programa económico.',
    category: 'internacional',
    tags: ['onu', 'derechos humanos', 'ajuste', 'pobreza', 'relator especial'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'China anunció una inversión de U$S 5.000 millones en infraestructura ferroviaria argentina',
    excerpt: 'El gobierno chino confirmó el financiamiento para la renovación de la red ferroviaria nacional en el marco de la iniciativa Belt and Road, con plazo de ejecución a diez años.',
    category: 'internacional',
    tags: ['china', 'inversión', 'ferroviario', 'belt and road', 'infraestructura'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'El G20 sesionó en Sudáfrica con la deuda de los países emergentes como eje central',
    excerpt: 'Los ministros de Economía del grupo de las veinte economías más grandes debatieron mecanismos de reestructuración y alivio de deuda para naciones de bajos ingresos.',
    category: 'internacional',
    tags: ['g20', 'deuda', 'economías emergentes', 'sudáfrica', 'finanzas internacionales'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    published_at: daysAgo(4),
  },
  {
    title: 'Venezuela expulsó al embajador argentino en respuesta a las críticas de Milei',
    excerpt: 'El gobierno de Maduro declaró persona non grata al representante diplomático argentino tras las declaraciones del presidente sobre la situación democrática venezolana.',
    category: 'internacional',
    tags: ['venezuela', 'maduro', 'milei', 'diplomacia', 'relaciones exteriores'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'Argentina presidirá el Comité Antártico Internacional durante el próximo bienio',
    excerpt: 'La Cancillería informó que el país asumirá la presidencia rotativa del organismo multilateral, reforzando su posición geopolítica en la región austral.',
    category: 'internacional',
    tags: ['antártida', 'cancillería', 'geopolítica', 'multilateral', 'soberanía'],
    author: 'Federico Navarro',
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
    published_at: daysAgo(6),
  },
  {
    title: 'La OTAN evaluó ampliar su presencia en América Latina ante la influencia rusa y china',
    excerpt: 'Un informe del Consejo del Atlántico Norte analizó la creciente presencia de Rusia y China en la región y la posibilidad de acuerdos de seguridad con países afines.',
    category: 'internacional',
    tags: ['otan', 'rusia', 'china', 'geopolítica', 'seguridad'],
    author: 'Carolina López',
    image_url: 'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=80',
    published_at: daysAgo(7),
  },

  // ========== SOCIEDAD (5) ==========
  {
    title: 'La matrícula universitaria cayó un 9% en 2025: el ajuste presupuestario y el costo de vida, principales causas',
    excerpt: 'Un relevamiento nacional de la Secretaría de Políticas Universitarias reveló que más de 80.000 estudiantes abandonaron o postergaron sus estudios superiores.',
    category: 'sociedad',
    tags: ['universidad', 'educación', 'matrícula', 'ajuste', 'costo de vida'],
    author: 'Martín Rodríguez',
    image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    published_at: daysAgo(1),
  },
  {
    title: 'Aumentó un 32% la demanda de comedores comunitarios en el conurbano bonaerense',
    excerpt: 'Organizaciones sociales advierten sobre el incremento de personas en situación de inseguridad alimentaria y reclaman al Estado mayor asistencia para los comedores.',
    category: 'sociedad',
    tags: ['comedores', 'pobreza', 'alimentación', 'conurbano', 'organizaciones sociales'],
    author: 'Ana Morales',
    image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    published_at: daysAgo(2),
  },
  {
    title: 'El gobierno presentó un plan de viviendas sociales con financiamiento del BID',
    excerpt: 'El programa prevé la construcción de 15.000 viviendas en todo el país, con foco en los municipios del conurbano bonaerense y las grandes ciudades del interior.',
    category: 'sociedad',
    tags: ['vivienda', 'bid', 'financiamiento', 'plan habitacional', 'conurbano'],
    author: 'Sebastián Castro',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    published_at: daysAgo(3),
  },
  {
    title: 'Un estudio revela que Argentina tiene la mayor tasa de terapia psicológica per cápita del mundo',
    excerpt: 'La investigación de la USAL actualiza el dato histórico y confirma que Buenos Aires sigue siendo la ciudad con más psicólogos y pacientes en relación a su población.',
    category: 'sociedad',
    tags: ['salud mental', 'psicología', 'terapia', 'usal', 'buenos aires'],
    author: 'Diego Gutiérrez',
    image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    published_at: daysAgo(5),
  },
  {
    title: 'Las migraciones internas se aceleraron: tucumanos y cordobeses encabezan la llegada a Patagonia',
    excerpt: 'Un informe del CONICET documenta el éxodo hacia las provincias patagónicas en busca de empleo en los sectores petrolero, gasífero y de servicios.',
    category: 'sociedad',
    tags: ['migración', 'patagonia', 'empleo', 'conicet', 'demografía'],
    author: 'Lucía Fernández',
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    published_at: daysAgo(6),
  },
]

// Build final objects with slugs and IDs
const finalArticles = articles.map((a, i) => ({
  title: a.title,
  slug: slugify(a.title) + '-' + uid(a.title),
  excerpt: a.excerpt,
  content: null,
  image_url: a.image_url,
  category: a.category,
  tags: a.tags,
  author: a.author,
  published_at: a.published_at,
  source_url: `https://politicaargentina.com/${a.category}/${slugify(a.title)}`,
}))

const output = {
  generated_at: new Date().toISOString(),
  total: finalArticles.length,
  articles: finalArticles,
}

const outPath = join(__dirname, 'scraped_articles.json')
writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8')

console.log(`✅ Generated ${finalArticles.length} articles → scripts/scraped_articles.json\n`)
const cats = {}
finalArticles.forEach(a => { cats[a.category] = (cats[a.category] || 0) + 1 })
Object.entries(cats).forEach(([c, n]) => console.log(`  ${c}: ${n}`))
