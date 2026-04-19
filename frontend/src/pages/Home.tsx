import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// Import Assets
import Pfp from '../assets/Pfp.jpg'; 
import matchuo from '../assets/matchuo.png';
import rev from '../assets/rev.png';
import coms from '../assets/coms.jpg';
import rank from '../assets/rank.png';
import meta from '../assets/meta.png';
import skill from '../assets/skill.png';

interface Post {
  _id: string;
  title: string;
  body: string;
  image?: string;
  author: { name: string; profilePic?: string };
  createdAt: string;
}

const staticPosts = [
  { id: 'static-1', img: matchuo, badge: 'Guide', title: 'Champion Matchup Guide', desc: 'Complete analysis of champion matchups, win conditions, and itemization strategies.' },
  { id: 'static-2', img: rev, badge: 'Analysis', title: 'Tournament Review', desc: 'In-depth breakdown of recent tournament matches, highlighting key plays and strategies.' },
  { id: 'static-3', img: coms, badge: 'Coach Tips', title: 'Team Communication', desc: 'Best practices for in-game communication, callouts, and team coordination during scrims.' },
  { id: 'static-4', img: rank, badge: 'Strategy', title: 'Ranked Grinding Tips', desc: 'Techniques to improve your ranked climb, mental game, and decision-making under pressure.' },
  { id: 'static-5', img: meta, badge: 'Pro Tips', title: 'Meta Trends', desc: 'What\'s dominating the competitive scene and why. Analysis of current meta shifts.' },
  { id: 'static-6', img: skill, badge: 'Learning', title: 'Skill Development', desc: 'Progressive training routines and exercises to master mechanics and game knowledge.' }
];

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const sectionWrapper = { width: '100%', padding: '4rem 0' };
  const contentWrapper = { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' };
  const sectionTitleStyle = { textAlign: 'center' as const, fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-heading)', fontFamily: 'serif' };
  const cardStyle = { background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' as const };
  
  const sliderBtnStyle = {
    width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
    color: 'var(--text-heading)', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
    transition: 'border-color 0.2s, background-color 0.2s', outline: 'none', padding: 0 
  };

  return (
    <>
      {/* 1. HERO SECTION */}
      <section style={{ ...sectionWrapper, padding: '6rem 0', background: 'var(--bg-secondary)' }}>
        <div style={{ ...contentWrapper, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>
          <div style={{ flexShrink: 0 }}>
            <img src={Pfp} alt="Profile" style={{ width: '280px', height: '280px', objectFit: 'cover', border: '3px solid var(--accent-color)', borderRadius: '6px', boxShadow: 'var(--shadow-lg)' }} />
          </div>
          <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
            <h1 style={{ fontSize: '4.5rem', margin: '0 0 1rem 0', lineHeight: 1.1, color: 'var(--text-heading)', fontFamily: 'serif' }}>Esports Analyst <br /> & Coach</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '90%', lineHeight: '1.6' }}>
              Focused on MOBA strategy, draft analysis, and competitive team performance improvement.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/about')} style={{ padding: '0.8rem 2rem', textTransform: 'uppercase', fontWeight: 'bold' }}>ABOUT ME</button>
              <button className="btn btn-outline" onClick={() => navigate('/contact')} style={{ padding: '0.8rem 2rem', textTransform: 'uppercase', fontWeight: 'bold', background: 'rgba(255,255,255,0.02)' }}>CONTACT</button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PUBLISHED POSTS */}
      <section style={{ ...sectionWrapper, background: 'var(--bg-secondary)' }}>
        <div style={contentWrapper}>
          <h2 style={sectionTitleStyle}>Published Post</h2>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading strategies...</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
              {posts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', width: '100%' }}>No analysis posted yet. Be the first to share your thoughts!</p>
              ) : (
                posts.map(post => (
                  <div key={post._id} style={{ ...cardStyle, flex: '0 1 350px', maxWidth: '350px', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate(`/posts/${post._id}`)}>
                    {post.image ? (
                      <img src={`https://clarkproject.onrender.com/uploads/${post.image}`} alt={post.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '220px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Cover Image</div>
                    )}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', color: 'var(--text-heading)' }}>{post.title}</h3>
                      <p style={{ color: 'var(--text-primary)', margin: '0 0 1.5rem 0', flexGrow: 1, lineHeight: '1.6' }}>
                        {post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {post.author.profilePic ? (
                             <img src={`https://clarkproject.onrender.com/uploads/${post.author.profilePic}`} alt={post.author.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                             post.author.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-heading)' }}>{post.author.name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. CONTENT LIBRARY */}
      <section style={{ ...sectionWrapper, background: 'var(--bg-secondary)' }}>
        <div style={contentWrapper}>
          <h2 style={sectionTitleStyle}>Content Library</h2>
          <div ref={sliderRef} style={{ display: 'flex', justifyContent: 'center', overflowX: 'hidden', scrollSnapType: 'x mandatory', gap: '2rem', paddingBottom: '2.5rem', scrollBehavior: 'smooth' }}>
            {staticPosts.map((post) => (
              <div key={post.id} style={{ ...cardStyle, flex: '0 0 350px', scrollSnapAlign: 'start' }}>
                <img src={post.img} alt={post.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'flex-start', marginBottom: '1rem' }}>
                    {post.badge}
                  </span>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', color: 'var(--text-heading)' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-primary)', margin: '0 0 1.5rem 0', flexGrow: 1, lineHeight: '1.6' }}>{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => scrollSlider('left')} style={sliderBtnStyle} title="Previous">&lt;</button>
            <button onClick={() => scrollSlider('right')} style={sliderBtnStyle} title="Next">&gt;</button>
          </div>
        </div>
      </section>

      {/* 4. FEATURED ANALYSIS */}
      <section style={sectionWrapper}>
        <div style={contentWrapper}>
          <h2 style={sectionTitleStyle}>Featured Analysis</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured</span>
              <h3 style={{ fontSize: '1.6rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>MOBA Macro Strategy Breakdown</h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                Deep dive into competitive MOBA strategy, covering map control, objective prioritization, and team synergy analysis. Learn how elite teams execute macro plays that win tournaments.
              </p>
            </div>
            
            <div style={{ padding: '2.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Latest</span>
              <h3 style={{ fontSize: '1.6rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>Draft Meta Report</h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                Current tournament draft trends, champion viability, and team composition strategies. Updated analysis of the competitive landscape and emerging strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KEY STRENGTHS (Hover animations completely removed) */}
      <section style={{ ...sectionWrapper, paddingBottom: '6rem' }}>
        <div style={contentWrapper}>
          <h2 style={sectionTitleStyle}>Key Strengths</h2>
          
          <div style={{ padding: '3.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'center' }}>
            <ul style={{ listStyleType: 'disc', color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '2.5', paddingLeft: '2rem', margin: 0, maxWidth: '600px' }}>
              <li style={{ cursor: 'default' }}>2+ years of esports analysis and coaching experience</li>
              <li style={{ cursor: 'default' }}>Deep expertise in MOBA macro strategy & draft analysis</li>
              <li style={{ cursor: 'default' }}>Specialized in ranked and tournament match reviews</li>
              <li style={{ cursor: 'default' }}>Strong communication and technical leadership skills</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};