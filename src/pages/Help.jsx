import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 transition-all duration-200 hover:shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
                <span>{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-brand-primary" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-700/50">
                    {answer}
                </div>
            </div>
        </div>
    )
}

export default function Help() {
    const { t } = useOutletContext()

    const faqs = [
        { q: 'q_expenses', a: 'a_expenses' },
        { q: 'q_budget', a: 'a_budget' },
        { q: 'q_password', a: 'a_password' },
        { q: 'q_delete_data', a: 'a_delete_data' },
    ]

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary mb-2">
                    <HelpCircle size={28} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('faq_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400">{t('faq_subtitle') || 'Find answers to common questions.'}</p>
            </div>

            <div className="space-y-4">
                {faqs.map((item, index) => (
                    <AccordionItem
                        key={index}
                        question={t(item.q)}
                        answer={t(item.a)}
                    />
                ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl text-center space-y-3">
                <p className="text-slate-700 dark:text-slate-300 font-medium">{t('help_contact_title') || 'Need more help?'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('help_contact_desc') || 'Contact support at support@studentbudget.com'}</p>
            </div>
        </div>
    )
}
