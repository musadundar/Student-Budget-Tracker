import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddTransaction from './pages/AddTransaction'
import Reports from './pages/Reports'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import Budget from './pages/Budget'
import Subscriptions from './pages/Subscriptions'
import Profile from './pages/Profile'
import Help from './pages/Help'
import Settings from './pages/Settings'
import Goals from './pages/Goals'
import CalendarPage from './pages/CalendarPage'
import ManageCategories from './pages/ManageCategories'
import Layout from './components/Layout'

function App() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for demo session
        const demoSession = localStorage.getItem('sb-demo-session')
        if (demoSession) {
            setSession({ user: { email: 'demo@student.com' } })
            setLoading(false)
        } else {
            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session)
                setLoading(false)
            })
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!localStorage.getItem('sb-demo-session')) {
                setSession(session)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-brand-primary">Loading...</div>
    }

    return (
        <Routes>
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!session ? <Register /> : <Navigate to="/" />} />

            <Route element={<Layout session={session} />}>
                <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/add-expense" element={session ? <AddTransaction type="expense" /> : <Navigate to="/login" />} />
                <Route path="/add-income" element={session ? <AddTransaction type="income" /> : <Navigate to="/login" />} />
                <Route path="/transactions" element={session ? <Transactions /> : <Navigate to="/login" />} />
                <Route path="/transactions/:id" element={session ? <TransactionDetail /> : <Navigate to="/login" />} />
                <Route path="/calendar" element={session ? <CalendarPage /> : <Navigate to="/login" />} />
                <Route path="/budget" element={session ? <Budget /> : <Navigate to="/login" />} />
                <Route path="/goals" element={session ? <Goals /> : <Navigate to="/login" />} />
                <Route path="/subscriptions" element={session ? <Subscriptions /> : <Navigate to="/login" />} />
                <Route path="/profile" element={session ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/help" element={session ? <Help /> : <Navigate to="/login" />} />
                <Route path="/settings" element={session ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/settings/categories" element={session ? <ManageCategories /> : <Navigate to="/login" />} />
                <Route path="/reports" element={session ? <Reports /> : <Navigate to="/login" />} />
            </Route>
        </Routes>
    )
}

export default App
