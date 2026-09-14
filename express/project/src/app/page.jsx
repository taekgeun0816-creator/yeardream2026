'use client'
import Link from 'next/link';
import PostList from '@/app/PostList';
import {useState} from "react";


export default function home() {
 
    return(
        <div>

            <h3>리스트 가져오기</h3>
            <PostList page={1}/>
        </div>


    );
}

