'use client'
import BalanceSection from './balance/section';
import OverviewSection from './overview/section';
// import CurriculumSection from './curriculum/section';
import { driver } from 'driver.js';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const tour = driver({
      showProgress: true,
      steps: [
        {
          element: '#balance-section',
          popover: {
            title: '你的資產總覽',
            description: '這裡顯示你的當前餘額與可用功能。',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#deposit-button',
          popover: {
            title: '存入資產',
            description: '點擊這裡可以將資產存入合約。',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#overview-section',
          popover: {
            title: '利率曲線',
            description: '這裡顯示了當前的利率曲線，幫助你了解市場動態。',
            side: 'left',
            align: 'start'
          }
        }
      ]
    });
    tour.drive();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <BalanceSection />
      <OverviewSection />
      {/* <CurriculumSection /> */}
    </div>
  );
}
