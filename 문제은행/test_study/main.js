const {get_products} = require('./promise');


async function main(filter){
    try{

        const data = await get_products(filter);
        console.log('--- 가져온 데이터 목록---');
        console.log(data);
    }catch(e){
        console.error(`ERROR: ${e.message}`)
    }
}

const filter = { published: true };
filter.stock = 25

main({category: "office", stock:50 });

