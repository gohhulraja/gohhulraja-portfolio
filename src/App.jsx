import React from "react";
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, BriefcaseBusiness, ExternalLink, Github,
  Heart, Instagram, Linkedin, LockKeyhole, LogOut, Mail, Menu,
  Pencil, Plus, Save, Settings, Trash2, Upload, UserRound, X
} from 'lucide-react';
import { supabase } from './supabase';

const ADMIN_EMAIL = 'gohhulraja@gmail.com';

const defaultSite = {
  name: 'Gohhul Raja R B',
  title: 'Software Developer | AI & Emerging Technologies | Student',
  tagline: 'Building ideas. Learning by doing.',
  bio: 'I am a B.Tech Information Technology student who loves working with computers, building software, experimenting with AI and learning through real projects.',
  about: 'As a child, if someone wanted to be my friend, they could show me a computer. That curiosity never really left. I am learning by building websites, applications, technical prototypes and small experiments. My long-term goal is simple: become a decent engineer who loves his work and build a life where that work can help take care of my family.',
  current_idea: 'Exploring AI, software engineering, emerging technologies and international opportunities.',
  location: 'Tamil Nadu, India',
  education: 'B.Tech Information Technology',
  graduation: '2028',
  github: 'https://github.com/gohhulraja',
  linkedin: 'https://in.linkedin.com/in/gohhul-raja-r-b-3ba3a6357',
  whatsapp: 'https://wa.me/918072829987',
  email: 'gohhulraja@gmail.com',
  avatar_url: '',
  resume_url: ''
};

async function getSite() {
  const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data?.content || defaultSite;
}

async function getProjects() {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

async function getPosts() {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

function usePortfolioData() {
  const [site, setSite] = useState(defaultSite);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      setError('');
      const [s, p, po] = await Promise.all([getSite(), getProjects(), getPosts()]);
      setSite(s);
      setProjects(p);
      setPosts(po);
    } catch (e) {
      setError(e.message || 'Unable to load portfolio data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);
  return { site, setSite, projects, setProjects, posts, setPosts, loading, error, refresh };
}

function Layout({ site, children }) {
  const [open, setOpen] = useState(false);
  const links = [['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'], ['/contact', 'Contact']];
  return (
    <div className="app-shell">
      <header className="nav">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">GR</span>
          <span>{site.name || defaultSite.name}</span>
        </Link>
        <button className="menu-button" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X size={21}/> : <Menu size={21}/>}
        </button>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>
          ))}
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18}/></a>
          <Link className="admin-link" to="/admin" onClick={() => setOpen(false)}><LockKeyhole size={15}/> Admin</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Curiosity → Code → Experience</span>
      </footer>
    </div>
  );
}

function Home({ site, projects, posts }) {
  return (
    <>
      <section className="hero page-pad">
        <div className="hero-copy">
          <p className="eyebrow">SOFTWARE DEVELOPER · STUDENT</p>
          <h1>{site.tagline}</h1>
          <p className="hero-title">{site.title}</p>
          <p className="lead">{site.bio}</p>
          <div className="actions">
            <Link className="button primary" to="/projects">Explore projects <ArrowRight size={17}/></Link>
            <Link className="button ghost" to="/about">About me</Link>
          </div>
          <div className="facts"><span>{site.location}</span><span>{site.education} · {site.graduation}</span></div>
        </div>
        <div className="hero-visual">
          {site.avatar_url ? <img src={site.avatar_url} alt={site.name}/> : <div className="avatar-placeholder">GR</div>}
          <div className="visual-card"><span>日本</span><small>BUILD / LEARN / IMPROVE</small></div>
        </div>
      </section>

      <section className="section page-pad">
        <SectionTitle eyebrow="CURRENT IDEA" title={site.current_idea}/>
        <div className="idea-card"><span className="pulse"></span><p>{site.current_idea}</p></div>
      </section>

      <section className="section page-pad">
        <SectionTitle eyebrow="SELECTED WORK" title="Projects and experiments"/>
        <div className="project-grid">
          {projects.slice(0, 4).map(p => <ProjectCard key={p.id} project={p}/>)}
        </div>
        <Link className="text-link" to="/projects">View everything <ArrowRight size={16}/></Link>
      </section>

      {posts.length > 0 && <PostsSection posts={posts}/>}
    </>
  );
}

function About({ site }) {
  return (
    <section className="page-pad section">
      <SectionTitle eyebrow="ABOUT" title="The person behind the projects"/>
      <div className="about-grid">
        <div className="about-main">
          <p className="big-copy">{site.about}</p>
          <div className="quote">“I want to become a decent engineer who loves his work — and build a life where that work can help take care of his family.”</div>
        </div>
        <aside className="info-card">
          <Info label="Education" value={site.education}/>
          <Info label="Graduation" value={site.graduation}/>
          <Info label="Location" value={site.location}/>
          <Info label="Current focus" value={site.current_idea}/>
        </aside>
      </div>
    </section>
  );
}

function Projects({ projects }) {
  return <section className="page-pad section">
    <SectionTitle eyebrow="PROJECTS" title="Things I’m building and exploring"/>
    <div className="project-grid">{projects.map(p => <ProjectCard key={p.id} project={p}/>)}</div>
  </section>;
}

function ProjectCard({ project }) {
  return <article className="project-card">
    {project.image_url ? <img src={project.image_url} alt="" className="project-image"/> : <div className="project-image placeholder">PROJECT</div>}
    <div className="project-body">
      <div className="project-meta"><span>{project.status}</span><span>{project.category}</span></div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="tags">{(project.stack || []).map(s => <span key={s}>{s}</span>)}</div>
      {project.link && <a className="text-link" href={project.link} target="_blank" rel="noreferrer">Open project <ExternalLink size={15}/></a>}
    </div>
  </article>;
}

function Contact({ site }) {
  return <section className="page-pad section">
    <SectionTitle eyebrow="CONTACT" title="Let's build something useful."/>
    <div className="contact-grid">
      <a className="contact-card" href={`mailto:${site.email}`}><Mail/><span>Email</span><strong>{site.email}</strong></a>
      <a className="contact-card" href={site.github} target="_blank" rel="noreferrer"><Github/><span>GitHub</span><strong>@gohhulraja</strong></a>
      <a className="contact-card" href={site.linkedin} target="_blank" rel="noreferrer"><Linkedin/><span>LinkedIn</span><strong>Connect professionally</strong></a>
      <a className="contact-card" href={site.whatsapp} target="_blank" rel="noreferrer"><Instagram/><span>WhatsApp</span><strong>Message me</strong></a>
    </div>
  </section>;
}

function PostsSection({ posts }) {
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem('gohhul-liked') || '{}'));
  const toggle = id => {
    const next = {...liked, [id]: !liked[id]};
    setLiked(next);
    localStorage.setItem('gohhul-liked', JSON.stringify(next));
  };
  return <section className="section page-pad">
    <SectionTitle eyebrow="JOURNAL" title="Updates, ideas and experiments"/>
    <div className="posts-grid">
      {posts.map(post => <article className="post-card" key={post.id}>
        {post.image_url && <img src={post.image_url} alt={post.caption || 'Post'}/>}
        <div className="post-content">
          <div className="post-top"><span>{new Date(post.created_at).toLocaleDateString()}</span><button onClick={() => toggle(post.id)} className={liked[post.id] ? 'like liked' : 'like'}><Heart size={18} fill={liked[post.id] ? 'currentColor' : 'none'}/></button></div>
          <p>{post.caption}</p>
        </div>
      </article>)}
    </div>
  </section>;
}

function SectionTitle({ eyebrow, title }) {
  return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}
function Info({label,value}) { return <div className="info-row"><span>{label}</span><strong>{value}</strong></div>; }

function Admin({ data }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    supabase.auth.getSession().then(({data}) => { setSession(data.session); setChecking(false); });
    const {data: listener} = supabase.auth.onAuthStateChange((_e,s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);
  if (checking) return <div className="admin-wrap"><div className="loader">Checking secure session…</div></div>;
  if (!session) return <AdminLogin/>;
  if (session.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    supabase.auth.signOut();
    return <div className="admin-wrap"><div className="login-card"><h2>Access denied</h2><p>This dashboard is restricted to the portfolio owner.</p></div></div>;
  }
  return <AdminDashboard data={data} onLogout={() => supabase.auth.signOut()}/>;
}

function AdminLogin() {
  const [email,setEmail]=useState(ADMIN_EMAIL);
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const submit=async e=>{
    e.preventDefault(); setBusy(true); setError('');
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error) setError(error.message);
    setBusy(false);
  };
  return <div className="admin-wrap">
    <form className="login-card" onSubmit={submit}>
      <div className="admin-icon"><LockKeyhole/></div>
      <p className="eyebrow">PRIVATE ADMIN</p>
      <h1>Welcome back.</h1>
      <p>Only the portfolio owner can enter the dashboard.</p>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="username" required/></label>
      <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete="current-password" required/></label>
      {error && <div className="error">{error}</div>}
      <button className="button primary full" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
    </form>
  </div>;
}

function AdminDashboard({data,onLogout}) {
  const {site,setSite,projects,setProjects,posts,setPosts,refresh} = data;
  const [tab,setTab]=useState('site');
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [editing,setEditing]=useState(null);

  const saveSite=async e=>{
    e.preventDefault(); setSaving(true); setMessage('');
    const {error}=await supabase.from('site_content').upsert({id:1,content:site});
    setMessage(error ? error.message : 'Saved successfully.');
    setSaving(false);
  };
  const uploadImage=async(file,folder)=>{
    const ext=file.name.split('.').pop().toLowerCase();
    const path=`${folder}/${crypto.randomUUID()}.${ext}`;
    const {error}=await supabase.storage.from('portfolio').upload(path,file,{upsert:false,contentType:file.type});
    if(error) throw error;
    return supabase.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
  };
  const saveProject=async p=>{
    setSaving(true); setMessage('');
    const payload={name:p.name,description:p.description,status:p.status,category:p.category,stack:p.stack,link:p.link||'',image_url:p.image_url||'',sort_order:Number(p.sort_order||0)};
    const q=p.id ? supabase.from('projects').update(payload).eq('id',p.id) : supabase.from('projects').insert(payload);
    const {error}=await q;
    setMessage(error ? error.message : 'Project saved.');
    setSaving(false); setEditing(null); refresh();
  };
  const deleteProject=async id=>{
    if(!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id',id); refresh();
  };
  const savePost=async p=>{
    setSaving(true); const payload={caption:p.caption,image_url:p.image_url||''};
    const q=p.id ? supabase.from('posts').update(payload).eq('id',p.id) : supabase.from('posts').insert(payload);
    const {error}=await q; setMessage(error ? error.message : 'Post saved.'); setSaving(false); setEditing(null); refresh();
  };
  const deletePost=async id=>{ if(confirm('Delete this post?')) {await supabase.from('posts').delete().eq('id',id);refresh();} };
  const changeImage=async(file, setter, folder)=>{
    try { setter(await uploadImage(file,folder)); setMessage('Image uploaded. Save to keep it.'); } catch(e){setMessage(e.message);}
  };

  return <div className="dashboard">
    <aside className="admin-sidebar">
      <div><span className="brand-mark">GR</span><strong>Admin Studio</strong></div>
      <button className={tab==='site'?'side active':'side'} onClick={()=>setTab('site')}><Settings/>Site</button>
      <button className={tab==='projects'?'side active':'side'} onClick={()=>setTab('projects')}><BriefcaseBusiness/>Projects</button>
      <button className={tab==='posts'?'side active':'side'} onClick={()=>setTab('posts')}><Instagram/>Posts</button>
      <Link className="side" to="/"><ExternalLink/>View site</Link>
      <button className="side logout" onClick={onLogout}><LogOut/>Sign out</button>
    </aside>

    <main className="admin-main">
      <div className="admin-top"><div><p className="eyebrow">CONTROL CENTER</p><h1>Edit everything.</h1></div><div className="admin-status"><span className="online"></span> Secure session</div></div>
      {message && <div className="notice">{message}</div>}

      {tab==='site' && <form className="editor-form" onSubmit={saveSite}>
        <SectionTitle eyebrow="SITE CONTENT" title="Profile & portfolio"/>
        <div className="editor-grid">
          {[
            ['name','Name'],['title','Professional title'],['tagline','Hero headline'],['location','Location'],
            ['education','Education'],['graduation','Graduation'],['email','Email'],['github','GitHub URL'],
            ['linkedin','LinkedIn URL'],['whatsapp','WhatsApp URL'],['resume_url','Resume URL'],['current_idea','Current idea / project']
          ].map(([key,label])=><label key={key}>{label}<input value={site[key]||''} onChange={e=>setSite({...site,[key]:e.target.value})}/></label>)}
        </div>
        <label>Short bio<textarea rows="4" value={site.bio||''} onChange={e=>setSite({...site,bio:e.target.value})}/></label>
        <label>About / full story<textarea rows="7" value={site.about||''} onChange={e=>setSite({...site,about:e.target.value})}/></label>
        <label>Profile picture URL<input value={site.avatar_url||''} onChange={e=>setSite({...site,avatar_url:e.target.value})}/></label>
        <div className="save-row"><button className="button primary" disabled={saving}><Save size={16}/>{saving?'Saving…':'Save all profile changes'}</button></div>
      </form>}

      {tab==='projects' && <div>
        <SectionTitle eyebrow="PROJECT CMS" title="Add and edit projects"/>
        <button className="button primary" onClick={()=>setEditing({name:'',description:'',status:'In progress',category:'Software',stack:[],link:'',image_url:'',sort_order:projects.length})}><Plus size={16}/> New project</button>
        <div className="admin-list">{projects.map(p=><div className="admin-item" key={p.id}><div><strong>{p.name}</strong><span>{p.status} · {p.category}</span></div><div className="item-actions"><button onClick={()=>setEditing({...p})}><Pencil size={16}/></button><button onClick={()=>deleteProject(p.id)}><Trash2 size={16}/></button></div></div>)}</div>
      </div>}

      {tab==='posts' && <div>
        <SectionTitle eyebrow="POST STUDIO" title="Instagram-style updates"/>
        <button className="button primary" onClick={()=>setEditing({caption:'',image_url:''})}><Plus size={16}/> New post</button>
        <div className="admin-list">{posts.map(p=><div className="admin-item" key={p.id}><div><strong>{p.caption?.slice(0,70)||'Untitled post'}</strong><span>{new Date(p.created_at).toLocaleString()}</span></div><div className="item-actions"><button onClick={()=>setEditing({...p})}><Pencil size={16}/></button><button onClick={()=>deletePost(p.id)}><Trash2 size={16}/></button></div></div>)}</div>
      </div>}
    </main>

    {editing && tab==='projects' && <ProjectEditor project={editing} setProject={setEditing} onSave={saveProject} uploadImage={f=>changeImage(f,u=>setEditing(x=>({...x,image_url:u})),'projects')} saving={saving}/>}
    {editing && tab==='posts' && <PostEditor post={editing} setPost={setEditing} onSave={savePost} uploadImage={f=>changeImage(f,u=>setEditing(x=>({...x,image_url:u})),'posts')} saving={saving}/>}
  </div>;
}

function ProjectEditor({project,setProject,onSave,uploadImage,saving}) {
  return <Modal title={project.id?'Edit project':'New project'} close={()=>setProject(null)}>
    <form className="modal-form" onSubmit={e=>{e.preventDefault();onSave(project)}}>
      <label>Name<input value={project.name} onChange={e=>setProject({...project,name:e.target.value})} required/></label>
      <label>Description<textarea rows="5" value={project.description} onChange={e=>setProject({...project,description:e.target.value})}/></label>
      <div className="two"><label>Status<input value={project.status} onChange={e=>setProject({...project,status:e.target.value})}/></label><label>Category<input value={project.category} onChange={e=>setProject({...project,category:e.target.value})}/></label></div>
      <label>Stack (comma separated)<input value={(project.stack||[]).join(', ')} onChange={e=>setProject({...project,stack:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})}/></label>
      <label>Project link<input value={project.link||''} onChange={e=>setProject({...project,link:e.target.value})}/></label>
      <label>Image URL<input value={project.image_url||''} onChange={e=>setProject({...project,image_url:e.target.value})}/></label>
      <label className="upload">Or upload image <input type="file" accept="image/*" onChange={e=>e.target.files[0]&&uploadImage(e.target.files[0])}/><Upload size={16}/></label>
      <button className="button primary full" disabled={saving}><Save size={16}/>Save project</button>
    </form>
  </Modal>;
}
function PostEditor({post,setPost,onSave,uploadImage,saving}) {
  return <Modal title={post.id?'Edit post':'New post'} close={()=>setPost(null)}>
    <form className="modal-form" onSubmit={e=>{e.preventDefault();onSave(post)}}>
      <label>Caption<textarea rows="6" value={post.caption} onChange={e=>setPost({...post,caption:e.target.value})} required/></label>
      <label>Image URL<input value={post.image_url||''} onChange={e=>setPost({...post,image_url:e.target.value})}/></label>
      <label className="upload">Upload image <input type="file" accept="image/*" onChange={e=>e.target.files[0]&&uploadImage(e.target.files[0])}/><Upload size={16}/></label>
      {post.image_url && <img className="preview-img" src={post.image_url} alt="Preview"/>}
      <button className="button primary full" disabled={saving}><Save size={16}/>Publish post</button>
    </form>
  </Modal>;
}
function Modal({title,close,children}) {
  return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><h2>{title}</h2><button onClick={close}><X/></button></div>{children}</div></div>;
}

function App() {
  const data=usePortfolioData();
  if(data.loading) return <div className="loading-screen"><span className="spinner"></span>Loading portfolio…</div>;
  return <Routes>
    <Route path="/admin" element={<Admin data={data}/>}/>
    <Route path="*" element={<Layout site={data.site}><AnimatePresence mode="wait"><Routes>
      <Route path="/" element={<Home site={data.site} projects={data.projects} posts={data.posts}/>}/>
      <Route path="/about" element={<About site={data.site}/>}/>
      <Route path="/projects" element={<Projects projects={data.projects}/>}/>
      <Route path="/contact" element={<Contact site={data.site}/>}/>
      <Route path="*" element={<section className="page-pad section"><SectionTitle eyebrow="404" title="Page not found"/></section>}/>
    </Routes></AnimatePresence></Layout>}/>
  </Routes>;
}

export default App;
