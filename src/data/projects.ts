// 프로젝트를 추가하면 목록과 상세 페이지가 함께 만들어집니다.
export const projects = [{
  slug: 'personal-space',
  name: 'Personal space',
  category: 'Web experience',
  year: '2026',
  description: '프로젝트, 생각, 그리고 나를 담는 공간. 읽기 좋은 콘텐츠와 작은 인터랙션이 만나는 개인 포트폴리오입니다.',
  technologies: ['Astro', 'TypeScript', 'CSS', 'Canvas'],
  role: 'Design & Development',
  status: '첫 번째 버전',
  demoUrl: '',
  sourceUrl: '',
  sections: [
    { title: '하나의 공간, 세 가지 이야기', text: '만든 것을 보여주는 포트폴리오, 배운 것을 정리하는 블로그, 경험을 담는 이력서. 서로 다른 목적을 하나의 시각 언어로 연결하는 것이 이 프로젝트의 출발점입니다.' },
    { title: '콘텐츠가 중심이 되는 구조', text: '글은 Markdown으로 작성하고 정적 HTML로 만듭니다. 페이지마다 고유한 주소가 있어 링크를 공유하거나 새로고침해도 내용을 바로 읽을 수 있습니다. 개인 사이트에 필요한 내용은 서버 운영 없이 GitHub Pages에서 제공할 수 있습니다.' },
    { title: '가볍지만 살아 있는 화면', text: '첫 화면은 뉴런과 연결선을 Canvas로 그린 입체 신경망입니다. 입력층에서 출력층으로 빛이 흐르고, 마우스를 가까이 가져가거나 노드를 누르면 신호가 반응합니다. 화면 밖이나 비활성 탭에서는 애니메이션을 멈추며, 방문자가 직접 움직임을 정지할 수도 있습니다.' },
    { title: '다음에 채울 이야기', text: '실제 프로젝트와 경력, 그리고 직접 쓴 글이 이 공간을 채우게 됩니다. 지금의 사이트는 완성된 소개서이기보다, 앞으로의 기록을 위한 첫 번째 버전입니다.' },
  ],
}];
