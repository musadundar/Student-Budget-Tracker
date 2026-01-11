import { useState, useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Search, ArrowUpRight, ArrowDownRight, Calendar, ShoppingBag, Car, Home, Film, Heart, BookOpen, Gift, Briefcase, DollarSign, HelpCircle, Utensils, Filter, Trash2 } from 'lucide-react'

export default function Transactions() {
    const { currency, t, categories: globalCategories, transactions, setTransactions } = useOutletContext()
    const [filter, setFilter] = useState('all') // Type filter (income/expense)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [dateRange, setDateRange] = useState({ start: '', end: '' })


    const getCategoryIcon = (category) => {
        switch (category) {
            case 'cat_food': return <Utensils size={20} />;
            case 'cat_transport': return <Car size={20} />;
            case 'cat_entertainment': return <Film size={20} />;
            case 'cat_rent': return <Home size={20} />;
            case 'cat_health': return <Heart size={20} />;
            case 'cat_edu': return <BookOpen size={20} />;
            case 'cat_shopping': return <ShoppingBag size={20} />;
            case 'cat_gift': return <Gift size={20} />;
            case 'cat_freelance': return <Briefcase size={20} />;
            case 'Salary': return <DollarSign size={20} />;
            default: return <HelpCircle size={20} />;
        }
    }

    const filteredTransactions = useMemo(() => {
        const safeTransactions = Array.isArray(transactions) ? transactions : []
        return safeTransactions
            .filter(tx => {
                if (!tx || typeof tx !== 'object') return false;

                // 1. Type Filter
                const matchesType = filter === 'all' || tx.type === filter

                // 2. Search (Description or Title or Category)
                const searchLower = searchTerm.toLowerCase()
                // Translating title/cat on the fly for search would be ideal but complex. 
                // For now, search raw description + raw title + raw category 
                // + potentially translated title/cat if simple replacers used?
                // Let's stick to searching the data properties. 
                // Description is plain text in mock data (e.g. 'Trader Joes haul'). 
                const matchesSearch =
                    (tx.description || '').toLowerCase().includes(searchLower) ||
                    (tx.title || '').toLowerCase().includes(searchLower) ||
                    (t(tx.title || '') || '').toLowerCase().includes(searchLower) ||
                    (tx.category || '').toLowerCase().includes(searchLower)

                // 3. Category Filter
                const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter

                // 4. Date Filter
                let matchesDate = true
                if (dateRange.start) {
                    matchesDate = matchesDate && new Date(tx.date) >= new Date(dateRange.start)
                }
                if (dateRange.end) {
                    matchesDate = matchesDate && new Date(tx.date) <= new Date(dateRange.end)
                }

                return matchesType && matchesSearch && matchesCategory && matchesDate
            })
            .sort((a, b) => {
                const dateA = new Date(a.date || 0)
                const dateB = new Date(b.date || 0)
                return dateB - dateA
            })
    }, [transactions, filter, searchTerm, categoryFilter, dateRange, t])

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('transactions_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('transactions_subtitle')}</p>
            </div>

            {/* Advanced Filters Container */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 transition-colors">

                {/* Top Row: Search & Type Filter */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 input-field w-full"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        {['all', 'income', 'expense'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? (f === 'income' ? 'bg-emerald-600 text-white' : f === 'expense' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white dark:bg-slate-600 dark:text-white') : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {t(`filter_${f}`)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bottom Row: Category & Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('filter_category')}</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="input-field w-full"
                        >
                            <option value="all">{t('all_categories')}</option>
                            {Array.isArray(globalCategories) && globalCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.isSystem ? t(cat.name) : cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('filter_date_start')}</label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="input-field w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('filter_date_end')}</label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="input-field w-full"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                            >
                                <Link
                                    to={`/transactions/${transaction.id}`}
                                    className="flex-1 flex items-center justify-between mr-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${transaction.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'} group-hover:scale-110 transition-transform`}>
                                            {getCategoryIcon(transaction.category)}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-lg group-hover:text-brand-primary transition-colors">{t(transaction.title)}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{transaction.description}</p>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">{t(transaction.category)}</span>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {transaction.date}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-lg flex items-center gap-1 ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                        {transaction.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                        {currency}{Math.abs(transaction.amount).toFixed(2)}
                                    </div>
                                </Link>
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
                        ))
                    ) : (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                            {t('no_transactions')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
