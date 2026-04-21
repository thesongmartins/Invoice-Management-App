export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img
        src="/emailman.svg"
        alt="Empty state image of a mail man"
        className="mt-10 mb-20"
      />

      <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 tracking-tight">
        There is nothing here
      </h2>
      <p className="text-[#888EB0] dark:text-blue-muted text-sm max-w-[220px] leading-relaxed">
        Create an invoice by clicking the <strong>New Invoice</strong> button
        and get started
      </p>
    </div>
  );
}
