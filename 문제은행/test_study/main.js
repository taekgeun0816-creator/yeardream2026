const {get_products} = require('./promise');


async function main(filter){
    try{

        const data = await get_products(filter);
        return data;
    }catch(e){
        console.error(`ERROR: ${e.message}`)
    }
}


async function run() {

    let product = {
        category: {$in: ['electronics', 'books']}
    }
    let p1 = await main(product);

    let result = p1.sort((a,b) => b.rating - a.rating).slice(0,2)
    console.log('-----답 목록-----')
    console.log(result)

}
run()

