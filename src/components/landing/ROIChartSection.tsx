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

const roiData = [
  { year: "2018", Apartments: 8, Plots: 12, Commercial: 6 },
  { year: "2019", Apartments: 11, Plots: 15, Commercial: 9 },
  { year: "2020", Apartments: 7, Plots: 10, Commercial: 4 },
  { year: "2021", Apartments: 14, Plots: 22, Commercial: 11 },
  { year: "2022", Apartments: 18, Plots: 28, Commercial: 15 },
  { year: "2023", Apartments: 22, Plots: 35, Commercial: 19 },
  { year: "2024", Apartments: 26, Plots: 42, Commercial: 24 },
  { year: "2025", Apartments: 30, Plots: 48, Commercial: 28 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="font-heading font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}% ROI</span>
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
            Gurgaon <span className="text-gradient-gold">ROI Trends</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
            Cumulative return on investment across property segments in Gurgaon — 
            India's fastest-growing real estate corridor.
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
                tickFormatter={(v) => `${v}%`}
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
            { label: "Apartments", roi: "30%", period: "7-Year ROI", color: "text-primary" },
            { label: "Plots", roi: "48%", period: "7-Year ROI", color: "text-[hsl(45,90%,45%)]" },
            { label: "Commercial", roi: "28%", period: "7-Year ROI", color: "text-[hsl(200,70%,50%)]" },
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
