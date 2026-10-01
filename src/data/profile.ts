// 이 파일에서 이름, 소개, 링크, 경력, 기술을 수정하세요.
// 빈 링크는 화면에서 자동으로 숨겨집니다. 이력서는 public/resume.pdf에 넣으세요.
export const profile = {
  name: 'tae0code',
  role: 'Developer & curious maker',
  tagline: '작은 호기심을, 더 나은 경험으로.',
  intro:
    '코드로 아이디어를 만들고, 만드는 과정에서 배운 것을 기록합니다. 여기는 프로젝트와 생각이 함께 자라는 저의 작은 인터넷 공간입니다.',
  about:
    '문제를 이해하고, 작게 실험하고, 조금씩 더 나은 답을 찾는 과정을 좋아합니다. 눈에 보이는 경험부터 보이지 않는 구조까지, 오래 쓰고 싶은 제품을 만들고 싶습니다.',
  email: '',
  github: '',
  linkedin: '',
  resumeFile: 'resume.pdf',
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'Git'],
  // 실제 경험에 맞춰 교체하세요. 비어 있으면 준비 중 상태로 표시됩니다.
  experience: [] as { company: string; role: string; period: string; description: string }[],
  education: [] as { school: string; degree: string; period: string }[],
};
