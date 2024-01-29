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

        const data = await response.json();
        
        if (data && data.error) {
            const error = document.getElementById('error');
            error.style.display = 'block';
            error.innerHTML = data.error;
        } else if(data){
            sessionStorage["user"] = JSON.stringify(data);
            window.location.href = '/views/products';
        }

        return false;
    }
    catch (error) {
        console.log(error);
    }
}