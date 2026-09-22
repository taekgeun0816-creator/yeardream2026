// 문제 1번
import {get_products} from "./promise";

main({price: {$gt:100000}});

//문제 2번

main({rating: {$gte:4.5}});

//문제 3번
main({stock: {$lte:10}});
//문제 4번
main({ category: { $in: ['electronics', 'office']}})

//문제 5번
main({price: {$gte:30000, $lte:100000}});

//문제 6번
main( { $or: [{category :'books'}, {stock: 0}]})


//문제 7번

let  filter = {
    published: true,
    rating: {$gt:4.0}
}


//문제 8번

let filter = {
    category: {$in: ['electronics','books']},
    price: {$gt:5000}
}
main(filter)

// 문제 9번

 let filter = {
    $or: [
        {rating :{$gt:4.0}},
        {price: {$gt:30000}}
    ]
}

//문제 10번
let filter = {
    published: true,
    $or:[
        {category: 'office'},
        {stock: {$gte:20}}
    ]
}

// 문제 11

let filter = {stock: {$gt:10}};

//문제 12
let filter = {rating:{$lte:4.2}};

//문제 13
let filter = {id: {$in:[1,2,5]}};

//문제 14
let filter = {
    category : 'electronics',
    price: {$gt:5000}
}

//문제 15번

let filter ={
$or:[
    {published: false},
    {sock:0}
]
}

// 문제 16번
let filter= {
    category: {$in:['electronics']},
    rating: {$gte:4.0, $lte:4.7}
}

// 문제 17번
let filter = {
    price: {$gt:30000},
    rating: {$gt:4.8}
}

// 문제 18번
let filter = {
    published: true,
    stock: {$gte:15}
}

//문제 19번
let filter = {
    category: {$in:['books', 'office']},
    price: {$gt:20000}
}

//문제 20번
let filter = {
    published: true,
    rating: {$gt:4.1},
    $or:[{stock:{$gte:20}},{category:"book"}],
}

//------------------------------------------------------

// 문제은행 3

//[문제1] published: true인 상품을 조회한 뒤, 가격(price) 내림차순으로 정렬하세요.
async function run() {
    const p1 = await main({
        published: true,
    })
    let result = p1.sort((a,b) => b.price- a.price)
    console.log(result)
}
run()

//[문제2]
// 전체 상품을 평점(rating) 오름차순 정렬하고, 상품명(name) 배열로 변환하세요.

async function run() {

    let p1 = await main()
    let result = p1.sort((a, b) => a.rating - b.rating).map((x) => x.name)
    console.log(result)
}
run()
// [문제3]
//가격이 50000원 이상($gte)인 상품을 조회해 가격 내림차순 정렬 후 "[상품명]: [가격]원" 문자열 배열로 변환하세요.

async function run() {

    let criteria = {
        price: {$gte:5000}
    }
    let p1 = await main(criteria)
    let result = p1.sort((a,b)=> b.price - a.price).map((x)=>`${x.name}: ${x.price}원`)
    console.log(result)
}
run()

//[문제4]
// 카테고리가 'electronics' 또는 'books'인 상품($in)을 조회해 평점 내림차순 정렬 후 상위 2개(slice)만 추출하세요.

async function run() {
    const p1 = await main({
        category: {$in: ['electronics', 'books']}
    })
    const result = p1.sort((a, b) => b.stock - a.stock).slice(0, 2)
    console.log(result)
}
run();

//[문제5]
// filter = { published: true }에 가격이 20000원 이상($gte)인 조건을 추가하여 조회 후,
// 재고(stock) 오름차순 정렬하고 { id, name, price } 객체 배열로 변환하세요.

async function run (){
    const criteria = {
        published: true,
        price: {$gte:20000}
    }
    const data = await main(criteria)
    const result = data
        .sort((a,b) =>a.stock-b.stock)
        .map((x) => ({id: x.id, name: x.name, price: x.price}))

    console.log(result)
}
run()

//[문제6]
// 전체 상품을 재고(stock) 내림차순 정렬 후 "[상품명] (재고: [stock]개)" 문자열 배열로 변환하세요.
async function run(){
    const data = await main()
    const result = data
        .sort((a,b)=> b.stock -a.stock)
        .map((x) => `[${x.name} (재고: [${x.stock}]개)]` )
    console.log(result)

}
run()

//[문제7]
// 평점이 4.5 이상인 상품을 가격 오름차순 정렬 후 상품명만 추출하세요.

async function run(){
    const criteria = {
        rating: {$gte:4.5}
    }
    const data = await main(criteria)
    const result = data.sort((a,b) => a.price - b.price).map((x) => x.name)
    console.log(result)
}
run()

//[문제8]
//재고가 0 초과($gt)인 상품을 평점 내림차순 정렬 후 "[상품명] - ★[rating]" 문자열 배열로 변환하세요.

async function run(){
    const criteria ={
        stock:{$gt:0}
    }
    const data = main(criteria)
    const result = data
        .sort((a,b)=>b.rating - a.rating)
        .map((x)=>`${x.name} - ★[${x.rating}]`)
    console.log(result)
}

//[문제9]
//filter = { category: 'electronics' }로 조회 후 가격 내림차순 정렬하여 { name, price } 객체 배열로 변환하세요.

async function run(){
    const criteria = {
        category: 'electronics'
    }
    const data = await main(criteria);
    const result = data.sort((a,b) => b,price - a.price).map((x)=> x.name )
    console.log(result)
}

//[문제10]
// 가격이 100000원 이하인 상품을 재고 내림차순 정렬 후 상품명만 추출하세요.

async function run (){
    const data = await main({
        price: {$lte: 100000}
    })
    const result = data.sort((a,b)=> b.stock - a.stock).map(({name})=> name)
   console.log(result)
}

//[문제11]
//published: true 상품을 평점 내림차순 정렬 후 "[상품명] ([category])" 문자열 배열로 변환하세요.

async function run(){
    const data = main({
        published: true
    })
    const result = data.sort((a,b)=> b.rating - a.rating).map(({name, category}) => `${name} (${category})`)
    console.log(result)
}


//[문제12]
//재고가 10개 이하인 상품을 가격 오름차순 정렬 후 상위 3개 상품만 추출하세요.
async function run(){
    const criteria = {
        stock: {$lte:10}
    }
    const data = main(criteria)
    const result = data.sort((a,b)=>a.price-b.price).slice(0,3)
    console.log(result)
}

//[문제 13]
//filter = { published: true }에 재고가 0 보다 큰($gt)조건을 추가해 조회 후
// 가격 내림차순 정렬하여 "[상품명]: [가격]원" 배열로 변환하세요.

async function run(){
    const criteria = {
        published: true,
        stock:{$gt:0}
    }
    const data = await main(criteria)
    const result = [...data]
        .sort((a,b)=> b.price - a.price)
        .map(({name, price}) => `${name}: ${price}원`)
    console.log(result)
}

//[문제14]
// 카테고리가 'books'인 상품을 평점 내림차순 정렬 후 { title: name, score: rating } 형태의 객체 배열로 변환하세요.

async function run() {
    const data = await main({ category: 'books' })
    const result = [...data]
        .sort((a, b) => b.rating - a.rating)
        .map(({ name, rating }) => ({ title: name, score: rating }))
    console.log(result)
}

//[문제15]
//filter 변수에 평점이4.0이상인 조건을 추가해 조회 후 재고 오름차순 정렬하여 상품명만 추출하세요.
async function run (){
    const data = await main({ rating : {$gte:4.0}})
    const result = [...data]
        .sort((a,b)=>a.stock - b.stock)
        .map(({name}) => name)
    console.log(result)
}

//[문제 16]
// 가격이 50000원 초과인 상품을 평점 내림차순 정렬 후 "[상품명] - [가격]원 (★[rating])" 배열로 변환하세요.

async function run (){
    const data = await main({price: {$gt:5000}})
    const result = [...data]
        .sort((a,b)=> b.rating - a.rating)
        .map(({name, price, rating}) => `${name} - ${price}원 (★${rating})`)
    console.log(result)
}

//[문제 17]
//filter = { published: true }에 카테고리가 'office'이거나'books'인 조건을 추가해 조회 후
//가격 오름차순 정렬하여 상품명만 추출하세요.


// 문제18]
// 전체 상품을 평점 오름차순 정렬 후 하위 3개 상품을 추출하여 "[상품명]: [rating]점" 배열로 변환하세요.
async function main (filter){
    try{
        const data = await get_products(filter)
        const result = data.sort((a,b)=>a.rating-b.rating).map(({name, rating}) => `${name}: ${rating}점`).slice(0,3)
        console.log(result)
    }catch(err){
        console.log(err)
    }
}

//[문제19]
// 가격이 30,000 이상, 250,000이하인 상품을 조회 후 평점 내림차순 정렬하여 { id, name } 객체 배열로 변환하세요.


async function main (filter){
    try{
        const data = await get_products(filter)
        const result = data.sort((a,b) => b.rating-a.rating).map(({id, name}) => ({id:id, name:name}))
        console.log(result)
    }catch(err){
        console.log(err)
    }
}

const filter = {
    price: {$gte:30000, $lte: 25000}
}
main(filter)
//[문제20]
//재고가 0인 품절 상품을 가격 내림차순 정렬 후 "[상품명] (품절)" 문자열 배열로 변환하세요.

async function main(filter){
    const data = await get_products(filter)
    const result = data.sort((a,b)=>b.price-a.price).map(({name,}) => `${name} 품절`)
}



const filter = {
    stock: 0
}
main(filter)

//문제은행 4

// [문제 1]
//await get_products()로 전체 상품 조회 후 find()로 id가 3인 상품의 이름과 가격을 출력하세요.

async function main (){
   try {
       const data = await get_products()
       const result = data.find((p) => p.id === 3)
       console.log(result)
   }catch(err){
       console.log(err)
   }
}

main()

//[문제 2]

//전체 상품 중 카테고리가 'electronics'이고 재고가 0 초과인 첫 번째 상품을 find()로 찾아 출력하세요.

async function main(){
    try{
        const data = await get_products()
        const result = data.find((p)=> p.category === "electronics" && p.stock > 0)
        console.log(result)
    }catch(err){
        console.log(err)
    }
}

//[문제 3]
//전체 상품 중 name이 '스마트 워치'인 상품을 find()로 찾은 뒤 published가 false이면 "비공개 상품", true이면 가격을 출력하세요.

async function main(){
    try{
        const data = await get_products()
        const result = data.find((p) => p.name ==='스마트 워치')
        if (result.published){
            console.log(result.price)
        }
        else{
            console.log("비공개 상품")
        }

    }catch(err){
        console.log(err)
    }
}
main()

//문제 4번
//전체 배열과 조건 객체 { category: 'books', price: 32000 }를 받아 find()로 단일 상품을 반환하는 helper 함수 findOne(products, target)를 작성하고 호출하세요.


function findOne(products, target){
    return products.find((p) => Object.entries(target).every(([key,value]) => p[key] === value))
}

async function main (){
     const data = await get_products()
    const result = data.findOne(data, {category: 'books', price: 32000})
    console.log(result)
}



//문제 5번
async function main(){
    const data = await get_products()
    const result = data.find((p) => p.rating >= 4.5 && p.price <= 300000)
    console.log(result)
}

//문제은행 5번 스키마

const mongoose =rquire('mongoose');

const UserSchema = new mongoose.Schema({
    emil:{

    },
    password:{

    },
    age:{

    },
    role:{

    }

},{
timestamps: true
})


const mongoose = require('mongoose');

const ExampleSchema = new mongoose.Schema({
    email:    { type: String,  required: true, unique: true, lowercase: true },
    code:     { type: String,  required: true, unique: true, uppercase: true },
    title:    { type: String,  required: true, trim: true },
    rating:   { type: Number,  required: true, min: 1, max: 5 },
    views:    { type: Number,  default: 0 },
    isActive: { type: Boolean, default: true },
    status:   { type: String,  default: 'pending', enum: ['pending', 'paid'] },
    tags:     [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Example', ExampleSchema);