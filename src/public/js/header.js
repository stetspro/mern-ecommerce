const getCurrentUser = async () => {
    const response = await fetch('/api/users/current', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
   
    if(!data || data.error) {
        return;
    }

    return data;
}

const logout = async () => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    if (data.message) {
        window.location.href = '/views/login';
    }

    localStorage.removeItem('user');
    document.getElementById('cartRoute').href = '#';
    document.getElementById('loginBtn').classList.remove('hidden');

    return false;
}

const initializeHeader = async () => {
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if (!user) {
        user = await getCurrentUser();
    }

    if(user) {
        console.log(user)
        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach(element => {
            element.classList.remove('hidden');
        });

        document.getElementById('loginBtn').classList.add('hidden');

        if(user.cart) {
            document.getElementById('cartRoute').href = `/views/cart/${user.cart}`;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeHeader();
});