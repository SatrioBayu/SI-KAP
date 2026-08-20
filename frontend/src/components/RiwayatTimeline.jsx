import StatusBadge from "./StatusBadge";

function formatWaktu(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RiwayatTimeline({ riwayat }) {
  if (!riwayat || riwayat.length === 0) {
    return (
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)" }}>
        Belum ada riwayat perubahan status.
      </p>
    );
  }

  return (
    <div className="timeline">
      {riwayat.map((item) => (
        <div className="timeline-item" key={item.id}>
          <span className={`timeline-dot ${item.status_ke}`} />
          <div className="timeline-head">
            <StatusBadge status={item.status_dari} />
            <span className="timeline-arrow">&rarr;</span>
            <StatusBadge status={item.status_ke} />
          </div>
          <div className="timeline-meta">{formatWaktu(item.created_at)}</div>
          {item.keterangan && <div className="timeline-note">{item.keterangan}</div>}
        </div>
      ))}
    </div>
  );
}
