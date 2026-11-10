/* SIN FILTRO — contenido de los juegos.
   IMPORTANTE: los "id" de las preguntas van dentro de los links que se comparten.
   Puedes agregar preguntas nuevas con ids nuevos, pero no cambies ni reutilices ids existentes. */
window.DATA = (function () {
  'use strict';

  /* Puntos por tipo de pregunta */
  var WEIGHTS = { mc: 1, bool: 1, rank: 2, open: 2 };

  /* t: mc (opción múltiple) | bool (verdad o mentira) | rank (ordenar por prioridad) | open (respuesta escrita)
     me: texto que ve quien crea el reto · you: texto que ve quien adivina ({n} = nombre de quien creó el reto) */
  var Q = [
    /* ---- Opción múltiple ---- */
    { id: 1, t: 'mc', cat: 'CAOS', me: 'Mi plan perfecto un viernes es…', you: 'El plan perfecto de {n} un viernes es…',
      opts: ['Maratón de series en pijama', 'Salir de fiesta hasta que cierren', 'Cena rica con gente rica', 'Improvisar un viaje a la playa'] },
    { id: 2, t: 'mc', cat: 'VIDA', me: 'Si me pierdo, lo primero que hago es…', you: 'Si {n} se pierde, lo primero que hace es…',
      opts: ['Abrir el mapa con calma', 'Preguntarle a la primera persona', 'Caminar con seguridad fingida', 'Pedir un Uber y rendirse'] },
    { id: 3, t: 'mc', cat: 'AMOR', me: 'Mi mayor red flag es…', you: 'La mayor red flag de {n} es…',
      opts: ['Responder tarde los mensajes', 'Llegar siempre tarde', 'Terquedad hasta el final', 'Dejar vasos por toda la casa'] },
    { id: 4, t: 'mc', cat: 'NOCHE', me: 'A las 3 a. m. yo estoy…', you: 'A las 3 a. m., {n} está…',
      opts: ['Dormido como roca', 'Comiendo algo en la cocina', 'Scrolleando sin poder parar', 'En la calle: la noche recién empieza'] },
    { id: 5, t: 'mc', cat: 'CITAS', me: 'En una cita pido…', you: 'En una cita, {n} pide…',
      opts: ['Lo más raro del menú', 'Lo de siempre, sin riesgo', 'Lo mismo que pida la otra persona', 'Compartir todo'] },
    { id: 6, t: 'mc', cat: 'AMOR', me: 'Mi forma de pedir perdón es…', you: '{n} pide perdón con…',
      opts: ['Un mensaje larguísimo', 'Un meme y esperar suerte', 'Comida (siempre comida)', 'Cara a cara, aunque cueste'] },
    { id: 7, t: 'mc', cat: 'VIDA', me: 'Mi peor hábito es…', you: 'El peor hábito de {n} es…',
      opts: ['Postergar todo', 'Mirar el celular en la mesa', 'Interrumpir cuando se emociona', 'Gastar en cosas que no necesita'] },
    { id: 8, t: 'mc', cat: 'NOCHE', me: 'En un karaoke soy…', you: 'En un karaoke, {n} es…',
      opts: ['La estrella que no suelta el micrófono', 'El que se niega… y luego no lo suelta', 'El que graba a todos', 'El público fiel que aplaude'] },
    { id: 9, t: 'mc', cat: 'CAOS', me: 'Mi miedo más absurdo es…', you: 'El miedo más absurdo de {n} es…',
      opts: ['Los bichos voladores', 'Las llamadas de número desconocido', 'Quedarse sin batería', 'El agua oscura y profunda'] },
    { id: 10, t: 'mc', cat: 'VIDA', me: 'Si gano la lotería, lo primero que hago es…', you: 'Si {n} gana la lotería, lo primero que hace es…',
      opts: ['Viajar sin fecha de regreso', 'Comprar la casa soñada', 'Invitar a todos a todo', 'Guardar el secreto y no decir nada'] },
    { id: 11, t: 'mc', cat: 'AMOR', me: 'Mi lenguaje del amor es…', you: 'El lenguaje del amor de {n} es…',
      opts: ['Tiempo juntos', 'Detalles y regalos', 'Palabras bonitas', 'Abrazos y contacto'] },
    { id: 12, t: 'mc', cat: 'COMIDA', me: 'Piña en la pizza: mi postura es…', you: 'Piña en la pizza: la postura de {n} es…',
      opts: ['Defensa hasta la muerte', 'Crimen imperdonable', 'Indiferencia total', 'Solo si la pide otro'] },
    { id: 13, t: 'mc', cat: 'CAOS', me: 'Mi espíritu animal es…', you: 'El espíritu animal de {n} es…',
      opts: ['Un gato que ignora a todos', 'Un perro que quiere a todos', 'Un mapache revisando la basura a medianoche', 'Un búho que vive de noche'] },
    { id: 14, t: 'mc', cat: 'NOCHE', me: 'En una fiesta soy…', you: 'En una fiesta, {n} es…',
      opts: ['El alma de la fiesta', 'El que ayuda en la cocina', 'El del balcón, con conversaciones profundas', 'El que se va sin despedirse'] },
    { id: 15, t: 'mc', cat: 'AMOR', me: 'Lo que más me enamora de alguien es…', you: 'Lo que más enamora a {n} de alguien es…',
      opts: ['El sentido del humor', 'La mirada', 'Sentirse seguro/a con esa persona', 'La ambición'] },
    { id: 16, t: 'mc', cat: 'VIDA', me: 'Mi relación con el despertador es…', you: 'La relación de {n} con el despertador es…',
      opts: ['Apagarlo y seguir durmiendo', 'Levantarse a la primera', 'Diez alarmas, cada 5 minutos', 'No lo necesita: despierta solo/a'] },
    { id: 17, t: 'mc', cat: 'AMOR', me: 'Mensaje de mi ex a las 2 a. m.: mi reacción es…', you: 'Mensaje del ex a las 2 a. m.: la reacción de {n} es…',
      opts: ['Dejarlo en visto', 'Responder al instante', 'Mostrárselo a los amigos', 'Bloquear sin pensarlo'] },

    /* ---- Verdad o mentira ---- */
    { id: 101, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Llego temprano a todo.', you: '{n} llega temprano a todo.' },
    { id: 102, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Me quedo dormido/a viendo películas casi siempre.', you: '{n} se queda dormido/a viendo películas casi siempre.' },
    { id: 103, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'He llorado con un comercial.', you: '{n} ha llorado con un comercial.' },
    { id: 104, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Reviso el celular apenas despierto.', you: '{n} revisa el celular apenas despierta.' },
    { id: 105, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Sé bailar de verdad (no solo moverme).', you: '{n} sabe bailar de verdad (no solo moverse).' },
    { id: 106, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Prefiero un mensaje de texto a una llamada, siempre.', you: '{n} prefiere un mensaje de texto a una llamada, siempre.' },
    { id: 107, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Mandé un mensaje y me arrepentí al segundo.', you: '{n} mandó un mensaje y se arrepintió al segundo.' },
    { id: 108, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Dejaría todo por un viaje improvisado mañana mismo.', you: '{n} dejaría todo por un viaje improvisado mañana mismo.' },
    { id: 109, t: 'bool', cat: 'VERDAD O MENTIRA', me: 'Soy bueno/a guardando secretos.', you: '{n} es bueno/a guardando secretos.' },

    /* ---- Ranking por prioridad (4 ítems; 1.º = lo que MÁS) ---- */
    { id: 201, t: 'rank', cat: 'RANKING', me: 'Ordena de MÁS a MENOS importante para ti en una relación.', you: '¿Cómo ordenaría {n} lo que más le importa en una relación?',
      opts: ['Confianza', 'Humor', 'Pasión', 'Estabilidad'] },
    { id: 202, t: 'rank', cat: 'RANKING', me: 'Ordena tus planes favoritos, del que MÁS al que MENOS.', you: '¿Cómo ordenaría {n} sus planes favoritos, del que MÁS al que MENOS?',
      opts: ['Cena rica', 'Fiesta hasta tarde', 'Maratón de series', 'Viaje improvisado'] },
    { id: 203, t: 'rank', cat: 'RANKING', me: 'Ordena lo que más te molesta, de MÁS a MENOS.', you: '¿Qué le molesta más a {n}? Ordénalo de MÁS a MENOS.',
      opts: ['La impuntualidad', 'El visto sin respuesta', 'El desorden', 'Las mentiras chiquitas'] },
    { id: 204, t: 'rank', cat: 'RANKING', me: 'Ordena tus prioridades de este año, de MÁS a MENOS.', you: '¿Cuáles son las prioridades de {n} este año? De MÁS a MENOS.',
      opts: ['Plata', 'Amor', 'Salud', 'Libertad'] },
    { id: 205, t: 'rank', cat: 'RANKING', me: 'Ordena lo que más disfrutas, de MÁS a MENOS.', you: '¿Qué disfruta más {n}? Ordénalo de MÁS a MENOS.',
      opts: ['Dormir', 'Comer', 'Bailar', 'Conversar de noche'] },
    { id: 206, t: 'rank', cat: 'RANKING', me: 'Ordena lo que más te atrae de alguien, de MÁS a MENOS.', you: '¿Qué le atrae más a {n} de alguien? De MÁS a MENOS.',
      opts: ['El humor', 'La mirada', 'La ambición', 'El estilo'] },
    { id: 207, t: 'rank', cat: 'RANKING', me: 'Ordena tus superpoderes con amigos o pareja, del MÁS fuerte al MENOS.', you: '¿Cuál es el superpoder de {n}? Ordénalos del MÁS fuerte al MENOS.',
      opts: ['Escuchar', 'Hacer reír', 'Organizar planes', 'Dar consejos'] },

    /* ---- Respuesta escrita ---- */
    { id: 301, t: 'open', cat: 'ESCRIBE', me: 'Mi comida de consuelo es…', you: 'La comida de consuelo de {n} es…', hint: 'Una sola cosa' },
    { id: 302, t: 'open', cat: 'ESCRIBE', me: 'El lugar del mundo al que más quiero viajar es…', you: 'El lugar del mundo al que {n} más quiere viajar es…', hint: 'Ciudad o país' },
    { id: 303, t: 'open', cat: 'ESCRIBE', me: 'La serie o película que veo cuando necesito consuelo es…', you: 'La serie o película que {n} ve cuando necesita consuelo es…', hint: 'Título' },
    { id: 304, t: 'open', cat: 'ESCRIBE', me: 'Lo que más miedo me da es…', you: 'Lo que más miedo le da a {n} es…', hint: 'Una cosa, en pocas palabras' },
    { id: 305, t: 'open', cat: 'ESCRIBE', me: 'El apodo con el que más me dicen es…', you: 'El apodo con el que más le dicen a {n} es…', hint: 'Apodo' },
    { id: 306, t: 'open', cat: 'ESCRIBE', me: 'Lo primero que hago al despertar es…', you: 'Lo primero que hace {n} al despertar es…', hint: 'Corto y sincero' },
    { id: 307, t: 'open', cat: 'ESCRIBE', me: 'Mi bebida de siempre es…', you: 'La bebida de siempre de {n} es…', hint: 'Una sola' },
    { id: 308, t: 'open', cat: 'ESCRIBE', me: 'Si tuvieras que definirme en UNA palabra, sería…', you: 'Si tuvieras que definir a {n} en UNA palabra, sería…', hint: 'Una palabra' }
  ];

  /* Niveles de resultado (min = % mínimo). side: crush = arriba, crash = abajo */
  var TIERS = [
    { min: 92, name: 'LOVE OF MY LIFE', side: 'crush', line: 'Te sabes hasta lo que nunca dijo. Esto ya es casi sospechoso.' },
    { min: 80, name: 'SOULMATE ENERGY', side: 'crush', line: 'Le lees la mente en HD. Cuidado: así empiezan las fusiones de apellidos.' },
    { min: 66, name: 'CRUSH CONFIRMADO', side: 'crush', line: 'Hay química y hay atención. Todavía quedan cosas por descubrir.' },
    { min: 52, name: 'SITUATIONSHIP', side: 'crush', line: 'Algo hay, pero nadie sabe qué es. Ni ustedes ni esta app.' },
    { min: 38, name: 'JUST FRIENDS', side: 'crash', line: 'Muy amables, muy lejos. Cumpleaños sí, confesiones no.' },
    { min: 24, name: 'WE NEED TO TALK', side: 'crash', line: 'Sí, es esa frase. Siéntate. Toma agua. Hay que hablar.' },
    { min: 10, name: 'LEFT ON READ', side: 'crash', line: 'Visto a las 21:47. Sin respuesta. Sin piedad.' },
    { min: 0, name: 'TOTAL CRASH', side: 'crash', line: 'Esto fue un choque frontal. ¿Seguro que se conocen?' }
  ];

  var QUIPS = {
    ok: ['¡DENTRO!', 'LO SABÍAS.', 'OJO CLÍNICO.', 'ESA FUE FÁCIL.', 'CASI SOSPECHOSO.'],
    half: ['A MEDIAS.', 'TIBIO, TIBIO.', 'ALGO ES ALGO.'],
    bad: ['UY. CASI.', 'ESO DOLIÓ.', 'NOPE.', 'REVISA TUS NOTAS.', 'AUCH.']
  };

  /* Mazo: CARDS[mazo][nivel] — nivel 1 = Suave, 2 = Picante, 3 = Profundo */
  var CARDS = {
    verdad: {
      1: [
        '¿Cuál es el último meme que te hizo reír de verdad?',
        '¿Qué app usas más y no te da vergüenza admitirlo?',
        '¿Qué es lo más raro que has googleado este mes?',
        '¿Cuál es tu comida favorita que nadie entiende?',
        'Si te toca ser DJ ahora mismo y todos te miran, ¿qué canción pones?',
        '¿Cuál fue tu peor corte de pelo o look de la adolescencia?'
      ],
      2: [
        '¿Cuál fue tu peor cita y qué la arruinó?',
        '¿Qué es lo primero que miras en alguien que te atrae?',
        '¿Has stalkeado a alguien hasta llegar a una foto de hace años? Cuenta.',
        '¿Con quién de esta mesa harías un viaje de dos semanas? ¿Y con quién no?',
        '¿Cuál es tu mejor técnica para coquetear? Demuéstrala en una frase.',
        '¿Cuál es el mensaje más vergonzoso que has enviado al chat equivocado?'
      ],
      3: [
        '¿Qué es lo que más miedo te da de crecer?',
        '¿Qué le dirías a tu yo de 15 años?',
        '¿Qué decisión cambió tu vida y no te arrepientes?',
        '¿Qué parte de ti te cuesta que los demás vean?',
        '¿A quién te cuesta perdonar, o de quién te gustaría recibir perdón?',
        '¿Qué te hace sentir realmente querido/a?'
      ]
    },
    reto: {
      1: [
        'Habla como locutor de radio durante 1 minuto describiendo lo que hay en la mesa.',
        'Imita a alguien de la mesa hasta que adivinen quién es.',
        'Baila 20 segundos sin música.',
        'Haz tu mejor cara de “acabo de ver a mi ex” y mantenla 10 segundos.',
        'Habla solo con preguntas durante las próximas 3 rondas.',
        'Cuenta un chiste. Si nadie se ríe, cuéntalo otra vez.'
      ],
      2: [
        'Muestra la última foto de tu galería. Si no te atreves, cuenta una anécdota peor.',
        'Hazle un piropo con cara seria a la persona de tu izquierda.',
        'Dile a alguien de la mesa tres cosas que admiras de él o ella, mirándolo/a a los ojos.',
        'Haz una mini pasarela por la habitación. La mesa te pone nota del 1 al 10.',
        'Deja que la mesa te elija un apodo nuevo que usarás el resto de la noche.',
        'Lee en voz alta el último mensaje que enviaste, con voz dramática.'
      ],
      3: [
        'Escribe un mensaje de agradecimiento a alguien importante y léelo en voz alta antes de enviarlo.',
        'Mira a los ojos a la persona de tu derecha durante 30 segundos sin reírte.',
        'Cuéntale a la mesa tu mejor recuerdo con alguien de aquí.',
        'Abraza a quien más lo necesite hoy (con su permiso).',
        'Di en voz alta una cosa que te gustaría soltar este año.',
        'Manda un audio a alguien que no ves hace tiempo y dile que lo piensas.'
      ]
    },
    confesion: {
      1: [
        'Confiesa tu serie o reality favorito de culpa.',
        'Confiesa una manía rara que tengas al dormir o al comer.',
        'Confiesa la mentira blanca que más repites.',
        'Confiesa a qué famoso/a le escribirías si tuvieras su número.',
        'Confiesa cuál es tu hábito más desordenado.',
        'Confiesa algo que finges que te gusta y en realidad no.'
      ],
      2: [
        'Confiesa tu crush más inesperado de la vida.',
        'Confiesa una vez en que te hiciste el/la dormido/a para evitar algo.',
        'Confiesa el nombre más vergonzoso con el que has guardado a alguien en tu celular.',
        'Confiesa a quién de la mesa le contarías un secreto sin dudar.',
        'Confiesa lo más atrevido que has hecho por alguien que te gustaba.',
        'Confiesa una red flag tuya que sabes que tienes.'
      ],
      3: [
        'Confiesa algo que nunca le has dicho a nadie de esta mesa.',
        'Confiesa una vez en que le fallaste a alguien y todavía lo piensas.',
        'Confiesa qué te hace sentir inseguro/a aunque no se note.',
        'Confiesa algo que extrañas de tu pasado.',
        'Confiesa un sueño que te da vergüenza decir en voz alta.',
        'Confiesa algo por lo que estás agradecido/a de esta mesa.'
      ]
    }
  };

  return { QUESTIONS: Q, WEIGHTS: WEIGHTS, TIERS: TIERS, QUIPS: QUIPS, CARDS: CARDS };
})();
