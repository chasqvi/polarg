import type { Article } from '../types/database'

// Title convention: text wrapped in **double asterisks** renders in Black (900) weight
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Milei anuncia **el superávit más alto** de la historia reciente',
    slug: 'milei-superavit-historico-2026',
    excerpt:
      'El presidente presentó los números del primer trimestre con optimismo desbordante. La oposición cuestiona la metodología de cálculo y los economistas advierten sobre la sustentabilidad del ajuste.',
    content: `La Casa Rosada amaneció con una conferencia de prensa que nadie esperaba para un lunes. Javier Milei, flanqueado por el ministro de Economía y la vocera presidencial, anunció que el primer trimestre de 2026 arrojó un superávit primario de 1,2 puntos del PBI, un número que, según el oficialismo, no tiene precedentes en la historia económica moderna del país.

"Esto demuestra que el ajuste fue necesario y que sus frutos están llegando", afirmó el presidente con tono triunfal, usando el pizarrón que se ha convertido en su marca registrada para las explicaciones económicas. Los mercados reaccionaron con moderada euforia: el riesgo país cedió 40 puntos básicos en la apertura y el tipo de cambio operó estable dentro de la banda de flotación.

Sin embargo, desde la vereda opuesta el panorama luce diferente. La bancada de Unión por la Patria cuestionó la metodología de cálculo, señalando que el gobierno excluye determinadas partidas del cómputo del gasto primario. "Con la contabilidad creativa de este gobierno, cualquier número puede parecer superávit", disparó la diputada Cecilia Moreau en declaraciones a la prensa parlamentaria.

El economista del CONICET Martín Burgos aportó una lectura más técnica: "El superávit primario existe, pero hay que leer los detalles. La caída del gasto en obra pública y en prestaciones sociales explica gran parte del resultado. No es lo mismo un superávit de productividad que uno de ajuste". Sus palabras, publicadas en un hilo de casi veinte mensajes en X, se convirtieron en tendencia durante toda la mañana.

Desde Rosario, donde se encontraba de visita oficial, el gobernador de Santa Fe se sumó a las críticas con un eje diferente: la transferencia de recursos a las provincias sigue siendo el nudo gordiano del esquema fiscal. "Nos piden que celebremos un número que se logró, en parte, a costa de los fondos que le corresponden a las provincias", señaló ante periodistas locales.

El mercado cambiario, por su parte, mostró cierta calma durante la jornada. El tipo de cambio oficial se mantuvo estable dentro de la banda, mientras que el dólar financiero operó con leve presión alcista en los últimos tramos de la rueda. Los operadores consultados por este medio indicaron que la calma cambiaria responde más a la estacionalidad de abril que al efecto directo del anuncio presidencial.

La discusión sobre la sustentabilidad del ajuste se instaló con fuerza en los medios especializados. El interrogante central que nadie puede responder con certeza: ¿puede el gobierno mantener este resultado fiscal en un contexto de actividad económica que aún no termina de recuperarse y con elecciones de medio término en el horizonte?

El ministro de Economía insistió en la tarde del lunes en que el camino está trazado y no hay marcha atrás. "El ancla fiscal es la base de todo lo demás. Si cedemos ahí, cedemos en todo", afirmó en declaraciones a una radio porteña. La metáfora del ancla, repetida a lo largo de la conferencia de prensa, funcionó como señal explícita al mercado: no habrá flexibilización antes de las elecciones.

Los sindicatos, ausentes en el debate de los últimos días, volvieron a alzar la voz. La CGT emitió un comunicado recordando que el salario real acumuló una caída del 18% en los últimos dieciocho meses, y que hablar de superávit fiscal mientras los trabajadores pierden poder adquisitivo es una "provocación inaceptable". El comunicado fue firmado por los cuatro secretariats generales de la central obrera, lo que subraya el grado de unidad interna.

La respuesta del oficialismo fue previsible: el presidente publicó un gráfico comparando la situación actual con la "herencia recibida" en diciembre de 2023. El gráfico, diseñado con colores amarillos y fuentes de gran tamaño, circuló ampliamente en las redes sociales y fue el contenido más compartido del día según las métricas de las principales plataformas.

Los analistas internacionales observan el proceso argentino con interés creciente. El Fondo Monetario Internacional, cuyo staff estará en Buenos Aires a fin de mes para la revisión del programa, anticipó que los resultados preliminares son "consistentes con los objetivos del acuerdo". La frase, cuidadosamente redactada para evitar elogios que puedan ser malinterpretados en año electoral, fue leída sin embargo como un respaldo implícito por los funcionarios del Ejecutivo.

La pregunta que nadie en el gobierno quiere responder en voz alta: ¿cuánto de este resultado es estructural y cuánto es consecuencia del brutal recorte del gasto real que ha golpeado a jubilados, empleados públicos y receptores de planes sociales? La respuesta, por ahora, la tiene solo el tiempo.`,
    image_url: null,
    category: 'economia',
    tags: ['ECONOMÍA', 'DÉFICIT', 'MILEI', 'AJUSTE'],
    author: 'Santiago Rodríguez',
    published_at: '2026-04-14T09:00:00Z',
    source_url: null,
    created_at: '2026-04-14T09:00:00Z',
  },
  {
    id: '2',
    title: '**La Corte Suprema** define el futuro del juicio político',
    slug: 'corte-suprema-juicio-politico-2026',
    excerpt:
      'Tres de los cinco magistrados anticiparon posiciones divergentes. El fallo podría redefinir el equilibrio entre los poderes del Estado y marcar jurisprudencia para los próximos treinta años.',
    content: `El Palacio de Justicia de la Nación amanece bajo una tensión que no se vivía desde los tiempos del 2001. Esta semana, la Corte Suprema de Justicia deberá pronunciarse sobre la admisibilidad del recurso presentado por el bloque opositor que busca habilitar el proceso de juicio político contra dos funcionarios del Poder Ejecutivo por presunta violación de la independencia del Ministerio Público.

El expediente lleva meses dando vueltas en los pasillos del Palacio. Tres de los cinco magistrados han anticipado, en conversaciones privadas con fuentes que prefieren no ser identificadas, posiciones divergentes sobre la cuestión central: si el Congreso tiene competencia exclusiva para avanzar en este trámite o si la Corte puede intervenir en su control formal.

La teoría constitucionalista más tradicional sostiene que el juicio político es una atribución privativa del Congreso, un control político que los otros poderes no pueden ni deben interferir. "La Corte no tiene nada que hacer aquí", afirma con firmeza el constitucionalista Alberto Garay. "El sistema de separación de poderes establece que cada poder tiene su ámbito de actuación excluyente, y la Corte ha sido muy cuidadosa históricamente en no cruzar esa línea".

Pero la doctrina no es unánime. Una corriente más moderna, que cobró fuerza en el contexto del intento de reforma del Poder Judicial impulsado por el kirchnerismo en 2013, sostiene que la Corte sí puede intervenir cuando el proceso parlamentario viola garantías constitucionales del debido proceso o afecta derechos fundamentales de los imputados.

"El problema es que aquí no se trata solo de una cuestión política abstracta", explica la profesora de derecho constitucional de la UBA, Ana Bestard. "Hay derechos individuales en juego. Y cuando hay derechos individuales, la Corte tiene que poder decir la última palabra. Eso no es invasión de competencias: es cumplimiento de su función esencial como guardiana de la Constitución".

Mientras tanto, en el Congreso la temperatura sube. El bloque oficialista intentó esta semana forzar el levantamiento de la sesión que trataba el tema, maniobra que fracasó por dos votos. La presidenta provisional del Senado acusó al Ejecutivo de "interferir indebidamente en los asuntos del Legislativo", en una declaración que fue recibida con aplausos desde la oposición y un silencio calculado desde la bancada gubernamental.

La situación se complica porque uno de los funcionarios cuestionados es el fiscal general que coordinó la investigación por corrupción en la compra de insumos médicos durante la pandemia. Para el oficialismo, el juicio político es una represalia de los sectores que se sienten perjudicados por esa investigación. Para la oposición, se trata de una usurpación de funciones que pone en riesgo la independencia del Ministerio Público.

Los abogados de los funcionarios presentaron ante la Corte un memorial de 180 páginas argumentando que el procedimiento parlamentario violó el debido proceso en al menos siete aspectos distintos. El memorial fue redactado por un equipo de doce abogados y cita precedentes de la Corte Interamericana de Derechos Humanos, el Tribunal Europeo y jurisprudencia comparada de Chile, Colombia y España.

El Procurador General, por su parte, presentó un dictamen en sentido opuesto: la Corte debe inhibirse de intervenir y dejar que el proceso parlamentario siga su curso natural. El dictamen tiene apenas 22 páginas y está escrito con una concisión que varios observadores interpretaron como deliberada: la brevedad como mensaje de que la cuestión no admite debate.

En los pasillos del Palacio de Justicia, la tensión se palpa en cada conversación. Los empleados del tribunal que llevan décadas observando el humor institucional de los magistrados dicen que nunca vieron un nivel de reserva similar. Los cinco ministros se comunican entre ellos únicamente en las deliberaciones formales, evitando los intercambios informales que habitualmente preceden a los fallos complejos.

El fallo se espera para antes del receso invernal. En los pasillos, pocos se animan a predecir qué dirá la Corte. Lo que sí es seguro es que, cualquiera sea la decisión, marcará un hito en la jurisprudencia constitucional argentina y definirá los límites del control judicial sobre los procesos políticos para las próximas generaciones.

Una cosa es cierta: cuando la Corte habla en este tipo de casos, lo hace sabiendo que sus palabras no serán solo derecho. Serán también política. Y política de la más alta.`,
    image_url: null,
    category: 'judicial',
    tags: ['JUDICIAL', 'CORTE SUPREMA', 'JUICIO POLÍTICO'],
    author: 'Valeria Manzini',
    published_at: '2026-04-13T14:30:00Z',
    source_url: null,
    created_at: '2026-04-13T14:30:00Z',
  },
  {
    id: '3',
    title: 'La oposición busca **unidad** antes del cierre de listas',
    slug: 'oposicion-unidad-cierre-listas-2026',
    excerpt:
      'Tres espacios con historias cruzadas intentan construir una candidatura común. El tiempo apremia y las diferencias programáticas son reales, pero la aritmética electoral impone la convergencia.',
    content: `En una vieja mansión del barrio de Palermo que ahora funciona como sede de un partido político, los dirigentes de tres espacios que se superponen, se confrontan y ocasionalmente se ignoran mutuamente, intentan esta semana construir algo que la política argentina últimamente resiste: una candidatura común con proyecto real y con chances electorales genuinas.

El escenario no es nuevo. La fragmentación opositora es una constante en la historia reciente. Pero el contexto sí cambió: con el oficialismo fortalecido en las encuestas luego del anuncio fiscal de esta semana, la presión para articular una alternativa creíble se volvió impostergable para cualquier dirigente que mire más allá de su propia supervivencia electoral.

Las diferencias no son solo de nombre y de ego, aunque de eso también hay bastante. El kirchnerismo duro no acepta bajar su candidatura presidencial a la fórmula y exige que el acuerdo empiece por reconocer el "legado de gestión" del período 2003-2015. El radicalismo renovador insiste en que sin gobernabilidad de gestión no hay nada que ofrecer al electorado, y que cualquier coalición que no incluya a los gobernadores radicales está incompleta por definición. Y el espacio "Alternativa Federal" que lidera el ex ministro de Hacienda quiere distancia explícita de la palabra "oposición" y prefiere hablar de "propuesta de gobierno", con un énfasis en gestión económica que otros espacios leen como una concesión al relato libertario.

"La unidad no se construye por decreto", dijo con franqueza uno de los negociadores al salir de la reunión de ayer a la noche, mientras encendía el cigarrillo que lleva dos años sin fumar. "Se construye en torno a un programa, y ese programa todavía no lo terminamos de escribir. Tenemos diagnósticos parecidos, pero propuestas distintas en los puntos que más le importan a la gente: tarifas, jubilaciones, tipo de cambio".

Los datos electorales que manejan los encuestadores de los tres espacios muestran un panorama que debería alentar la convergencia sin necesidad de más argumentos teóricos. Por separado, ninguno de los tres candidatos supera el 18% de intención de voto. Unidos, o al menos coordinados bajo una plataforma común, se acercan al 38% y quedan competitivos frente a un oficialismo que no termina de despegar del 42%.

Pero la matemática electoral tiene sus límites. Los votantes que apoyan a cada espacio no son necesariamente transferibles a los otros. El electorado del kirchnerismo que votaría a un candidato de "Alternativa Federal" es, según las propias encuestas que maneja la bancada kirchnerista, inferior al 30% del total de sus votantes actuales. En dirección contraria, el electorado del radicalismo renovador tiene una resistencia muy fuerte hacia los candidatos identificados con el kirchnerismo.

El problema que nadie nombra en las reuniones pero que todos tienen presente: la unidad puede destruir a cada espacio individualmente antes de derrotar al oficialismo. Un kirchnerismo que va a una lista unificada y termina tercero en las internas pierde la iniciativa para los próximos cuatro años. Un radicalismo que pacta y luego ve que su electorado se fue al tercer espacio tiene que reconstruirse desde cero.

La historia argentina está llena de acuerdos opositores que resultaron en la destrucción de los partes contratantes. El Frente País Solidario de 1993, la Alianza del 99 que llegó al gobierno y se disolvió tres años después en una crisis histórica, el Frente de Todos en 2019 que terminó en una interna pública de proporciones épicas. Cada uno de esos procesos está presente en la sala, aunque nadie lo mencione explícitamente.

"Aprendimos de esos fracasos", insiste el senador que lidera las negociaciones por parte del radicalismo. "Esta vez el acuerdo tiene que ser programático primero, institucional después. No al revés". Suena convincente. Pero cuando se le pregunta qué pasa si los otros espacios no aceptan el programa radical como punto de partida, la respuesta llega con una pausa demasiado larga.

El cierre de listas es en seis semanas. La cuenta regresiva pesa sobre cada conversación, cada café y cada reunión de pasillo en el Congreso. El tiempo, siempre incómodo árbitro de la política argentina, está corriendo. Y los dirigentes que llevan años hablando de unidad saben que esta vez, si vuelven a fracasar en construirla, la excusa de "no fue el momento" va a sonar mucho menos convincente que antes.

Mientras tanto, en los barrios, los militantes de cada espacio siguen pintando sus propias paredes con sus propios colores. La unidad, si llega, va a tener que convencer primero a quienes están en la calle antes que a quienes están en las salas de reunión de Palermo.`,
    image_url: null,
    category: 'politica',
    tags: ['POLÍTICA', 'OPOSICIÓN', 'ELECCIONES', 'COALICIÓN'],
    author: 'Martín Rial',
    published_at: '2026-04-14T08:00:00Z',
    source_url: null,
    created_at: '2026-04-14T08:00:00Z',
  },
  {
    id: '4',
    title: 'Brasil y Argentina **redefinen** el eje del Mercosur',
    slug: 'brasil-argentina-mercosur-2026',
    excerpt:
      'Lula y Milei se reunieron en Brasilia en un encuentro que duró el doble de lo previsto. El comunicado conjunto sorprendió a propios y ajenos y reactiva el debate sobre el futuro del bloque regional.',
    content: `Nadie esperaba que durara tanto. La agenda oficial indicaba noventa minutos de reunión bilateral. Terminaron siendo tres horas y media, con un almuerzo que se extendió hasta las cinco de la tarde y un comunicado conjunto que fue redactado, según fuentes diplomáticas de ambos países, directamente por los dos presidentes sentados frente a una computadora, con sus asesores esperando en el pasillo.

El encuentro entre Javier Milei y Luiz Inácio Lula da Silva en el Palacio del Planalto fue presentado como una visita de cortesía con agenda comercial. Terminó siendo algo bastante más denso: un reencuadre de la relación bilateral y, por extensión, del rol que ambos países quieren jugar en el bloque regional que fundaron en 1991 y que llevan décadas discutiendo si está bien o mal diseñado.

El comunicado conjunto habla de "convergencia en lo esencial con respeto a las diferencias en lo accidental", una fórmula que los analistas leen como un reconocimiento explícito de que la relación ideológica entre los dos gobiernos es, en el mejor caso, complicada. Pero también como una señal de que los intereses comerciales, geopolíticos y de política exterior son demasiado importantes para quedar subordinados a esas diferencias programáticas.

Los puntos concretos del acuerdo incluyen: un mecanismo bilateral de resolución de diferendos comerciales con plazos más cortos que los actuales —el promedio actual es de 14 meses—, una coordinación de posiciones frente a las negociaciones del Mercosur con la Unión Europea que vienen estancadas desde hace tres años, y una declaración conjunta sobre la necesidad de reformar el bloque para hacerlo más ágil en la toma de decisiones colectivas.

Este último punto es el más significativo políticamente. Venezuela y Bolivia, que tienen status de Estados en proceso de adhesión al bloque, leyeron la declaración como un mensaje implícito sobre los requisitos democráticos para integrarse. La cancillería venezolana emitió una nota de protesta pocas horas después de la publicación del comunicado, calificándolo de "injerencia en los asuntos internos de Estados soberanos".

La respuesta de la cancillería argentina fue lacónica: el comunicado habla por sí mismo y no requiere interpretaciones adicionales. En diplomacia, la brevedad de la respuesta es, ella misma, una respuesta.

En Buenos Aires, la lectura del kirchnerismo fue igualmente crítica pero desde el ángulo opuesto: "Milei usa la relación con Brasil para legitimarse internacionalmente mientras aplica un ajuste que empobrece a los argentinos". El diputado Leandro Santoro fue el más explícito, señalando que "la foto con Lula no borra el hambre ni la recesión".

Desde el ámbito académico, el politólogo Pablo Lacoste aportó una lectura más histórica y menos partidaria: "Lo que vemos es que cuando Argentina y Brasil se entienden, el Mercosur avanza. Cuando se pelean o se ignoran mutuamente, el bloque se paraliza. Esta reunión, más allá de las ideologías, es una buena noticia para la integración regional. El Mercosur no puede funcionar con dos socios que no se hablan".

Los empresarios del sector automotriz y de agronegocios recibieron la noticia con entusiasmo, por razones distintas. El automotriz porque depende del esquema bilateral de intercambio compensado que permite la integración productiva de las cadenas de valor en los dos países. El agroalimentario porque cualquier avance en la negociación con la UE puede abrir mercados nuevos para productos con alto valor agregado que hoy encuentran barreras paraarancelarias en Europa.

Lo que ninguna de las dos delegaciones quiso discutir públicamente —y lo que todos los corresponsales presentes intentaron obtener en los cuartos de hora de acceso al presidente— fue la cuestión del tipo de cambio bilateral. Brasil acusa que el peso argentino sigue artificialmente subvaluado, lo que genera una distorsión competitiva que perjudica a los productores brasileños. Argentina sostiene que el tipo de cambio responde a variables macroeconómicas internas y no puede sujetarse a consideraciones de competitividad regional.

La discusión seguirá, probablemente, en la próxima reunión de Cancilleres que está prevista para junio en Montevideo. Lo que Brasilia dejó claro esta semana es que prefiere tener esa discusión con Argentina en la mesa que en el pasillo.`,
    image_url: null,
    category: 'internacional',
    tags: ['INTERNACIONAL', 'MERCOSUR', 'BRASIL', 'DIPLOMACIA'],
    author: 'Cecilia Argüello',
    published_at: '2026-04-12T18:00:00Z',
    source_url: null,
    created_at: '2026-04-12T18:00:00Z',
  },
  {
    id: '5',
    title: 'El campo **resiste** la baja de retenciones con silencio',
    slug: 'campo-retenciones-baja-silencio-2026',
    excerpt:
      'La Mesa de Enlace no convocó a ningún paro. Tampoco celebró el anuncio. Lo que hay en el sector agropecuario es una desconfianza estructural que no se disipa con gestos de un gobierno que todavía no resolvió el problema del tipo de cambio.',
    content: `Cuando el gobierno anunció la baja de retenciones a la soja en dos puntos porcentuales, la reacción esperada era un aplauso desde el sector agropecuario. No llegó. Lo que hubo, en cambio, fue un silencio calculado que dice más que cualquier declaración sobre el estado real de la relación entre el campo y el gobierno que más se parece al campo en términos ideológicos desde hace muchos años.

La Mesa de Enlace se reunió de urgencia el miércoles a la tarde, en una de esas reuniones que duran más de lo previsto y terminan sin ningún documento escrito. La reunión, según fuentes presentes, fue tensa. El sector más combativo de la Federación Agraria Argentina quería emitir un comunicado rechazando la medida por insuficiente y exigiendo una reducción de al menos diez puntos. La SRA y Coninagro pedían prudencia y señalaban que en año electoral hay que evitar el conflicto innecesario con un gobierno que, al menos, habla el idioma del campo. El resultado fue el silencio: ningún comunicado, ninguna conferencia de prensa, ninguna posición pública.

"No es que no estemos conformes", explicó un dirigente rural que prefirió no ser identificado en conversación con este medio. "Es que aprendimos que celebrar les da munición política a ellos, y no celebrar les muestra que esto no alcanza. En este contexto, el silencio es la posición más honesta que podemos tener frente a un gobierno que nos promete mucho y nos da poco".

Los números detrás del silencio son elocuentes para quien quiera leerlos. Según las estimaciones del Consejo Agroindustrial Argentino, la baja de dos puntos en retenciones a la soja representa un alivio de aproximadamente 380 millones de dólares anuales para el sector. Es una cifra que no es menor, pero que queda lejos del reclamo histórico de eliminar o reducir sustancialmente las retenciones a los principales cultivos que el candidato Milei planteó en la campaña de 2023.

El contexto climático complica adicionalmente el panorama y hace que cualquier cálculo económico sea más incierto de lo habitual. La campaña 2025/2026 arrancó con un déficit hídrico significativo en las principales zonas productivas de la pampa húmeda. Los pronósticos de producción de soja de las principales consultoras se ubican entre 45 y 47 millones de toneladas, por debajo de las 52 millones de la campaña anterior. Menos volumen exportado significa menos divisas para el sistema, independientemente de la alícuota de retenciones que se aplique sobre ese volumen.

"El campo no está de paro, pero tampoco está liquidando", resumió el economista agrario Javier Preciado Patiño en su análisis semanal, que circuló ampliamente en los grupos de WhatsApp de productores sojeros del interior. "Hay una retención de granos en silos bolsa que responde tanto a expectativas cambiarias como a una desconfianza estructural hacia las políticas agropecuarias de cualquier gobierno nacional, independientemente del color político".

La referencia al tipo de cambio es crucial. Aunque el gobierno libertario liberalizó parcialmente el mercado cambiario y estableció una banda de flotación, la brecha cambiaria que persiste en el mercado financiero sigue siendo un incentivo para que los productores retengan la cosecha esperando una eventual devaluación que mejore sus ingresos en pesos. La baja de retenciones, por significativa que sea en términos relativos, no resuelve ese problema estructural.

Los exportadores de granos tienen sus propias razones para la cautela. Las principales aceiteras y acopiadoras operan en un contexto de márgenes muy ajustados por el aumento de los costos de logística y energía, y están esperando señales más claras sobre la trayectoria cambiaria antes de comprometerse en posiciones de exportación de largo plazo. "Dos puntos de retenciones son bienvenidos, pero no cambian el cuadro macro", dijo sin dramatismo un ejecutivo de una de las principales exportadoras, en conversación privada.

En los municipios del interior bonaerense, la realidad del productor mediano —entre 500 y 2000 hectáreas, que es la mayoría de los productores del cinturón sojero— es más compleja que la que presentan los grandes números nacionales. El costo del arrendamiento, que se paga en quintales de soja, subió un 15% interanual en las principales zonas. Los insumos como semillas, herbicidas y fertilizantes tienen una componente dolarizada que no bajó con la estabilización cambiaria. Y el precio de la soja en el mercado internacional viene cayendo desde el pico de 2022.

La pregunta que nadie en el campo quiere responder en voz alta, pero que sobrevuela cada conversación en las exposiciones rurales y en los cafés de las ciudades del interior: ¿cuánto de este silencio es estrategia política calculada, y cuánto es resignación ante la certeza de que ningún gobierno nacional, de ningún signo político, va a resolver verdaderamente el problema de fondo del sector agropecuario argentino?

La respuesta, probablemente, es que es las dos cosas al mismo tiempo. Y que esa ambigüedad es, por sí misma, la respuesta más honesta que el campo puede dar.`,
    image_url: null,
    category: 'economia',
    tags: ['ECONOMÍA', 'CAMPO', 'RETENCIONES', 'SOJA'],
    author: 'Jorge Eiras',
    published_at: '2026-04-13T11:00:00Z',
    source_url: null,
    created_at: '2026-04-13T11:00:00Z',
  },
  {
    id: '6',
    title: '**Inflación** de marzo: el número que cambia todo',
    slug: 'inflacion-marzo-2026',
    excerpt:
      'El IPC de marzo llegó a 3,2%, el más bajo desde 2021. El gobierno festeja. Los economistas advierten sobre la base de comparación, los precios regulados pendientes y la fragilidad del proceso de desinflación.',
    content: `El INDEC publicó esta mañana el índice de precios al consumidor de marzo de 2026: 3,2% mensual. El número circuló en los chats de economistas, periodistas y funcionarios antes de la publicación oficial —como siempre ocurre, a pesar de los protocolos de confidencialidad— y la reacción fue dividida según el ángulo desde el cual se miraba.

El gobierno salió a festejar con toda la artillería comunicacional disponible. El vocero presidencial convocó a una conferencia de prensa inusualmente rápida para los cuarenta minutos posteriores a la publicación. El ministro de Economía publicó en sus redes sociales un gráfico mostrando la tendencia descendente desde los picos del 25% mensual de diciembre de 2024. "Argentina está dejando atrás la inflación como fenómeno estructural", declaró, con la seguridad de quien sabe que el número le pertenece por al menos una semana.

La lectura técnica es más matizada, como suele ser cuando los números son buenos pero no tan buenos como parecen. Varios economistas señalaron en sus informes matinales que el número de marzo se beneficia de una base de comparación muy favorable con el mismo mes del año anterior, cuando los precios habían tenido un rebote significativo después de la corrección del tipo de cambio que precedió a las elecciones de medio término de 2025. Comparado contra esa base alta, casi cualquier número luce bien.

"El 3,2% en términos interanuales sigue representando una inflación del 46%, que en cualquier otro país del mundo sería considerada una emergencia inflacionaria seria", escribió la economista Marina Dal Poggetto en su reporte mensual, que distribuye a unos dos mil suscriptores en el sector privado y el gobierno. "No estamos celebrando el éxito; estamos celebrando haber salido del abismo. Son cosas muy distintas".

El desglose por rubros revela que la baja de inflación no es pareja ni sostenida en todos los sectores de la economía. Alimentos y bebidas registraron un aumento del 2,8%, el más bajo en muchos meses y la principal causa del buen resultado general, dado el peso que tiene ese rubro en la canasta de familias de ingresos medios y bajos. Pero indumentaria subió 5,1%, impulsada por la corrección estacional de otoño, y los servicios privados acumularon una suba del 4,7% en el mes.

Los precios regulados, que venían atrasados respecto de la inflación general por la política deliberada del gobierno de contenerlos para anclar expectativas, tuvieron en marzo su primera corrección relevante del año: 6,3% promedio, incluyendo aumentos en tarifas de gas, electricidad y transporte público en el área metropolitana. Ese rezago acumulado es la variable que más preocupa a los analistas de cara a los próximos meses.

"El gobierno tiene dos opciones, y ninguna es cómoda en año electoral", explicó el economista Hernán Lacunza en declaraciones radiales que escuchó medio país de camino al trabajo. "Seguir atrasando tarifas y acumular un desequilibrio que va a explotar en algún momento después de las elecciones, o terminar de corregirlas ahora y aguantar tres o cuatro meses con una inflación más alta antes de que vuelva a bajar. El dilema no es técnico; es político".

Desde el Banco Central, el presidente del organismo intentó aportar una perspectiva más calma. En una conferencia de prensa convocada para dar contexto al dato del INDEC, señaló que las expectativas de inflación a doce meses relevadas en el último REM —relevamiento de expectativas de mercado— muestran una tendencia descendente consistente, con la mediana de los analistas privados ubicándose en 38% para los próximos doce meses. Ese número, si se confirma, sería el más bajo desde 2017.

Los sindicatos leyeron el dato de manera muy diferente. La CGT publicó un comunicado señalando que la caída de la inflación en términos interanuales no alcanza a compensar la pérdida acumulada del salario real desde el inicio de la gestión actual. Según sus propios cálculos —que difieren de los del INDEC en metodología pero no dramáticamente en resultado— el salario real promedio de los trabajadores registrados perdió 21 puntos porcentuales desde diciembre de 2023. "Celebrar el 3,2% cuando los trabajadores no pueden llegar a fin de mes es una frivolidad que ofende a la gente de a pie", declaró el secretario general de una de las grandes federaciones obreras.

La discusión, inevitablemente, se mezcla con el calendario electoral que todos tienen en mente aunque nadie menciona públicamente. Con primarias en agosto, ningún funcionario quiere ser el responsable de un rebote inflacionario en plena campaña que destruya la narrativa del gobierno. Pero tampoco quieren llegar a octubre con tarifas tan atrasadas que el próximo gobierno —sea quien sea— tenga que enfrentar una corrección brutal en su primer trimestre.

El 3,2% es, en ese contexto, un dato alentador pero no definitivo. Lo que queda por demostrar es si es el piso de un proceso de desinflación sostenible y estructural, o apenas una meseta antes de la próxima corrección que el sistema macroeconómico argentino, con su larga historia de ciclos inflacionarios, tiende a producir con irritante regularidad.`,
    image_url: null,
    category: 'economia',
    tags: ['ECONOMÍA', 'INFLACIÓN', 'IPC', 'PRECIOS'],
    author: 'Redacción PolArg',
    published_at: '2026-04-14T10:30:00Z',
    source_url: null,
    created_at: '2026-04-14T10:30:00Z',
  },
]
