import { useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Check, X } from 'lucide-react'

export default function ManageCategories() {
    const { t, categories, setCategories } = useOutletContext()
    const [newCatName, setNewCatName] = useState('')
    const [selectedColor, setSelectedColor] = useState('emerald')
    const [error, setError] = useState('')

    const COLOR_MAP = {
        slate: 'bg-slate-500',
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        violet: 'bg-violet-500',
        amber: 'bg-amber-500',
        red: 'bg-red-500',
        indigo: 'bg-indigo-500',
        pink: 'bg-pink-500',
        teal: 'bg-teal-500',
        cyan: 'bg-cyan-500',
        orange: 'bg-orange-500',
        lime: 'bg-lime-500',
        fuchsia: 'bg-fuchsia-500',
        sky: 'bg-sky-500'
    }

    const BG_LIGHT_MAP = {
        slate: 'bg-slate-100 dark:bg-slate-700',
        emerald: 'bg-emerald-100 dark:bg-emerald-900/30',
        blue: 'bg-blue-100 dark:bg-blue-900/30',
        violet: 'bg-violet-100 dark:bg-violet-900/30',
        amber: 'bg-amber-100 dark:bg-amber-900/30',
        red: 'bg-red-100 dark:bg-red-900/30',
        indigo: 'bg-indigo-100 dark:bg-indigo-900/30',
        pink: 'bg-pink-100 dark:bg-pink-900/30',
        teal: 'bg-teal-100 dark:bg-teal-900/30',
        cyan: 'bg-cyan-100 dark:bg-cyan-900/30',
        orange: 'bg-orange-100 dark:bg-orange-900/30',
        lime: 'bg-lime-100 dark:bg-lime-900/30',
        fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
        sky: 'bg-sky-100 dark:bg-sky-900/30'
    }

    const TEXT_MAP = {
        slate: 'text-slate-600 dark:text-slate-300',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        blue: 'text-blue-600 dark:text-blue-400',
        violet: 'text-violet-600 dark:text-violet-400',
        amber: 'text-amber-600 dark:text-amber-400',
        red: 'text-red-600 dark:text-red-400',
        indigo: 'text-indigo-600 dark:text-indigo-400',
        pink: 'text-pink-600 dark:text-pink-400',
        teal: 'text-teal-600 dark:text-teal-400',
        cyan: 'text-cyan-600 dark:text-cyan-400',
        orange: 'text-orange-600 dark:text-orange-400',
        lime: 'text-lime-600 dark:text-lime-400',
        fuchsia: 'text-fuchsia-600 dark:text-fuchsia-400',
        sky: 'text-sky-600 dark:text-sky-400'
    }

    const handleAddCategory = (e) => {
        e.preventDefault()
        if (!newCatName.trim()) return

        // Check duplicate
        if (categories.some(c => c.name.toLowerCase() === newCatName.toLowerCase() || t(c.name).toLowerCase() === newCatName.toLowerCase())) {
            setError(t('category_exists') || 'Category exists')
            return
        }

        const newCat = {
            id: `cat_${Date.now()}`,
            name: newCatName.trim(),
            color: selectedColor,
            isSystem: false
        }

        setCategories([...categories, newCat])
        setNewCatName('')
        setError('')
    }

    const handleDelete = (id) => {
        if (confirm(t('confirm_delete') || 'Are you sure?')) {
            setCategories(categories.filter(c => c.id !== id))
        }
    }

    const handleUpdateColor = (id, color) => {
        setCategories(categories.map(c => c.id === id ? { ...c, color } : c))
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link to="/settings" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-slate-300">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('manage_categories') || 'Manage Categories'}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{t('manage_categories_subtitle') || 'Customize your spending categories.'}</p>
                </div>
            </div>

            {/* Add New Category */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t('add_new_category') || 'Add New Category'}</h2>
                <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('category_name') || 'Category Name'}</label>
                            <input
                                type="text"
                                value={newCatName}
                                onChange={e => setNewCatName(e.target.value)}
                                className="input-field w-full"
                                placeholder={t('category_placeholder') || 'e.g. Gaming'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('category_color') || 'Color'}</label>
                            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                                {Object.keys(COLOR_MAP).map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-slate-600 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full ${COLOR_MAP[color]}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" className="btn-primary w-full md:w-auto">
                        <Plus size={18} className="mr-2" />
                        {t('add_category') || 'Add Category'}
                    </button>
                </form>
            </div>

            {/* List Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        onClick={() => {
                            setNewCatName(cat.isSystem ? t(cat.name) : cat.name)
                            setSelectedColor(cat.color)
                        }}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group cursor-pointer hover:border-brand-primary dark:hover:border-brand-primary transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${BG_LIGHT_MAP[cat.color] || 'bg-slate-100 dark:bg-slate-700'} ${TEXT_MAP[cat.color] || 'text-slate-600 dark:text-slate-300'}`}>
                                {/* Show first letter if no icon */}
                                <span className="font-bold text-lg">{(cat.isSystem ? t(cat.name) : cat.name).charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{cat.isSystem ? t(cat.name) : cat.name}</h3>
                                {cat.isSystem && <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">{t('default') || 'Default'}</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Color Picker Popover could go here, but for simplicity let's just show delete for now, maybe edit later */}
                            {!cat.isSystem && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete(cat.id)
                                    }}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    title={t('delete') || 'Delete'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
