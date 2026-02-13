"use client"

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, PieChart as PieIcon, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import PageWrapper from '@/app/components/PageWrapper'

export default function AnalyticsPage({ data }: { data: any }) {
    const { expenseByCategory, expensesByDay } = data

    // Professional Palette for Charts (indigo, emerald, rose, amber, sky, violet)
    const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9', '#8b5cf6']

    return (
        <PageWrapper className="flex flex-col gap-6 py-8 pb-32 max-w-md mx-auto">
            <header className="flex items-center gap-4 px-2">
                <Link href="/" className="btn btn-outline h-10 w-10 p-0 rounded-full border-slate-200">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Analytics</h1>
            </header>

            {/* Category Analysis */}
            <section className="card p-6 bg-white border-slate-200 shadow-sm">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-slate-900">
                    <PieIcon size={18} className="text-indigo-500" /> Spending by Category
                </h3>
                <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseByCategory}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {expenseByCategory.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => formatCurrency(value || 0)}
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#0f172a' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    {expenseByCategory.map((entry: any, index: number) => (
                        <div key={entry.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="text-slate-700 font-medium">{entry.name}</span>
                            </div>
                            <span className="font-mono text-slate-500">{((entry.value / data.totalExpenses) * 100).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Daily Trend */}
            <section className="card p-6 bg-white border-slate-200 shadow-sm">
                <h3 className="font-semibold mb-6 flex items-center gap-2 text-slate-900">
                    <TrendingUp size={18} className="text-emerald-500" /> Daily Trend
                </h3>
                <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={expensesByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                tickFormatter={(val) => `${val / 1000}k`}
                                axisLine={false}
                                tickLine={false}
                                dx={-10}
                            />
                            <Tooltip
                                formatter={(value: any) => formatCurrency(value || 0)}
                                cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#0f172a' }}
                            />
                            <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

        </PageWrapper>
    )
}
