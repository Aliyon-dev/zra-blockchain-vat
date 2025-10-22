import { NextResponse } from "next/server";


export async function POST(request: Request){
    const { username, password } = await request.json();
    // Here you would typically validate the username and password
    const res  =  await fetch('https', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ username, password })
    })
}