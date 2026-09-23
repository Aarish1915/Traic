import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Cpu, Layers, Trophy, Calendar, Users, LogOut, CheckCircle2 } from 'lucide-react';
export function App() {
    const [activeTab, setActiveTab] = useState('projects');
    return (_jsxs("div", { style: { display: 'flex', minHeight: '100vh', backgroundColor: '#07080B', color: '#E8EAF0' }, children: [_jsxs("aside", { style: { width: '260px', backgroundColor: '#0D0F14', borderRight: '1px solid #232838', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '24px', borderBottom: '1px solid #232838' }, children: [_jsx("div", { style: { width: '36px', height: '36px', backgroundColor: 'rgba(255, 159, 28, 0.15)', border: '1px solid rgba(255, 159, 28, 0.4)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9F1C' }, children: _jsx(Cpu, { size: 20 }) }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 800, fontSize: '16px' }, children: "TRAIC ADMIN" }), _jsx("div", { style: { fontSize: '11px', color: '#9AA3B5', textTransform: 'uppercase', letterSpacing: '1px' }, children: "Coordinator Console" })] })] }), _jsx("nav", { style: { marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }, children: [
                                    { id: 'projects', label: 'Projects', icon: _jsx(Layers, { size: 18 }) },
                                    { id: 'events', label: 'Events & Hackathons', icon: _jsx(Calendar, { size: 18 }) },
                                    { id: 'achievements', label: 'Achievements', icon: _jsx(Trophy, { size: 18 }) },
                                    { id: 'applications', label: 'Join Applications', icon: _jsx(Users, { size: 18 }) },
                                ].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        border: activeTab === tab.id ? '1px solid #232838' : '1px solid transparent',
                                        backgroundColor: activeTab === tab.id ? '#141821' : 'transparent',
                                        color: activeTab === tab.id ? '#38BDF8' : '#9AA3B5',
                                        textAlign: 'left',
                                    }, children: [tab.icon, _jsx("span", { children: tab.label })] }, tab.id))) })] }), _jsxs("div", { style: { borderTop: '1px solid #232838', paddingTop: '16px' }, children: [_jsxs("div", { style: { fontSize: '12px', color: '#9AA3B5', marginBottom: '8px' }, children: ["Logged in as ", _jsx("strong", { children: "coordinator@traic.in" })] }), _jsxs("button", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#141821',
                                    color: '#F87171',
                                    border: '1px solid #232838',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    width: '100%',
                                }, children: [_jsx(LogOut, { size: 14 }), _jsx("span", { children: "Sign Out" })] })] })] }), _jsxs("main", { style: { flex: 1, padding: '32px 40px', overflowY: 'auto' }, children: [_jsxs("header", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #232838', marginBottom: '32px' }, children: [_jsxs("div", { children: [_jsxs("h1", { style: { margin: 0, fontSize: '28px', fontWeight: 800, textTransform: 'capitalize' }, children: [activeTab, " Management"] }), _jsx("p", { style: { margin: '4px 0 0', fontSize: '14px', color: '#9AA3B5' }, children: "Publish, update, and manage entries verified against shared Zod schemas." })] }), _jsx("button", { style: {
                                    backgroundColor: '#FF9F1C',
                                    color: '#07080B',
                                    border: 'none',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }, children: "+ Create New Entry" })] }), _jsxs("div", { style: { backgroundColor: '#141821', border: '1px solid #232838', borderRadius: '12px', padding: '24px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#34D399', fontSize: '13px', fontWeight: 600 }, children: [_jsx(CheckCircle2, { size: 16 }), _jsx("span", { children: "Connected to TRAIC API Gateway (Local Monorepo)" })] }), _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '1px solid #232838', color: '#9AA3B5' }, children: [_jsx("th", { style: { padding: '12px 8px' }, children: "Title / Name" }), _jsx("th", { style: { padding: '12px 8px' }, children: "Status" }), _jsx("th", { style: { padding: '12px 8px' }, children: "Last Updated" }), _jsx("th", { style: { padding: '12px 8px', textAlign: 'right' }, children: "Actions" })] }) }), _jsxs("tbody", { children: [_jsxs("tr", { style: { borderBottom: '1px solid rgba(35, 40, 56, 0.4)' }, children: [_jsx("td", { style: { padding: '14px 8px', fontWeight: 600 }, children: "Autonomous Field Rover (UGV-X)" }), _jsx("td", { style: { padding: '14px 8px' }, children: _jsx("span", { style: { backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }, children: "PUBLISHED" }) }), _jsx("td", { style: { padding: '14px 8px', color: '#9AA3B5' }, children: "2024-12-20" }), _jsxs("td", { style: { padding: '14px 8px', textAlign: 'right' }, children: [_jsx("button", { style: { background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }, children: "Edit" }), _jsx("button", { style: { background: 'none', border: '1px solid #232838', color: '#F87171', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }, children: "Archive" })] })] }), _jsxs("tr", { style: { borderBottom: '1px solid rgba(35, 40, 56, 0.4)' }, children: [_jsx("td", { style: { padding: '14px 8px', fontWeight: 600 }, children: "Edge Neural Accelerator Board" }), _jsx("td", { style: { padding: '14px 8px' }, children: _jsx("span", { style: { backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }, children: "PUBLISHED" }) }), _jsx("td", { style: { padding: '14px 8px', color: '#9AA3B5' }, children: "2024-12-18" }), _jsxs("td", { style: { padding: '14px 8px', textAlign: 'right' }, children: [_jsx("button", { style: { background: 'none', border: '1px solid #232838', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }, children: "Edit" }), _jsx("button", { style: { background: 'none', border: '1px solid #232838', color: '#F87171', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }, children: "Archive" })] })] })] })] })] })] })] }));
}
//# sourceMappingURL=App.js.map