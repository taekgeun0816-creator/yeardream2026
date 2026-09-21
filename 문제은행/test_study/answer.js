// 문제 1번
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
