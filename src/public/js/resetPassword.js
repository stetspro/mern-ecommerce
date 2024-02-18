const onSubmit = async (userId, token) => {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const error = document.getElementById('error');

    if(newPassword === confirmPassword) {
        const response = await fetch('/api/token/' + userId + '/' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
        });

        response.json().then(data => {
            if (data.status == 'error' && data.error.includes('expired')) {
                showDialog();
                return;
            } else if(data.status == 'error' && data.error) {
                error.style.display = 'block';
                error.innerHTML = data.error;

                return;
            }

            if (data.status == 'success') {
                window.location.replace('/views/login');
            }
        })
    } else {
        error.style.display = 'block';
        error.innerHTML = "Passwords doesn't match";
    }

}

function showDialog() {
    const dialog = document.getElementById('restorePwDialog');
    dialog.classList.remove('hidden');
}
  
function hideDialog() {
    const dialog = document.getElementById('restorePwDialog');
    dialog.classList.add('hidden');
}
  
async function sendResetPwEmail() {
    const email = document.getElementById('restoreEmail').value;

    const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    hideDialog();
    window.location.replace('/views/login');
}