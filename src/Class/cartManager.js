import fs from 'fs';
import path from 'path';

export class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
    }

    async createCart() {
        const newCart = { id: this.carts.length + 1, products: [] };
        this.carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
        return newCart;
    }

    async addProductToCart(id, productId) {
        this.carts = await this.getCarts();
        const cartIndex = this.carts.findIndex(cart => cart.id === id);

        if (cartIndex === -1) return null;

        const cart = this.carts[cartIndex];
        const productIndex = cart.products.findIndex(prod => prod.id === productId);

        if (productIndex === -1) {
            cart.products.push({ id: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        this.carts[cartIndex] = cart;
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts));

        return cart;
    }

    async getCarts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            this.carts = [];
        }
        return this.carts;
    }
}

export default CartManager;
