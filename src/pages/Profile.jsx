import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { User, Mail, Shield, LogOut, Wallet, Calendar, Lock, Check } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
// import { MOCK_TRANSACTIONS } from '../lib/mockData' // Removed

export default function Profile() {
    const { session, t, currency, transactions } = useOutletContext()
    const user = session?.user
    const [loading, setLoading] = useState(false)
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
    const [message, setMessage] = useState({ type: '', text: '' })

    const [sessionData, setSessionData] = useState(session?.user || {})

    // Calculate Stats
    const totalSpent = transactions
        ? transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)
        : 0

    // Mock Join Date (or use user.created_at if correct format)
    const joinDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : new Date().toLocaleDateString()

    // Avatar Logic
    const getInitials = (email) => {
        return email ? email.substring(0, 2).toUpperCase() : 'U'
    }
    const avatarColor = 'bg-brand-primary' // Consistent brand color

    const handleLogout = async () => {
        if (localStorage.getItem('sb-demo-session')) {
            localStorage.removeItem('sb-demo-session')
            window.location.reload()
            return
        }
        await supabase.auth.signOut()
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()
        setMessage({ type: '', text: '' })

        if (passwordForm.new !== passwordForm.confirm) {
            setMessage({ type: 'error', text: t('password_mismatch') })
            return
        }

        if (passwordForm.new.length < 6) {
            setMessage({ type: 'error', text: t('password_too_short') || 'Password must be at least 6 characters.' })
            return
        }

        setLoading(true)

        // Handle Demo Mode
        if (localStorage.getItem('sb-demo-session')) {
            setTimeout(() => {
                setLoading(false)
                setMessage({ type: 'success', text: t('password_updated') })
                setPasswordForm({ current: '', new: '', confirm: '' })
            }, 1000)
            return
        }

        // Real Supabase Update
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordForm.new
            })

            if (error) throw error

            setMessage({ type: 'success', text: t('password_updated') })
            setPasswordForm({ current: '', new: '', confirm: '' })
        } catch (error) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('profile_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('profile_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
                        <div className={`w-24 h-24 ${avatarColor} rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-brand-primary/20`}>
                            {getInitials(user?.email)}
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 dark:text-white break-all">{user?.email?.split('@')[0]}</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">{t('budget_tracker_member')}</p>

                        <div className="w-full space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <Mail size={18} className="text-slate-400" />
                                <div className="text-left overflow-hidden">
                                    <p className="text-xs text-slate-400 font-bold uppercase">{t('email_address')}</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm truncate" title={user?.email}>{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                <Shield size={18} className="text-slate-400" />
                                <div className="text-left">
                                    <p className="text-xs text-slate-400 font-bold uppercase">{t('account_type')}</p>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm">{t('standard_plan')}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="mt-6 flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors w-full justify-center text-sm"
                        >
                            <LogOut size={18} />
                            <span>{t('nav_logout')}</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Stats & Form */}
                <div className="md:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors">
                            <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-xl">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('total_spent')}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{currency}{totalSpent.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-colors">
                            <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('join_date')}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{joinDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                        <div className="flex items-center gap-2 mb-6">
                            <Lock className="text-brand-primary" size={24} />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('change_password_title')}</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('current_password')}</label>
                                <input
                                    type="password"
                                    className="input-field w-full"
                                    value={passwordForm.current}
                                    onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('new_password')}</label>
                                    <input
                                        type="password"
                                        className="input-field w-full"
                                        value={passwordForm.new}
                                        onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('confirm_password')}</label>
                                    <input
                                        type="password"
                                        className="input-field w-full"
                                        value={passwordForm.confirm}
                                        onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {message.text && (
                                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                    {message.type === 'success' && <Check size={16} />}
                                    {message.text}
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary"
                                >
                                    {loading ? 'Updating...' : t('update_password')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
