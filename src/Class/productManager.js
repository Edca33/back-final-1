import fs from 'node:fs'

class ProductManager {
    constructor(path){
        this.path= path;
        this.productList = [];
    }

    async getProductById(id){
        await this.getProductList();

        return this.productList.find (product => product.id === id);
    }

    async getProductList(){
        const list = await fs.promises.readFile(this.path, 'utf-8')
        this.productList = [... JSON.parse(list).data] 
        return [... this.productList]
    }
    
    async addProduct(product){
        await this.getProductList();
        const newProduct = 
            {id: this.productList.length +1, ...product, status: true}; 
        
        this.productList.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify({data: this.productList})); return newProduct
    };
}

export default ProductManager