import { TokenModel } from "./models/token.model.js";

export default class TokenDAO {
    constructor() {
        this.tokenModel = TokenModel;
    }

    async createToken(userId, token) {
        return await this.tokenModel.create({ userId, token });
    }

    async getToken(userId, token) {
        return await this.tokenModel.findOne({ userId, token });
    }

    async deleteToken(tokenId) {
        return await this.tokenModel.findByIdAndDelete(tokenId);
    }
}