
import {useEffect, useState} from "react";
import axios from "axios";

export default function PostList({page}) {
    const [posts, setPosts] = useState([]);

    useEffect(function (){
        axios.get('http://localhost/board/list/' + page).then(({data}) => {
            console.log(data);
            setPosts(data.list);
        });
    }, [page]);
}
