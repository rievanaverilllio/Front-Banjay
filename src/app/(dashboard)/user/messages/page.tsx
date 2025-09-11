"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserNavbar from '@/components/UserNavbar';
import { MessageSquare, Search, Star, StarOff, Send, Plus, Filter, Paperclip, MoreHorizontal, Circle, CheckCircle2 } from 'lucide-react';

interface Message {
	id: string;
	sender: 'me' | 'other';
	name: string; // for other
	avatar?: string;
	body: string;
	ts: string; // ISO
	read: boolean;
	pending?: boolean;
}

interface Conversation {
	id: string;
	title: string;
	participants: string[]; // excluding me
	messages: Message[];
	unread: number;
	starred?: boolean;
	lastTs: string;
	type: 'direct' | 'group' | 'system';
}

// Mock seed data
const seed: Conversation[] = [
	{
		id: 'c1',
		title: 'Flood Monitoring Team',
		participants: ['Ayu','Dimas','Rudi'],
		type: 'group',
		messages: [
			{ id:'m1', sender:'other', name:'Ayu', body:'Sensor level at station KRB-07 increased 12cm in last hour.', ts: new Date(Date.now()-1000*60*60).toISOString(), read:true },
			{ id:'m2', sender:'me', name:'Me', body:'Logged. Any upstream rainfall updates?', ts: new Date(Date.now()-1000*60*45).toISOString(), read:true },
			{ id:'m3', sender:'other', name:'Dimas', body:'Radar shows moderate cells dissipating. Forecast stable.', ts: new Date(Date.now()-1000*60*30).toISOString(), read:false },
		],
		unread: 1,
		starred: true,
		lastTs: new Date(Date.now()-1000*60*30).toISOString(),
	},
	{
		id: 'c2',
		title: 'Ops Coordination',
		participants: ['Coordinator'],
		type: 'direct',
		messages: [
			{ id:'m1', sender:'other', name:'Coordinator', body:'Please attach the latest logistics route risk map.', ts: new Date(Date.now()-1000*60*90).toISOString(), read:true },
			{ id:'m2', sender:'me', name:'Me', body:'Will share in 10 minutes.', ts: new Date(Date.now()-1000*60*70).toISOString(), read:true },
		],
		unread: 0,
		lastTs: new Date(Date.now()-1000*60*70).toISOString(),
	},
	{
		id: 'c3',
		title: 'System Alerts',
		participants: ['System'],
		type: 'system',
		messages: [
			{ id:'m1', sender:'other', name:'System', body:'Automated report generation completed: Daily Situation Overview.', ts: new Date(Date.now()-1000*60*20).toISOString(), read:false },
		],
		unread: 1,
		lastTs: new Date(Date.now()-1000*60*20).toISOString(),
	},
];

export default function MessagesPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const toggleSidebar = () => setIsSidebarOpen(o=>!o);

	const [conversations, setConversations] = useState<Conversation[]>(seed);
	const [activeId, setActiveId] = useState<string | null>('c1');
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<'all'|'unread'|'starred'|'system'>('all');
	const [draft, setDraft] = useState('');
	const [sending, setSending] = useState(false);
	const threadRef = useRef<HTMLDivElement|null>(null);
	const [typing, setTyping] = useState(false);

	const active = useMemo(()=> conversations.find(c => c.id===activeId) || null, [conversations, activeId]);

	// Auto-scroll thread bottom
	useEffect(()=> {
		if (threadRef.current) {
			threadRef.current.scrollTop = threadRef.current.scrollHeight;
		}
	}, [activeId, active?.messages.length]);

	// Typing simulation for group threads
	useEffect(()=> {
		if (!active || active.type==='system') return setTyping(false);
		const last = active.messages[active.messages.length-1];
		if (last && last.sender==='me') {
			setTyping(true);
			const t = setTimeout(()=> setTyping(false), 3000);
			return () => clearTimeout(t);
		}
		setTyping(false);
	}, [active?.messages]);

	const filtered = useMemo(()=> {
		const q = search.trim().toLowerCase();
		return conversations.filter(c => {
			if (filter==='unread' && c.unread===0) return false;
			if (filter==='starred' && !c.starred) return false;
			if (filter==='system' && c.type!=='system') return false;
			if (!q) return true;
			return c.title.toLowerCase().includes(q) || c.messages.some(m => m.body.toLowerCase().includes(q));
		}).sort((a,b)=> new Date(b.lastTs).getTime() - new Date(a.lastTs).getTime());
	}, [conversations, search, filter]);

	const unreadTotal = useMemo(()=> conversations.reduce((a,c)=> a+c.unread,0), [conversations]);

	const sendMessage = () => {
		if (!draft.trim() || !active) return;
		setSending(true);
		const text = draft.trim();
		setDraft('');
		setConversations(cs => cs.map(c => c.id===active.id ? {
			...c,
			messages: [...c.messages, { id: 'm'+Date.now(), sender:'me', name:'Me', body:text, ts:new Date().toISOString(), read:true, pending:true }],
			lastTs: new Date().toISOString(),
		} : c));
		setTimeout(()=> {
			setConversations(cs => cs.map(c => c.id===active.id ? {
				...c,
				messages: c.messages.map(m => m.pending ? { ...m, pending:false } : m)
			} : c));
			setSending(false);
		}, 800);
	};

	const markRead = (conv: Conversation) => {
		if (conv.unread===0) return;
		setConversations(cs => cs.map(c => c.id===conv.id ? { ...c, unread:0, messages: c.messages.map(m => ({...m, read:true})) } : c));
	};

	const toggleStar = (conv: Conversation) => {
		setConversations(cs => cs.map(c => c.id===conv.id ? { ...c, starred: !c.starred } : c));
	};

	const createConversation = () => {
		const id = 'c'+Math.random().toString(36).slice(2,7);
		const conv: Conversation = {
			id,
			title: 'New Conversation',
			participants:['User'],
			type:'direct',
			messages:[{ id:'m'+Date.now(), sender:'other', name:'User', body:'Hi, this is a placeholder start.', ts:new Date().toISOString(), read:false }],
			unread:1,
			lastTs: new Date().toISOString(),
		};
		setConversations(cs => [conv, ...cs]);
		setActiveId(id);
	};

	const keyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
	};

	return (
		<div className="flex h-screen bg-[#edf2f9] font-sans text-gray-800">
			<UserSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			<div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
				<UserNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<main className="flex-1 flex min-h-0">
					{/* Conversations Panel */}
					<aside className="w-80 border-r border-gray-200 bg-white flex flex-col">
						<div className="p-4 border-b border-gray-200 space-y-3">
							<div className="flex items-center justify-between">
								<h1 className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" /> Messages</h1>
								<button onClick={createConversation} className="p-2 rounded-full bg-black text-white hover:bg-gray-800" aria-label="New"><Plus className="w-4 h-4" /></button>
							</div>
							<div className="relative">
								<Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
								<input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Search" className="w-full pl-9 pr-3 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
							</div>
							<div className="flex items-center gap-2 text-xs">
								<button onClick={()=> setFilter('all')} className={`px-3 py-1.5 rounded-full border ${filter==='all'?'bg-black text-white border-black':'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>All</button>
								<button onClick={()=> setFilter('unread')} className={`px-3 py-1.5 rounded-full border ${filter==='unread'?'bg-black text-white border-black':'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>Unread {unreadTotal>0 && <span className="ml-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded" aria-label="Unread count">{unreadTotal}</span>}</button>
								<button onClick={()=> setFilter('starred')} className={`px-3 py-1.5 rounded-full border ${filter==='starred'?'bg-black text-white border-black':'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>Starred</button>
								<button onClick={()=> setFilter('system')} className={`p-2 rounded-full border ${filter==='system'?'bg-black text-white border-black':'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`} aria-label="System"><Filter className="w-4 h-4" /></button>
							</div>
						</div>
						<div className="flex-1 overflow-y-auto divide-y divide-gray-100">
							{filtered.map(c => (
								<button key={c.id} onClick={()=> { setActiveId(c.id); markRead(c); }} className={`w-full text-left px-4 py-3 flex flex-col gap-1 hover:bg-gray-50 transition ${c.id===activeId ? 'bg-gray-100':''}`}> 
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm text-gray-900 line-clamp-1 flex items-center gap-2">
											{c.starred && <Star className="w-4 h-4 text-amber-500" />}
											{c.title}
										</span>
										<span className="text-[10px] text-gray-500 tabular-nums">{new Date(c.lastTs).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
									</div>
									<div className="flex items-center gap-2 text-xs text-gray-600">
										<span className="truncate flex-1">{c.messages[c.messages.length-1]?.body}</span>
										{c.unread>0 && <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">{c.unread}</span>}
									</div>
									<div className="flex items-center gap-2 mt-1">
										<button onClick={(e)=> { e.stopPropagation(); toggleStar(c); }} className="text-gray-400 hover:text-amber-500" aria-label="Star">
											{c.starred ? <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> : <StarOff className="w-4 h-4" />}
										</button>
										<span className="text-[10px] uppercase tracking-wide text-gray-400">{c.type}</span>
									</div>
								</button>
							))}
							{filtered.length===0 && (
								<div className="p-6 text-center text-xs text-gray-500">No conversations.</div>
							)}
						</div>
					</aside>
					{/* Thread Area */}
					<section className="flex-1 flex flex-col min-w-0">
						{active ? (
							<>
								<header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
									<div className="flex flex-col">
										<h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">{active.title} {active.starred && <Star className="w-4 h-4 text-amber-500" />}</h2>
										<p className="text-xs text-gray-500">Participants: {active.participants.join(', ') || '—'}</p>
									</div>
									<div className="flex items-center gap-2">
										<button onClick={()=> toggleStar(active)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Star toggle">{active.starred ? <Star className="w-4 h-4 text-amber-500" />:<StarOff className="w-4 h-4 text-gray-500" />}</button>
										<button className="p-2 rounded-full hover:bg-gray-100" aria-label="More"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
									</div>
								</header>
								<div ref={threadRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gray-50">
									{active.messages.map(m => (
										<div key={m.id} className={`flex ${m.sender==='me'?'justify-end':''}`}> 
											<div className={`max-w-[65%] rounded-2xl px-4 py-2 text-sm shadow-sm border ${m.sender==='me'?'bg-black text-white border-gray-900':'bg-white text-gray-800 border-gray-200'} ${m.pending?'opacity-70':''}`}> 
												<div className="flex items-center gap-2 mb-1">
													<span className={`text-[10px] uppercase tracking-wide font-medium ${m.sender==='me'?'text-gray-300':'text-gray-500'}`}>{m.sender==='me'?'Me':m.name}</span>
													<span className={`text-[9px] ${m.sender==='me'?'text-gray-400':'text-gray-400'}`}>{new Date(m.ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
												</div>
												<p className="leading-relaxed whitespace-pre-wrap break-words">{m.body}</p>
												{m.sender==='me' && !m.pending && <div className="mt-1 flex justify-end"><CheckCircle2 className="w-3 h-3 text-blue-400" /></div>}
											</div>
										</div>
									))}
									{typing && (
										<div className="flex items-center gap-2 text-xs text-gray-500">
											<Circle className="w-2 h-2 animate-pulse" /> someone is typing…
										</div>
									)}
								</div>
								{/* Composer */}
								<div className="border-t border-gray-200 p-4 bg-white space-y-2">
									<div className="flex items-center gap-2 text-[11px] text-gray-500">
										<span>Press Enter to send • Shift+Enter for newline</span>
									</div>
									<div className="flex items-end gap-3">
										<button className="p-3 rounded-xl border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600" aria-label="Attach"><Paperclip className="w-5 h-5" /></button>
										<div className="flex-1 relative">
											<textarea value={draft} onChange={e=> setDraft(e.target.value)} onKeyDown={keyDown} rows={2} placeholder="Type a message..." className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
											<div className="absolute right-3 bottom-3 flex items-center gap-2">
												<span className="text-[10px] text-gray-400 tabular-nums">{draft.length}</span>
											</div>
										</div>
										<button disabled={sending || !draft.trim()} onClick={sendMessage} className="p-3 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-40 flex items-center gap-2 text-sm font-medium">
											<Send className={`w-4 h-4 ${sending?'animate-pulse':''}`} /> Send
										</button>
									</div>
								</div>
							</>
						) : (
							<div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-10">
								<MessageSquare className="w-12 h-12 text-blue-600" />
								<h2 className="text-xl font-semibold">Select a conversation</h2>
								<p className="text-sm text-gray-500 max-w-sm">Choose a thread on the left or start a new one to begin chatting with your team.</p>
								<button onClick={createConversation} className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 flex items-center gap-2"><Plus className="w-4 h-4" /> New Conversation</button>
							</div>
						)}
					</section>
				</main>
			</div>
		</div>
	);
}

