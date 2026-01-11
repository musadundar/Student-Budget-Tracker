import { useOutletContext, Link } from 'react-router-dom'
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus, TrendingUp, TrendingDown, DollarSign, Calendar, Trash2 } from 'lucide-react'
// import { MOCK_TRANSACTIONS } from '../lib/mockData' // Removed

export default function Dashboard() {
    const { currency, t, categories, budgetLimits, transactions, setTransactions, isLoading } = useOutletContext()

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const balance = totalIncome - totalExpense

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

    // Implement Skeleton Loading
    if (isLoading) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                    <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl mb-2"></div>
                    <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-xl"></div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 h-40 animate-pulse">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                            <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded mt-4"></div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                    <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                </div>

                {/* Budget Status Skeleton */}
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4 animate-pulse">
                    <div className="flex justify-between">
                        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            </div>
                            <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Original Return
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('dashboard_welcome')}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-brand-primary to-violet-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Wallet size={24} className="text-white" />
                        </div>
                        <span className="text-brand-light font-medium">{t('total_balance')}</span>
                    </div>
                    <h2 className="text-4xl font-bold">{currency}{balance.toFixed(2)}</h2>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <ArrowUpCircle size={24} className="text-emerald-500" />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{t('monthly_income')}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{currency}{totalIncome.toFixed(2)}</h2>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                            <ArrowDownCircle size={24} className="text-red-500" />
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{t('monthly_expenses')}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{currency}{totalExpense.toFixed(2)}</h2>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/add-income" className="btn-primary bg-emerald-600 hover:bg-emerald-700 justify-center py-4">
                    <Plus size={20} />
                    {t('add_income')}
                </Link>
                <Link to="/add-expense" className="btn-primary bg-red-600 hover:bg-red-700 justify-center py-4">
                    <Plus size={20} />
                    {t('add_expense')}
                </Link>
            </div>

            {/* Budget Status */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('budget_status')}</h2>
                    <Link to="/budget" className="text-brand-primary text-sm font-medium hover:underline">{t('view_all')}</Link>
                </div>
                <div className="space-y-4">
                    {categories.filter(c => budgetLimits && budgetLimits[c.name] > 0).slice(0, 3).map(cat => {
                        const limit = budgetLimits[cat.name]
                        const spent = transactions
                            .filter(t => t.type === 'expense' && t.category === cat.name)
                            .reduce((sum, t) => sum + Math.abs(t.amount), 0)
                        const percentage = Math.min((spent / limit) * 100, 100)
                        const isOverBudget = spent > limit

                        return (
                            <div key={cat.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat.isSystem ? t(cat.name) : cat.name}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{Math.round(percentage)}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-brand-primary'}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-slate-400 dark:text-slate-500">
                                    <span>{currency}{spent.toFixed(0)} {t('spent')}</span>
                                    <span>{currency}{limit.toFixed(0)} {t('limit')}</span>
                                </div>
                            </div>
                        )
                    })}
                    {categories.filter(c => budgetLimits && budgetLimits[c.name] > 0).length === 0 && (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-sm">{t('no_budget_limits')}</p>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{t('recent_transactions')}</h2>
                <div className="space-y-4">
                    {recentTransactions.map(transaction => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                                    {transaction.type === 'income' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{t(transaction.title) || transaction.description}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {transaction.type === 'income' ? '+' : '-'}{currency}{Math.abs(transaction.amount).toFixed(2)}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        const updated = transactions.filter(t => t.id !== transaction.id)
                                        setTransactions(updated)
                                    }}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all relative z-10"
                                    title={t('delete') || 'Delete'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {recentTransactions.length === 0 && (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-4">{t('no_transactions')}</p>
                    )}
                </div>
            </div>
        </div>
    )
}
