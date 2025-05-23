import BalanceSection from './balance/section';
import CurriculumSection from './curriculum/section';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <BalanceSection />
      <CurriculumSection />
    </div>
  );
}
