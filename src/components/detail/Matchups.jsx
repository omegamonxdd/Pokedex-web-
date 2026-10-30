import TypeBadge from './TypeBadge';

const LABEL = { 4: '×4', 2: '×2', 0.5: '×½', 0.25: '×¼', 0: '×0' };

function Group({ title, groups }) {
  const filled = groups.filter((g) => g.types.length > 0);
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-600">{title}</h3>
      {filled.length === 0 ? (
        <p className="text-sm text-slate-400">Ninguno</p>
      ) : (
        <ul className="space-y-2">
          {filled.map((g) => (
            <li key={g.multiplier} className="flex flex-wrap items-center gap-2">
              <span className="w-9 font-display text-base font-bold">{LABEL[g.multiplier]}</span>
              {g.types.map((t) => <TypeBadge key={t} type={t} />)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Matchups({ matchups }) {
  return (
    <div className="space-y-5">
      <Group title="Débil contra" groups={matchups.weaknesses} />
      <Group title="Resiste" groups={matchups.resistances} />
      <Group title="Inmune a" groups={matchups.immunities} />
    </div>
  );
}
