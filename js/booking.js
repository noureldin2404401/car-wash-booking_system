document.addEventListener('DOMContentLoaded', function () {

    var form          = document.getElementById('booking-form');
    var steps         = document.querySelectorAll('.form-step');
    var stepperSteps  = document.querySelectorAll('.stepper-step');
    var stepperLines  = document.querySelectorAll('.stepper-line');
    var serviceCards  = document.querySelectorAll('.service-card');
    var nextBtns      = document.querySelectorAll('.btn-next');
    var prevBtns      = document.querySelectorAll('.btn-prev');
    var successDiv    = document.getElementById('booking-success');
    var newBookingBtn = document.getElementById('btn-new-booking');

    var currentStep = 1;

    serviceCards.forEach(function (card) {
        card.addEventListener('click', function () {
            serviceCards.forEach(function (c) {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            var radio = card.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            clearError('error-service');
        });
    });

    nextBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var nextStep = parseInt(btn.getAttribute('data-next'));
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    prevBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var prevStep = parseInt(btn.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });

    function goToStep(step) {
        steps.forEach(function (s) {
            s.classList.remove('active');
        });

        var targetStep = document.getElementById('step-' + step);
        if (targetStep) {
            targetStep.classList.add('active');
        }

        updateStepper(step);

        if (step === 4) {
            populateSummary();
        }

        currentStep = step;

        window.scrollTo({ top: document.querySelector('.stepper').offsetTop - 100, behavior: 'smooth' });
    }

    function updateStepper(activeStep) {
        stepperSteps.forEach(function (s, i) {
            var stepNum = i + 1;
            s.classList.remove('active', 'done');

            if (stepNum < activeStep) {
                s.classList.add('done');
            } else if (stepNum === activeStep) {
                s.classList.add('active');
            }
        });

        stepperLines.forEach(function (line, i) {
            if (i + 1 < activeStep) {
                line.classList.add('done');
            } else {
                line.classList.remove('done');
            }
        });
    }

    function validateStep(step) {
        var isValid = true;

        if (step === 1) {
            var selectedService = form.querySelector('input[name="service"]:checked');
            if (!selectedService) {
                showError('error-service', 'Please select a wash package before continuing.');
                isValid = false;
            } else {
                clearError('error-service');
            }
        }

        if (step === 2) {
            var dateInput = document.getElementById('booking-date');
            var dateValue = dateInput.value.trim();

            if (dateValue === '') {
                showError('error-date', 'Please select an appointment date.');
                markInvalid(dateInput);
                isValid = false;
            } else if (isDateInPast(dateValue)) {
                showError('error-date', 'The selected date is in the past. Please choose a future date.');
                markInvalid(dateInput);
                isValid = false;
            } else {
                clearError('error-date');
                markValid(dateInput);
            }

            var timeInput = document.getElementById('booking-time');
            var timeValue = timeInput.value;

            if (timeValue === '') {
                showError('error-time', 'Please select a preferred time slot.');
                markInvalid(timeInput);
                isValid = false;
            } else {
                clearError('error-time');
                markValid(timeInput);
            }

            var carInput = document.getElementById('car-type');
            var carValue = carInput.value;

            if (carValue === '') {
                showError('error-carType', 'Please select your car type.');
                markInvalid(carInput);
                isValid = false;
            } else {
                clearError('error-carType');
                markValid(carInput);
            }
        }

        if (step === 3) {
            var nameInput = document.getElementById('full-name');
            var nameValue = nameInput.value.trim();

            if (nameValue === '') {
                showError('error-fullName', 'Full name is required.');
                markInvalid(nameInput);
                isValid = false;
            } else if (nameValue.length < 3) {
                showError('error-fullName', 'Name must be at least 3 characters long.');
                markInvalid(nameInput);
                isValid = false;
            } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(nameValue)) {
                showError('error-fullName', 'Name should only contain letters and spaces.');
                markInvalid(nameInput);
                isValid = false;
            } else {
                clearError('error-fullName');
                markValid(nameInput);
            }

            var emailInput = document.getElementById('email');
            var emailValue = emailInput.value.trim();

            if (emailValue === '') {
                showError('error-email', 'Email address is required.');
                markInvalid(emailInput);
                isValid = false;
            } else if (!isValidEmail(emailValue)) {
                showError('error-email', 'Please enter a valid email address (e.g. user@example.com).');
                markInvalid(emailInput);
                isValid = false;
            } else {
                clearError('error-email');
                markValid(emailInput);
            }

            var phoneInput = document.getElementById('phone');
            var phoneValue = phoneInput.value.trim();

            if (phoneValue === '') {
                showError('error-phone', 'Phone number is required.');
                markInvalid(phoneInput);
                isValid = false;
            } else if (!/^\d+$/.test(phoneValue)) {
                showError('error-phone', 'Phone number must contain only digits (no letters or symbols).');
                markInvalid(phoneInput);
                isValid = false;
            } else if (phoneValue.length < 10 || phoneValue.length > 15) {
                showError('error-phone', 'Phone number must be between 10 and 15 digits.');
                markInvalid(phoneInput);
                isValid = false;
            } else {
                clearError('error-phone');
                markValid(phoneInput);
            }

            var plateInput = document.getElementById('plate-number');
            var plateValue = plateInput.value.trim();

            if (plateValue === '') {
                showError('error-plateNumber', 'Car plate number is required.');
                markInvalid(plateInput);
                isValid = false;
            } else if (plateValue.length < 2) {
                showError('error-plateNumber', 'Please enter a valid plate number.');
                markInvalid(plateInput);
                isValid = false;
            } else {
                clearError('error-plateNumber');
                markValid(plateInput);
            }
        }

        return isValid;
    }

    function isValidEmail(email) {
        var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    function isDateInPast(dateString) {
        var selectedDate = new Date(dateString);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate < today;
    }

    function showError(errorId, message) {
        var errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    function clearError(errorId) {
        var errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    function markInvalid(input) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
    }

    function markValid(input) {
        input.classList.remove('invalid', 'shake');
        input.classList.add('valid');
    }

    var fieldsToWatch = [
        { id: 'booking-date',  errorId: 'error-date' },
        { id: 'booking-time',  errorId: 'error-time' },
        { id: 'car-type',      errorId: 'error-carType' },
        { id: 'full-name',     errorId: 'error-fullName' },
        { id: 'email',         errorId: 'error-email' },
        { id: 'phone',         errorId: 'error-phone' },
        { id: 'plate-number',  errorId: 'error-plateNumber' }
    ];

    fieldsToWatch.forEach(function (field) {
        var input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('input', function () {
                if (input.classList.contains('invalid')) {
                    input.classList.remove('invalid', 'shake');
                    clearError(field.errorId);
                }
            });

            input.addEventListener('change', function () {
                if (input.classList.contains('invalid')) {
                    input.classList.remove('invalid', 'shake');
                    clearError(field.errorId);
                }
            });
        }
    });

    function populateSummary() {
        var selectedCard = document.querySelector('.service-card.selected');
        if (selectedCard) {
            document.getElementById('sum-service').textContent =
                selectedCard.querySelector('h3').textContent;
            document.getElementById('sum-price').textContent =
                selectedCard.getAttribute('data-price') + ' EGP';
        }

        var dateVal = document.getElementById('booking-date').value;
        if (dateVal) {
            var dateObj = new Date(dateVal);
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('sum-date').textContent =
                dateObj.toLocaleDateString('en-US', options);
        }

        document.getElementById('sum-time').textContent =
            document.getElementById('booking-time').value;

        var carTypeSelect = document.getElementById('car-type');
        document.getElementById('sum-car').textContent =
            carTypeSelect.options[carTypeSelect.selectedIndex].text;

        document.getElementById('sum-name').textContent =
            document.getElementById('full-name').value.trim();
        document.getElementById('sum-email').textContent =
            document.getElementById('email').value.trim();
        document.getElementById('sum-phone').textContent =
            document.getElementById('phone').value.trim();
        document.getElementById('sum-plate').textContent =
            document.getElementById('plate-number').value.trim();

        var notesVal = document.getElementById('notes').value.trim();
        var notesRow = document.getElementById('sum-notes-row');
        if (notesVal !== '') {
            document.getElementById('sum-notes').textContent = notesVal;
            notesRow.style.display = 'flex';
        } else {
            notesRow.style.display = 'none';
        }
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        form.style.display = 'none';
        document.querySelector('.stepper').style.display = 'none';

        var selectedCard = document.querySelector('.service-card.selected');
        var serviceName  = selectedCard ? selectedCard.querySelector('h3').textContent : '';
        var servicePrice = selectedCard ? selectedCard.getAttribute('data-price') : '';
        var dateVal      = document.getElementById('booking-date').value;
        var dateObj      = new Date(dateVal);
        var dateFormatted = dateObj.toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        var successDetails = document.getElementById('success-details');
        successDetails.innerHTML =
            '<strong>Service:</strong> ' + serviceName + ' (' + servicePrice + ' EGP)<br>' +
            '<strong>Date:</strong> ' + dateFormatted + '<br>' +
            '<strong>Time:</strong> ' + document.getElementById('booking-time').value + '<br>' +
            '<strong>Name:</strong> ' + document.getElementById('full-name').value.trim() + '<br>' +
            '<strong>Phone:</strong> ' + document.getElementById('phone').value.trim();

        successDiv.style.display = 'block';

        window.scrollTo({ top: successDiv.offsetTop - 120, behavior: 'smooth' });
    });

    if (newBookingBtn) {
        newBookingBtn.addEventListener('click', function () {
            form.reset();

            form.querySelectorAll('.form-control').forEach(function (input) {
                input.classList.remove('valid', 'invalid', 'shake');
            });

            document.querySelectorAll('.form-error').forEach(function (el) {
                el.textContent = '';
                el.classList.remove('visible');
            });

            serviceCards.forEach(function (c) {
                c.classList.remove('selected');
            });

            form.style.display = '';
            document.querySelector('.stepper').style.display = '';
            successDiv.style.display = 'none';
            goToStep(1);
        });
    }

    var dateInput = document.getElementById('booking-date');
    if (dateInput) {
        var today = new Date();
        var yyyy  = today.getFullYear();
        var mm    = String(today.getMonth() + 1).padStart(2, '0');
        var dd    = String(today.getDate()).padStart(2, '0');
        dateInput.setAttribute('min', yyyy + '-' + mm + '-' + dd);
    }

    var navToggle = document.getElementById('nav-toggle');
    var navLinks  = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('open');
        });
    }

});
