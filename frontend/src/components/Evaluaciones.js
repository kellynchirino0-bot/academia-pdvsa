import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const quizzes = [
  { id: 1, titulo: 'Fundamentos de IA Generativa', preguntas: [
    { enunciado: '¿Qué arquitectura de red neuronal es la base de los modelos GPT?', opciones: ['VAE', 'Transformer', 'GAN', 'RNN'], correcta: 1 },
    { enunciado: '¿Qué significa "transfer learning" en el contexto de IA?', opciones: ['Entrenar desde cero', 'Reutilizar un modelo pre-entrenado en una nueva tarea', 'Transferir datos entre servidores', 'Migrar a otro framework'], correcta: 1 },
    { enunciado: '¿Cuál es el principal desafío ético al implementar IA en PDVSA?', opciones: ['Costo del hardware', 'Privacidad de datos y transparencia algorítmica', 'Velocidad de internet', 'Idioma de los modelos'], correcta: 1 },
    { enunciado: '¿Qué tipo de aprendizaje usa un modelo generativo como GPT?', opciones: ['Supervisado', 'No supervisado', 'Auto-supervisado', 'Refuerzo'], correcta: 2 },
    { enunciado: '¿Qué métrica se usa comúnmente para evaluar la calidad de texto generado?', opciones: ['Precisión', 'Perplexidad', 'F1-Score', 'AUC-ROC'], correcta: 1 },
  ]},
  { id: 2, titulo: 'Prompt Engineering para PDVSA', preguntas: [
    { enunciado: '¿Cuál es el componente clave de un prompt efectivo?', opciones: ['Longitud máxima', 'Contexto y especificidad', 'Uso de mayúsculas', 'Incluir URLs'], correcta: 1 },
    { enunciado: '¿Qué técnica de prompting ayuda a mejorar la precisión en tareas técnicas?', opciones: ['Zero-shot', 'Chain-of-Thought', 'Random sampling', 'Keyword stuffing'], correcta: 1 },
    { enunciado: 'Para un informe técnico de PDVSA, ¿qué estilo de prompt es más adecuado?', opciones: ['Creativo', 'Estructurado con rol y formato definido', 'Libre sin restricciones', 'Poético'], correcta: 1 },
    { enunciado: '¿Qué es "temperature" en un modelo GPT?', opciones: ['Temperatura del servidor', 'Parámetro que controla la aleatoriedad de la salida', 'Velocidad de generación', 'Versión del modelo'], correcta: 1 },
    { enunciado: '¿Cómo se puede reducir el riesgo de alucinaciones en un modelo de IA?', opciones: ['Aumentando la temperatura', 'Usando grounding con fuentes verificadas', 'Eliminando el contexto', 'Usando solo prompts cortos'], correcta: 1 },
  ]},
  { id: 3, titulo: 'Visión Artificial Industrial', preguntas: [
    { enunciado: '¿Qué red neuronal es más eficaz para detección de objetos en tiempo real?', opciones: ['RNN', 'YOLO (You Only Look Once)', 'BERT', 'GPT'], correcta: 1 },
    { enunciado: '¿Qué técnica de visión artificial se usa para detectar corrosión en ductos?', opciones: ['Segmentación semántica', 'Reconocimiento facial', 'Traducción automática', 'Síntesis de voz'], correcta: 0 },
    { enunciado: '¿Qué es un "mapa de calor" en el contexto de visión artificial?', opciones: ['Un gráfico de temperatura ambiente', 'Una visualización de las regiones que más activan una red neuronal', 'Un tipo de cámara térmica', 'Un formato de imagen'], correcta: 1 },
    { enunciado: '¿Qué arquitectura es la base de los modelos generativos de imágenes?', opciones: ['LSTM', 'GAN (Generative Adversarial Network)', 'SVM', 'K-Means'], correcta: 1 },
    { enunciado: '¿Para qué se usa una red VAE en la industria petrolera?', opciones: ['Generar música ambiental', 'Detectar anomalías en señales de sensores', 'Traducir documentos', 'Navegación GPS'], correcta: 1 },
  ]},
];

export default function Evaluaciones() {
  const { getApi } = useAuth();
  const [quizActual, setQuizActual] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const iniciarQuiz = (q) => {
    setQuizActual(q);
    setRespuestas({});
    setResultado(null);
  };

  const seleccionarRespuesta = (pIndex, opcion) => {
    setRespuestas(prev => ({ ...prev, [pIndex]: opcion }));
  };

  const calificar = useCallback(async () => {
    setEnviando(true);
    const preguntas = quizActual.preguntas;
    let aciertos = 0;
    preguntas.forEach((p, i) => {
      if (respuestas[i] === p.correcta) aciertos++;
    });
    const calificacion = (aciertos / preguntas.length) * 100;
    const aprobado = calificacion >= 80;
    const res = { aciertos, total: preguntas.length, calificacion: calificacion.toFixed(1), aprobado };
    setResultado(res);
    try {
      await getApi().post('/notas/calificar', {
        evaluacion_id: quizActual.id,
        respuestas: preguntas.map((_, i) => respuestas[i] !== undefined ? respuestas[i] : -1),
      });
    } catch (err) {
      console.error('Error al guardar nota:', err);
    }
    setEnviando(false);
  }, [quizActual, respuestas, getApi]);

  const todasRespondidas = quizActual && quizActual.preguntas.every((_, i) => respuestas[i] !== undefined);

  if (resultado) {
    return (
      <div className="page">
        <div className="page-header"><h1>Resultado</h1></div>
        <div className={`resultado-card ${resultado.aprobado ? 'aprobado' : 'reprobado'}`}>
          <div className="resultado-icon">{resultado.aprobado ? '🎉' : '😞'}</div>
          <h2>{resultado.aprobado ? '¡Aprobado!' : 'Reprobado'}</h2>
          <div className="resultado-score">{resultado.calificacion}%</div>
          <p>{resultado.aciertos} de {resultado.total} respuestas correctas</p>
          <p className="resultado-msg">{resultado.aprobado
            ? 'Felicidades, has superado el 80% requerido. Puedes continuar con el siguiente módulo.'
            : 'No alcanzaste el 80% mínimo. Revisa el material del módulo e intenta nuevamente.'}</p>
          <button className="btn-primary" onClick={() => setQuizActual(null)}>Volver a Evaluaciones</button>
        </div>
      </div>
    );
  }

  if (quizActual) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>{quizActual?.titulo || 'Sin título'}</h1>
          <p>Responde todas las preguntas. Mínimo 80% para aprobar.</p>
          <small>{Object.keys(respuestas || {}).length} de {(quizActual?.preguntas || []).length} respondidas</small>
        </div>
        <div className="quiz-container">
          {(quizActual.preguntas || []).map((p, i) => (
            <div key={i} className="quiz-pregunta">
              <h3>{i + 1}. {p.enunciado}</h3>
              <div className="quiz-opciones">
                {(p.opciones || []).map((o, j) => (
                  <label key={j} className={`quiz-opcion ${respuestas[i] === j ? 'selected' : ''}`}>
                    <input type="radio" name={`p_${i}`} checked={respuestas[i] === j}
                      onChange={() => seleccionarRespuesta(i, j)} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-primary" onClick={calificar} disabled={!todasRespondidas || enviando}>
            {enviando ? 'Enviando...' : 'Enviar Respuestas'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Evaluaciones</h1>
        <p>Selecciona un cuestionario para comenzar. Debes obtener mínimo 80% para aprobar.</p>
      </div>
      <div className="quizzes-grid">
        {quizzes.map(q => (
          <div key={q.id} className="quiz-card" onClick={() => iniciarQuiz(q)}>
            <div className="quiz-card-num">{String(q.id).padStart(2, '0')}</div>
            <div className="quiz-card-info">
              <h3>{q?.titulo || 'Sin título'}</h3>
              <p>{q.preguntas.length} preguntas · 80% mínimo</p>
            </div>
            <button className="btn-start">Comenzar →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
