import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pfp from '../assets/Pfp.jpg';
import m4 from '../assets/m4.jpg';
import au from '../assets/au.jpg';
import loo from '../assets/loo.jpg';
import creep from '../assets/creep.jpg';
import minion from '../assets/minion.jpg';
import turtle from '../assets/turtle.jpg';
import lord from '../assets/lord.jpg';
import bush from '../assets/bush.jpg';
import item from '../assets/item.jpg';
import heroes from '../assets/heroes.jpg';
import turret from '../assets/turret.jpg';
import base from '../assets/base.jpg';
import mapImg from '../assets/map.jpg';

const quizData = [
  { id: 1, img: creep, hint: "Any jungle monster", expected: "creep" },
  { id: 2, img: minion, hint: "Small lane units walking to towers", expected: "minion" },
  { id: 3, img: turtle, hint: "Big monster in the river (early game)", expected: "turtle" },
  { id: 4, img: lord, hint: "Huge monster that helps push lanes", expected: "lord" },
  { id: 5, img: bush, hint: "Tall grass where heroes can hide", expected: "bush" },
  { id: 6, img: item, hint: "Weapon or gear bought in shop", expected: "item" },
  { id: 7, img: heroes, hint: "Character controlled by the player", expected: "hero" },
  { id: 8, img: turret, hint: "Building that shoots enemies", expected: "turret" },
  { id: 9, img: base, hint: "Main base structure", expected: "base" },
  { id: 10, img: mapImg, hint: "Whole battlefield where the game is played", expected: "map" }
];

export const About = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<string | null>(null);

  const handleInputChange = (id: number, value: string) => {
    const val = value.trim().toLowerCase();
    setAnswers(prev => ({ ...prev, [id]: val }));
    
    const expected = quizData[id - 1].expected;
    if (val === expected) {
      setResults(prev => ({ ...prev, [id]: true }));
    } else {
      setResults(prev => ({ ...prev, [id]: false }));
    }
  };

  const isCurrentAnswerCorrect = () => {
    const currentQuestion = quizData[currentSlide];
    const userAns = answers[currentQuestion.id] || '';
    return userAns === currentQuestion.expected;
  };

  const handleNext = () => {
    if (currentSlide < quizData.length - 1) {
      if (!isCurrentAnswerCorrect()) {
        alert('Please answer correctly before proceeding!');
        return;
      }
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  const handleCheckAll = () => {
    let correct = 0;
    const newResults: Record<number, boolean> = {};
    quizData.forEach(q => {
      if (answers[q.id] === q.expected) {
        correct++;
        newResults[q.id] = true;
      } else {
        newResults[q.id] = false;
      }
    });
    setResults(newResults);
    setScore(`Score: ${correct}/${quizData.length}`);
  };

  const handleShowAnswers = () => {
    const perfectAnswers: Record<number, string> = {};
    const perfectResults: Record<number, boolean> = {};
    quizData.forEach(q => {
      perfectAnswers[q.id] = q.expected;
      perfectResults[q.id] = true;
    });
    setAnswers(perfectAnswers);
    setResults(perfectResults);
    setScore(`Score: ${quizData.length}/${quizData.length}`);
  };

  return (
    <>
      <section>
        <div className="featured-section">
          <div className="featured-item">
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <img src={Pfp} alt="Profile" style={{ width: '160px', height: '160px', objectFit: 'cover', border: '3px solid var(--accent-color)' }} />
              <div>
                <h1 style={{ margin: '0 0 0.5rem' }}>7ckngmad</h1>
                <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)' }}>Esports Analyst & Coach — specializing in MOBA macro strategy, draft analysis, and team performance.</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/contact')}>Work With Me</button>
                  <button className="btn btn-outline" onClick={() => navigate('/register')}>View Services</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="featured-item">
            <h3 style={{ marginTop: 0, color: 'var(--accent-color)' }}>Quick Stats</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0', lineHeight: 1.8, color: 'var(--text-muted)' }}>
              <li><strong>2+</strong> years — Competitive analysis</li>
              <li><strong>500+</strong> matches reviewed</li>
              <li><strong>10+</strong> teams assisted</li>
              <li><strong>4.9</strong> average client rating</li>
            </ul>
            <div style={{ marginTop: '1rem' }}><span className="featured-badge">Available for Coaching</span></div>
          </aside>
        </div>

        <h2 className="title">Core Strengths</h2>
        <div className="card-container">
          <div className="card">
            <h3>Strategic Analysis</h3>
            <p>Match breakdowns focused on macro decisions, rotations, and objective control to create repeatable win conditions.</p>
          </div>
          <div className="card">
            <h3>Draft & Meta</h3>
            <p>Draft recommendations, champion tiering, and counter-picks to maximize team composition efficiency.</p>
          </div>
          <div className="card">
            <h3>Coaching</h3>
            <p>Personalized coaching plans, scrim reviews, and communication training to improve team synergy.</p>
          </div>
        </div>

        <h2 className="title">Skills</h2>
        <div style={{ maxWidth: '900px', margin: '1rem auto', textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Macro Strategy</strong>
            <div style={{ background: 'var(--bg-tertiary)', height: '10px', marginTop: '6px', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '92%', height: '100%', background: 'var(--accent-color)' }}></div></div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Draft Analysis</strong>
            <div style={{ background: 'var(--bg-tertiary)', height: '10px', marginTop: '6px', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '85%', height: '100%', background: 'var(--accent-color)' }}></div></div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Team Coaching</strong>
            <div style={{ background: 'var(--bg-tertiary)', height: '10px', marginTop: '6px', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '80%', height: '100%', background: 'var(--accent-color)' }}></div></div>
          </div>
        </div>

        <h2 className="title">Visual Portfolio</h2>
        <div className="about-images">
          <img src={m4} alt="Professional headshot" />
          <img src={au} alt="Game analysis" />
          <img src={loo} alt="Tournament review" />
        </div>

        <h2 className="title">Professional Journey</h2>
        <ol>
          <li><strong>2022</strong> – Mastered MOBA mechanics, studied competitive metas</li>
          <li><strong>2023</strong> – Analyzed hundreds of ranked and scrim matches</li>
          <li><strong>2024</strong> – Assisted multiple teams with draft strategies and game planning</li>
          <li><strong>2025</strong> – Advanced coaching focus with detailed match reviews and mentorship</li>
        </ol>

        <blockquote>
          "Winning starts with understanding the game, not just playing it. Excellence comes from preparation."
        </blockquote>

        <section className="map-section">
          <h2 className="title">Location</h2>
          {/* Reverted to the original vanilla placeholder URL as requested */}
          <div className="map-container" style={{ height: '550px', border: '1px solid var(--border-color)' }}>
            <iframe
              src="https://www.google.com/maps?q=XG8P%2B89W,Bading,Butuan+City,8600+Agusan+del+Norte&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        <section className="quiz-section">
          <h2 className="title">Quiz — Match the Picture (1 pic 1 word)</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '900px', margin: 'auto' }}>Look at each image and type the one-word answer. Navigate through the quiz using the arrows.</p>
          
          <div className="quiz-slider" style={{ maxWidth: '500px', margin: '1rem auto', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <span>{currentSlide + 1}</span> / {quizData.length}
            </div>
            
            <div className="quiz-grid" style={{ position: 'relative', height: '420px' }}>
              {quizData.map((q, index) => (
                <div key={q.id} className="quiz-card" style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '6px', textAlign: 'center', position: 'absolute', width: '100%', display: index === currentSlide ? 'block' : 'none' }}>
                  <div className="q-number" style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{q.id}</div>
                  <div className="img-wrap" style={{ width: '100%', height: '300px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '4px', marginBottom: '0.75rem' }}>
                    <img src={q.img} alt={q.expected} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{q.hint}</div>
                  <input 
                    type="text" 
                    placeholder="Your answer" 
                    value={answers[q.id] || ''}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--text-primary)', textAlign: 'center' }} 
                  />
                  <div className="q-result" style={{ marginTop: '0.4rem', height: '18px', fontWeight: 700, color: results[q.id] ? '#10b981' : 'inherit' }}>
                    {results[q.id] ? 'Correct!' : ''}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
              <button onClick={handlePrev} className="btn btn-outline" disabled={currentSlide === 0}>← Prev</button>
              <button onClick={handleNext} className="btn btn-primary" disabled={currentSlide === quizData.length - 1}>Next →</button>
            </div>

            <div style={{ textAlign: 'center', margin: '1rem' }}>
              <button onClick={handleCheckAll} className="btn btn-primary" style={{ marginRight: '10px' }}>Check All Answers</button>
              <button onClick={handleShowAnswers} className="btn btn-outline">Show All Answers</button>
              <div style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>{score}</div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};