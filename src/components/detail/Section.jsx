export default function Section({ title, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <h2 className="mb-4 font-display text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}
