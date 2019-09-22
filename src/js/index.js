document.addEventListener('DOMContentLoaded', () => {

	// Form send
	(function () {
		const BUTTON_FORM = document.querySelector('.button[type=submit]');
		const PHONE_INPUT = document.querySelector('.subscribe__input[name=phone]');
		const COURSES_BTTNS = document.querySelectorAll('[data-course]');

		let selectedCourse = "";

		if (COURSES_BTTNS) {
			COURSES_BTTNS.forEach(button => {
				button.addEventListener('click', () => {
					selectedCourse = button.getAttribute('data-course');
				})
			})
		}

		PHONE_INPUT.addEventListener('input', () => {
			PHONE_INPUT.value = PHONE_INPUT.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
		});

		BUTTON_FORM.addEventListener('click', () => {

			if (PHONE_INPUT && PHONE_INPUT.value.length > 0) {
				if (selectedCourse.length > 0) {
					sendPhone(PHONE_INPUT.value, selectedCourse);
				} else {
					sendPhone(PHONE_INPUT.value);
				}
				PHONE_INPUT.value = "";
			} else {
				PHONE_INPUT.classList.toggle('shake');

				setTimeout(() => {
					PHONE_INPUT.classList.toggle('shake');
				}, 500);
			}
		});

		const sendPhone = (phone, course) => {
			if (!phone) return;

			const url = 'post.php';
			const request = new XMLHttpRequest();
			const stringToSend = "phone=" + phone + (course ? ("&course=" + course) : "");

			request.open('POST', url, true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			request.send(stringToSend);
			request.onload = function () {
				if (this.status === 200 && this.status < 400) {
					toggleModal();
				} else {
					toggleModal(true);
				}
			}
			request.onerror = function () {
				toggleModal(true);
			}
		};

		const toggleModal = (isError) => {
			const BACKDROP = document.querySelector(".backdrop");
			const MODAL = document.querySelector('.modal');
			const MODAL_STATUS = MODAL.querySelector(".modal__icon-status");
			const MODAL_STATUS_TITLE = MODAL.querySelector('.modal__title');
			const MODAL_STATUS_SUBTITLE = MODAL.querySelector('.modal__subtitle');
			const MODAL_BTN = MODAL.querySelector(".button");
			const CLOSE_BTN = MODAL.querySelector(".modal__close-btn");

			let modalInitTitle = "Спасибо за заявку!";
			let modalInitSubtitle = "Мы вам перезвоним в течении <br><b>30 минут</b>.";

			if (isError) {
				const MODAL_STATUS = MODAL.querySelector('.modal__icon-status');
				MODAL_STATUS.classList.add('modal__icon-status--error');
				MODAL_STATUS_TITLE.innerText = "Упс, что-то пошло не так :(";
				MODAL_STATUS_SUBTITLE.innerText = "";
			} else {
				MODAL_STATUS_TITLE.innerText = modalInitTitle;
				MODAL_STATUS_SUBTITLE.innerHTML = modalInitSubtitle;
				MODAL_STATUS.classList.remove('modal__icon-status--error');
			}

			BACKDROP.classList.toggle('backdrop--open');
			MODAL.classList.toggle('modal--open');
			document.body.classList.toggle('fixed');

			const closeModal = () => {
				BACKDROP.classList.remove('backdrop--open');
				MODAL.classList.remove('modal--open');
				document.body.classList.remove('fixed');
			}

			if (BACKDROP) BACKDROP.addEventListener('click', closeModal);
			if (MODAL_BTN) MODAL_BTN.addEventListener('click', closeModal);
			if (CLOSE_BTN) CLOSE_BTN.addEventListener('click', closeModal);
		}
	})();

	// Images zoom
	(function () {
		const IMAGES = document.querySelectorAll('[data-zoom]');
		if (IMAGES) {
			mediumZoom('[data-zoom]', {
				background: 'rgba(0, 0, 0, 0.8)',
			});
		}
	})();

	// Mobile menu
	(function () {
		const NAV_BURGER = document.querySelector('.nav__button');
		const NAV_MOBILE = document.querySelector('.nav-mobile');
		const NAV_MOBILE_CLOSE = NAV_MOBILE.querySelector('.nav-mobile__close');
		const NAV_MOBILE_LINKS = NAV_MOBILE.querySelectorAll('.nav-mobile__link');
		const BACKDROP = document.querySelector(".backdrop");

		const openMenu = () => {
			BACKDROP.classList.add('backdrop--open');
			NAV_MOBILE.classList.add('nav-mobile--open');
		}
		const closeMenu = () => {
			BACKDROP.classList.remove('backdrop--open');
			NAV_MOBILE.classList.remove('nav-mobile--open');
		}

		if (BACKDROP) BACKDROP.addEventListener('click', closeMenu);

		if (NAV_MOBILE_LINKS) {
			NAV_MOBILE_LINKS.forEach(link => {
				link.addEventListener('click', closeMenu);
			})
		}

		NAV_BURGER.addEventListener('click', openMenu);
		NAV_MOBILE_CLOSE.addEventListener('click', closeMenu);
	})();

	// Bar chat hover
	(function () {
		const BAR_CHAT_ICON = document.querySelector('.bar__chat');

		BAR_CHAT_ICON.addEventListener('click', () => {
			BAR_CHAT_ICON.classList.toggle('bar__socials--open');
		});
	})();
});