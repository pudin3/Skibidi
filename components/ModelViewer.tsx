export default function ModelViewer({ fileUrl, title }: { fileUrl: string; title: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-navy-100 shadow-panel bg-navy-950">
      <model-viewer
        src={fileUrl}
        alt={title}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        exposure="1"
        loading="eager"
        style={{ width: "100%", height: "420px", backgroundColor: "#0A1628" }}
      />
      <p className="text-center text-xs text-navy-300 py-2 px-4 bg-navy-900">
        Geser untuk memutar &middot; cubit untuk zoom
      </p>
    </div>
  );
}
