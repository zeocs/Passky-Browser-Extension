chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let username = null;
  let password = null;
  let usernameFilled = false;
  let passwordFilled = false;

  if(typeof(request.password) !== 'undefined') password = request.password;
  if(typeof(request.username) !== 'undefined') username = request.username;
  if(username === null || password === null) return;

  let inputs = document.getElementsByTagName("input");

  // Password input detection
  for(let i = 0; i < inputs.length; i++){
    let type = inputs[i].type?.toLowerCase();
    let autocomplete = inputs[i].autocomplete?.toLowerCase();
    if(type !== 'password') continue;
    if(autocomplete !== 'current-password') continue;

    setInputValue(inputs[i], password);
    passwordFilled = true;
    break;
  }

  // Username input detection
  for(let i = 0; i < inputs.length; i++){
    let type = inputs[i].type?.toLowerCase();
    let name = inputs[i].name?.toLowerCase();
    let id = inputs[i].id?.toLowerCase();
    if(!(type === 'text' || type === 'email')) continue;
    if(!(name.includes('user') || name.includes('email') || name.includes('login'))) continue;
    if(name.includes('fake') || id.includes('fake')) continue;

    setInputValue(inputs[i], username);
    usernameFilled = true;
    break;
  }

  if(usernameFilled && passwordFilled) return;

  // Desperate password input detection
  for(let i = 0; i < inputs.length; i++){
    if(passwordFilled) break;
    let type = inputs[i].type?.toLowerCase();
    if(type !== 'password') continue;

    setInputValue(inputs[i], password);
    passwordFilled = true;
    break;
  }

  // Desperate username input detection
  for(let i = 0; i < inputs.length; i++){
    if(usernameFilled) break;
    let type = inputs[i].type?.toLowerCase();
    if(!(type === 'text' || type === 'email')) continue;

    inputs[i].value = username;
    setInputValue(inputs[i], username);
    break;
  }
});

// Will set the value of the given input element to the given value.
// Various techniques are used to simulate real user input as closely
// as possible, since naively setting the value may remain unnoticed
// or be rejected by some browsers or frameworks on websites (e.g. React).
function setInputValue(input, value) {
  input.focus();

  const setter =
    Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(input),
      "value"
    )?.set ||
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;

  setter
    ? setter.call(input, value)
    : (input.value = value);

  input.dispatchEvent(
    new InputEvent("input", {
      bubbles: true,
      inputType: "insertText",
      data: value,
    })
  );

  input.blur();

  input.dispatchEvent(new Event("change", { bubbles: true }));
}
