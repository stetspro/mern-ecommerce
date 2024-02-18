const onSubmit = async () => {
    try {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if(!response.ok) {
            const error = document.getElementById('error');
            error.style.display = 'block';
            error.innerHTML = 'Invalid credentials';

            console.log(response)
            return false;
        }

        const data = await response.json();
        
        sessionStorage["user"] = JSON.stringify(data);
        window.location.href = '/views/products';

        return false;
    }
    catch (error) {
        console.log(error);
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
    console.log(email)

    const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    hideDialog();
}