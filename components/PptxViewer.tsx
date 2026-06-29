import { googleDocsViewerUrl } from "@/lib/utils";

export default function PptxViewer({ fileUrl, title }: { fileUrl: string; title: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-navy-100 shadow-panel bg-white">
      <iframe
        src={googleDocsViewerUrl(fileUrl)}
        title={title}
        className="w-full aspect-[16/10] sm:aspect-video"
        allowFullScreen
      />
      <div className="px-4 py-2 bg-navy-50 border-t border-navy-100 text-center">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-navy-500 underline underline-offset-2"
        >
          Tampilan tidak muncul? Buka langsung di tab baru
        </a>
      </div>
    </div>
  );
}
