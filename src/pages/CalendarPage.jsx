import { useState, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useOutletContext } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowUpRight, ArrowDownLeft, Receipt } from 'lucide-react'

export default function CalendarPage() {
    const { transactions, currency, t } = useOutletContext()
    const [date, setDate] = useState(new Date())

    // Group transactions by date (YYYY-MM-DD)
    const transactionsByDate = useMemo(() => {
        const grouped = {}
        transactions.forEach(tx => {
            const dateKey = tx.date.split('T')[0] // Ensure YYYY-MM-DD
            if (!grouped[dateKey]) {
                grouped[dateKey] = { income: 0, expense: 0, items: [] }
            }
            if (tx.type === 'expense') {
                grouped[dateKey].expense += Math.abs(tx.amount)
            } else if (tx.type === 'income') {
                grouped[dateKey].income += Math.abs(tx.amount)
            }
            grouped[dateKey].items.push(tx)
        })
        return grouped
    }, [transactions])

    // Tile Content (Badges)
    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateKey = format(date, 'yyyy-MM-dd')
            const dayData = transactionsByDate[dateKey]

            if (dayData) {
                const net = dayData.income - dayData.expense
                if (Math.abs(net) === 0) return null

                const isPositive = net >= 0
                const colorClass = isPositive
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-red-100 text-red-600'

                return (
                    <div className="flex justify-center mt-1">
                        <div className={`${colorClass} text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm`}>
                            {isPositive ? '+' : ''}{currency}{net.toLocaleString()}
                        </div>
                    </div>
                )
            }
        }
    }

    const selectedDateKey = format(date, 'yyyy-MM-dd')
    const selectedDayData = transactionsByDate[selectedDateKey] || { income: 0, expense: 0, items: [] }
    const dailyNet = selectedDayData.income - selectedDayData.expense

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('calendar_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {t('transactions_for').replace('{date}', new Intl.DateTimeFormat(t('nav_dashboard') === 'Panel' ? 'tr-TR' : 'en-US', { dateStyle: 'long' }).format(date))}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Calendar Section */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Calendar
                        onChange={setDate}
                        value={date}
                        locale={t('nav_dashboard') === 'Panel' ? 'tr-TR' : 'en-US'}
                        tileContent={tileContent}
                        className="w-full border-none font-sans text-slate-700 dark:text-slate-200"
                        tileClassName="rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors h-24 flex flex-col justify-start pt-2"
                    />
                </div>

                {/* Details Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full">
                    <div className="space-y-3 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400">{t('daily_income') || 'Daily Income'}</span>
                            <span className="text-emerald-600 font-bold">+{currency}{selectedDayData.income.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 dark:text-slate-400">{t('daily_expense') || 'Daily Expense'}</span>
                            <span className="text-red-500 font-bold">-{currency}{selectedDayData.expense.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-700/50">
                            <span className="font-bold text-slate-900 dark:text-white">{t('daily_total')} (Net)</span>
                            <span className={dailyNet >= 0 ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                                {dailyNet >= 0 ? '+' : ''}{currency}{dailyNet.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {selectedDayData.items.length === 0 ? (
                            <div className="text-center text-slate-400 mt-10">
                                <Receipt size={48} className="mx-auto mb-2 opacity-50" />
                                <p>No transactions</p>
                            </div>
                        ) : (
                            selectedDayData.items.map(tx => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">{tx.description}</p>
                                            <p className="text-xs text-slate-500">{t(tx.category) || tx.category}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {tx.type === 'income' ? '+' : '-'}{currency}{Math.abs(tx.amount).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
