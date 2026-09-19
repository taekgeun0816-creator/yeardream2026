const products = [
    { id: 1, name: '게이밍 모니터', category: 'electronics', price: 350000, rating: 4.8, published: true, stock: 12 },
    { id: 2, name: '무선 키보드', category: 'electronics', price: 89000, rating: 4.2, published: true, stock: 0 },
    { id: 3, name: '자바스크립트 완벽 가이드', category: 'books', price: 45000, rating: 4.9, published: true, stock: 25 },
    { id: 4, name: '스마트 워치', category: 'electronics', price: 220000, rating: 3.9, published: false, stock: 5 },
    { id: 5, name: '리액트 실전 프로그래밍', category: 'books', price: 32000, rating: 4.7, published: true, stock: 18 },
    { id: 6, name: '노이즈캔슬링 헤드폰', category: 'electronics', price: 290000, rating: 4.5, published: true, stock: 8 },
    { id: 7, name: '개발자 장패드', category: 'office', price: 15000, rating: 4.1, published: true, stock: 50 },
];


function matchField(value, condition){
    if(typeof condition === 'object' && condition != null && !Array.isArray(condition)){
        return Object.keys(condition).every((op)=>{
            const target = condition[op];
            if (op ==='$gt') return value > target;
            if (op ==='$gte') return value >= target;
            if (op === '$lte') return value <= target;
            if (op === '$in') return Array.isArray(target) && target.includes(value);
            return false;
       });
    }
    return value === condition; 
}

function matchItem(item, filter){
    if (!filter || Object.keys(filter).length === 0) return true;

    if(filter.$or && Array.isArray(filter.$or)){
        const orMatches = filter.$or.some((subFilter)=> matchItem(item, subFilter));
        const otherKeys = Object.keys(filter).filter((k)=>k !== '$or');
        if (otherKeys.length ===0) return orMatches;
        return orMatches && otherKeys.every((key) => matchField(item[key], filter[key]));
    }
    return Object.keys(filter).every((key)=> matchField(item[key], filter[key]));
}

class MockQuery{
    constructor(data){
        this.data = [...data];

    }

    sort(sortObj){
        this.data.sort((a,b) => {for (const [key, order] of Object.entries(sortObj)){
            if (a[key] !== b[key]){ 
                return order ===-1 ? (b[key] > a[key] ? 1 : -1) : (a[key] >b[key] ? 1 : -1);
                }
            } 
            return 0
        });
        return this;
    }

    select(fields){
        const fieldList = fields.split(' ').filter((f) => f && !f.startsWith('-'));
        if (fieldList.length > 0){
            this.data = this.data.map((item) => {
                const newItem = {};
                fieldList.forEach((f) => {
                    if (item[f] !== undefined) newItem[f] = item[f]
                });
                return newItem;
            })
        }
        return this;
    }

    limit(n){
        this.data = this.data.slice(0, n);
        return this;
    }

    then(resolve, reject){setTimeout(() => resolve(this.data),30);

    }

}

function get_products(filter = {}){
        const filteredData = products.filter((item) => matchItem(item, filter));
        return new MockQuery(filteredData);
    }


module.exports = {
    get_products,
};

