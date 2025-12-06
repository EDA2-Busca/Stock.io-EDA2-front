'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '@/utilis/api';
import { useRouter } from 'next/navigation';
import { FaBell, FaCheck, FaTrashAlt, FaCircle } from 'react-icons/fa';

type Notificacao = {
    id: number;
    mensagem: string;
    lida: boolean;
    createdAt: string;
    link?: string;
};

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        fetchNotificacoes();

        const interval = setInterval(fetchNotificacoes, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotificacoes = async () => {
        try {
            const res = await api.get('/notificacoes');
            setNotificacoes(res.data);
            const naoLidas = res.data.filter((n: Notificacao) => !n.lida).length;
            setUnreadCount(naoLidas);
        } catch (error) {
            console.error("Erro ao buscar notificações", error);
        }
    };

    const handleMarkAsRead = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        try {
            await api.patch(`/notificacoes/${id}/lida`);
            setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Erro ao marcar", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notificacoes/ler-todas');
            setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Erro ao ler todas", error);
        }
    }
    const handleNotificationClick = async (notificacao: Notificacao) => {
        if (!notificacao.lida) {
            try {
                await api.patch(`/notificacoes/${notificacao.id}/lida`);
                setNotificacoes(prev => prev.map(n => n.id === notificacao.id ? { ...n, lida: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (e) { console.error(e) }
        }

        setIsOpen(false);

        if (notificacao.link) {
            router.push(notificacao.link);
        } else {
            console.log("Notificação sem link específico");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 px-0.5 top-1 transition-colors
                    ${isOpen ? 'text-[#C6E700]' : 'text-white hover:text-[#C6E700]'}
                    `}
            >
                <FaBell size={36} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-90 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100">
                    <div className="bg-background px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-700">Notificações</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                                title="Marcar todas como lidas"
                            >
                                <FaTrashAlt size={10} /> Limpar
                            </button>
                        )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notificacoes.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                Nenhuma notificação.
                            </div>
                        ) : (
                            <ul>
                                {notificacoes.map((n) => (
                                    <li
                                        key={n.id}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`relative border-b border-gray-50 last:border-0 transition-colors cursor-pointer flex justify-between items-start 
                                            ${n.lida ? 'bg-white hover:bg-gray-50 opacity-70' : 'bg-purple-50 hover:bg-purple-100'}
                                                `}
                                    >
                                        <div className="px-4 py-3 pr-10">
                                            <div className="flex items-center gap-2 mb-1">
                                                {!n.lida && <FaCircle size={6} className="text-primary" />}
                                                <span className="text-xs text-gray-400">
                                                    {new Date(n.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-800 leading-snug">
                                                {n.mensagem}
                                            </p>
                                        </div>
                                        {!n.lida && (
                                            <button
                                                onClick={(e) => handleMarkAsRead(e, n.id)}
                                                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-full transition-all"
                                                title="Marcar como lida"
                                            >
                                                <FaCheck size={12} />
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}