import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import PageWrapper from '@/app/components/PageWrapper'
import Link from 'next/link'
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Calendar,
  PieChart,
  TrendingDown,
  CreditCard,
  Plus
} from 'lucide-react'

import { logout } from '@/app/actions/auth'
import { LogOut } from 'lucide-react'

// Fetch data on the server
import { verifySession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

async function getDashboardData() {
  const session = await verifySession()

  if (!session) {
    redirect('/login')
  }

  // 1. Get User Name (Lightweight)
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, username: true }
  })

  if (!user) {
    redirect('/login')
  }

  // 2. Parallel Aggregations (Fast)
  const [
    revenueStats,
    expenseStats,
    monthlyIncomeStats,
    monthlyExpenseStats
  ] = await Promise.all([
    // All Time Revenue
    prisma.revenue.aggregate({
      where: {
        userId: session.userId,
        OR: [{ status: 'PAID_CASH' }, { status: 'PAID_TF' }]
      },
      _sum: { amount: true }
    }),
    // All Time Expenses
    prisma.realizedExpense.aggregate({
      where: { userId: session.userId },
      _sum: { amount: true }
    }),
    // Monthly Income
    prisma.revenue.aggregate({
      where: {
        userId: session.userId,
        OR: [{ status: 'PAID_CASH' }, { status: 'PAID_TF' }],
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      },
      _sum: { amount: true }
    }),
    // Monthly Expenses
    prisma.realizedExpense.aggregate({
      where: {
        userId: session.userId,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      },
      _sum: { amount: true }
    })
  ])

  const allTimeRevenue = revenueStats._sum.amount || 0
  const allTimeExpenses = expenseStats._sum.amount || 0
  const balance = allTimeRevenue - allTimeExpenses

  const monthlyIncome = monthlyIncomeStats._sum.amount || 0
  const monthlyExpenses = monthlyExpenseStats._sum.amount || 0

  // Calculate Safe Daily Spend
  const now = new Date()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const currentDay = now.getDate()
  const daysRemaining = daysInMonth - currentDay + 1

  const safeDailySpend = balance > 0 ? balance / daysRemaining : 0
  const isCrisis = balance < 0

  return {
    user, // Minimal user object
    monthlyIncome,
    monthlyExpenses,
    balance,
    safeDailySpend,
    daysRemaining,
    isCrisis,
    totalRevenue: allTimeRevenue,
    totalExpenses: allTimeExpenses
  }
}

export default async function Home() {
  const data = await getDashboardData()

  return (
    <PageWrapper className="flex flex-col gap-8 py-8 pb-32 max-w-md mx-auto">
      {/* Header */}
      <header className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500">Welcome back, {data.user.name?.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <form action={logout}>
            <button className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-slate-50 transition-colors shadow-sm" title="Log Out">
              <LogOut size={18} />
            </button>
          </form>
          <div className="h-10 w-10 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm">
            {(data.user as any).username[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* NEW USER WELCOME: If all time revenue is 0, show guide */}
      {data.balance === 0 && data.totalRevenue === 0 && data.totalExpenses === 0 ? (
        <section className="col-span-full">
          <div className="card bg-white border-slate-200 p-8 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="h-20 w-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-2">
              <Wallet size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Welcome to your Cashflow! 🚀</h2>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">You have no data yet. Start by adding your first income source to activate the dashboard.</p>
            </div>
            <Link href="/revenue/new" className="btn btn-primary mt-2">
              <Plus size={18} className="mr-2" /> Add First Revenue
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* Balance Card - Professional / Solid */}
          <section className={`card ${data.isCrisis ? 'bg-rose-600 border-rose-500 shadow-rose-500/30' : 'bg-indigo-600 border-indigo-500 shadow-indigo-500/30'} text-white shadow-xl relative overflow-hidden transition-colors duration-500 border-0`}>
            {/* Abstract Background Decoration */}
            <div className={`absolute -right-6 -top-6 h-32 w-32 rounded-full ${data.isCrisis ? 'bg-rose-500/30' : 'bg-indigo-500/30'} blur-2xl`}></div>
            <div className={`absolute -left-6 -bottom-6 h-32 w-32 rounded-full ${data.isCrisis ? 'bg-rose-700/30' : 'bg-indigo-700/30'} blur-2xl`}></div>

            <div className="relative z-10 p-6 flex flex-col gap-6">
              <div>
                <p className={`${data.isCrisis ? 'text-rose-100' : 'text-indigo-100'} text-sm font-medium mb-1`}>Total Balance</p>
                <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(data.balance)}</h2>
              </div>

              {/* Smart Daily Limit (Sage Mode) */}
              <div className={`${data.isCrisis ? 'bg-rose-500/20 border-rose-500/30' : 'bg-indigo-500/20 border-indigo-500/30'} rounded-2xl p-3 border backdrop-blur-sm`}>
                <div className="flex justify-between items-end mb-1">
                  <p className={`${data.isCrisis ? 'text-rose-100' : 'text-indigo-100'} text-xs font-medium uppercase tracking-wider`}>Safe Daily Spend</p>
                  <p className={`${data.isCrisis ? 'text-rose-100' : 'text-indigo-100'} text-xs`}>{data.daysRemaining} Days Left</p>
                </div>
                <div className="flex items-baseline gap-2">
                  {data.isCrisis ? (
                    <span className="text-xl font-bold text-white tracking-widest">CRITICAL</span>
                  ) : (
                    <>
                      <span className="text-2xl font-bold text-white">{formatCurrency(data.safeDailySpend)}</span>
                      <span className={`${data.isCrisis ? 'text-rose-100' : 'text-indigo-100'} text-sm`}>/ day</span>
                    </>
                  )}
                </div>
              </div>

              <div className={`grid grid-cols-2 gap-4 border-t ${data.isCrisis ? 'border-rose-500/30' : 'border-indigo-500/30'} pt-4`}>
                <div>
                  <div className={`flex items-center gap-1.5 ${data.isCrisis ? 'text-rose-100' : 'text-indigo-100'} text-xs mb-1`}>
                    <div className={`p-0.5 rounded-full ${data.isCrisis ? 'bg-rose-500/30' : 'bg-indigo-500/30'}`}>
                      <ArrowUpCircle size={12} />
                    </div>
                    Income (Month)
                  </div>
                  <p className="font-semibold text-lg">{formatCurrency(data.monthlyIncome)}</p>
                </div>
                <div>
                  <div className={`flex items-center gap-1.5 ${data.isCrisis ? 'text-rose-100' : 'text-indigo-100'} text-xs mb-1`}>
                    <div className={`p-0.5 rounded-full ${data.isCrisis ? 'bg-rose-500/30' : 'bg-indigo-500/30'}`}>
                      <ArrowDownCircle size={12} />
                    </div>
                    Expenses (Month)
                  </div>
                  <p className="font-semibold text-lg">{formatCurrency(data.monthlyExpenses)}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Main Actions */}
          <section className="grid grid-cols-2 gap-3">
            <Link href="/revenue" className="nav-item group">
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowUpCircle size={20} />
              </div>
              <span className="font-medium text-slate-700">Revenue</span>
            </Link>
            <Link href="/realized" className="nav-item group">
              <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                <ArrowDownCircle size={20} />
              </div>
              <span className="font-medium text-slate-700">Expense</span>
            </Link>
            <Link href="/allocation" className="nav-item group">
              <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Wallet size={20} />
              </div>
              <span className="font-medium text-slate-700">Allocations</span>
            </Link>
            <Link href="/budget" className="nav-item group">
              <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <TrendingDown size={20} />
              </div>
              <span className="font-medium text-slate-700">Budget</span>
            </Link>
          </section>

          {/* Tools */}
          <section>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Analysis Tools</h3>
            <div className="grid grid-cols-3 gap-3">
              <Link href="/daily" className="card hover:bg-slate-50 transition p-4 flex flex-col items-center gap-2 text-center border-slate-100 shadow-sm">
                <Calendar size={20} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Daily</span>
              </Link>
              <Link href="/analytics" className="card hover:bg-slate-50 transition p-4 flex flex-col items-center gap-2 text-center border-slate-100 shadow-sm">
                <PieChart size={20} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Analytics</span>
              </Link>
              <Link href="/savings" className="card hover:bg-slate-50 transition p-4 flex flex-col items-center gap-2 text-center border-slate-100 shadow-sm">
                <CreditCard size={20} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-600">Savings</span>
              </Link>
            </div>
          </section>
        </>
      )}
    </PageWrapper>
  )
}
