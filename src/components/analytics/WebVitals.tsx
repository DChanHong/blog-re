'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    const { id, name, label, value, rating } = metric;

    const style = {
      good: 'color: #0cce6b; font-weight: bold',
      needs_improvement: 'color: #ffa400; font-weight: bold',
      poor: 'color: #ff4e42; font-weight: bold',
    };

    const color = style[rating as keyof typeof style] || style.poor;

    let description = '';
    switch (name) {
      case 'FCP':
      case 'TTFB':
        description = '초기 진입: 서버 응답이 빠른가? 첫 화면이 즉시 뜨는가?';
        break;
      case 'LCP':
        description = '콘텐츠 확인: 본문 내용이 2.5초 이내로 완성되는가?';
        break;
      case 'CLS':
        description = '스크롤/읽기: 글을 읽는 도중 레이아웃이 덜컥거리며 변하지 않는가?';
        break;
      case 'INP':
        description = '기능 조작: 다크모드 전환, 검색 클릭 시 버벅임이 없는가?';
        break;
      default:
        break;
    }

    console.groupCollapsed(`%c[Web Vitals] ${name} (${rating})`, color);
    console.log(`%cValue: ${Math.round(value * 10) / 10}`, 'font-size: 1.2em');
    console.log(`ID: ${id}`);
    if (description) {
      console.log(`%c확인 항목: ${description}`, 'color: #555; font-style: italic');
    }
    console.log(metric);
    console.groupEnd();
  });

  return null;
}
