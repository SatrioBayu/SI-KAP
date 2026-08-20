const LABELS = {
  draft: "Draft",
  pengecekkan: "Pengecekan Checker",
  verifikasi: "Verifikasi Approver",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

export default function StatusBadge({ status, stamp = false }) {
  const label = LABELS[status] || status;

  if (stamp && (status === "disetujui" || status === "ditolak")) {
    return <span className={`status-stamp ${status}`}>{label}</span>;
  }

  return <span className={`status-badge ${status}`}>{label}</span>;
}
