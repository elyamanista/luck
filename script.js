const segments = [
  {
    label: 'خصم 15% على كل الطلبات',
    type: 'discount',
    code: 'LUCK15',
  },
  { label: 'صندوق مفاجآت صغير', type: 'reward' },
  {
    label: 'خصم 25% للقطعة المفضلة',
    type: 'discount',
    code: 'LUCK25',
  },
  { label: 'شحن مجاني للطلب القادم', type: 'reward' },
  { label: 'قهوة من اختيارك على حسابنا', type: 'reward' },
];

const wheel = document.querySelector('#wheel');
const spinBtn = document.querySelector('.spin-btn');
const resultText = document.querySelector('.result-text');
const discountWrap = document.querySelector('.discount');
const discountCode = document.querySelector('.discount-code');
const copyBtn = document.querySelector('.copy-btn');
const popup = document.querySelector('.popup');
const openBtn = document.querySelector('.open-popup');
const closeBtn = document.querySelector('.close-popup');

let spinning = false;
let spinCounter = 0;
const segmentAngle = 360 / segments.length;
const offset = -90; // aligns first slice to the top

const showPopup = () => popup.classList.add('visible');
const hidePopup = () => popup.classList.remove('visible');

openBtn.addEventListener('click', showPopup);
closeBtn.addEventListener('click', hidePopup);
showPopup();

spinBtn.addEventListener('click', () => {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  const winnerIndex = Math.floor(Math.random() * segments.length);
  const wedgeCenter = offset + winnerIndex * segmentAngle + segmentAngle / 2;
  const normalized = ((-wedgeCenter) % 360 + 360) % 360;
  spinCounter += 1;
  const extraTurns = 360 * (4 + spinCounter);
  const rotation = extraTurns + normalized;
  wheel.style.setProperty('--rotation', `${rotation}deg`);

  setTimeout(() => {
    const selection = segments[winnerIndex];
    resultText.textContent = `نتيجتك: ${selection.label}`;

    if (selection.type === 'discount') {
      discountWrap.hidden = false;
      discountCode.textContent = selection.code;
      copyBtn.dataset.code = selection.code;
    } else {
      discountWrap.hidden = true;
      discountCode.textContent = '';
      copyBtn.removeAttribute('data-code');
    }

    spinning = false;
    spinBtn.disabled = false;
  }, 4600);
});

copyBtn.addEventListener('click', async () => {
  const code = copyBtn.dataset.code;
  if (!code) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = code;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      tempInput.remove();
    }
    copyBtn.textContent = 'تم النسخ ✔';
  } catch (error) {
    copyBtn.textContent = 'انسخ يدويًا';
  } finally {
    setTimeout(() => {
      copyBtn.textContent = 'انسخ الكود';
    }, 2000);
  }
});
