import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

/**
 * Возвращает обещание с искусственной задержкой.
 * @param {number} ms - Время задержки в миллисекундах.
 * @param {string} promiseType - Тип обещания ('fulfilled' или 'rejected').
 * @returns {Promise<string>} - Обещание, которое выполнится с заданным сообщением.
 */
const getArtificialDelayPromise = (ms, promiseType) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      promiseType === 'fulfilled'
        ? res(`Fulfilled promise in ${ms}ms`)
        : rej(`Rejected promise in ${ms}ms`);
    }, ms);
  });
};

const form = document.querySelector('.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const currentForm = e.currentTarget;
  const { delayMs, promiseType } = currentForm.elements;
  const ms = Number(delayMs.value);

  getArtificialDelayPromise(ms, promiseType.value)
    .then(message => iziToast.success({ message }))
    .catch(message => iziToast.error({ message }));

  currentForm.reset();
});
