const BUTTON_FORM = document.querySelector('.button[type=submit]');
const PHONE_INPUT = document.querySelector('.subscribe__input[name=phone]');

// PHONE.addEventListener('input', () => {
//   this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
// });

BUTTON_FORM.addEventListener('click', () => {

	if (PHONE_INPUT && PHONE_INPUT.value.length > 0) {
		sendPhone(PHONE_INPUT.value);
		PHONE_INPUT.value = "";
		toggleModal();
	} else {
		PHONE_INPUT.classList.toggle('shake');

		setTimeout(() => {
			PHONE_INPUT.classList.toggle('shake');
		}, 500);
	}
});

const sendPhone = (data) => {
	if (!data) return;

	const url = 'post.php';
	const request = new XMLHttpRequest();

	request.open('POST', url, true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send("phone=" + data);
	console.log(request);
};

const toggleModal = () => {
	const MODAL = document.querySelector('.modal');
	const BACKDROP = document.querySelector(".backdrop");
	const MODAL_BTN = MODAL.querySelector(".button");
	const CLOSE_BTN = MODAL.querySelector(".modal__close-btn");

	if (BACKDROP) BACKDROP.addEventListener('click', toggleModal);
	if (MODAL_BTN) MODAL_BTN.addEventListener('click', toggleModal);
	if (CLOSE_BTN) CLOSE_BTN.addEventListener('click', toggleModal);

	BACKDROP.classList.toggle('backdrop--open');
	MODAL.classList.toggle('modal--open');
	document.body.classList.toggle('fixed');
}

(function () {
	const IMAGES = document.querySelectorAll('.mediumZoom');
	if (IMAGES) {
		mediumZoom('.mediumZoom', {
			background: 'rgba(0, 0, 0, 0.8)',
		});
	}
})();
