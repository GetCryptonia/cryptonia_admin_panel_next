"use client";

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="border-b border-divider-color px-[24px] py-[20px] md:px-[48px] md:py-[24px]">
      <h1 className="text-[28px] font-semibold">{title}</h1>
    </div>
  );
}
