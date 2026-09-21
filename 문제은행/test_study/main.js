const {get_products} = require('./promise');


async function main(filter){
    try{

        const data = await get_products(filter);
        return data;
    }catch(e){
        console.error(`ERROR: ${e.message}`)
    }
}

async function run(){
    console.log( main({
        published: true
    }))

    console.log(await main({
        published: true
    }))


}
run(       