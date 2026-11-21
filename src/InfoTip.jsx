export default function InfoTip({title,children}) {
  return <details className="info-tip">
    <summary aria-label={`About ${title}`} title={`About ${title}`}>i</summary>
    <div className="info-content"><strong>{title}</strong><p>{children}</p></div>
  </details>;
}
