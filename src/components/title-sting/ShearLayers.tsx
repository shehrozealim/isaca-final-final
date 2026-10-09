import { copy } from '../../data/content'
import { useMemo } from 'react'

export default function ShearLayers({ seal, mobile }: { seal: string; mobile: boolean }) {
  // This source SVG has no internal paint references. Decorative copies omit
  // IDs and labels so the original remains the only named, animated geometry.
  const sealCopy = useMemo(() => seal.replace(/\s(?:id|aria-labelledby)="[^"]*"/g, ''), [seal])
  return <div className="s01-shear" data-sting-layer="shear" aria-hidden="true">
    {(mobile ? [1] : [0, 1, 2]).map(band => <div key={band} className={`s01-shear-band s01-shear-band--${band}`}>
      <div className="s01-seal-copy" dangerouslySetInnerHTML={{ __html: sealCopy }} />
      <div className="s01-typography-copy">
        <p className="s01-presenter-copy">{copy("DJS ISACA PRESENTS")}</p>
        <div className="s01-title-copy"><span>{copy("THE HUNT")}</span></div>
      </div>
    </div>)}
  </div>
}
