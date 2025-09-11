export default function Loading() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <div aria-hidden style={{display: 'inline-block', width: 64, height: 64, borderRadius: '50%', border: '6px solid rgba(0,0,0,0.08)', borderTopColor: 'var(--primary, #111827)', animation: 'spin 1s linear infinite'}} />
        <p style={{marginTop: '0.75rem'}}>Loading...</p>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
