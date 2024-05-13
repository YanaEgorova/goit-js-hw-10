import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

let futureTime = null;

const buttonStart = document.querySelector('[data-start]');

buttonStart.addEventListener('click', onStartTimer);

function onStartTimer(e) {
  e.currentTarget.disabled = true;

  new CountTimer({
    selector: '.timer',
    targetDate: futureTime,
  });
  document.querySelector('#datetime-picker').disabled = true;
  dataFlatpickr.destroy();
  buttonStart.removeEventListener('click', onStartTimer);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose({ 0: selectedDate }) {
    if (selectedDate.getTime() <= Date.now()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      futureTime = null;
      buttonStart.disabled = true;
      return;
    }
    futureTime = selectedDate;
    buttonStart.disabled = false;
  },
};

const dataFlatpickr = flatpickr('#datetime-picker', options);

class CountTimer {
  #second = 1000;
  #minute = this.#second * 60;
  #hour = this.#minute * 60;
  #day = this.#hour * 24;

  #selector;
  #targetDate;
  #refs;

  constructor({ selector, targetDate }) {
    this.#selector = document.querySelector(selector);
    this.#targetDate = targetDate;

    this.#refs = {
      days: this.#selector.querySelector('[data-days]'),
      hours: this.#selector.querySelector('[data-hours]'),
      mins: this.#selector.querySelector('[data-minutes]'),
      secs: this.#selector.querySelector('[data-seconds]'),
    };

    this.#updateTimeOnce();
    this.#updateTimeOnline();
  }

  #updateTimeOnce() {
    if (this.#targetDate.getTime() <= Date.now()) return;

    const ms = this.#targetDate.getTime() - Date.now();
    this.#updateMarkup(this.#convertMs(ms));
  }

  #updateTimeOnline() {
    const timer = setInterval(() => {
      const ms = this.#targetDate.getTime() - Date.now();

      if (ms < 1) {
        clearInterval(timer);
        return;
      }

      this.#updateMarkup(this.#convertMs(ms));
    }, 1000);
  }

  #convertMs(ms) {
    const days = Math.floor(ms / this.#day);
    const hours = Math.floor((ms % this.#day) / this.#hour);
    const mins = Math.floor(((ms % this.#day) % this.#hour) / this.#minute);
    const secs = Math.floor(
      (((ms % this.#day) % this.#hour) % this.#minute) / this.#second
    );

    return { days, hours, mins, secs };
  }

  #updateMarkup({ days, hours, mins, secs }) {
    const daysString = this.#addLoadingZero(days);
    const hoursString = this.#addLoadingZero(hours);
    const minsString = this.#addLoadingZero(mins);
    const secsString = this.#addLoadingZero(secs);

    this.#refs.days.textContent = daysString;
    this.#refs.hours.textContent = hoursString;
    this.#refs.mins.textContent = minsString;
    this.#refs.secs.textContent = secsString;
  }

  #addLoadingZero(value) {
    return String(value).padStart(2, '0');
  }
}
