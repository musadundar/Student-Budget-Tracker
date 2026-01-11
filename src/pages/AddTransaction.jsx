import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Calendar, DollarSign, Tag, FileText, ArrowLeft } from 'lucide-react'

export default function AddTransaction({ type = 'expense' }) {
    const navigate = useNavigate()
    const { categories: globalCategories, t, addTransaction } = useOutletContext() // Get from context
    const isExpense = type === 'expense'
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: '',
        category: isExpense ? (globalCategories.find(c => c.name === 'cat_food')?.name || 'Food') : 'Salary',
        date: new Date().toISOString().split('T')[0],
        description: ''
    })

    // ... (categories logic remains same) ...

    const availableCategories = isExpense
        ? globalCategories.filter(c => c.name !== 'Salary')
        : globalCategories.filter(c => ['Salary', 'cat_freelance', 'cat_gift'].includes(c.name) || !c.isSystem)

    const displayCategories = globalCategories.filter(c => {
        if (isExpense) return c.name !== 'Salary'
        return true
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const newTx = {
            id: Date.now(), // Generate ID
            title: formData.category, // Simplified title logic for now, or use description
            amount: isExpense ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
            type,
            date: formData.date,
            category: formData.category,
            description: formData.description
        }

        // Add to global state
        addTransaction(newTx)

        // Simulate network delay slightly for UX
        setTimeout(() => {
            setLoading(false)
            navigate('/')
        }, 500)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>{t('back')}</span>
            </button>

            <div>
                <h1 className={`text-3xl font-bold ${isExpense ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'}`}>
                    {isExpense ? t('add_expense') : t('add_income')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    {(t('record_new_transaction') || '').replace('{type}', isExpense ? t('expense').toLowerCase() : t('income').toLowerCase())}
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 md:p-8 transition-colors">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('amount')}</label>
                        <div className="relative">
                            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isExpense ? 'text-red-400' : 'text-emerald-400'}`}>
                                <DollarSign size={20} />
                            </div>
                            <input
                                type="number"
                                name="amount"
                                required
                                min="0"
                                step="0.01"
                                value={formData.amount}
                                onChange={handleChange}
                                className="pl-10 input-field text-lg font-medium"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('filter_category')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                <Tag size={20} />
                            </div>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="pl-10 input-field"
                            >
                                {displayCategories.map(cat => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.isSystem ? t(cat.name) : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('date')}</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                <Calendar size={20} />
                            </div>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="pl-10 input-field"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('description')} ({t('optional')})</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-slate-400 dark:text-slate-500">
                                <FileText size={20} />
                            </div>
                            <textarea
                                name="description"
                                rows="3"
                                value={formData.description}
                                onChange={handleChange}
                                className="pl-10 input-field resize-none"
                                placeholder={t('description_placeholder')}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-3 rounded-xl font-medium text-white shadow-lg transition-all active:scale-95 ${isExpense
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none'
                                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none'
                                }`}
                        >
                            {loading ? t('save') + '...' : t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
