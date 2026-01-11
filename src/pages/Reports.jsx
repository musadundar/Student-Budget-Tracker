import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useOutletContext } from 'react-router-dom'

export default function Reports() {
    const { currency, t, categories, transactions } = useOutletContext()

    // ... (data prep logic skipped for brevity if not changing) ...

    const tooltipStyle = {
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        color: '#1e293b'
    }

    // 1. Donut Chart Data (Expenses by Category)
    const pieData = categories
        .filter(c => c.name !== 'Salary') // Only expenses
        .map(cat => {
            const total = transactions
                .filter(tx => tx.type === 'expense' && tx.category === cat.name)
                .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

            return {
                name: cat.isSystem ? t(cat.name) : cat.name,
                value: total
            }
        })
        .filter(item => item.value > 0)

    // 2. Bar Chart Data (Last 6 Months Income vs Expense)
    const barData = []
    for (let i = 5; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const monthYear = d.toLocaleString('defaut', { month: 'short', year: 'numeric' }) // e.g. "Jan 2026"
        const monthKey = d.toISOString().slice(0, 7) // "2026-01"

        const monthlyTransactions = transactions.filter(tx => tx.date.startsWith(monthKey))

        const income = monthlyTransactions
            .filter(tx => tx.type === 'income')
            .reduce((sum, tx) => sum + tx.amount, 0)

        const expense = monthlyTransactions
            .filter(tx => tx.type === 'expense')
            .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

        barData.push({
            name: monthYear,
            income: parseFloat(income.toFixed(2)),
            expense: parseFloat(expense.toFixed(2))
        })
    }

    const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

    // Custom Label Renderer
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
        const RADIAN = Math.PI / 180
        const radius = outerRadius * 1.2
        let x = cx + radius * Math.cos(-midAngle * RADIAN)
        let y = cy + radius * Math.sin(-midAngle * RADIAN)

        // Custom manual offset for 'Entertainment' / 'Eğlence' to avoid overlap with Transport
        const isEntertainment = name.includes('Entertainment') || name.includes('Eğlence')
        if (isEntertainment) {
            y -= 15 // Move up
            x -= 10 // Move left
        }

        return (
            <text
                x={x}
                y={y}
                fill="#64748b"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={13}
                fontWeight={600}
            >
                {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('reports_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('reports_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center transition-colors">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 w-full text-left">{t('expenses_by_category')}</h2>
                    <div className="w-full h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={renderCustomizedLabel}
                                    labelLine={true}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `${currency}${value}`}
                                    contentStyle={tooltipStyle}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center transition-colors">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 w-full text-left">{t('income_vs_expense') || 'Income vs Expense (6 Months)'}</h2>
                    <div className="w-full h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-20" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value) => `${currency}${value}`}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff', color: '#1e293b' }}
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="income" name={t('filter_income') || 'Income'} fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name={t('filter_expense') || 'Expense'} fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
