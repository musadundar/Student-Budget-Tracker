import { useOutletContext, Link } from 'react-router-dom'
import { DollarSign, HelpCircle, FileText, PieChart as PieIcon, Calendar, Globe, Tags } from 'lucide-react'

export default function Settings() {
    const { currency, setCurrency, language, setLanguage, t } = useOutletContext()

    const helpItems = [
        {
            icon: DollarSign,
            title: t('help_transactions'),
            text: t('help_transactions_desc')
        },
        {
            icon: PieIcon,
            title: t('help_budget'),
            text: t('help_budget_desc')
        },
        {
            icon: Calendar,
            title: t('help_subs'),
            text: t('help_subs_desc')
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('settings_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('settings_subtitle')}</p>
            </div>

            {/* Categories Management */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                <Link to="/settings/categories" className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="bg-brand-primary/10 p-3 rounded-xl text-brand-primary">
                            <Tags size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-brand-primary transition-colors">{t('manage_categories')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('manage_categories_subtitle')}</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Language Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <Globe size={24} className="text-brand-primary" />
                    {t('language_pref')}
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setLanguage('en')}
                        className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all ${language === 'en'
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('tr')}
                        className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all ${language === 'tr'
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        Türkçe
                    </button>
                </div>
            </div>

            {/* Currency Settings */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign size={24} className="text-brand-primary" />
                    {t('currency_pref')}
                </h2>
                <div className="flex gap-4">
                    <button
                        onClick={() => setCurrency('$')}
                        className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all ${currency === '$'
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        USD ($)
                    </button>
                    <button
                        onClick={() => setCurrency('₺')}
                        className={`flex-1 py-4 px-6 rounded-xl border-2 font-bold transition-all ${currency === '₺'
                            ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                    >
                        TRY (₺)
                    </button>
                </div>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-3">
                    {t('currency_desc')}
                </p>
            </div>

            {/* Help Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <HelpCircle size={24} className="text-brand-primary" />
                    {t('help_title')}
                </h2>

                <div className="space-y-6">
                    {helpItems.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-1">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
