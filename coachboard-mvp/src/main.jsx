import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dumbbell, Users, ClipboardList, CheckCircle2, Plus, Search, User, CalendarDays } from 'lucide-react';
import './styles.css';

const exerciseLibrary = [
  { name: 'Squat', group: 'Gambe', type: 'Multiarticolare' },
  { name: 'Leg press', group: 'Gambe', type: 'Macchina' },
  { name: 'Affondi camminati', group: 'Gambe', type: 'Manubri' },
  { name: 'Leg extension', group: 'Gambe', type: 'Macchina' },
  { name: 'Leg curl', group: 'Femorali', type: 'Macchina' },
  { name: 'Hip thrust', group: 'Glutei', type: 'Bilanciere' },
  { name: 'Stacco rumeno', group: 'Femorali', type: 'Bilanciere' },
  { name: 'Calf raise', group: 'Polpacci', type: 'Macchina' },
  { name: 'Panca piana', group: 'Petto', type: 'Bilanciere' },
  { name: 'Chest press', group: 'Petto', type: 'Macchina' },
  { name: 'Croci ai cavi', group: 'Petto', type: 'Cavi' },
  { name: 'Lat machine', group: 'Dorso', type: 'Macchina' },
  { name: 'Rematore manubrio', group: 'Dorso', type: 'Manubri' },
  { name: 'Pulley basso', group: 'Dorso', type: 'Macchina' },
  { name: 'Trazioni', group: 'Dorso', type: 'Corpo libero' },
  { name: 'Military press', group: 'Spalle', type: 'Bilanciere' },
  { name: 'Alzate laterali', group: 'Spalle', type: 'Manubri' },
  { name: 'Rear delt machine', group: 'Spalle', type: 'Macchina' },
  { name: 'Curl bilanciere', group: 'Bicipiti', type: 'Bilanciere' },
  { name: 'Curl manubri', group: 'Bicipiti', type: 'Manubri' },
  { name: 'Pushdown cavo', group: 'Tricipiti', type: 'Cavi' },
  { name: 'French press', group: 'Tricipiti', type: 'Bilanciere' },
  { name: 'Crunch machine', group: 'Addome', type: 'Macchina' },
  { name: 'Plank', group: 'Core', type: 'Corpo libero' },
];

const initialClients = [
  { id: 1, name: 'Marco Rossi', goal: 'Ipertrofia', level: 'Intermedio' },
  { id: 2, name: 'Luca Bianchi', goal: 'Dimagrimento', level: 'Principiante' },
  { id: 3, name: 'Andrea Verdi', goal: 'Forza', level: 'Avanzato' },
];

const starterProgram = [
  {
    day: 'Giorno 1 - Upper',
    exercises: [
      { name: 'Panca piana', sets: 4, reps: '6-8', rest: "2'", load: '70 kg', notes: 'RIR 1-2', done: true },
      { name: 'Lat machine', sets: 4, reps: '8-10', rest: '90"', load: '55 kg', notes: 'Controllo scapole', done: false },
      { name: 'Alzate laterali', sets: 3, reps: '12-15', rest: '60"', load: '10 kg', notes: 'No slancio', done: false },
    ],
  },
  {
    day: 'Giorno 2 - Lower',
    exercises: [
      { name: 'Squat', sets: 4, reps: '5-6', rest: '2\'30"', load: '90 kg', notes: 'Tecnica pulita', done: false },
      { name: 'Leg press', sets: 3, reps: '10-12', rest: '90"', load: '160 kg', notes: 'ROM completo', done: false },
      { name: 'Leg curl', sets: 3, reps: '10-12', rest: '75"', load: '35 kg', notes: 'Eccentrica lenta', done: false },
    ],
  },
];

function App() {
  const [activeView, setActiveView] = useState('coach');
  const [selectedClient, setSelectedClient] = useState(initialClients[0]);
  const [query, setQuery] = useState('');
  const [program, setProgram] = useState(starterProgram);

  const filteredExercises = useMemo(() => {
    return exerciseLibrary.filter((e) => `${e.name} ${e.group} ${e.type}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const toggleDone = (dayIndex, exerciseIndex) => {
    setProgram((prev) =>
      prev.map((day, dIdx) =>
        dIdx !== dayIndex
          ? day
          : {
              ...day,
              exercises: day.exercises.map((ex, eIdx) => (eIdx !== exerciseIndex ? ex : { ...ex, done: !ex.done })),
            }
      )
    );
  };

  const addExerciseToFirstDay = (exercise) => {
    setProgram((prev) => {
      const next = [...prev];
      next[0] = {
        ...next[0],
        exercises: [...next[0].exercises, { name: exercise.name, sets: 3, reps: '10-12', rest: '90"', load: '', notes: '', done: false }],
      };
      return next;
    });
  };

  const allExercises = program.flatMap((d) => d.exercises);
  const completion = allExercises.length ? Math.round((allExercises.filter((e) => e.done).length / allExercises.length) * 100) : 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="logo"><Dumbbell size={22} /></div>
            <div><h1>CoachBoard MVP</h1><p>Programmi palestra per coach e clienti</p></div>
          </div>
          <div className="tabs">
            <button className={activeView === 'coach' ? 'active' : ''} onClick={() => setActiveView('coach')}>Area coach</button>
            <button className={activeView === 'client' ? 'active' : ''} onClick={() => setActiveView('client')}>Area cliente</button>
          </div>
        </div>
      </header>

      <main className="layout">
        <aside className="sidebar">
          <section className="card">
            <div className="section-title"><Users size={20} /><h2>Clienti</h2></div>
            <div className="client-list">
              {initialClients.map((client) => (
                <button key={client.id} onClick={() => setSelectedClient(client)} className={`client ${selectedClient.id === client.id ? 'selected' : ''}`}>
                  <div className="client-name"><User size={16} /> {client.name}</div>
                  <p>{client.goal} · {client.level}</p>
                </button>
              ))}
            </div>
            <button className="primary full"><Plus size={16} /> Nuovo cliente</button>
          </section>

          <section className="card">
            <div className="progress-head"><div><p>Completamento</p><strong>{completion}%</strong></div><CheckCircle2 size={34} /></div>
            <div className="progress"><span style={{ width: `${completion}%` }} /></div>
          </section>
        </aside>

        {activeView === 'coach' ? (
          <section className="coach-grid">
            <section className="card main-card">
              <div className="top-row"><div><h2>Programma assegnato</h2><p>Cliente: {selectedClient.name}</p></div><button className="primary"><Plus size={16} /> Aggiungi giorno</button></div>
              <div className="days">
                {program.map((day) => (
                  <div key={day.day} className="day-card">
                    <div className="day-title"><CalendarDays size={18} /><h3>{day.day}</h3></div>
                    <div className="table-wrap"><table><thead><tr><th>Esercizio</th><th>Serie</th><th>Reps</th><th>Rec.</th><th>Carico</th><th>Note</th></tr></thead><tbody>{day.exercises.map((ex, idx) => (<tr key={`${ex.name}-${idx}`}><td><b>{ex.name}</b></td><td>{ex.sets}</td><td>{ex.reps}</td><td>{ex.rest}</td><td>{ex.load || '—'}</td><td>{ex.notes || '—'}</td></tr>))}</tbody></table></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card library-card">
              <div className="section-title"><ClipboardList size={20} /><h2>Libreria esercizi</h2></div>
              <label className="search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cerca esercizio o gruppo..." /></label>
              <div className="exercise-list">{filteredExercises.map((exercise) => (<div key={exercise.name} className="exercise"><div><b>{exercise.name}</b><p>{exercise.group} · {exercise.type}</p></div><button onClick={() => addExerciseToFirstDay(exercise)}><Plus size={14} /></button></div>))}</div>
            </section>
          </section>
        ) : (
          <section className="card main-card">
            <div className="top-row"><div><h2>Il tuo programma</h2><p>Vista cliente · {selectedClient.name}</p></div></div>
            <div className="days">
              {program.map((day, dayIndex) => (
                <div key={day.day} className="day-card"><h3 className="client-day-title">{day.day}</h3><div className="client-exercises">{day.exercises.map((ex, exerciseIndex) => (<div key={`${ex.name}-${exerciseIndex}`} className="client-ex"><div><h3>{ex.name}</h3><p>{ex.sets} serie · {ex.reps} reps · recupero {ex.rest}</p><p>Carico previsto: {ex.load || 'da inserire'}</p>{ex.notes && <em>Note coach: {ex.notes}</em>}</div><button onClick={() => toggleDone(dayIndex, exerciseIndex)} className={ex.done ? 'primary' : 'dark'}>{ex.done ? 'Completato' : 'Segna fatto'}</button></div>))}</div></div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
