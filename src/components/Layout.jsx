import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, LogOut, Menu, X, Wallet, PieChart, BarChart3, CalendarClock, User, Settings, Moon, Sun, Target, CalendarDays, HelpCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { translations } from '../lib/translations'
import { MOCK_TRANSACTIONS } from '../lib/mockData'

export default function Layout({ session }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    // Layout State (Language & Currency only)
    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || '$')
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language')
        return (saved && translations[saved]) ? saved : 'en'
    })

    const t = (key) => {
        const langData = translations[language] || translations['en'] || {}
        return langData[key] || key || ''
    }

    // Persist currency
    const handleSetCurrency = (newCurrency) => {
        setCurrency(newCurrency)
        localStorage.setItem('currency', newCurrency)
    }

    // Persist language
    const handleSetLanguage = (newLang) => {
        setLanguage(newLang)
        localStorage.setItem('language', newLang)
    }

    const handleLogout = async () => {
        if (localStorage.getItem('sb-demo-session')) {
            localStorage.removeItem('sb-demo-session')
            window.location.reload()
            return
        }
        await supabase.auth.signOut()
    }

    // Default categories
    const DEFAULT_CATEGORIES = [
        { id: 'cat_food', name: 'cat_food', color: 'emerald', isSystem: true },
        { id: 'cat_transport', name: 'cat_transport', color: 'blue', isSystem: true },
        { id: 'cat_entertainment', name: 'cat_entertainment', color: 'violet', isSystem: true },
        { id: 'cat_rent', name: 'cat_rent', color: 'amber', isSystem: true },
        { id: 'cat_health', name: 'cat_health', color: 'red', isSystem: true },
        { id: 'cat_edu', name: 'cat_edu', color: 'indigo', isSystem: true },
        { id: 'cat_shopping', name: 'cat_shopping', color: 'pink', isSystem: true },
        { id: 'cat_gift', name: 'cat_gift', color: 'teal', isSystem: true },
        { id: 'cat_freelance', name: 'cat_freelance', color: 'cyan', isSystem: true },
        { id: 'Salary', name: 'Salary', color: 'green', isSystem: true },
    ]


    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories')
        return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES
    })

    const handleSetCategories = (newCats) => {
        setCategories(newCats)
        localStorage.setItem('categories', JSON.stringify(newCats))
    }

    // Budget Limits State
    const DEFAULT_LIMITS = {
        'cat_food': 300,
        'cat_entertainment': 100,
        'cat_transport': 150,
        'cat_shopping': 200,
        'cat_rent': 600,
        'cat_edu': 100
        // Keys must correspond to category names
    }

    const [budgetLimits, setBudgetLimits] = useState(() => {
        const saved = localStorage.getItem('budgetLimits')
        return saved ? JSON.parse(saved) : DEFAULT_LIMITS
    })

    const handleSetBudgetLimits = (newLimits) => {
        setBudgetLimits(newLimits)
        localStorage.setItem('budgetLimits', JSON.stringify(newLimits))
    }

    // Transactions State
    const [transactions, setTransactions] = useState(() => {
        try {
            const saved = localStorage.getItem('transactions')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    // Sanitize: Remove nulls/non-objects and ensure minimal structure
                    return parsed.filter(tx => tx && typeof tx === 'object' && tx.id)
                }
            }
        } catch (e) {
            console.error("Failed to parse transactions", e)
        }
        return MOCK_TRANSACTIONS
    })

    const handleAddTransaction = (newTx) => {
        const updated = [newTx, ...transactions]
        setTransactions(updated)
        localStorage.setItem('transactions', JSON.stringify(updated))
    }

    // Also provide a way to update transactions (for edit/delete)
    const handleSetTransactions = (newTxList) => {
        // Sanitize incoming list as well
        const safeList = Array.isArray(newTxList)
            ? newTxList.filter(tx => tx && typeof tx === 'object' && tx.id)
            : []
        setTransactions(safeList)
        localStorage.setItem('transactions', JSON.stringify(safeList))
    }

    const navItems = [
        { key: 'nav_dashboard', path: '/', icon: LayoutDashboard },
        { key: 'nav_transactions', path: '/transactions', icon: Wallet },
        { key: 'nav_calendar', path: '/calendar', icon: CalendarDays },
        { key: 'nav_reports', path: '/reports', icon: BarChart3 },
        { key: 'nav_budget', path: '/budget', icon: PieChart },
        { key: 'nav_goals', path: '/goals', icon: Target },
        { key: 'nav_subscriptions', path: '/subscriptions', icon: CalendarClock },
        { key: 'nav_profile', path: '/profile', icon: User },
        { key: 'nav_help', path: '/help', icon: HelpCircle },
        { key: 'nav_settings', path: '/settings', icon: Settings },
    ]

    const [isLoading, setIsLoading] = useState(true)

    // Simulate Data Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1200) // 1.2s delay for skeleton demo
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="flex h-screen overflow-hidden bg-slate-300 transition-colors duration-300">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex md:flex-col w-64 border-r transition-colors duration-300 bg-slate-100 border-slate-200">
                <div className="flex items-center justify-center h-16 border-b border-slate-200">
                    <span className="text-2xl font-bold text-brand-primary">BudgetTracker</span>
                </div>
                <nav className="flex-1 flex flex-col p-4 gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.key}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-brand-primary text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{t(item.key)}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t space-y-2 border-slate-200">
                    <div className="mb-2 px-4 text-sm text-slate-500 truncate">
                        {session?.user?.email}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full rounded-lg transition-colors text-slate-600 hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">{t('nav_logout')}</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b transition-colors duration-300 bg-slate-100 border-slate-200">
                    <span className="text-xl font-bold text-brand-primary">BudgetTracker</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-slate-600"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-16 z-50 p-4 transition-colors duration-300 bg-white">
                        <nav className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.key}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-brand-primary text-white shadow-md'
                                            : 'text-slate-600 hover:bg-slate-100'
                                        }`
                                    }
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{t(item.key)}</span>
                                </NavLink>
                            ))}
                            <div className="h-px my-2 bg-slate-200"></div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors text-slate-600 hover:bg-red-50 hover:text-red-600"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">{t('nav_logout')}</span>
                            </button>
                        </nav>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-300">
                    <div className="max-w-7xl mx-auto">
                        <Outlet context={{
                            session,
                            currency,
                            setCurrency: handleSetCurrency,
                            language,
                            setLanguage: handleSetLanguage,
                            t,
                            categories,
                            setCategories: handleSetCategories,
                            budgetLimits,
                            setBudgetLimits: handleSetBudgetLimits,
                            transactions,
                            addTransaction: handleAddTransaction,
                            setTransactions: handleSetTransactions,
                            isLoading
                        }} />
                    </div>
                </main>
            </div>
        </div>
    )
}
