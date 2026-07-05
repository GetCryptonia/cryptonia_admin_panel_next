"use client";

type PageToolbarProps = {
  children?: React.ReactNode;
  meta?: React.ReactNode;
};

export default function PageToolbar({ children, meta }: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-[12px] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-[12px] sm:flex-row sm:items-center">
        {children}
      </div>
      {meta ? <div className="shrink-0">{meta}</div> : null}
    </div>
  );
}
