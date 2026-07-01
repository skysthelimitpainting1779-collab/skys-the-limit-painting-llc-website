'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../../lib/supabase/client';
import {
  Building,
  Phone,
  Mail,
  Settings,
  Users,
  Folder,
  MapPin,
  Plus,
  Trash2,
  Check,
  Download,
  Upload,
  LogOut,
  FileText,
  Briefcase,
  Eye,
  Edit3,
} from 'lucide-react';

export default function AdminPage() {
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'leads' | 'settings' | 'testimonials' | 'portfolio' | 'service_areas'
  >('leads');

  // Leads State
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsFilterStatus, setLeadsFilterStatus] = useState('all');

  // Settings State
  const [companySettings, setCompanySettings] = useState<any>({
    company_name: '',
    phone: '',
    email: '',
    logo_url: '',
    primary_color: '',
    tagline: '',
    service_areas: [],
    services: [],
    meta_title_default: '',
    meta_desc_default: '',
  });
  const [settingsSaving, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [jsonImportString, setJsonImportString] = useState('');

  // Testimonials State
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    location: '',
    rating: 5,
    quote: '',
    approved: true,
  });

  // Portfolio State
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    category: 'Commercial',
    location: '',
    problem: '',
    prepInput: '',
    result: '',
    image_url: '',
    before_image_url: '',
    after_image_url: '',
  });

  // Service Areas State
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [newServiceArea, setNewServiceArea] = useState({
    city: '',
    slug: '',
    description: '',
    meta_title: '',
    meta_desc: '',
  });

  // Global operation error shown as a toast/banner
  const [opError, setOpError] = useState<string | null>(null);

  // Check current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Load dashboard data once authenticated
  useEffect(() => {
    if (session) {
      loadLeads();
      loadSettings();
      loadTestimonials();
      loadPortfolio();
      loadServiceAreas();
    }
  }, [session]);

  // Authenticate Actions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  const handleSignupOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthError(
        'Account initialized. Please check your email for confirmation, or login if auto-confirmed.'
      );
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign-out failed:', error);
      setOpError('Sign-out failed: ' + error.message);
    }
  };

  // --- CRUD API CALLS ---

  // Leads
  const loadLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load leads:', error);
      setOpError('Failed to load leads: ' + error.message);
      return;
    }
    if (data) setLeads(data);
  };

  const updateLeadStatus = async (
    leadId: string,
    newStatus: string,
    notesText?: string
  ) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, notes: notesText })
      .eq('lead_id', leadId);
    if (error) {
      console.error('Failed to update lead status:', error);
      setOpError('Failed to update lead status: ' + error.message);
      return;
    }
    loadLeads();
    if (selectedLead && selectedLead.lead_id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus, notes: notesText });
    }
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'Date',
      'Name',
      'Phone',
      'Email',
      'City',
      'Market',
      'Type',
      'Budget',
      'Status',
      'Notes',
    ];
    const rows = leads.map((l) => [
      new Date(l.created_at).toLocaleDateString(),
      l.name,
      l.phone,
      l.email,
      l.city,
      l.market,
      l.project_type,
      l.budget || '',
      l.status,
      (l.notes || '').replace(/,/g, ';'),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        headers.join(','),
        ...rows.map((e) => e.map((val) => `"${val}"`).join(',')),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `skys-the-limit-leads-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Settings
  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'default')
      .single();
    if (error) {
      // PGRST116 = no rows found -- expected on fresh installs before first save
      if (error.code !== 'PGRST116') {
        console.error('Failed to load settings:', error);
        setOpError('Failed to load settings: ' + error.message);
      }
      return;
    }
    if (data) {
      setCompanySettings(data);
    }
  };

  const saveSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    setSettingsSuccess(null);
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 'default', ...companySettings });
    if (error) {
      setSettingsError(error.message);
    } else {
      setSettingsSuccess('Settings successfully applied!');
    }
    setSettingsLoading(false);
  };

  const handleExportSettings = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(companySettings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `settings-rebrand-${companySettings.company_name.toLowerCase().replace(/\s+/g, '-')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const handleImportSettings = async () => {
    setSettingsError(null);
    setSettingsSuccess(null);
    try {
      const parsed = JSON.parse(jsonImportString);
      const { id, updated_at, ...cleanSettings } = parsed; // strip immutable keys
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'default', ...cleanSettings });
      if (error) {
        setSettingsError(error.message);
      } else {
        setSettingsSuccess('Configuration imported and saved successfully!');
        loadSettings();
      }
    } catch (err) {
      setSettingsError(
        'Invalid JSON format: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  // Testimonials
  const loadTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load testimonials:', error);
      setOpError('Failed to load testimonials: ' + error.message);
      return;
    }
    if (data) setTestimonials(data);
  };

  const addTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('testimonials')
      .insert([newTestimonial]);
    if (error) {
      console.error('Failed to add testimonial:', error);
      setOpError('Failed to add testimonial: ' + error.message);
      return;
    }
    setNewTestimonial({
      name: '',
      location: '',
      rating: 5,
      quote: '',
      approved: true,
    });
    loadTestimonials();
  };

  const toggleTestimonialApproval = async (
    id: number,
    currentApproved: boolean
  ) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ approved: !currentApproved })
      .eq('id', id);
    if (error) {
      console.error('Failed to toggle testimonial approval:', error);
      setOpError('Failed to update testimonial: ' + error.message);
      return;
    }
    loadTestimonials();
  };

  const deleteTestimonial = async (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Failed to delete testimonial:', error);
        setOpError('Failed to delete testimonial: ' + error.message);
        return;
      }
      loadTestimonials();
    }
  };

  // Portfolio
  const loadPortfolio = async () => {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to load portfolio:', error);
      setOpError('Failed to load portfolio: ' + error.message);
      return;
    }
    if (data) setPortfolio(data);
  };

  const addPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    const prepArray = newPortfolio.prepInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const { error } = await supabase.from('portfolio').insert([
      {
        title: newPortfolio.title,
        category: newPortfolio.category,
        location: newPortfolio.location,
        problem: newPortfolio.problem,
        prep: prepArray,
        result: newPortfolio.result,
        image_url: newPortfolio.image_url || null,
        before_image_url: newPortfolio.before_image_url || null,
        after_image_url: newPortfolio.after_image_url || null,
        project_date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        }),
      },
    ]);

    if (error) {
      console.error('Failed to add portfolio item:', error);
      setOpError('Failed to add portfolio item: ' + error.message);
      return;
    }
    setNewPortfolio({
      title: '',
      category: 'Commercial',
      location: '',
      problem: '',
      prepInput: '',
      result: '',
      image_url: '',
      before_image_url: '',
      after_image_url: '',
    });
    loadPortfolio();
  };

  const deletePortfolio = async (id: number) => {
    if (confirm('Are you sure you want to delete this portfolio project?')) {
      const { error } = await supabase.from('portfolio').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete portfolio item:', error);
        setOpError('Failed to delete portfolio item: ' + error.message);
        return;
      }
      loadPortfolio();
    }
  };

  // Service Areas
  const loadServiceAreas = async () => {
    const { data, error } = await supabase
      .from('service_areas')
      .select('*')
      .order('city', { ascending: true });
    if (error) {
      console.error('Failed to load service areas:', error);
      setOpError('Failed to load service areas: ' + error.message);
      return;
    }
    if (data) setServiceAreas(data);
  };

  const addServiceArea = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('service_areas')
      .insert([newServiceArea]);
    if (error) {
      console.error('Failed to add service area:', error);
      setOpError('Failed to add service area: ' + error.message);
      return;
    }
    setNewServiceArea({
      city: '',
      slug: '',
      description: '',
      meta_title: '',
      meta_desc: '',
    });
    loadServiceAreas();
  };

  const deleteServiceArea = async (id: number) => {
    if (confirm('Are you sure you want to delete this service area?')) {
      const { error } = await supabase
        .from('service_areas')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Failed to delete service area:', error);
        setOpError('Failed to delete service area: ' + error.message);
        return;
      }
      loadServiceAreas();
    }
  };

  // Loading Gate
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-white border-t-transparent animate-spin rounded-none"></div>
          <p className="text-xs ]">Authenticating Core...</p>
        </div>
      </div>
    );
  }

  // Auth Gate UI (Login & Setup Owner accounts)
  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center py-12 px-6 font-mono text-white">
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none"></div>

        <div className="relative max-w-md w-full border border-white/10 bg-[#0B0B0D] p-8 rounded-none ">
          <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-80"></div>

          <div className="text-center mb-8">
            <h1 className="text-xl font-display font-black text-white">
              Operator Console
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              SKYS THE LIMIT PAINTING LLC — ADMIN PORTAL
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 p-3 text-sm rounded-none focus:outline-none focus:border-white text-white"
                placeholder="operator@skysthelimit.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 mb-2">
                Security Key
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 p-3 text-sm rounded-none focus:outline-none focus:border-white text-white"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">
                {authError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleLogin}
                disabled={authLoading}
                className="bg-white hover:bg-white text-[#050505] font-black text-xs py-3.5 rounded-none transition duration-300 disabled:opacity-50"
              >
                {authLoading ? 'Verifying...' : 'Login'}
              </button>
              <button
                onClick={handleSignupOwner}
                disabled={authLoading}
                className="border border-white/20 hover:border-white hover:text-white text-white font-black text-xs py-3.5 rounded-none transition duration-300 disabled:opacity-50"
              >
                Init Owner
              </button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-white/5 text-center text-xs text-gray-600">
            MINNESOTA CONTRACTOR REGISTRATION: IR816596
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard View (Authenticated)
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
      l.city.toLowerCase().includes(leadsSearch.toLowerCase());

    const matchesStatus =
      leadsFilterStatus === 'all' || l.status === leadsFilterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex flex-col">
      {/* Operation Error Banner */}
      {opError && (
        <div className="bg-red-900/80 border-b border-red-500 px-6 py-3 flex items-center justify-between text-sm">
          <span className="text-red-200">{opError}</span>
          <button
            onClick={() => setOpError(null)}
            className="text-red-300 hover:text-white ml-4 text-xs uppercase tracking-widest"
          >
            Dismiss
          </button>
        </div>
      )}
      {/* Top Console Header */}
      <header className="relative bg-[#0B0B0D] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
        <div className="absolute left-0 top-0 h-0.5 bg-white w-full"></div>
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 bg-white animate-pulse"></span>
          <div>
            <h1 className="text-md font-display font-black text-white">
              {companySettings.company_name || "Sky's the Limit Painting LLC"}
            </h1>
            <p className="text-[10px] text-gray-500">Global Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-gray-500 hidden md:inline">
            Account: {session.user.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-white/10 hover:border-red-500 hover:text-red-400 bg-[#050505] px-3 py-2 text-xs font-bold rounded-none transition"
          >
            <LogOut size={12} /> Exit
          </button>
        </div>
      </header>

      {/* Main Console Workspace Grid */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Workspace Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-[#0B0B0D] border-b md:border-b-0 md:border-r border-white/10 flex flex-row md:flex-col py-2 md:py-6">
          <nav className="flex-grow flex flex-row flex-wrap md:flex-col gap-1 px-4 w-full">
            <button
              onClick={() => {
                setActiveTab('leads');
                setSelectedLead(null);
              }}
              className={`flex items-center gap-3.5 px-4 py-3.5 text-xs font-black   rounded-none transition duration-300 w-full text-left ${activeTab === 'leads' ? 'bg-white text-[#050505]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <Briefcase size={14} /> Leads
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3.5 px-4 py-3.5 text-xs font-black   rounded-none transition duration-300 w-full text-left ${activeTab === 'settings' ? 'bg-white text-[#050505]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <Settings size={14} /> Rebrand / Settings
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-3.5 px-4 py-3.5 text-xs font-black   rounded-none transition duration-300 w-full text-left ${activeTab === 'testimonials' ? 'bg-white text-[#050505]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <Users size={14} /> Testimonials
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-3.5 px-4 py-3.5 text-xs font-black   rounded-none transition duration-300 w-full text-left ${activeTab === 'portfolio' ? 'bg-white text-[#050505]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <Folder size={14} /> Portfolio
            </button>
            <button
              onClick={() => setActiveTab('service_areas')}
              className={`flex items-center gap-3.5 px-4 py-3.5 text-xs font-black   rounded-none transition duration-300 w-full text-left ${activeTab === 'service_areas' ? 'bg-white text-[#050505]' : 'hover:bg-white/5 text-gray-400'}`}
            >
              <MapPin size={14} /> Service Cities
            </button>
          </nav>

          <div className="hidden md:block px-6 mt-auto border-t border-white/5 pt-6 text-xs text-gray-600 space-y-1">
            <p>Registration: IR816596</p>
            <p>MN Statute 176.041 Exempt</p>
          </div>
        </aside>

        {/* Workspace Workspace Content Pane */}
        <main className="flex-grow p-6 md:p-8 bg-[#050505] overflow-auto">
          {/* TAB 1: LEADS PANEL */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-xl font-display font-black">
                    Inbound Customer Leads
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Review multi-step estimates and inquiries submitted by
                    prospects.
                  </p>
                </div>
                <button
                  onClick={exportLeadsToCSV}
                  className="flex items-center gap-2 border border-white hover:bg-white hover:text-[#050505] text-white px-4 py-2.5 text-xs font-black rounded-none transition"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>

              {/* Filters / Search Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <input
                  type="text"
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  placeholder="Search by Name, City, or Email..."
                  className="md:col-span-8 bg-[#0B0B0D] border border-white/10 p-3 text-xs rounded-none focus:outline-none focus:border-white"
                />
                <select
                  value={leadsFilterStatus}
                  onChange={(e) => setLeadsFilterStatus(e.target.value)}
                  className="md:col-span-4 bg-[#0B0B0D] border border-white/10 p-3 text-xs rounded-none focus:outline-none focus:border-white text-gray-300"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {/* Leads Table or Detail View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div
                  className={`${selectedLead ? 'lg:col-span-6' : 'lg:col-span-12'} border border-white/10 bg-[#0B0B0D] overflow-hidden`}
                >
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold text-xs">
                        <th className="p-4">Date</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">City</th>
                        <th className="p-4">Market</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-8 text-center text-gray-500 italic"
                          >
                            No matching leads located.
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr
                            key={lead.id}
                            className="hover:bg-white/[0.02] transition"
                          >
                            <td className="p-4 text-gray-400">
                              {new Date(lead.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 font-bold text-white">
                              {lead.name}
                            </td>
                            <td className="p-4 text-gray-300">{lead.city}</td>
                            <td className="p-4 text-gray-400 font-black text-[10px]">
                              {lead.market}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-block px-2.5 py-1 text-[10px] font-black   rounded-none ${
                                  lead.status === 'new'
                                    ? 'bg-white/10 border border-white/35 text-white'
                                    : lead.status === 'completed'
                                      ? 'bg-emerald-500/10 border border-emerald-500/35 text-emerald-400'
                                      : lead.status === 'lost'
                                        ? 'bg-zinc-500/10 border border-zinc-500/35 text-zinc-400'
                                        : 'bg-blue-500/10 border border-blue-500/35 text-blue-400'
                                }`}
                              >
                                {lead.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="border border-white/10 hover:border-white px-3 py-1.5 text-xs font-bold rounded-none transition"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Selected Lead Details Sidebar */}
                {selectedLead && (
                  <div className="lg:col-span-6 border border-white/10 bg-[#0B0B0D] p-6 space-y-6 relative">
                    <div className="road-rule absolute left-0 top-0 h-1 w-full opacity-80"></div>

                    <div className="flex justify-between items-start border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-md font-bold text-white">
                          Lead Record
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                          {selectedLead.lead_id}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="text-gray-500 hover:text-white font-bold text-xs"
                      >
                        [Close]
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Contact Name
                        </p>
                        <p className="font-bold text-white mt-1">
                          {selectedLead.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Submitted On
                        </p>
                        <p className="text-gray-300 mt-1">
                          {new Date(selectedLead.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Phone
                        </p>
                        <p className="font-bold text-white mt-1 select-all">
                          {selectedLead.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Email
                        </p>
                        <p className="font-bold text-gray-300 mt-1 select-all">
                          {selectedLead.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          City
                        </p>
                        <p className="text-gray-300 mt-1">
                          {selectedLead.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Target Budget
                        </p>
                        <p className="text-gray-300 mt-1">
                          {selectedLead.budget || 'Not specified'}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-gray-500 font-black">
                          Address / Area details
                        </p>
                        <p className="text-gray-300 mt-1">
                          {selectedLead.project_address || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Market Segment
                        </p>
                        <p className="text-gray-300 mt-1 font-bold text-white">
                          {selectedLead.market}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-black">
                          Scope Type
                        </p>
                        <p className="text-gray-300 mt-1">
                          {selectedLead.project_type}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-2">
                      <p className="text-[10px] text-gray-500 font-black">
                        User Comments / Notes
                      </p>
                      <p className="bg-[#050505] p-3 border border-white/5 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {selectedLead.notes || 'No user comments submitted.'}
                      </p>
                    </div>

                    {selectedLead.photos_url && (
                      <div className="border-t border-white/5 pt-4 space-y-3">
                        <p className="text-[10px] text-gray-500 font-black">
                          Lead Attachments
                        </p>
                        <div className="bg-[#050505] p-4 border border-white/5 flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono truncate max-w-[200px]">
                            {selectedLead.photos_url}
                          </span>
                          <a
                            href={selectedLead.photos_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white text-[#050505] font-black text-xs px-3 py-1.5 hover:bg-white hover:text-black transition"
                          >
                            View Photo
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Operational State Update Form */}
                    <div className="border-t border-white/5 pt-6 space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex-grow">
                          <label className="block text-[10px] text-gray-500 font-black mb-2">
                            Internal Pipeline Status
                          </label>
                          <select
                            value={selectedLead.status}
                            onChange={(e) =>
                              updateLeadStatus(
                                selectedLead.lead_id,
                                e.target.value,
                                selectedLead.notes
                              )
                            }
                            className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs rounded-none text-white focus:border-white focus:outline-none"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">
                              Scheduled Appointment
                            </option>
                            <option value="completed">Completed Project</option>
                            <option value="lost">Lost / Archived</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: REBRAND & SETTINGS PANEL */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-xl font-display font-black">
                  Company Rebranding & Variables
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Configure company details, taglines, sitemap lists, and
                  colors. These update elements globally.
                </p>
              </div>

              {settingsSuccess && (
                <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-400 font-bold flex items-center gap-2">
                  <Check size={16} /> {settingsSuccess}
                </div>
              )}

              {settingsError && (
                <div className="border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 font-bold">
                  {settingsError}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Configuration form */}
                <div className="lg:col-span-8 border border-white/10 bg-[#0B0B0D] p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companySettings.company_name}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            company_name: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Direct Phone
                      </label>
                      <input
                        type="text"
                        value={companySettings.phone}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Primary Email
                      </label>
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            email: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Theme Color HEX
                      </label>
                      <input
                        type="text"
                        value={companySettings.primary_color}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            primary_color: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Company Tagline (Bento Positioning)
                      </label>
                      <input
                        type="text"
                        value={companySettings.tagline}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            tagline: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Default Search Meta Title
                      </label>
                      <input
                        type="text"
                        value={companySettings.meta_title_default}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            meta_title_default: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-gray-400 mb-2">
                        Default Search Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={companySettings.meta_desc_default}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            meta_desc_default: e.target.value,
                          })
                        }
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={saveSettings}
                    disabled={settingsSaving}
                    className="bg-white hover:bg-white text-[#050505] font-black text-xs px-6 py-4 rounded-none transition duration-300"
                  >
                    {settingsSaving
                      ? 'Applying Variables...'
                      : 'Apply Live Rebrand'}
                  </button>
                </div>

                {/* Import / Export Sidecard for Forks */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="border border-white/10 bg-[#0B0B0D] p-6 space-y-6">
                    <h3 className="font-display font-black text-xs text-white border-b border-white/5 pb-3">
                      Fast-Fork Configuration
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Download settings as a JSON file to replicate/backup this
                      brand config, or paste a cloned backup configuration below
                      to rebrand this site in seconds.
                    </p>

                    <button
                      onClick={handleExportSettings}
                      className="w-full flex items-center justify-center gap-2 border border-white text-white hover:bg-white hover:text-[#050505] font-black text-xs py-3 transition"
                    >
                      <Download size={12} /> Export settings.json
                    </button>

                    <div className="w-full h-px bg-white/5 my-4"></div>

                    <div className="space-y-3">
                      <label className="block text-xs font-black text-gray-400">
                        Import config settings
                      </label>
                      <textarea
                        rows={4}
                        value={jsonImportString}
                        onChange={(e) => setJsonImportString(e.target.value)}
                        placeholder='{"company_name": "New Painting LLC", ...}'
                        className="w-full bg-[#050505] border border-white/10 p-3 text-xs font-mono rounded-none text-white focus:outline-none focus:border-white"
                      />
                      <button
                        onClick={handleImportSettings}
                        className="w-full flex items-center justify-center gap-2 bg-white text-[#050505] font-black text-xs py-3 hover:bg-white hover:text-black transition"
                      >
                        <Upload size={12} /> Apply Import JSON
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TESTIMONIALS PANEL */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-xl font-display font-black">
                  Social Proof & Testimonials
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Manage public customer reviews. Toggle approval to push them
                  to the website frontend dynamically.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form to add testimonial */}
                <form
                  onSubmit={addTestimonial}
                  className="lg:col-span-4 border border-white/10 bg-[#0B0B0D] p-6 space-y-5"
                >
                  <h3 className="font-display font-black text-xs text-white border-b border-white/5 pb-3">
                    Register New Testimonial
                  </h3>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newTestimonial.name}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          name: e.target.value,
                        })
                      }
                      placeholder="Jane Doe"
                      className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">
                      Location / Subtitle
                    </label>
                    <input
                      type="text"
                      value={newTestimonial.location}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          location: e.target.value,
                        })
                      }
                      placeholder="Eagan, MN"
                      className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">
                      Rating (1-5 Stars)
                    </label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          rating: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                      <option value={2}>2 Stars ★★☆☆☆</option>
                      <option value={1}>1 Star ★☆☆☆☆</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-2">
                      Review Content Quote
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={newTestimonial.quote}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          quote: e.target.value,
                        })
                      }
                      placeholder="Anthony did an excellent job. Fast, accurate, and kept prep priority."
                      className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-[#050505] font-black text-xs py-3.5 rounded-none hover:bg-white hover:text-black transition duration-300"
                  >
                    Add Testimonial
                  </button>
                </form>

                {/* Table of testimonials */}
                <div className="lg:col-span-8 border border-white/10 bg-[#0B0B0D] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold text-xs">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Approved</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {testimonials.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-gray-500 italic"
                          >
                            No testimonials registered yet.
                          </td>
                        </tr>
                      ) : (
                        testimonials.map((test) => (
                          <tr key={test.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white">
                              {test.name}
                            </td>
                            <td className="p-4 text-gray-300">
                              {test.location || '-'}
                            </td>
                            <td className="p-4 text-white">
                              {'★'.repeat(test.rating)}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() =>
                                  toggleTestimonialApproval(
                                    test.id,
                                    test.approved
                                  )
                                }
                                className={`px-2.5 py-1 text-[10px] font-black   border rounded-none transition ${
                                  test.approved
                                    ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400'
                                    : 'bg-zinc-500/10 border-white/10 text-zinc-400'
                                }`}
                              >
                                {test.approved ? 'Approved' : 'Hidden'}
                              </button>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => deleteTestimonial(test.id)}
                                className="text-red-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1.5 text-xs font-bold rounded-none transition"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO PANEL */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-xl font-display font-black">
                  Portfolio Case Studies
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Publish actual projects showing your technical prep protocols,
                  challenge, and visual before/after proofs.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form to add portfolio case study */}
                <form
                  onSubmit={addPortfolio}
                  className="lg:col-span-4 border border-white/10 bg-[#0B0B0D] p-6 space-y-4"
                >
                  <h3 className="font-display font-black text-xs text-white border-b border-white/5 pb-3">
                    Register New Case Study
                  </h3>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      Project Scope / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newPortfolio.title}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          title: e.target.value,
                        })
                      }
                      placeholder="Cabinet Finishing / Exterior Siding"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      Category
                    </label>
                    <select
                      value={newPortfolio.category}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          category: e.target.value,
                        })
                      }
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    >
                      <option value="Commercial">
                        Commercial / Public-Sector
                      </option>
                      <option value="Residential">Residential Interior</option>
                      <option value="Exterior">Residential Exterior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      Location / City
                    </label>
                    <input
                      type="text"
                      required
                      value={newPortfolio.location}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          location: e.target.value,
                        })
                      }
                      placeholder="Inver Grove Heights, MN"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      The Challenge / Problem Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={newPortfolio.problem}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          problem: e.target.value,
                        })
                      }
                      placeholder="Faded siding and wood rot details requiring deep stabilizing repairs."
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      Prep Protocols (Comma Separated)
                    </label>
                    <input
                      type="text"
                      required
                      value={newPortfolio.prepInput}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          prepInput: e.target.value,
                        })
                      }
                      placeholder="Sanding, Priming, Masking, Wood stabilization"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      The Final Result
                    </label>
                    <input
                      type="text"
                      required
                      value={newPortfolio.result}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          result: e.target.value,
                        })
                      }
                      placeholder="Durable, gorgeous finish with weather-stabilized defense."
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      Single Image Fallback URL
                    </label>
                    <input
                      type="text"
                      value={newPortfolio.image_url}
                      onChange={(e) =>
                        setNewPortfolio({
                          ...newPortfolio,
                          image_url: e.target.value,
                        })
                      }
                      placeholder="/images/services/commercial/case-fallback.webp"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-1">
                        Before Img URL
                      </label>
                      <input
                        type="text"
                        value={newPortfolio.before_image_url}
                        onChange={(e) =>
                          setNewPortfolio({
                            ...newPortfolio,
                            before_image_url: e.target.value,
                          })
                        }
                        placeholder="/images/before.webp"
                        className="w-full bg-[#050505] border border-white/10 p-2 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 mb-1">
                        After Img URL
                      </label>
                      <input
                        type="text"
                        value={newPortfolio.after_image_url}
                        onChange={(e) =>
                          setNewPortfolio({
                            ...newPortfolio,
                            after_image_url: e.target.value,
                          })
                        }
                        placeholder="/images/after.webp"
                        className="w-full bg-[#050505] border border-white/10 p-2 text-xs text-white rounded-none focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-[#050505] font-black text-xs py-3 rounded-none hover:bg-white hover:text-black transition duration-300"
                  >
                    Publish Project
                  </button>
                </form>

                {/* List of portfolio projects */}
                <div className="lg:col-span-8 border border-white/10 bg-[#0B0B0D] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold text-xs">
                        <th className="p-4">Project Scope</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Location</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {portfolio.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-gray-500 italic"
                          >
                            No case studies published yet. Falling back to code
                            defaults.
                          </td>
                        </tr>
                      ) : (
                        portfolio.map((proj) => (
                          <tr key={proj.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white">
                              {proj.title}
                            </td>
                            <td className="p-4 text-gray-400 font-black text-[10px]">
                              {proj.category}
                            </td>
                            <td className="p-4 text-gray-300">
                              {proj.location}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => deletePortfolio(proj.id)}
                                className="text-red-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1.5 text-xs font-bold rounded-none transition"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SERVICE AREAS PANEL */}
          {activeTab === 'service_areas' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-6">
                <h2 className="text-xl font-display font-black">
                  Dynamic Service Cities
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Configure target coverage areas. Every city added
                  auto-generates a unique SEO-optimized routed page.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form to add service area */}
                <form
                  onSubmit={addServiceArea}
                  className="lg:col-span-4 border border-white/10 bg-[#0B0B0D] p-6 space-y-4"
                >
                  <h3 className="font-display font-black text-xs text-white border-b border-white/5 pb-3">
                    Register New Coverage City
                  </h3>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      City Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceArea.city}
                      onChange={(e) => {
                        const slugified = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '');
                        setNewServiceArea({
                          ...newServiceArea,
                          city: e.target.value,
                          slug: slugified,
                        });
                      }}
                      placeholder="Woodbury"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      URL Slug (Auto Generated)
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceArea.slug}
                      onChange={(e) =>
                        setNewServiceArea({
                          ...newServiceArea,
                          slug: e.target.value,
                        })
                      }
                      placeholder="woodbury"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white font-mono rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      City Landing Text Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newServiceArea.description}
                      onChange={(e) =>
                        setNewServiceArea({
                          ...newServiceArea,
                          description: e.target.value,
                        })
                      }
                      placeholder="Serving residential neighborhoods and commercial businesses across Woodbury with high-quality specialty painting."
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      SEO Meta Title
                    </label>
                    <input
                      type="text"
                      value={newServiceArea.meta_title}
                      onChange={(e) =>
                        setNewServiceArea({
                          ...newServiceArea,
                          meta_title: e.target.value,
                        })
                      }
                      placeholder="Painting Contractor in Woodbury MN | Sky's the Limit"
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-400 mb-1.5">
                      SEO Meta Description
                    </label>
                    <textarea
                      rows={2}
                      value={newServiceArea.meta_desc}
                      onChange={(e) =>
                        setNewServiceArea({
                          ...newServiceArea,
                          meta_desc: e.target.value,
                        })
                      }
                      placeholder="Professional painting company in Woodbury, MN. Quality preparation, cabinet spray-finishing, and parking-lot marking."
                      className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white rounded-none focus:outline-none focus:border-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-[#050505] font-black text-xs py-3 rounded-none hover:bg-white hover:text-black transition duration-300"
                  >
                    Add Service City
                  </button>
                </form>

                {/* Table of active service areas */}
                <div className="lg:col-span-8 border border-white/10 bg-[#0B0B0D] overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-gray-400 font-bold text-xs">
                        <th className="p-4">Active City</th>
                        <th className="p-4">URL Route</th>
                        <th className="p-4">Meta Title</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {serviceAreas.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="p-8 text-center text-gray-500 italic"
                          >
                            No dynamic coverage cities defined. Falling back to
                            default list.
                          </td>
                        </tr>
                      ) : (
                        serviceAreas.map((city) => (
                          <tr key={city.id} className="hover:bg-white/[0.01]">
                            <td className="p-4 font-bold text-white">
                              {city.city}
                            </td>
                            <td className="p-4 text-white font-mono">
                              /service-areas/{city.slug}
                            </td>
                            <td className="p-4 text-gray-400 truncate max-w-[200px]">
                              {city.meta_title || '-'}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => deleteServiceArea(city.id)}
                                className="text-red-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2.5 py-1.5 text-xs font-bold rounded-none transition"
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
