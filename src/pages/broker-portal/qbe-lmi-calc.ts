function submitQBELmiCalcForm() {
  const CARD_SELECTOR = '[data-broker-resource="qbe-lmi-calc"]';
  const linkEl = document.querySelector(`${CARD_SELECTOR} a`);

  linkEl?.addEventListener('click', (event) => {
    event.preventDefault();

    // Create form element
    const formEl = document.createElement('form');
    formEl.action = 'https://services.lmiconnect.com.au/lmiOnline/login.do';
    formEl.method = 'post';
    formEl.name = 'lmiOnline';
    formEl.target = '_blank';

    // Create hidden input fields
    const actionInput = document.createElement('input');
    actionInput.type = 'hidden';
    actionInput.name = 'action';
    actionInput.value = 'autoLogon';

    const userIdInput = document.createElement('input');
    userIdInput.type = 'hidden';
    userIdInput.name = 'userId';
    userIdInput.value = 'bankaustraliauser';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'hidden';
    passwordInput.name = 'password';
    passwordInput.value = 'Bankaustralia15';

    // Append inputs to form
    formEl.appendChild(actionInput);
    formEl.appendChild(userIdInput);
    formEl.appendChild(passwordInput);

    // Append form to body, submit, and remove
    document.body.appendChild(formEl);
    formEl.submit();
  });
}

document.addEventListener('DOMContentLoaded', submitQBELmiCalcForm);
