import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Video, FileText, File, ClipboardList, Trash2, 
  Edit2, Upload, Link as LinkIcon, Save, X, ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const TutorCourseEditor = () => {
  const [modulos, setModulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModulo, setSelectedModulo] = useState(null);
  const [selectedLeccion, setSelectedLeccion] = useState(null);
  const [contenido, setContenido] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedModulos, setExpandedModulos] = useState({});
  const [contentForm, setContentForm] = useState({ tipo: 'video', titulo: '', url: '', descripcion: '' });
  const [taskForm, setTaskForm] = useState({ titulo: '', descripcion: '', puntos_maximos: 100, fecha_limite: '' });

  useEffect(() => { loadModulos(); }, []);

  const loadModulos = async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/modulos`);
      setModulos(response.data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const loadLecciones = async (moduloId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/modulos/${moduloId}`);
      const modulo = modulos.find(m => m.id === moduloId);
      setSelectedModulo({ ...modulo, lecciones: response.data.lecciones || [] });
    } catch (error) { console.error('Error:', error); }
  };

  const loadContenido = async (leccionId) => {
    try {
      const [contRes, tarRes] = await Promise.all([
        axios.get(`${API_URL}/courses/lecciones/${leccionId}/content`),
        axios.get(`${API_URL}/courses/lecciones/${leccionId}/tareas`)
      ]);
      setContenido(contRes.data);
      setTareas(tarRes.data);
      setSelectedLeccion(leccionId);
    } catch (error) { console.error('Error:', error); }
  };

  const addContent = async () => {
    if (!selectedLeccion || !contentForm.url) return;
    try {
      await axios.post(`${API_URL}/courses/lecciones/${selectedLeccion}/content`, contentForm);
      loadContenido(selectedLeccion);
      setShowAddContent(false);
      setContentForm({ tipo: 'video', titulo: '', url: '', descripcion: '' });
    } catch (error) { alert('Error al agregar contenido'); }
  };

  const deleteContent = async (contentId) => {
    if (!window.confirm('Eliminar este contenido?')) return;
    try {
      await axios.delete(`${API_URL}/courses/content/${contentId}`);
      loadContenido(selectedLeccion);
    } catch (error) { alert('Error al eliminar'); }
  };

  const addTask = async () => {
    if (!selectedLeccion || !taskForm.titulo) return;
    try {
      await axios.post(`${API_URL}/courses/lecciones/${selectedLeccion}/tareas`, taskForm);
      loadContenido(selectedLeccion);
      setShowAddTask(false);
      setTaskForm({ titulo: '', descripcion: '', puntos_maximos: 100, fecha_limite: '' });
    } catch (error) { alert('Error al crear tarea'); }
  };

  const toggleModulo = (id) => {
    setExpandedModulos(prev => ({ ...prev, [id]: !prev[id] }));
    if (!expandedModulos[id]) loadLecciones(id);
  };

  const getTipoIcon = (tipo) => {
    const icons = { video: Video, pdf: FileText, documento: File, link: LinkIcon, presentacion: FileText };
    const Icon = icons[tipo] || File;
    return <Icon size={16} />;
  };

  const getTipoColor = (tipo) => {
    const colors = { video: '#ef4444', pdf: '#f59e0b', documento: '#3b82f6', link: '#10b981', presentacion: '#8b5cf6' };
    return colors[tipo] || '#6b7280';
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Editor de Cursos</h1>
        <p>Gestiona videos, documentos, PDFs y tareas de cada leccion</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        <div className="card" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="card-header"><h2>Modulos</h2></div>
          {modulos.map(mod => (
            <div key={mod.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div onClick={() => toggleModulo(mod.id)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', background: expandedModulos[mod.id] ? 'var(--bg-secondary)' : 'transparent' }}>
                <span style={{ fontSize: '1.2rem' }}>{mod.icono}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{mod?.titulo || 'Sin título'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mod.total_lecciones || 0} lecciones</div>
                </div>
                {expandedModulos[mod.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {expandedModulos[mod.id] && selectedModulo?.id === mod.id && (
                <div style={{ padding: '0 16px 12px' }}>
                  {selectedModulo.lecciones?.map(lec => (
                    <div key={lec.id} onClick={() => loadContenido(lec.id)} style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '6px', marginBottom: '4px', background: selectedLeccion === lec.id ? 'var(--primary-blue)' : 'transparent', color: selectedLeccion === lec.id ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                      <BookOpen size={14} />
                      {lec?.titulo || 'Sin título'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          {selectedLeccion ? (
            <>
              <div className="card">
                <div className="card-header">
                  <h2>Contenido Multimedial</h2>
                  <button className="btn-primary" onClick={() => setShowAddContent(true)} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Agregar Contenido
                  </button>
                </div>
                {contenido.length === 0 ? (
                  <div className="empty-state"><div className="icon">📚</div><h3>Sin contenido</h3><p>Agrega videos, PDFs o documentos</p></div>
                ) : (
                  <div style={{ display: 'grid', gap: '8px', padding: '16px' }}>
                    {contenido.map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${getTipoColor(c.tipo)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getTipoColor(c.tipo) }}>
                          {getTipoIcon(c.tipo)}
                        </div>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: '500', fontSize: '0.9rem' }}>{c?.titulo || c?.tipo || 'Sin título'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.descripcion || c.url}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: getTipoColor(c.tipo), textTransform: 'uppercase', fontWeight: '600' }}>{c.tipo}</span>
                        <button onClick={() => deleteContent(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header">
                  <h2>Tareas y Entregas</h2>
                  <button className="btn-primary" onClick={() => setShowAddTask(true)} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={16} /> Crear Tarea
                  </button>
                </div>
                {tareas.length === 0 ? (
                  <div className="empty-state"><div className="icon">📝</div><h3>Sin tareas</h3><p>Crea tareas para que los estudiantes entreguen</p></div>
                ) : (
                  <div style={{ padding: '16px' }}>
                    {tareas.map(t => (
                      <div key={t.id} style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                             <div style={{ fontWeight: '600' }}>{t?.titulo || 'Sin título'}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.descripcion}</div>
                          </div>
                          <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{t.puntos_maximos} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {showAddContent && (
                <div className="modal-overlay" onClick={() => setShowAddContent(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                    <div className="modal-header">
                      <h2>Agregar Contenido</h2>
                      <button className="close-btn" onClick={() => setShowAddContent(false)}><X size={24} /></button>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Tipo</label>
                      <select value={contentForm.tipo} onChange={(e) => setContentForm({ ...contentForm, tipo: e.target.value })} style={{ width: '100%', marginBottom: '12px', padding: '8px', borderRadius: '6px' }}>
                        <option value="video">Video (MP4/YouTube/Vimeo)</option>
                        <option value="pdf">PDF</option>
                        <option value="documento">Documento (Word)</option>
                        <option value="presentacion">Presentacion</option>
                        <option value="link">Enlace externo</option>
                      </select>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Titulo</label>
                      <input type="text" value={contentForm.titulo} onChange={(e) => setContentForm({ ...contentForm, titulo: e.target.value })} placeholder="Titulo del contenido" style={{ width: '100%', marginBottom: '12px' }} />
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>URL</label>
                      <input type="text" value={contentForm.url} onChange={(e) => setContentForm({ ...contentForm, url: e.target.value })} placeholder="https://..." style={{ width: '100%', marginBottom: '12px' }} />
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Descripcion</label>
                      <textarea value={contentForm.descripcion} onChange={(e) => setContentForm({ ...contentForm, descripcion: e.target.value })} placeholder="Descripcion opcional..." style={{ width: '100%', minHeight: '60px', marginBottom: '16px' }} />
                      <button className="btn-primary" onClick={addContent} style={{ width: '100%' }}>Agregar Contenido</button>
                    </div>
                  </div>
                </div>
              )}

              {showAddTask && (
                <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                    <div className="modal-header">
                      <h2>Crear Tarea</h2>
                      <button className="close-btn" onClick={() => setShowAddTask(false)}><X size={24} /></button>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Titulo</label>
                      <input type="text" value={taskForm.titulo} onChange={(e) => setTaskForm({ ...taskForm, titulo: e.target.value })} placeholder="Titulo de la tarea" style={{ width: '100%', marginBottom: '12px' }} />
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Descripcion / Consigna</label>
                      <textarea value={taskForm.descripcion} onChange={(e) => setTaskForm({ ...taskForm, descripcion: e.target.value })} placeholder="Instrucciones para el estudiante..." style={{ width: '100%', minHeight: '80px', marginBottom: '12px' }} />
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Puntos Maximos</label>
                      <input type="number" value={taskForm.puntos_maximos} onChange={(e) => setTaskForm({ ...taskForm, puntos_maximos: e.target.value })} min="1" max="100" style={{ width: '100%', marginBottom: '12px' }} />
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Fecha Limite (opcional)</label>
                      <input type="datetime-local" value={taskForm.fecha_limite} onChange={(e) => setTaskForm({ ...taskForm, fecha_limite: e.target.value })} style={{ width: '100%', marginBottom: '16px' }} />
                      <button className="btn-primary" onClick={addTask} style={{ width: '100%' }}>Crear Tarea</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card">
              <div className="empty-state">
                <div className="icon">📚</div>
                <h3>Selecciona una leccion</h3>
                <p>Elige un modulo y leccion para gestionar su contenido</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorCourseEditor;
