import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Gurgaon avg per sq ft prices (₹) — realistic market data
const roiData = [
  { year: "2018", Apartments: 4500, Plots: 5500, Commercial: 7000 },
  { year: "2019", Apartments: 4800, Plots: 6200, Commercial: 7500 },
  { year: "2020", Apartments: 4600, Plots: 6000, Commercial: 7200 },
  { year: "2021", Apartments: 5500, Plots: 7800, Commercial: 8500 },
  { year: "2022", Apartments: 7200, Plots: 10500, Commercial: 10000 },
  { year: "2023", Apartments: 9500, Plots: 13500, Commercial: 12500 },
  { year: "2024", Apartments: 11500, Plots: 16000, Commercial: 14500 },
  { year: "2025", Apartments: 13000, Plots: 18000, Commercial: 16000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="font-heading font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">₹{entry.value.toLocaleString()}/sq ft</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ROIChartSection() {
  return (
    <section className="section-padding bg-accent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            Market Intelligence
          </p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold text-foreground">
            Gurgaon <span className="text-gradient-gold">Price Trends</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Average per sq ft prices across property segments in Gurgaon — 
            prices have surged 2-3x since 2018 in key corridors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6 md:p-10"
        >
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={roiData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="year"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 13 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 13 }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 16, fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="Apartments"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 5, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="Plots"
                stroke="hsl(45, 90%, 45%)"
                strokeWidth={3}
                dot={{ r: 5, fill: "hsl(45, 90%, 45%)" }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="Commercial"
                stroke="hsl(200, 70%, 50%)"
                strokeWidth={3}
                dot={{ r: 5, fill: "hsl(200, 70%, 50%)" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { label: "Apartments", roi: "2.9x", period: "₹4,500 → ₹13,000/sqft", color: "text-primary" },
            { label: "Plots", roi: "3.3x", period: "₹5,500 → ₹18,000/sqft", color: "text-[hsl(45,90%,45%)]" },
            { label: "Commercial", roi: "2.3x", period: "₹7,000 → ₹16,000/sqft", color: "text-[hsl(200,70%,50%)]" },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <p className="text-muted-foreground text-sm mb-1">{item.label}</p>
              <p className={`font-heading text-4xl font-bold ${item.color}`}>{item.roi}</p>
              <p className="text-muted-foreground text-xs mt-1">{item.period}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
