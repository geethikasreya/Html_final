// Password validation: length>=9, exactly 2 uppercase, exactly 1 special symbol
const form = document.getElementById('password-form');
const errors = document.getElementById('errors');
const success = document.getElementById('success');

function exactlyTwoUpperAndOneSpecial(pw){
  const minLen = pw.length >= 9;
  const upperCount = (pw.match(/[A-Z]/g) || []).length;
  const specialCount = (pw.match(/[^A-Za-z0-9]/g) || []).length;
  return minLen && upperCount === 2 && specialCount === 1;
}

function toggleEyes(){
  document.querySelectorAll('.icon-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      input.type = input.type === 'password' ? 'text' : 'password';
      input.focus();
    });
  });
}
toggleEyes();

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  errors.textContent = '';
  success.hidden = true;

  const current = document.getElementById('current-password').value;
  const newPw = document.getElementById('new-password').value;
  const confirmPw = document.getElementById('confirm-password').value;

  let msgs = [];
  if(!current) msgs.push('Current password is required.');
  if(!exactlyTwoUpperAndOneSpecial(newPw)){
    msgs.push('New password must be at least 9 characters with exactly 2 uppercase letters and exactly 1 special symbol.');
  }
  if(newPw !== confirmPw) msgs.push('Confirm password does not match.');

  if(msgs.length){
    errors.innerHTML = msgs.map(m=>`• ${m}`).join('<br>');
    return;
  }
  // All good
  success.hidden = false;
  form.reset();
});

document.getElementById('change-address').addEventListener('click', () => {
  const cur = document.getElementById('current-address');
  const val = prompt('Enter new shipping address:');
  if(val){
    cur.innerHTML = val.replaceAll('\n','<br/>');
  }
});
