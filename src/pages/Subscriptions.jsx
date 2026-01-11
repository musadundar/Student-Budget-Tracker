import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { CalendarClock, Plus, X, Calendar, Pencil, Trash2, Tv, Music, Zap, Briefcase, Gamepad2, ShoppingBag, BookOpen, LayoutGrid } from 'lucide-react'

const CATEGORIES = [
    { id: 'entertainment', icon: Tv, labelKey: 'sub_cat_entertainment' },
    { id: 'music', icon: Music, labelKey: 'sub_cat_music' },
    { id: 'utilities', icon: Zap, labelKey: 'sub_cat_utilities' },
    { id: 'software', icon: Briefcase, labelKey: 'sub_cat_software' },
    { id: 'gaming', icon: Gamepad2, labelKey: 'sub_cat_gaming' },
    { id: 'shopping', icon: ShoppingBag, labelKey: 'sub_cat_shopping' },
    { id: 'education', icon: BookOpen, labelKey: 'sub_cat_education' },
    { id: 'other', icon: LayoutGrid, labelKey: 'sub_cat_other' }
]

const INITIAL_SUBSCRIPTIONS = [
    { id: 1, name: 'Netflix', cost: 15.99, billingDay: 5, category: 'entertainment' },
    { id: 2, name: 'Spotify', cost: 9.99, billingDay: 15, category: 'music' },
    { id: 3, name: 'Adobe Creative Cloud', cost: 29.99, billingDay: 1, category: 'software' },
]

export default function Subscriptions() {
    const { currency, t } = useOutletContext()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [subscriptions, setSubscriptions] = useState(() => {
        try {
            const saved = localStorage.getItem('subscriptions')
            const parsed = saved ? JSON.parse(saved) : null
            if (Array.isArray(parsed) && parsed.every(s => s && typeof s.cost !== 'undefined' && s.billingDay)) {
                return parsed
            }
            return INITIAL_SUBSCRIPTIONS
        } catch (e) {
            return INITIAL_SUBSCRIPTIONS
        }
    })

    const [newSub, setNewSub] = useState({ name: '', cost: '', billingDay: '', category: 'other' })

    const totalMonthly = subscriptions.reduce((sum, sub) => sum + (Number(sub.cost) || 0), 0)

    const handleSaveSubscription = (e) => {
        e.preventDefault()
        if (!newSub.name || !newSub.cost || !newSub.billingDay) return

        let updatedSubs
        if (editingId) {
            // Edit existing
            updatedSubs = subscriptions.map(sub =>
                sub.id === editingId
                    ? {
                        ...sub,
                        name: newSub.name,
                        cost: parseFloat(newSub.cost),
                        billingDay: parseInt(newSub.billingDay),
                        category: newSub.category
                    }
                    : sub
            )
        } else {
            // Add new
            const subscription = {
                id: Date.now(),
                name: newSub.name,
                cost: parseFloat(newSub.cost),
                billingDay: parseInt(newSub.billingDay),
                category: newSub.category || 'other'
            }
            updatedSubs = [...subscriptions, subscription]
        }

        setSubscriptions(updatedSubs)
        localStorage.setItem('subscriptions', JSON.stringify(updatedSubs))

        // Reset
        closeModal()
    }

    const startEdit = (sub) => {
        setNewSub({
            name: sub.name,
            cost: sub.cost,
            billingDay: sub.billingDay,
            category: sub.category || 'other'
        })
        setEditingId(sub.id)
        setIsModalOpen(true)
    }

    const handleDelete = (id) => {
        if (!window.confirm(t('confirm_delete') || 'Are you sure you want to delete this subscription?')) return
        const updatedSubs = subscriptions.filter(sub => sub.id !== id)
        setSubscriptions(updatedSubs)
        localStorage.setItem('subscriptions', JSON.stringify(updatedSubs))
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
        setNewSub({ name: '', cost: '', billingDay: '', category: 'other' })
    }

    const today = new Date().getDate()

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('subs_title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('subs_subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setNewSub({ name: '', cost: '', billingDay: '', category: 'other' })
                        setIsModalOpen(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-medium shadow-lg shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>{t('add_subscription')}</span>
                </button>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-brand-secondary to-brand-primary rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2 opacity-90">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <CalendarClock size={24} />
                        </div>
                        <span className="font-medium tracking-wide">{t('total_monthly_cost')}</span>
                    </div>
                    <h2 className="text-5xl font-bold mb-4">{currency}{totalMonthly.toFixed(2)}</h2>
                    <p className="text-brand-light text-sm font-medium bg-white/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                        {(t('active_subscriptions') || '').replace('{count}', subscriptions.length)}
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map(sub => {
                    const billingDay = parseInt(sub.billingDay) || 1
                    const daysLeft = billingDay >= today ? billingDay - today : (30 - today + billingDay)
                    const category = CATEGORIES.find(c => c.id === sub.category) || CATEGORIES[7] // Fallback to 'other'
                    const Icon = category.icon

                    return (
                        <div key={sub.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-colors group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-xl text-brand-primary">
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{sub.name}</h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t(category.labelKey)}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-white text-lg">{currency}{Number(sub.cost).toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 pl-1">
                                    <Calendar size={12} />
                                    {(t('billed_on') || '').replace('{day}', billingDay)}
                                </div>
                            </div>

                            <div className="space-y-4 mt-4">
                                <div className="w-full py-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-center text-sm text-slate-500 dark:text-slate-300 font-medium">
                                    <span className="text-brand-primary font-bold">{daysLeft}</span> {t('days_left')}
                                </div>
                                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => startEdit(sub)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Pencil size={16} />
                                        {t('edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        {t('delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingId ? t('edit_subscription') : t('add_subscription')}</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveSubscription} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('subscription_name')}</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full"
                                    placeholder={t('placeholder_netflix')}
                                    value={newSub.name}
                                    onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('cat_select_label')}</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {CATEGORIES.map(cat => {
                                        const Icon = cat.icon
                                        const isSelected = newSub.category === cat.id
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setNewSub({ ...newSub, category: cat.id })}
                                                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${isSelected
                                                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                                    : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                    }`}
                                                title={t(cat.labelKey)}
                                            >
                                                <Icon size={20} />
                                                <span className="text-[10px] mt-1 font-medium truncate w-full text-center">{t(cat.labelKey)}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('cost_label')} ({currency})</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="input-field w-full"
                                        placeholder="0.00"
                                        value={newSub.cost}
                                        onChange={e => setNewSub({ ...newSub, cost: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('billing_day')}</label>
                                    <input
                                        type="number"
                                        min="1" max="31"
                                        required
                                        className="input-field w-full"
                                        placeholder="1-31"
                                        value={newSub.billingDay}
                                        onChange={e => setNewSub({ ...newSub, billingDay: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full bg-brand-primary justify-center mt-6">
                                {editingId ? t('save_changes') : t('add_subscription')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
