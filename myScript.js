//네비게이션 중앙 위치 고정하기!

const nav = document.querySelector('.nav');
let fixedLeft = null;

function calculateFixedLeft() {
  const testWidth = 1420;
  fixedLeft = testWidth / 2 - nav.offsetWidth / 2;
  // 화면 가로길이절반, 네비게이션 바 너비 절반
}

function adjustNavPosition() {
  const windowWidth = window.innerWidth;
  if (fixedLeft === null) calculateFixedLeft();

  if (windowWidth < 1420) {
    // 1420px 미만일 때 left 픽셀값 고정, transform 효과 끔
    nav.style.left = `${fixedLeft}px`;
    nav.style.transform = 'none';
  } else {
    // 1420px 이상일 때, 중앙 정렬 (left 50%, translateX(-50%))
    nav.style.left = '50%';
    nav.style.transform = 'translateX(-50%)';
  }
}

// 창 크기 변경과 페이지 로드 시 실행
window.addEventListener('resize', adjustNavPosition);
window.addEventListener('load', adjustNavPosition);








//네비게이션 언더라인 위치 조절&스크롤 시 활성 메뉴 표시하기!
const underline = document.querySelector('.underline');
const navLinks = document.querySelectorAll('.nav-link');

function updateUnderline(target) {
  const navRect = nav.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  underline.style.width = `${targetRect.width}px`;
  underline.style.left = `${targetRect.left - navRect.left}px`;
}

// 메뉴 클릭 시 해당 섹션으로 부드럽게 스크롤 & 언더라인 이동
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const section = document.getElementById(targetId);
    window.scrollTo({
      top: section.offsetTop - 0,
      behavior: 'smooth'
    });
  });
});

const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        if (link.classList.contains('active')) updateUnderline(link);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));

// 페이지 로드, 창 크기 변경 시 활성 메뉴 언더라인 맞춤
['load', 'resize'].forEach(event => {
  window.addEventListener(event, () => {
    requestAnimationFrame(() => {
      const active = document.querySelector('.nav-link.active');
      if (active) updateUnderline(active);
    });
  });
});





//메인이미지 변환
const imageUrls = [
  "img/main_e.png",
  "img/main_e2.png",
  "img/main_e3.png",
  "img/main_e4.png",
  "img/main_e5.png"
];

// 이미지 미리 로드 저장소
const loadedImages = [];

// 이미지 미리 로드
imageUrls.forEach((url, idx) => {
  const img = new Image();
  img.src = url;
  img.onload = () => {
    loadedImages[idx] = img;  // 로딩 완료된 이미지 객체 저장
  };
});

const slide1 = document.getElementById("slide1");
const slide2 = document.getElementById("slide2");

let current = 0;
let showingSlide1 = true;

function updateSlide() {
  const next = (current + 1) % imageUrls.length;

  // 이미지가 아직 로딩되지 않았다면 skip
  if (!loadedImages[next]) return;

  const nextUrl = `linear-gradient(to top, rgba(0, 0, 0, 1), transparent 40%), url('${imageUrls[next]}')`;

  if (showingSlide1) {
    slide2.style.backgroundImage = nextUrl;
    slide2.style.zIndex = 2;
    slide1.style.zIndex = 1;
    slide2.style.opacity = 1;
    slide1.style.opacity = 0;
  } else {
    slide1.style.backgroundImage = nextUrl;
    slide1.style.zIndex = 2;
    slide2.style.zIndex = 1;
    slide1.style.opacity = 1;
    slide2.style.opacity = 0;
  }

  showingSlide1 = !showingSlide1;
  current = next;
}

// 첫 이미지 로딩 완료 후 시작
const firstImage = new Image();
firstImage.src = imageUrls[0];
firstImage.onload = () => {
  slide1.style.backgroundImage = `linear-gradient(to top, rgba(0, 0, 0, 1), transparent 40%), url('${imageUrls[0]}')`;
  setInterval(updateSlide, 800); 
};






// 농촌설명 > 지역소멸표 넘어갈 때 배경 픽스 > 움직이게 하기!
const aboutSections = document.querySelectorAll('#about, #about2');
const section2 = document.querySelector('.section2.row0');

window.addEventListener('scroll', () => {
  const section2Top = section2.getBoundingClientRect().top;

  if (section2Top <= window.innerHeight) {
    // section2가 화면에 등장하면 unfixed
    aboutSections.forEach(sec => sec.classList.add('unfixed-bg'));
  } else {
    // 아직 안 보이면 fixed 유지
    aboutSections.forEach(sec => sec.classList.remove('unfixed-bg'));
  }
});


const preloadImgs = ['img/js02.png', 'img/js03.png', 'img/js04.png', 'img/js05.png', 'img/js06.png'];
preloadImgs.forEach(src => {
  const img = new Image();
  img.src = src;
});





//사회파장 이미지 호버하면 이미지가 바뀌게 하기!
const imageContainer = document.querySelector('.image-container');

document.querySelectorAll('.hover-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const imgSrc = item.getAttribute('data-img');
    imageContainer.style.backgroundImage = `url(${imgSrc})`;
  });
  item.addEventListener('mouseleave', () => {
    imageContainer.style.backgroundImage = 'url(img/js01.png)';
  });
});







//사회파장 이미지 호버하면 다음 이미지가 가운데로 오게 하기!

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const wrapper = document.querySelector('.slider-wrapper');

const slideWidth = slides[0].offsetWidth;  // 모든 슬라이드 너비는 같음
const slideMarginRight = 40;               // CSS에서 margin-right 줬으면 그 값

const totalSlideWidth = slideWidth + slideMarginRight;
const wrapperWidth = wrapper.offsetWidth;



function goToSlide(index) {
  if (index < 0) index = 0;
  if (index >= slides.length) index = slides.length -1;

  currentIndex = index;

  // 슬라이드 가운데 오도록 offset 계산
  // offsetLeft 대신 간단하게 index * (슬라이드폭 + 마진)
  const offset = totalSlideWidth * index - (wrapperWidth / 2) + (slideWidth / 2);

  slider.style.transform = `translateX(-${offset}px)`;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

slides.forEach((slide, idx) => {
  slide.addEventListener('mouseenter', () => {
    goToSlide(idx);
  });
});

// 초기 위치 셋팅
goToSlide(0);