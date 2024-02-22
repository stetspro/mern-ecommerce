export default class CurrentUserDTO {
    constructor(user) {
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart;
        this.id = user._id
    }
}