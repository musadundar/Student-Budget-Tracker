import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PieChart, Clock, Edit2, Check, X } from 'lucide-react'
// import { MOCK_TRANSACTIONS } from '../lib/mockData' // Removed

// DEFAULT_LIMITS moved to Layout.jsx

export default function Budget() {
    const { currency, t, categories, budgetLimits, setBudgetLimits, transactions } = useOutletContext()
    const [editingCategory, setEditingCategory] = useState(null)
    const [editValue, setEditValue] = useState('')

    // Removed local budgetLimits state logic as it is now global

    const calculateSpent = (categoryName) => {
        return transactions
            .filter(t => t.type === 'expense' && t.category === categoryName)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    }

    const handleEditClick = (categoryName, currentLimit) => {
        setEditingCategory(categoryName)
        setEditValue(currentLimit.toString())
    }

    const handleSave = (categoryName) => {
        const newLimits = { ...budgetLimits, [categoryName]: parseFloat(editValue) || 0 }
        setBudgetLimits(newLimits) // This now refers to the context function
        localStorage.setItem('budgetLimits', JSON.stringify(newLimits))
        setEditingCategory(null)
    }

    // Filter out Salary from Budget view usually
    const expenseCategories = categories.filter(c => c.name !== 'Salary')

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('budget_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('budget_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {expenseCategories.map(cat => {
                    const categoryName = cat.name
                    const limit = budgetLimits[categoryName] || 0
                    const spent = calculateSpent(categoryName)
                    const percentage = limit > 0 ? Math.min((spent / limit) * 100, 100) : (spent > 0 ? 100 : 0)
                    const isOverBudget = spent > limit

                    return (
                        <div key={cat.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{cat.isSystem ? t(categoryName) : categoryName}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('spent')}: {currency}{spent.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    {editingCategory === categoryName ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-24 p-1 border rounded text-right dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                autoFocus
                                            />
                                            <button onClick={() => handleSave(categoryName)} className="p-1 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setEditingCategory(null)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="group flex items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('limit')}: {currency}{limit.toFixed(2)}</span>
                                            <button
                                                onClick={() => handleEditClick(categoryName, limit)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-all"
                                                title={t('edit_limit')}
                                            >
                                                <Edit2 size={14} className="text-slate-400 dark:text-slate-500" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-brand-primary'}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
