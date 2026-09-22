const {get_products} = require('./promise');





async function main(){
    const data = await get_products()
    const result = data.find((p) => p.rating >= 4.5 && p.price <= 300000)
    console.log(result)
}

main()