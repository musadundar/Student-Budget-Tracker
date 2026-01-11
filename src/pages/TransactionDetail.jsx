import { useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { ArrowLeft, Trash2, Calendar, Tag, FileText, ArrowUpRight, ArrowDownRight, Edit2, Check, X } from 'lucide-react'
// import { MOCK_TRANSACTIONS } from '../lib/mockData' // Removed
import { supabase } from '../lib/supabaseClient'

export default function TransactionDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t, categories, transactions, setTransactions } = useOutletContext()

    // In a real app, fetch from Supabase. Using simplified mock logic here.
    const transaction = transactions.find(t => t.id === Number(id))

    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        amount: transaction ? Math.abs(transaction.amount) : '',
        date: transaction ? transaction.date : '',
        category: transaction ? transaction.category : '',
        description: transaction ? (transaction.description || '') : ''
    })

    if (!transaction) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-800">{t('no_transactions') || 'Transaction not found'}</h2>
                <button onClick={() => navigate(-1)} className="text-brand-primary mt-4 hover:underline">Go back</button>
            </div>
        )
    }

    const isIncome = transaction.type === 'income'

    const handleDelete = async () => {
        if (confirm(t('confirm_delete') || 'Are you sure?')) {
            const updatedTransactions = transactions.filter(t => t.id !== Number(id))
            setTransactions(updatedTransactions)
            navigate('/')
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Real Supabase Update
            // const { error } = await supabase
            //     .from('transactions')
            //     .update({
            //         amount: isIncome ? parseFloat(formData.amount) : -parseFloat(formData.amount),
            //         date: formData.date,
            //         category: formData.category,
            //         description: formData.description
            //     })
            //     .eq('id', id)

            // if (error) {
            //     // If table doesn't exist (likely in this demo environment), log and simulate success
            //     console.warn('Supabase update failed (expected if table missing):', error)
            // }

            // Simulate success for UI
            const updatedTx = {
                ...transaction,
                amount: isIncome ? parseFloat(formData.amount) : -parseFloat(formData.amount),
                date: formData.date,
                category: formData.category,
                description: formData.description
            }

            const updatedTransactions = transactions.map(t => t.id === Number(id) ? updatedTx : t)
            setTransactions(updatedTransactions)

            setIsEditing(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>

            {isEditing ? (
                // EDIT MODE
                <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden p-8 space-y-6 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('edit_transaction')}</h2>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('amount')}</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="input-field w-full text-lg font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('date')}</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="input-field w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('category') || 'Category'}</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="input-field w-full"
                        >
                            {/* Use dynamic categories from context if available, or just defaults + current */}
                            {categories && categories.length > 0 ? (
                                categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.isSystem ? t(cat.name) : cat.name}
                                    </option>
                                ))
                            ) : (
                                <option value={formData.category}>{formData.category}</option>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('description')}</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="input-field w-full h-24 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 flex items-center justify-center gap-2"
                        >
                            <Check size={20} />
                            {loading ? 'Saving...' : t('update')}
                        </button>
                    </div>
                </form>
            ) : (
                // VIEW MODE
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className={`p-8 text-center ${isIncome ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isIncome ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>
                            {isIncome ? <ArrowUpRight size={32} /> : <ArrowDownRight size={32} />}
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                        </h1>
                        <p className={`font-medium mt-2 uppercase tracking-wide text-sm ${isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {transaction.type}
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{formData.category ? (t(formData.category) || formData.category) : transaction.title}</h2>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
                                >
                                    <Edit2 size={16} />
                                    {t('edit')}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300 mt-1">
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('category') || 'Category'}</p>
                                        <p className="text-lg text-slate-900 dark:text-white font-medium">{t(transaction.category) || transaction.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300 mt-1">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('date')}</p>
                                        <p className="text-lg text-slate-900 dark:text-white font-medium">{transaction.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300 mt-1">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('description')}</p>
                                        <p className="text-lg text-slate-900 dark:text-white font-medium">{transaction.description || 'No description provided.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-900/50 transition-all active:scale-95"
                            >
                                <Trash2 size={20} />
                                {t('delete') || 'Delete Transaction'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
