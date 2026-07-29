export default function ProvenanceTab() {
  return (
    <div className="w-full h-[80vh] rounded-lg overflow-hidden border">
      <iframe
        src="/trace4magnet/map.html"
        title="TRACE4MAGNET Supply Chain"
        className="w-full h-full border-0"
      />
    </div>
  );
}