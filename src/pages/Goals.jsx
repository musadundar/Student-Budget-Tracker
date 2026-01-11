import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Plus, Target, X, PiggyBank, Pencil, Trash2, Coins } from 'lucide-react'

const INITIAL_GOALS = [
    { id: 1, name: 'goal_vacation', target: 5000, current: 1500, color: 'blue' },
    { id: 2, name: 'goal_laptop', target: 15000, current: 8000, color: 'purple' },
]

export default function Goals() {
    const { currency, t } = useOutletContext()
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
    const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false)
    const [editingGoal, setEditingGoal] = useState(null)
    const [activeGoalId, setActiveGoalId] = useState(null)

    const [goals, setGoals] = useState(() => {
        try {
            const saved = localStorage.getItem('goals')
            return saved ? JSON.parse(saved) : INITIAL_GOALS
        } catch (e) {
            return INITIAL_GOALS
        }
    })

    const [goalForm, setGoalForm] = useState({ name: '', target: '', color: 'blue' })
    const [addAmount, setAddAmount] = useState('')

    const COLORS = [
        { id: 'blue', bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
        { id: 'green', bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-100' },
        { id: 'purple', bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
        { id: 'orange', bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' },
        { id: 'pink', bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-100' },
        { id: 'red', bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
    ]

    const handleSaveGoal = (e) => {
        e.preventDefault()
        if (!goalForm.name || !goalForm.target) return

        let updatedGoals
        if (editingGoal) {
            updatedGoals = goals.map(g => g.id === editingGoal.id ? { ...g, ...goalForm, target: parseFloat(goalForm.target) } : g)
        } else {
            const newGoal = {
                id: Date.now(),
                ...goalForm,
                target: parseFloat(goalForm.target),
                current: 0
            }
            updatedGoals = [...goals, newGoal]
        }

        setGoals(updatedGoals)
        localStorage.setItem('goals', JSON.stringify(updatedGoals))
        closeGoalModal()
    }

    const handleDeleteGoal = (id) => {
        if (!window.confirm(t('confirm_delete') || 'Delete this goal?')) return
        const updated = goals.filter(g => g.id !== id)
        setGoals(updated)
        localStorage.setItem('goals', JSON.stringify(updated))
    }

    const handleAddMoney = (e) => {
        e.preventDefault()
        if (!addAmount || !activeGoalId) return

        const amount = parseFloat(addAmount)
        const updatedGoals = goals.map(g => {
            if (g.id === activeGoalId) {
                const newCurrent = g.current + amount
                if (newCurrent >= g.target && g.current < g.target) {
                    alert(t('congratulations') + ' ' + t('goal_reached'))
                }
                return { ...g, current: newCurrent }
            }
            return g
        })

        setGoals(updatedGoals)
        localStorage.setItem('goals', JSON.stringify(updatedGoals))
        closeMoneyModal()
    }

    const openGoalModal = (goal = null) => {
        if (goal) {
            setEditingGoal(goal)
            setGoalForm({ name: goal.name, target: goal.target, color: goal.color })
        } else {
            setEditingGoal(null)
            setGoalForm({ name: '', target: '', color: 'blue' })
        }
        setIsGoalModalOpen(true)
    }

    const closeGoalModal = () => {
        setIsGoalModalOpen(false)
        setEditingGoal(null)
    }

    const openMoneyModal = (id) => {
        setActiveGoalId(id)
        setAddAmount('')
        setIsMoneyModalOpen(true)
    }

    const closeMoneyModal = () => {
        setIsMoneyModalOpen(false)
        setActiveGoalId(null)
    }

    const totalSaved = goals.reduce((sum, g) => sum + g.current, 0)
    const totalTarget = goals.reduce((sum, g) => sum + g.target, 0)

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('goals_title')}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('goals_subtitle')}</p>
                </div>
                <button
                    onClick={() => openGoalModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl font-medium shadow-lg hover:bg-brand-secondary transition-all active:scale-95"
                >
                    <Plus size={20} />
                    <span>{t('add_goal')}</span>
                </button>
            </div>

            {/* Total Summary */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                        <PiggyBank size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t('total_balance') || 'Total Saved'}</h2>
                        <div className="text-2xl font-bold text-brand-primary">{currency}{totalSaved.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ {currency}{totalTarget.toLocaleString()}</span></div>
                    </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-brand-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const percentage = Math.min((goal.current / goal.target) * 100, 100)
                    const colorParams = COLORS.find(c => c.id === goal.color) || COLORS[0]

                    return (
                        <div key={goal.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${colorParams.bg} opacity-5 rounded-full -mr-8 -mt-8`}></div>

                            <div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 ${colorParams.light} rounded-lg ${colorParams.text}`}>
                                            <Target size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t(goal.name) || goal.name}</h3>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openGoalModal(goal)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-500 dark:text-slate-400">{t('current_saved')}</span>
                                        <span className="text-slate-900 dark:text-white">{currency}{goal.current.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`${colorParams.bg} h-full rounded-full transition-all duration-1000 relative`}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>{percentage.toFixed(0)}%</span>
                                        <span>{t('goal_target')}: {currency}{goal.target.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => openMoneyModal(goal.id)}
                                className={`w-full py-2.5 rounded-xl font-medium border-2 transition-all flex items-center justify-center gap-2
                                    ${percentage >= 100
                                        ? 'border-emerald-500 text-emerald-600 bg-emerald-50 cursor-default'
                                        : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5'
                                    }`}
                                disabled={percentage >= 100}
                            >
                                {percentage >= 100 ? (
                                    <>
                                        <PiggyBank size={18} />
                                        <span>{t('goal_reached')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Coins size={18} />
                                        <span>{t('add_money')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Create/Edit Goal Modal */}
            {isGoalModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{editingGoal ? t('edit_goal') : t('add_goal')}</h2>
                            <button onClick={closeGoalModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveGoal} className="space-y-4">
                            <div>
                                <label className="label">{t('goal_name')}</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field w-full"
                                    value={goalForm.name}
                                    onChange={e => setGoalForm({ ...goalForm, name: e.target.value })}
                                    placeholder="e.g. New Car"
                                />
                            </div>
                            <div>
                                <label className="label">{t('goal_target')} ({currency})</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field w-full"
                                    value={goalForm.target}
                                    onChange={e => setGoalForm({ ...goalForm, target: e.target.value })}
                                    placeholder="5000"
                                />
                            </div>
                            <div>
                                <label className="label">{t('goal_color')}</label>
                                <div className="flex gap-3">
                                    {COLORS.map(c => (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setGoalForm({ ...goalForm, color: c.id })}
                                            className={`w-8 h-8 rounded-full ${c.bg} transition-all ${goalForm.color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-70 hover:opacity-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="btn-primary w-full justify-center mt-4">
                                {t('save_changes') || 'Save'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Money Modal */}
            {isMoneyModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('add_money')}</h2>
                            <button onClick={closeMoneyModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddMoney} className="space-y-4">
                            <div>
                                <label className="label">{t('amount')} ({currency})</label>
                                <input
                                    type="number"
                                    required
                                    autoFocus
                                    className="input-field w-full text-2xl font-bold text-center py-4"
                                    value={addAmount}
                                    onChange={e => setAddAmount(e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full justify-center mt-4 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25">
                                <Plus size={20} />
                                {t('add_money')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
