"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getOverview,
  getSalesByDay,
  getSalesByCategory,
  getOrderStatusBreakdown,
  getNewUsersByWeek,
  getLowStock,
} from "@/src/lib/api/reports";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Card, CardContent } from "../ui/analyticCard";
import {
  AlertCircle,
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

// === Small helpers ===
const chartPalette = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#06b6d4",
  "#eab308",
  "#ef4444",
  "#a855f7",
  "#14b8a6",
];

function money(n?: number) {
  return (n ?? 0).toLocaleString(undefined, {
    style: "currency",
    currency: "LKR",
  });
}

function cx(...cls: Array<string | false | null | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function Analytics() {
  const [overview, setOverview] = useState<any>(null);
  const [byDay, setByDay] = useState<any[]>([]);
  const [byCat, setByCat] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [newUsers, setNewUsers] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [o, d, c, s, n, l] = await Promise.all([
          getOverview(),
          getSalesByDay({ days }),
          getSalesByCategory(),
          getOrderStatusBreakdown(),
          getNewUsersByWeek({ days: 12 * 7 }),
          getLowStock({ threshold: 5 }),
        ]);
        if (!mounted) return;
        setOverview(o);
        setByDay(d);
        setByCat(c);
        setStatus(s);
        setNewUsers(n);
        setLowStock(l);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [days]);

  const totalUsers = useMemo(
    () => newUsers.reduce((a, b) => a + (b?.count ?? 0), 0),
    [newUsers]
  );

  return (
    <div className="space-y-8">
      {/* Header + Range selector */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Store Analytics
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value) as any)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi
          title="Revenue"
          value={money(overview?.revenue)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <Kpi
          title="Orders"
          value={overview?.ordersCount ?? 0}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <Kpi
          title="AOV"
          value={money(overview?.aov)}
          icon={<Package className="h-5 w-5" />}
        />
        <Kpi
          title="Repeat Rate"
          value={`${Math.round((overview?.repeatRate ?? 0) * 100)}%`}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Revenue by day */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-4 md:p-6 h-[320px]">
          <SectionTitle title="Revenue by Day" subtitle={`Last ${days} days`} />
          <div className="h-[240px]">
            {loading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byDay}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={60} />
                  <Tooltip
                    formatter={(v: any) => [money(v as number), "Revenue"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category & Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-4 md:p-6 h-[320px]">
            <SectionTitle title="Sales by Category" subtitle="Revenue" />
            <div className="h-[240px]">
              {loading ? (
                <SkeletonChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCat}>
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} width={60} />
                    <Tooltip
                      formatter={(v: any) => [money(v as number), "Revenue"]}
                    />
                    <Bar
                      dataKey="revenue"
                      radius={[8, 8, 0, 0]}
                      fill="#22c55e"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border">
          <CardContent className="p-4 md:p-6 h-[320px]">
            <SectionTitle title="Order Status" subtitle="Breakdown" />
            <div className="h-[240px]">
              {loading ? (
                <SkeletonChart />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={24} />
                    <Pie
                      data={status}
                      dataKey="count"
                      nameKey="status"
                      outerRadius={90}
                      label
                    >
                      {status.map((_: any, i: number) => (
                        <Cell
                          key={i}
                          fill={chartPalette[i % chartPalette.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New users */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-4 md:p-6 h-[320px]">
          <SectionTitle
            title="New Users"
            subtitle={`${totalUsers} in the period`}
          />
          <div className="h-[240px]">
            {loading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={newUsers}>
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={50} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low stock */}
      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-4 md:p-6">
          <SectionTitle title="Low Stock" subtitle="Below threshold" />
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-md bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <EmptyState
              icon={<AlertCircle className="h-5 w-5" />}
              title="All good"
              subtitle="No variants under threshold."
            />
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <div className="grid grid-cols-6 gap-2 px-3 py-2 text-xs font-medium bg-gray-50">
                <div>Product</div>
                <div>Variant</div>
                <div className="text-right">Qty</div>
                <div className="text-right">Price</div>
                <div className="text-right">Variant ID</div>
                <div className="text-right">Product ID</div>
              </div>
              <div className="divide-y">
                {lowStock.map((v: any) => (
                  <div
                    key={v.variantId}
                    className="grid grid-cols-6 gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="truncate">{v.productName}</div>
                    <div className="truncate">
                      {[v.size, v.color].filter(Boolean).join(" / ") || "-"}
                    </div>
                    <div
                      className={cx(
                        "text-right font-medium",
                        v.quantity <= 0 && "text-red-600",
                        v.quantity > 0 && v.quantity <= 2 && "text-orange-600",
                        v.quantity > 2 && v.quantity <= 5 && "text-yellow-600"
                      )}
                    >
                      {v.quantity}
                    </div>
                    <div className="text-right">{money(v.price)}</div>
                    <div className="text-right font-mono text-xs opacity-80">
                      {v.variantId}
                    </div>
                    <div className="text-right font-mono text-xs opacity-80">
                      {v.productId}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable UI bits
function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <div className="text-base font-semibold">{title}</div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </div>
  );
}

function Kpi({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">{title}</div>
          {icon}
        </div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function SkeletonChart() {
  return <div className="h-full w-full rounded-xl bg-gray-100 animate-pulse" />;
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border p-4 text-gray-600">
      {icon}
      <div>
        <div className="font-medium">{title}</div>
        {subtitle && <div className="text-sm">{subtitle}</div>}
      </div>
    </div>
  );
}
