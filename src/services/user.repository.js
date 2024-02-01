
export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getUserByEmail = async (email) => {
        try {
            return await this.dao.getUserByEmail(email);
        }
        catch (error) {
            //console.log(error);
            throw error;
        }
    }

    getUserById = async (id) => {
        try {
            return await this.dao.getUserById(id);
        }
        catch (error) {
            //console.log(error);
            throw error;
        }
    }
    
    registerUser = async (user) => {
        try {
            //console.log(user)
            return await this.dao.createUser(user);
        }
        catch (error) {
            //console.log(error);
            throw error;
        }
    }
}
