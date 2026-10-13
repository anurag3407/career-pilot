import React from 'react';
import { Check, Minus } from 'lucide-react';

export default function FeatureComparison({
  heading = 'A paid-tool workflow, without the paid-tool stack',
  competitors = [],
}) {
  if (!competitors.length) return null;

  return (
    <section className="border-y border-border bg-card/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Why switch
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            CareerPilot bundles the core upgrade users pay for across resume, portfolio,
            interview, and job-search tools—and keeps it free under one coherent workflow.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto">
          <div className="min-w-[820px] overflow-hidden rounded-2xl border border-border bg-background/80">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Feature comparison between CareerPilot and paid alternatives
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th scope="col" className="px-6 py-5 text-sm font-bold text-foreground">
                    Capability
                  </th>
                  <th scope="col" className="px-6 py-5 text-sm font-bold text-foreground">
                    CareerPilot
                  </th>
                  {competitors.map((competitor) => (
                    <th
                      key={competitor.name}
                      scope="col"
                      className="px-6 py-5 text-sm font-bold text-foreground"
                    >
                      {competitor.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {competitors[0].features.map((row, rowIndex) => (
                  <tr
                    key={row.capability}
                    className={rowIndex % 2 ? 'bg-muted/20' : undefined}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 text-sm font-medium text-foreground"
                    >
                      {row.capability}
                    </th>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        <Check className="h-4 w-4" aria-hidden="true" />
                        {row.careerpilot}
                      </span>
                    </td>
                    {competitors.map((competitor) => {
                      const value = competitor.features[rowIndex]?.alternative ?? 'Unknown';
                      return (
                        <td key={competitor.name} className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                            {['Yes', 'Included', 'Free'].includes(value) ? (
                              <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                            ) : (
                              <Minus className="h-4 w-4 text-muted-foreground/70" aria-hidden="true" />
                            )}
                            {value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
